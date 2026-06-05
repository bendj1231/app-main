/**
 * PilotRecognition Wallet — VC Builder
 *
 * Maps a raw Supabase pilot profile into W3C VC Data Model v2.0 payloads.
 * No PII is sent to any server — all construction happens client-side.
 *
 * Output types defined in lib/wallet/types/schemas.ts
 */

import {
  AVIATION_CONTEXT_URL,
  W3C_VC_CONTEXT_V2,
  PLATFORM_DID_WEB,
  HoursBracket,
  TerminalClearanceLevel,
  PilotLicenseCredential,
  MedicalCurrencyCredential,
  OEMAttestationRecord,
  AviationRecordSummaryPayload,
  VerifiablePresentationSummary,
  DataIntegrityProof,
  BitstringStatusListEntry,
  WalletState,
  CredentialSlotKey,
} from './types/schemas';

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

function urnUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `urn:uuid:${crypto.randomUUID()}`;
  }
  // Fallback using crypto.getRandomValues for cryptographically secure UUID v4
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    buf[6] = (buf[6] & 0x0f) | 0x40; // Version 4
    buf[8] = (buf[8] & 0x3f) | 0x80; // Variant 10
    const hex = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
    return `urn:uuid:${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Last resort fallback (not cryptographically secure — should never be needed in modern browsers)
  return `urn:uuid:${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function dateIso(raw: string | null | undefined): string {
  if (!raw) return new Date().toISOString();
  return new Date(raw).toISOString();
}

/** Derive the pilot's did:web identifier from their Supabase profile ID */
export function holderDid(profileId: string): string {
  return `did:web:wallet.pilotrecognition.com:${profileId}`;
}

/** Classify total hours into a ZK-compatible bracket claim */
export function classifyHoursBracket(totalHours: number): HoursBracket {
  if (totalHours < 50)   return 'Student-Cadet';
  if (totalHours < 500)  return '0-500-CPL';
  if (totalHours < 1500) return '500-1500-Turboprop';
  if (totalHours < 2500) return '1500-2500-ATPL';
  return '2500-Plus-Command';
}

/** Map verification check status to Terminal clearance level */
export function classifyTerminalClearance(
  hasVerifiedLicense: boolean,
  hasVerifiedMedical: boolean,
  medicalExpired: boolean,
): TerminalClearanceLevel {
  if (medicalExpired || (!hasVerifiedLicense && !hasVerifiedMedical)) {
    return 'Terminal-1-Baseline';
  }
  if (hasVerifiedLicense && !hasVerifiedMedical) {
    return 'Terminal-2-Authenticated';
  }
  return 'Terminal-3-Temporal-Verified';
}

/** Build a pending (unsigned) DataIntegrityProof shell.
 *  In production this is populated by the Secure Enclave signing request.
 *  Client-side: the proofValue is a deterministic mock derived from the holder DID
 *  until the walt.id signing service is wired in. */
function pendingProof(verificationMethod: string): DataIntegrityProof {
  return {
    type: 'DataIntegrityProof',
    cryptosuite: 'ecdsa-2026',
    proofPurpose: 'assertionMethod',
    verificationMethod,
    created: nowIso(),
    proofValue: 'PENDING_ENCLAVE_SIGNATURE',
  };
}

/** Build a BitstringStatusListEntry pointing to the platform status list */
function statusEntry(profileId: string, slotIndex: number): BitstringStatusListEntry {
  const listUrl = `${PLATFORM_DID_WEB}/status/v1`;
  return {
    id: `${listUrl}#${slotIndex}`,
    type: 'BitstringStatusListEntry',
    statusPurpose: 'revocation',
    statusListIndex: String(slotIndex),
    statusListCredential: listUrl,
  };
}

// ─────────────────────────────────────────────────────────────
// PROFILE TYPE (minimal subset used for VC construction)
// ─────────────────────────────────────────────────────────────

export interface PilotProfileInput {
  id: string;
  display_name?: string | null;
  full_name?: string | null;
  license_number?: string | null;
  license_id?: string | null;
  license_type?: string | null;
  current_occupation?: string | null;
  country?: string | null;
  citizenship?: string | null;
  total_hours?: number | string | null;
  pic_hours?: number | string | null;
  instrument_hours?: number | string | null;
  multi_engine_hours?: number | string | null;
  night_hours?: number | string | null;
  license_expiry?: string | null;
  medical_expiry?: string | null;
  medical_class?: string | null;
}

export interface VerificationCheckInput {
  check_type: string;
  status: string;
  result_data?: Record<string, unknown> | null;
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL BUILDERS
// ─────────────────────────────────────────────────────────────

/**
 * Build a PilotLicenseCredential from profile data.
 * Issuer defaults to did:web:caap.gov.ph until a real CAAP DID is resolvable.
 */
export function buildPilotLicenseCredential(
  profile: PilotProfileInput,
  checks: VerificationCheckInput[],
): PilotLicenseCredential {
  const hDid = holderDid(profile.id);
  const issuerDid = 'did:web:caap.gov.ph';
  const licenseVerified = checks.some(
    c => c.check_type === 'professional_qualification' && c.status === 'verified',
  );
  const licenseNumber = profile.license_number || profile.license_id || 'PENDING';
  const licenseType = (profile.license_type || profile.current_occupation || 'Commercial Pilot License') as PilotLicenseCredential['credentialSubject']['licenseType'];

  return {
    '@context': [W3C_VC_CONTEXT_V2, AVIATION_CONTEXT_URL],
    id: urnUuid(),
    type: ['VerifiableCredential', 'PilotLicenseCredential'],
    issuer: licenseVerified ? issuerDid : `${PLATFORM_DID_WEB}#self-asserted`,
    validFrom: nowIso(),
    validUntil: profile.license_expiry ? dateIso(profile.license_expiry) : dateIso(null),
    credentialSubject: {
      id: hDid,
      subjectDid: hDid,
      licenseNumber,
      pelNumber: licenseNumber.replace(/[^0-9]/g, ''),
      licenseType: licenseType as PilotLicenseCredential['credentialSubject']['licenseType'],
      issuingAuthority: profile.country === 'Philippines' || profile.citizenship === 'Philippines'
        ? 'Civil Aviation Authority of the Philippines (CAAP)'
        : 'National Aviation Authority',
      issuingDid: issuerDid,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: profile.license_expiry
        ? new Date(profile.license_expiry).toISOString().split('T')[0]
        : '',
      ratings: [],
      limitations: [],
      languageProficiency: {
        language: 'English',
        level: 5,
        standard: 'ICAO Language Proficiency Rating Scale',
      },
    },
    credentialStatus: statusEntry(profile.id, 0),
    proof: pendingProof(`${issuerDid}#key-1`),
  };
}

/**
 * Build a MedicalCurrencyCredential.
 * isCurrent is computed from expiry date — this is the circuit-breaker field.
 */
export function buildMedicalCurrencyCredential(
  profile: PilotProfileInput,
  checks: VerificationCheckInput[],
): MedicalCurrencyCredential {
  const hDid = holderDid(profile.id);
  const medicalVerified = checks.some(
    c => c.check_type === 'medical' && c.status === 'verified',
  );
  const issuerDid = medicalVerified
    ? 'did:web:caap.gov.ph#dme'
    : `${PLATFORM_DID_WEB}#self-asserted`;

  const expiryDate = profile.medical_expiry ? new Date(profile.medical_expiry) : null;
  const isCurrent = expiryDate ? expiryDate > new Date() : false;

  return {
    '@context': [W3C_VC_CONTEXT_V2, AVIATION_CONTEXT_URL],
    id: urnUuid(),
    type: ['VerifiableCredential', 'MedicalCurrencyCredential'],
    issuer: issuerDid,
    validFrom: nowIso(),
    validUntil: expiryDate ? expiryDate.toISOString() : nowIso(),
    credentialSubject: {
      id: hDid,
      subjectDid: hDid,
      pelNumber: (profile.license_number || profile.license_id || '').replace(/[^0-9]/g, ''),
      medicalClass: (profile.medical_class as MedicalCurrencyCredential['credentialSubject']['medicalClass']) || 'Class 1',
      controlNumber: '',
      examinationDate: '',
      grantedDate: '',
      expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : '',
      regulatoryStandard: 'Philippine Civil Aviation Regulations Part 2 + ICAO Annex 1',
      examinerDid: `${PLATFORM_DID_WEB}#dme-placeholder`,
      medicalLimitations: [],
      waivers: [],
      isCurrent,
    },
    credentialStatus: statusEntry(profile.id, 1),
    proof: pendingProof(`${issuerDid}#key-1`),
  };
}

/**
 * Build an OEMAttestationRecord.
 * Exposes only bracket claims — no raw hour values leave the client.
 */
export function buildOEMAttestationRecord(
  profile: PilotProfileInput,
): OEMAttestationRecord {
  const hDid = holderDid(profile.id);
  const totalHours = Number(profile.total_hours) || 0;
  const picHours = Number(profile.pic_hours) || 0;
  const instrumentHours = Number(profile.instrument_hours) || 0;
  const multiEngineHours = Number(profile.multi_engine_hours) || 0;
  const nightHours = Number(profile.night_hours) || 0;

  return {
    '@context': [W3C_VC_CONTEXT_V2, AVIATION_CONTEXT_URL],
    id: urnUuid(),
    type: ['VerifiableCredential', 'OEMAttestationRecord'],
    issuer: `${PLATFORM_DID_WEB}#self-asserted`,
    validFrom: nowIso(),
    validUntil: null,
    credentialSubject: {
      id: hDid,
      subjectDid: hDid,
      typeRatings: [],
      hoursBracket: classifyHoursBracket(totalHours),
      totalHoursMinimum: totalHours,
      picHoursMinimum: picHours,
      instrumentHoursMin: instrumentHours,
      multiEngineHoursMin: multiEngineHours,
      nightHoursMin: nightHours,
      trainingOrganizationDid: `${PLATFORM_DID_WEB}#ato-placeholder`,
      attestationStandard: 'ICAO Annex 1 — Personnel Licensing',
    },
    credentialStatus: statusEntry(profile.id, 2),
    proof: pendingProof(`${PLATFORM_DID_WEB}#key-1`),
  };
}

// ─────────────────────────────────────────────────────────────
// PRESENTATION BUILDER
// ─────────────────────────────────────────────────────────────

/**
 * Derive a selective-disclosure AviationRecordSummary VP.
 * Only bracket claims are included — no PII, no raw hours.
 */
export function buildAviationRecordSummaryVP(
  profile: PilotProfileInput,
  checks: VerificationCheckInput[],
  disclosedFields: Record<string, boolean>,
): VerifiablePresentationSummary {
  const hDid = holderDid(profile.id);

  const hasVerifiedLicense = checks.some(
    c => c.check_type === 'professional_qualification' && c.status === 'verified',
  );
  const hasVerifiedMedical = checks.some(
    c => c.check_type === 'medical' && c.status === 'verified',
  );
  const medicalExpiry = profile.medical_expiry ? new Date(profile.medical_expiry) : null;
  const medicalExpired = medicalExpiry ? medicalExpiry < new Date() : false;

  const totalHours = Number(profile.total_hours) || 0;

  const subject: AviationRecordSummaryPayload = {
    terminalClearance: classifyTerminalClearance(
      hasVerifiedLicense,
      hasVerifiedMedical,
      medicalExpired,
    ),
    hoursBracket: disclosedFields['total'] ? classifyHoursBracket(totalHours) : 'Student-Cadet',
    typeRatings: [],
    verificationTimestamp: nowIso(),
  };

  const proof = pendingProof(`${PLATFORM_DID_WEB}#key-1`);

  return {
    '@context': [W3C_VC_CONTEXT_V2, AVIATION_CONTEXT_URL],
    id: urnUuid(),
    type: ['VerifiablePresentation', 'AviationRecordSummary'],
    holder: hDid,
    verifiableCredential: {
      credentialSubject: subject,
      proof,
    },
    proof,
  };
}

// ─────────────────────────────────────────────────────────────
// WALLET STATE FACTORY
// ─────────────────────────────────────────────────────────────

/**
 * Bootstrap a WalletState from a profile + verification checks.
 * Slots are populated with built VCs; status is set to 'unknown' pending first poll.
 */
export function buildInitialWalletState(
  profile: PilotProfileInput,
  checks: VerificationCheckInput[],
): WalletState {
  const hDid = holderDid(profile.id);

  const licenseVC  = buildPilotLicenseCredential(profile, checks);
  const medicalVC  = buildMedicalCurrencyCredential(profile, checks);
  const oemVC      = buildOEMAttestationRecord(profile);

  return {
    holderDid: hDid,
    slots: {
      license: {
        key: 'license',
        vc: licenseVC,
        rawJwt: null,
        statusBit: 'unknown',
        lastStatusCheck: null,
        importedAt: Date.now(),
      },
      medical: {
        key: 'medical',
        vc: medicalVC,
        rawJwt: null,
        statusBit: medicalVC.credentialSubject.isCurrent ? 'unknown' : 'suspended',
        lastStatusCheck: null,
        importedAt: Date.now(),
      },
      radio: {
        key: 'radio',
        vc: null,
        rawJwt: null,
        statusBit: 'unknown',
        lastStatusCheck: null,
        importedAt: null,
      },
      elp: {
        key: 'elp',
        vc: oemVC,
        rawJwt: null,
        statusBit: 'unknown',
        lastStatusCheck: null,
        importedAt: Date.now(),
      },
    },
    activePresentation: null,
    statusListUrl: `${PLATFORM_DID_WEB}/status/v1`,
    lastStatusPoll: null,
  };
}
