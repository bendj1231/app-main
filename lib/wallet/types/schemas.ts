/**
 * PilotRecognition Wallet — W3C VC Data Model v2.0 TypeScript Schema Layer
 *
 * Context URL: https://pilotrecognition.com/contexts/v2/aviation-v2.jsonld
 * Spec: https://www.w3.org/TR/vc-data-model-2.0/
 * Cryptosuites: https://www.w3.org/TR/vc-di-ecdsa/ (ecdsa-2026), https://www.w3.org/TR/vc-di-bbs/ (bbs-2023)
 */

export const AVIATION_CONTEXT_URL = 'https://pilotrecognition.com/contexts/v2/aviation-v2.jsonld';
export const W3C_VC_CONTEXT_V2    = 'https://www.w3.org/ns/credentials/v2';
export const STATUS_LIST_CONTEXT  = 'https://www.w3.org/ns/credentials/status/v1';
export const PLATFORM_DID_WEB     = 'did:web:pilotrecognition.com';

export type TerminalClearanceLevel =
  | 'Terminal-1-Baseline'
  | 'Terminal-2-Authenticated'
  | 'Terminal-3-Temporal-Verified';

export type HoursBracket =
  | 'Student-Cadet'
  | '0-500-CPL'
  | '500-1500-Turboprop'
  | '1500-2500-ATPL'
  | '2500-Plus-Command';

export type CryptoSuite = 'ecdsa-2026' | 'ecdsa-2019' | 'Ed25519Signature2020' | 'bbs-2023';

export type ProofPurpose = 'assertionMethod' | 'authentication' | 'keyAgreement';

export type CredentialStatusType = 'BitstringStatusListEntry' | 'StatusList2021Entry';

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────

export interface DataIntegrityProof {
  type: 'DataIntegrityProof';
  cryptosuite: CryptoSuite;
  proofPurpose: ProofPurpose;
  verificationMethod: string;
  created: string;
  proofValue: string;
}

export interface BitstringStatusListEntry {
  id: string;
  type: CredentialStatusType;
  statusPurpose: 'revocation' | 'suspension';
  statusListIndex: string;
  statusListCredential: string;
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL 1: PilotLicenseCredential
// Issuer: did:web:caap.gov.ph (CAAP) or equivalent national authority
// ─────────────────────────────────────────────────────────────

export interface LanguageProficiency {
  language: string;
  level: number;
  standard: string;
}

export interface PilotLicenseSubject {
  id: string;
  subjectDid: string;
  licenseNumber: string;
  pelNumber: string;
  licenseType: 'Student Pilot License' | 'Private Pilot License' | 'Commercial Pilot License' | 'Airline Transport Pilot License';
  issuingAuthority: string;
  issuingDid: string;
  issueDate: string;
  expiryDate: string;
  ratings: string[];
  limitations: string[];
  languageProficiency: LanguageProficiency;
}

export interface PilotLicenseCredential {
  '@context': [typeof W3C_VC_CONTEXT_V2, typeof AVIATION_CONTEXT_URL];
  id: string;
  type: ['VerifiableCredential', 'PilotLicenseCredential'];
  issuer: string;
  validFrom: string;
  validUntil: string;
  credentialSubject: PilotLicenseSubject;
  credentialStatus: BitstringStatusListEntry;
  proof: DataIntegrityProof;
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL 2: MedicalCurrencyCredential
// Issuer: Designated Medical Examiner DID
// Status bit is the circuit-breaker for the 60-sec revocation protocol
// ─────────────────────────────────────────────────────────────

export interface MedicalCurrencySubject {
  id: string;
  subjectDid: string;
  pelNumber: string;
  medicalClass: 'Class 1' | 'Class 2' | 'Class 3';
  controlNumber: string;
  examinationDate: string;
  grantedDate: string;
  expiryDate: string;
  regulatoryStandard: string;
  examinerDid: string;
  medicalLimitations: string[];
  waivers: string[];
  isCurrent: boolean;
}

export interface MedicalCurrencyCredential {
  '@context': [typeof W3C_VC_CONTEXT_V2, typeof AVIATION_CONTEXT_URL];
  id: string;
  type: ['VerifiableCredential', 'MedicalCurrencyCredential'];
  issuer: string;
  validFrom: string;
  validUntil: string;
  credentialSubject: MedicalCurrencySubject;
  credentialStatus: BitstringStatusListEntry;
  proof: DataIntegrityProof;
}

// ─────────────────────────────────────────────────────────────
// CREDENTIAL 3: OEMAttestationRecord
// Issuer: Training organisation (ATO) DID
// Uses ZK-compatible hour bracket claims — no raw logbook data exposed
// ─────────────────────────────────────────────────────────────

export interface OEMAttestationSubject {
  id: string;
  subjectDid: string;
  typeRatings: string[];
  hoursBracket: HoursBracket;
  totalHoursMinimum: number;
  picHoursMinimum: number;
  instrumentHoursMin: number;
  multiEngineHoursMin: number;
  nightHoursMin: number;
  trainingOrganizationDid: string;
  attestationStandard: string;
}

export interface OEMAttestationRecord {
  '@context': [typeof W3C_VC_CONTEXT_V2, typeof AVIATION_CONTEXT_URL];
  id: string;
  type: ['VerifiableCredential', 'OEMAttestationRecord'];
  issuer: string;
  validFrom: string;
  validUntil: string | null;
  credentialSubject: OEMAttestationSubject;
  credentialStatus: BitstringStatusListEntry;
  proof: DataIntegrityProof;
}

// ─────────────────────────────────────────────────────────────
// VERIFIABLE PRESENTATION: AviationRecordSummary
// Output format for airline ATS ingestion (Workday / SAP SuccessFactors)
// Selective disclosure — raw VC data stripped, bracket claims only
// ─────────────────────────────────────────────────────────────

export interface AviationRecordSummaryPayload {
  terminalClearance: TerminalClearanceLevel;
  hoursBracket: HoursBracket;
  typeRatings: string[];
  verificationTimestamp: string;
}

export interface VerifiablePresentationSummary {
  '@context': [typeof W3C_VC_CONTEXT_V2, typeof AVIATION_CONTEXT_URL];
  id: string;
  type: ['VerifiablePresentation', 'AviationRecordSummary'];
  holder: string;
  verifiableCredential: {
    credentialSubject: AviationRecordSummaryPayload;
    proof: DataIntegrityProof;
  };
  proof: DataIntegrityProof;
}

// ─────────────────────────────────────────────────────────────
// BITSTRING STATUS LIST (W3C spec) — runtime cache fragment
// Polled every 60s by the wallet background worker
// bit 0 = valid, bit 1 = revoked/suspended
// ─────────────────────────────────────────────────────────────

export interface BitstringStatusListCredential {
  '@context': [typeof W3C_VC_CONTEXT_V2, typeof STATUS_LIST_CONTEXT];
  id: string;
  type: ['VerifiableCredential', 'BitstringStatusListCredential'];
  issuer: string;
  validFrom: string;
  credentialSubject: {
    id: string;
    type: 'BitstringStatusList';
    statusPurpose: 'revocation' | 'suspension';
    encodedList: string;
  };
}

export type BitstringStatusResult = 'valid' | 'revoked' | 'suspended' | 'unknown';

// ─────────────────────────────────────────────────────────────
// WALLET LOCAL STATE — per-slot credential store
// ─────────────────────────────────────────────────────────────

export type CredentialSlotKey = 'license' | 'medical' | 'radio' | 'elp';

export interface WalletCredentialSlot {
  key: CredentialSlotKey;
  vc: PilotLicenseCredential | MedicalCurrencyCredential | OEMAttestationRecord | null;
  rawJwt: string | null;
  statusBit: BitstringStatusResult;
  lastStatusCheck: number | null;
  importedAt: number | null;
}

export interface WalletState {
  holderDid: string;
  slots: Record<CredentialSlotKey, WalletCredentialSlot>;
  activePresentation: VerifiablePresentationSummary | null;
  statusListUrl: string;
  lastStatusPoll: number | null;
}
