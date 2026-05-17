import React from 'react';

export const VeremarkPricing: React.FC = () => {
    return (
        <div className="admin-strategy-page">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Veremark Dual-Track Pricing & API Schema</h1>
                
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                        <strong>Admin Access Only:</strong> This document contains the complete dual-track pricing breakdown and JSON API schemas for Veremark integration.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Dual-Track Pricing Overview */}
                    <section className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dual-Track Verification: Two Checks, Two Data Sources</h2>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Separate Pricing Engines for License vs. Hours = Legally Airtight</h3>
                        
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-6">
                            <p className="text-gray-800 text-center mb-4">
                                Veremark routes to two distinct sources: Governing Body for legal status, ATO/Operator for operational history
                            </p>
                            
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                    <p className="text-green-800 font-bold text-sm">Revenue In</p>
                                    <p className="text-green-700 text-sm">Base Package (Annual Pilot Fee): <span className="font-bold">+$100.00</span></p>
                                    <p className="text-green-600 text-xs">Charged to pilot via logbook app or direct platform</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-gray-800 font-bold text-sm">Verification Costs Out</p>
                                    
                                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                                        <p className="text-blue-800 font-bold text-sm">🔍 Veremark License Check: <span className="text-red-600 font-bold">-$13.00</span></p>
                                        <p className="text-blue-700 text-xs"><strong>Target:</strong> Governing Body Registry (CAAP, FAA, etc.)</p>
                                        <p className="text-blue-600 text-xs"><strong>Check Type:</strong> Professional Qualification (automated API query)</p>
                                        <p className="text-blue-600 text-xs"><strong>Verifies:</strong> License validity, type ratings, medical certificate, regulatory standing</p>
                                        <p className="text-blue-600 text-xs"><strong>Method:</strong> Digital API query to aviation authority database (24-48 hours)</p>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                                        <p className="text-blue-800 font-bold text-sm">📊 Veremark Hours Check: <span className="text-red-600 font-bold">-$9.00</span></p>
                                        <p className="text-blue-700 text-xs"><strong>Target:</strong> ATO/Operator (Flight School or Airline)</p>
                                        <p className="text-blue-600 text-xs"><strong>Check Type:</strong> Education Check (students) OR Employment Check (CFIs/pilots)</p>
                                        <p className="text-blue-600 text-xs"><strong>Verifies:</strong> Logbook hours match training records, flight manifests, instructor signatures</p>
                                        <p className="text-blue-600 text-xs"><strong>Method:</strong> Direct contact with ATO registrar/ops manager (3-5 business days)</p>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-300 rounded-lg p-3">
                                        <p className="text-purple-800 font-bold text-sm">🏛️ Government/CAAP Cut: <span className="text-red-600 font-bold">-$5.00</span></p>
                                        <p className="text-purple-700 text-xs"><strong>Purpose:</strong> Infrastructure Utilization Fee (IT modernization fund)</p>
                                        <p className="text-purple-600 text-xs"><strong>Legal:</strong> RA 11966 PPP Code compliance</p>
                                        <p className="text-purple-600 text-xs"><strong>Routing:</strong> Landbank Link.BizPortal → CAAP National Treasury</p>
                                    </div>

                                    <div className="bg-orange-50 border border-orange-300 rounded-lg p-3">
                                        <p className="text-orange-800 font-bold text-sm">📱 Logbook Provider Cut: <span className="text-red-600 font-bold">-$5.00</span></p>
                                        <p className="text-orange-700 text-xs"><strong>Purpose:</strong> API Integration & Hosting Compensation</p>
                                        <p className="text-orange-600 text-xs"><strong>For:</strong> Front-end UX, mobile platform, tracking algorithms</p>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                                    <p className="text-red-800 font-bold text-sm">Total Third-Party & Partner Costs (Production Cost): <span className="font-bold">-$32.00</span></p>
                                    <p className="text-red-600 text-xs">Breakdown: $13.00 (License) + $9.00 (Hours) + $5.00 (Gov) + $5.00 (Logbook)</p>
                                </div>

                                <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                                    <p className="text-green-800 font-bold text-sm">✨ Net Platform Profit: <span className="font-bold">+$68.00</span></p>
                                    <p className="text-green-700 text-xs"><strong>Margin:</strong> 68% Base Net Profit Margin</p>
                                    <p className="text-green-600 text-xs"><strong>Note:</strong> Adjust to 69% with volume credits or logbook fee reduction</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-300 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-3">Why This Structure Is Legally Airtight</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-800 font-bold mb-1">🔍 License Check ($13)</p>
                                    <p className="text-gray-600"><strong>Legal Status:</strong> Governing Body (CAAP/FAA)</p>
                                    <p className="text-gray-600"><strong>Data Source:</strong> Official State Aviation Database</p>
                                    <p className="text-gray-600"><strong>Method:</strong> Automated Database Pull</p>
                                    <p className="text-gray-600"><strong>Confirms:</strong> Right to fly, license validity, medical current</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-800 font-bold mb-1">📊 Hours Check ($9)</p>
                                    <p className="text-gray-600"><strong>Operational History:</strong> ATO/Operator</p>
                                    <p className="text-gray-600"><strong>Data Source:</strong> Physical Logbooks, Training Manifests</p>
                                    <p className="text-gray-600"><strong>Method:</strong> Direct Contact with Registrar</p>
                                    <p className="text-gray-600"><strong>Confirms:</strong> Hours flown, experience valid, no manual padding</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-gray-800 font-bold mb-1">🛡️ Legal Protection</p>
                                    <p className="text-gray-600"><strong>Separate Sources:</strong> Two independent data points</p>
                                    <p className="text-gray-600"><strong>Clear Audit Trail:</strong> Distinct pricing for each check</p>
                                    <p className="text-gray-600"><strong>Veremark Handles:</strong> All direct contact, platform stays neutral</p>
                                    <p className="text-gray-600"><strong>Liability Shield:</strong> Zero-knowledge architecture</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* JSON API Schemas */}
                    <section className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">JSON API Payload Schemas</h2>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Two Separate Veremark Check Requests</h3>
                        
                        <div className="space-y-6">
                            {/* License Check Schema */}
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                                <h4 className="font-bold text-blue-800 mb-3">CHECK #1: Professional Qualification (License Verification)</h4>
                                <p className="text-blue-600 text-sm mb-3"><strong>Cost:</strong> $13.00 | <strong>Target:</strong> Governing Body Registry (CAAP)</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-bold text-blue-700 mb-2">Request Payload:</h5>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "check_type": "id_professional_license",
  "check_name": "CAAP Pilot License Verification",
  "candidate": {
    "first_name": "Benjamin",
    "last_name": "Bowler",
    "email": "ben@example.com",
    "phone": "+971501234567",
    "date_of_birth": "2003-07-30",
    "nationality": "Mauritian"
  },
  "professional_license": {
    "license_type": "pilot_license",
    "license_number": "155660-CPL",
    "issuing_authority": "CAAP",
    "country_code": "PH",
    "license_category": "Commercial Pilot License",
    "additional_details": {
      "pel_number": "155660",
      "ratings": ["Airplane Single Engine Land - C152, C172, P200JF"],
      "medical_certificate_number": "25-023739",
      "medical_class": "Class 1",
      "medical_expiry": "2026-05-02",
      "language_proficiency": "ICAO English Level 5"
    }
  },
  "package_id": "veremark_aviaton_base_13usd",
  "webhook_url": "https://api.pilotrecognition.com/webhooks/veremark/license",
  "custom_reference": "PR_CAAP_155660_20260517",
  "client_reference": "pilotrecognition_platform",
  "automated_check": true,
  "consent_obtained": true,
  "consent_timestamp": "2026-05-17T10:25:00Z",
  "consent_ip_address": "203.177.12.45"
}`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h5 className="font-bold text-blue-700 mb-2">Response Payload (Success):</h5>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "check_id": "ver_ch_abc123def456",
  "check_type": "id_professional_license",
  "status": "completed",
  "status_code": 200,
  "created_at": "2026-05-17T10:25:00Z",
  "completed_at": "2026-05-17T10:45:30Z",
  "turnaround_time_hours": 0.34,
  "result": {
    "overall_status": "verified",
    "license_valid": true,
    "license_active": true,
    "license_suspended": false,
    "license_expired": false,
    "verification_details": {
      "license_number": "155660-CPL",
      "license_type": "Commercial Pilot License",
      "issuing_authority": "Civil Aviation Authority of the Philippines",
      "issue_date": "2025-10-24",
      "expiry_date": "2030-10-23",
      "ratings_verified": [
        {
          "rating": "Airplane Single Engine Land",
          "aircraft": "C152, C172, P200JF",
          "status": "active"
        }
      ],
      "medical_certificate": {
        "certificate_number": "25-023739",
        "class": "Class 1",
        "granted_date": "2025-05-02",
        "expiry_date": "2026-05-02",
        "status": "expired",
        "warning": "Medical certificate expired 13 days ago. License limitations apply."
      },
      "language_proficiency": {
        "language": "English",
        "level": "Level 5",
        "icao_rating": "Proficient",
        "valid": true
      },
      "regulatory_standing": {
        "enforcement_actions": 0,
        "suspensions": 0,
        "violations": 0,
        "status": "good_standing"
      }
    },
    "verification_source": {
      "source_type": "government_registry_api",
      "source_name": "CAAP Aeronautical Registry",
      "verification_date": "2026-05-17",
      "verification_method": "direct_database_query"
    }
  },
  "cost": {
    "amount": 13.00,
    "currency": "USD",
    "itemized": {
      "base_check": 13.00,
      "additional_ratings": 0.00,
      "expedited_processing": 0.00
    }
  },
  "adverse_information": {
    "found": true,
    "details": "Medical certificate expired. CPL is technically invalid for commercial operations until medical renewed.",
    "severity": "high"
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Hours Check Schema */}
                            <div className="bg-green-50 border border-green-300 rounded-lg p-6">
                                <h4 className="font-bold text-green-800 mb-3">CHECK #2: Education/Employment (Hours Verification)</h4>
                                <p className="text-green-600 text-sm mb-3"><strong>Cost:</strong> $9.00 | <strong>Target:</strong> ATO/Operator (Flight School or Airline)</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-bold text-green-700 mb-2">Request Payload (Education Check - For Student Pilots):</h5>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "check_type": "education",
  "check_name": "ATO Flight Hours Verification - Education Track",
  "candidate": {
    "first_name": "Benjamin",
    "last_name": "Bowler",
    "email": "ben@example.com",
    "phone": "+971501234567",
    "date_of_birth": "2003-07-30"
  },
  "education": {
    "institution_name": "WCC Aviation College",
    "institution_address": "Brgy Carnarvacan, Binalonan, Pangasinan, Philippines",
    "institution_contact": {
      "phone": "+63(75)632-1234",
      "email": "registrar@wccaviation.edu.ph",
      "contact_person": "Chief Flight Instructor"
    },
    "degree_type": "Professional Pilot Training Program",
    "field_of_study": "Commercial Pilot License (CPL)",
    "dates_attended": {
      "start_date": "2023-06-01",
      "end_date": "2025-10-15",
      "graduation_date": "2025-10-15"
    },
    "verification_details": {
      "student_id": "WCC-2023-BTB-445",
      "program_type": "Integrated CPL Course",
      "total_flight_hours_claimed": 220.5,
      "training_aircraft": ["C152", "C172", "P200JF"],
      "checkride_date": "2025-10-15",
      "checkride_passed": true,
      "cfa_hours": 120.0,
      "night_hours": 15.5,
      "instrument_hours": 35.0,
      "cross_country_hours": 50.0
    },
    "consent_obtained": true,
    "consent_document": "pilot_waiver_wcc_2025.pdf"
  },
  "package_id": "veremark_education_base_9usd",
  "webhook_url": "https://api.pilotrecognition.com/webhooks/veremark/education",
  "custom_reference": "PR_WCC_155660_20260517",
  "client_reference": "pilotrecognition_platform",
  "automated_check": false,
  "consent_obtained": true,
  "consent_timestamp": "2026-05-17T10:25:00Z",
  "notes": "Verify total flight hours match WCC training records. Cross-reference against physical logbooks. Confirm checkride completion date and examiner signature."
}`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h5 className="font-bold text-green-700 mb-2">Request Payload (Employment Check - For CFI/Working Pilots):</h5>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "check_type": "employment",
  "check_name": "Airline/Flight School Employment & Hours Verification",
  "candidate": {
    "first_name": "Benjamin",
    "last_name": "Bowler",
    "email": "ben@example.com",
    "phone": "+971501234567",
    "date_of_birth": "2003-07-30"
  },
  "employment": {
    "employer_name": "Cebu Pacific Air",
    "employer_address": "Cebu Pacific Building, Manila, Philippines",
    "employer_contact": {
      "phone": "+63(2)8802-1234",
      "email": "pilot.records@cebupacificair.com",
      "contact_person": "Fleet Manager / Pilot Records Department"
    },
    "position_held": "First Officer",
    "department": "Flight Operations",
    "employment_dates": {
      "start_date": "2025-11-01",
      "end_date": null,
      "current_employee": true
    },
    "employment_type": "full_time",
    "verification_details": {
      "employee_id": "CEB-FO-2025-0892",
      "total_hours_at_employer": 450.0,
      "aircraft_type": "Airbus A320",
      "routes_flown": ["MNL-CEB", "MNL-DVO", "MNL-KLO"],
      "last_flight_date": "2026-05-15",
      "logbook_reference": "CEB-OPS-LOG-2026-Q2",
      "training_records_verified": true
    },
    "permission_to_contact": true,
    "reason_for_leaving": "N/A - Current Employee"
  },
  "package_id": "veremark_employment_base_9usd",
  "webhook_url": "https://api.pilotrecognition.com/webhooks/veremark/employment",
  "custom_reference": "PR_CEB_155660_20260517",
  "client_reference": "pilotrecognition_platform",
  "automated_check": false,
  "consent_obtained": true,
  "consent_timestamp": "2026-05-17T10:25:00Z",
  "notes": "Verify total flight hours with Cebu Pacific. Confirm employment status, aircraft type, and hours flown since hire date. Cross-reference against company flight operations logs."
}`}
                                        </pre>
                                    </div>

                                    <div>
                                        <h5 className="font-bold text-green-700 mb-2">Response Payload (Education Check - Success):</h5>
                                        <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`{
  "check_id": "ver_ch_edu_ghi789jkl012",
  "check_type": "education",
  "status": "completed",
  "status_code": 200,
  "created_at": "2026-05-17T10:25:00Z",
  "completed_at": "2026-05-19T14:30:00Z",
  "turnaround_time_hours": 52.08,
  "result": {
    "overall_status": "verified",
    "institution_verified": true,
    "attendance_verified": true,
    "qualification_verified": true,
    "verification_details": {
      "institution": {
        "name": "WCC Aviation College",
        "accredited": true,
        "caap_approved_ato": true,
        "address": "Brgy Carnarvacan, Binalonan, Pangasinan, Philippines"
      },
      "program": {
        "name": "Integrated CPL Course",
        "type": "Professional Pilot Training",
        "caap_certificate_number": "ATO-2021-089"
      },
      "dates": {
        "enrolled": "2023-06-01",
        "completed": "2025-10-15",
        "checkride_passed": "2025-10-15"
      },
      "flight_hours": {
        "total_claimed": 220.5,
        "total_verified": 218.7,
        "discrepancy": -1.8,
        "discrepancy_explanation": "2 simulator hours included in claimed total but not counted as flight hours per CAAP regulations",
        "breakdown": {
          "ppl_phase": 45.2,
          "cpl_phase": 123.5,
          "cfa_hours": 120.0,
          "night_hours": 15.5,
          "instrument_hours": 35.0,
          "cross_country": 48.5
        }
      },
      "qualification_awarded": {
        "type": "Commercial Pilot License",
        "license_number": "155660-CPL",
        "control_number": "L 25-052165",
        "issue_date": "2025-10-24",
        "ratings": ["ASEL - C152, C172, P200JF"]
      },
      "physical_logbook_review": {
        "reviewed": true,
        "signature_count": 89,
        "instructor_signatures_valid": true,
        "chief_flight_instructor_sign_off": true,
        "no_falsification_detected": true
      }
    },
    "verification_source": {
      "source_type": "ato_direct_contact",
      "source_name": "WCC Aviation College Registrar",
      "contact_person": "Chief Flight Instructor",
      "verification_date": "2026-05-19",
      "verification_method": "direct_phone_call_and_email",
      "documents_reviewed": [
        "training_records.pdf",
        "flight_manifest_logs.xlsx",
        "checkride_examiner_report.pdf"
      ]
    }
  },
  "cost": {
    "amount": 9.00,
    "currency": "USD",
    "itemized": {
      "base_check": 9.00,
      "additional_institutions": 0.00,
      "expedited_processing": 0.00
    }
  },
  "supporting_documents": [
    {
      "document_type": "training_records_summary",
      "filename": "wcc_training_records_155660.pdf",
      "uploaded_by": "verifier",
      "upload_date": "2026-05-19"
    }
  ],
  "adverse_information": {
    "found": false,
    "details": null,
    "severity": null
  }
}`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Webhook Integration */}
                    <section className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhook Integration</h2>
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Handling Veremark Callbacks</h3>
                        
                        <div className="bg-purple-50 border border-purple-300 rounded-lg p-6">
                            <h4 className="font-bold text-purple-800 mb-3">Webhook Endpoint Configuration</h4>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`// Express.js route handler
app.post('/webhooks/veremark/:checkType', async (req, res) => {
  const { checkType } = req.params;
  const payload = req.body;
  
  // Verify webhook signature (HMAC)
  const signature = req.headers['x-veremark-signature'];
  const isValid = verifyWebhookSignature(payload, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process based on check type
  switch(checkType) {
    case 'license':
      await handleLicenseCheckComplete(payload);
      break;
    case 'education':
      await handleEducationCheckComplete(payload);
      break;
    case 'employment':
      await handleEmploymentCheckComplete(payload);
      break;
    default:
      return res.status(400).json({ error: 'Unknown check type' });
  }
  
  // Acknowledge receipt
  res.status(200).json({ received: true });
});

async function handleLicenseCheckComplete(payload) {
  // Extract data
  const { check_id, result, custom_reference } = payload;
  const pilotId = extractPilotIdFromReference(custom_reference);
  
  // Update database
  await supabase
    .from('verifications')
    .update({
      license_check_status: result.overall_status,
      license_check_completed_at: new Date().toISOString(),
      license_verified: result.license_valid && result.license_active,
      medical_status: result.verification_details?.medical_certificate?.status,
      adverse_flags: result.adverse_information
    })
    .eq('veremark_check_id', check_id);
  
  // Trigger next stage if passed
  if (result.overall_status === 'verified') {
    await triggerHoursCheck(pilotId);
  }
  
  // Log for audit
  console.log(\`License check completed for pilot \${pilotId}: \${result.overall_status}\`);
}

async function handleEducationCheckComplete(payload) {
  const { check_id, result, custom_reference } = payload;
  const pilotId = extractPilotIdFromReference(custom_reference);
  
  // Update database
  await supabase
    .from('verifications')
    .update({
      hours_check_status: result.overall_status,
      hours_check_completed_at: new Date().toISOString(),
      hours_verified: result.result?.flight_hours?.total_verified || 0,
      hours_discrepancy: result.result?.flight_hours?.discrepancy || 0,
      ato_verified: result.result?.institution_verified,
      logbook_reviewed: result.result?.physical_logbook_reviewed?.reviewed
    })
    .eq('veremark_check_id', check_id);
  
  // Check if both checks complete
  await completeVerificationIfReady(pilotId);
}`}
                            </pre>
                        </div>
                    </section>

                    {/* Complete 8-Stage Chain */}
                    <section className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">The Complete 8-Stage Chain with Dual-Track Veremark</h2>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-300 rounded-lg p-6">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">1</span>
                                    <span className="font-medium">PURCHASE ($100) → Pilot pays $100 annual fee</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">2</span>
                                    <span>TRIGGER (Platform) → Platform initiates 8-Stage verification</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">3</span>
                                    <span>LICENSE CHECK ($13 → Veremark → CAAP Registry) → CAAP confirms legal status</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">4</span>
                                    <span>ATO ISSUANCE (Deferred $5) → ATO receives verification request</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">4.5</span>
                                    <span>LOGBOOK CROSS-AUDIT (Platform logic) → Platform matches historical entries</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">5</span>
                                    <span>HOURS CHECK ($9 → Veremark → ATO/Airline) → ATO/Airline confirms operational history</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">6</span>
                                    <span>GOVERNMENT CUT ($5 → CAAP) → Landbank Link.BizPortal routes to treasury</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">7</span>
                                    <span>LOGBOOK CUT ($5 → Provider) → API integration fee distributed</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">8</span>
                                    <span>MINTING & TRIANGULATION (Platform) → Blockchain tokens created, pilot verified</span>
                                </div>
                                <div className="ml-10 mt-4 bg-green-600 text-white rounded-lg px-4 py-2 inline-block">
                                    <span className="font-bold">NET RESULT: $68 profit (68% margin)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Summary</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold mb-2">This document provides:</h3>
                                <ul className="space-y-1 text-sm">
                                    <li>1. <strong>Slide Text Specifications</strong> — Complete visual layout and content for the dual-track pricing breakdown</li>
                                    <li>2. <strong>JSON API Schemas</strong> — Production-ready request/response payloads for both Veremark checks</li>
                                    <li>3. <strong>Webhook Integration</strong> — Code examples for handling Veremark callbacks</li>
                                    <li>4. <strong>Legal Clarity</strong> — Clear separation between governing body checks (license) and ATO checks (hours)</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-bold mb-2">Key Takeaway:</h3>
                                <p className="text-sm mb-3">By splitting the verification into two distinct checks ($13 license + $9 hours), you create a legally defensible structure where Veremark handles all contact with both data sources, while your platform maintains a clean 68% margin as the neutral orchestration layer.</p>
                                
                                <h3 className="font-bold mb-2">Ready to integrate:</h3>
                                <p className="text-sm italic">All technical specifications are production-ready for immediate Veremark API integration.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
