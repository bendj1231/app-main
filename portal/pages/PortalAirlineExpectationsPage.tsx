import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plane, MapPin, DollarSign, Clock, Globe, Star, Cpu, Users, Brain, Shield, Target, GraduationCap, CheckCircle2, Search, Briefcase, Zap, TrendingUp, ArrowLeft, Database, Calendar, Bell } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { PilotAptitudeTest } from '../../components/PilotAptitudeTest';
import { MeshGradient } from '@paper-design/shaders-react';
import { QuickStats } from '../components/QuickStats';

type Region = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa' | 'Middle East';

export interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  salaryRangePublic?: string;
  salaryRangeDetailed?: string;
  flightHours: string;
  tags: string[];
  image: string;
  cardImage?: string;
  description: string;
  fleet?: string;
  currentFleet?: string;
  fleetWithEndOfService?: Array<{ aircraft: string; endOfService: string }>;
  futureDemand?: string;
  flag?: string;
  region: Region;
  assessmentProcessPublic?: string;
  assessmentProcessDetailed?: string;
  dataSource?: string;
  lastUpdated?: string;
  verificationStatus?: string;
  verificationNotes?: string;
  expectations?: Array<{
    title: string;
    desc: string;
    bullets: string[];
    icon?: any;
    color?: string;
  }>;
  questionBank?: Array<{
    pillar: string;
    questions: Array<{
      q: string;
      type: 'situational' | 'behavioral' | 'technical' | 'cognitive';
      alignment: string;
      modelAnswer: string;
    }>;
  }>;
  futureFleetPlans?: {
    newAircraft: string[];
    retiringAircraft: string[];
    expansionPlans: string;
  };
  aircraftDemand?: {
    airbusPreference: number; // 0-100%
    boeingPreference: number; // 0-100%
    primaryManufacturer: 'Airbus' | 'Boeing' | 'Mixed';
    trendingAircraft: string[];
  };
  pilotRequirements?: {
    minHours: number;
    preferredHours: number;
    typeRatingRequired: string[];
    additionalCertifications: string[];
    languageRequirements: string[];
  };
  detailedInfo?: {
    entryRequirements?: {
      captains?: string;
      firstOfficers?: string;
      licensesMedical?: string;
      recency?: string;
    };
    assessmentProcess?: {
      day1?: string;
      day2?: string;
      day3?: string;
      technicalFocus?: string;
      simulatorCheck?: string;
    };
    workingConditions?: {
      rostering?: string;
      culture?: string;
      bonds?: string;
      roster?: string;
      training?: string;
    };
    compensationBenefits?: {
      salary?: string;
      livingSupport?: string;
      travelPerks?: string;
      insurance?: string;
    };
    profileAlignment?: {
      technicalMastery?: string;
      crmManualFlying?: string;
      professionalism?: string;
      culturalAdaptability?: string;
    };
    latestUpdates?: {
      fleetNews?: string;
      futureOrders?: string;
      a380Status?: string;
      openings?: string;
    };
    coreCompetencies?: {
      oneTeam?: string;
      drivingExcellence?: string;
      customerFirst?: string;
      safetySituational?: string;
      futureFleetInsights?: string;
    };
    recruitmentStatus?: {
      typeRatedPositions?: string;
      directEntryCaptains?: string;
      applicationMethod?: string;
      assessmentProcess?: string;
    };
    preparationResources?: {
      psychometricCognitive?: {
        description?: string;
        cost?: string;
        providers?: string[];
      };
      atplQuestionBank?: {
        description?: string;
        cost?: string;
        details?: string;
      };
      interviewCoaching?: {
        description?: string;
        cost?: string;
        providers?: string[];
        topics?: string[];
      };
      technicalGuides?: {
        description?: string;
        cost?: string;
        examples?: string;
      };
      cvAudit?: {
        description?: string;
        cost?: string;
      };
    };
  };
}

const AIRLINES: Airline[] = [
  // Middle East
  { id: 'qatar', name: 'Qatar Airways', location: 'Qatar', salaryRange: '$100,000 – $300,000 USD/Year (Total Package)', salaryRangePublic: '$100,000-300,000/year', salaryRangeDetailed: '$100,000 – $300,000 USD/Year (Total Package)', assessmentProcessPublic: 'Multi-stage assessment including psychometric testing, technical exams, simulator evaluation, and competency-based interviews', assessmentProcessDetailed: 'Multi-stage assessment including psychometric testing, technical exams, simulator evaluation, and competency-based interviews', flightHours: '1,000 hrs (FO) / 6,000 hrs (DEC)', tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Qatar_Airways_Logo.png', description: 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. With competitive tax-free salary packages, modern aircraft fleet, and rapid career progression opportunities.', fleet: 'Boeing 777, 787, Airbus A350, A380, A320, A321neo, B777-9', currentFleet: 'Boeing 777, 787, Airbus A350, A380, A320, A321neo', dataSource: 'Airbus public delivery data, aviation industry reports, pilot community forums, Qatar Airways career portal', lastUpdated: 'April 2026', verificationStatus: 'unverified', verificationNotes: 'This airline is currently unverified on pilotrecognition.com. Airbus aircraft specifications sourced from public Airbus announcements and industry reports for pilot awareness purposes—not for competitive intelligence.', fleetWithEndOfService: [
    { aircraft: 'Boeing 777', endOfService: 'Ongoing' },
    { aircraft: 'Boeing 787', endOfService: 'Ongoing' },
    { aircraft: 'Airbus A350', endOfService: 'Ongoing' },
    { aircraft: 'Airbus A380', endOfService: 'Phasing out (fleet reduction ongoing)' },
    { aircraft: 'Airbus A320', endOfService: 'Phasing out' }
  ], futureDemand: 'Fleet modernization with new aircraft deliveries planned (Source: Airbus Orders & Deliveries data)', region: 'Middle East', questionBank: [
    {
      pillar: '5-Star Service Standards',
      questions: [
        { q: "Describe a situation where you had to manage a passenger complaint while maintaining operational safety priorities.", type: 'situational', alignment: 'EBT: Situational Judgment - Passenger Interaction', modelAnswer: "Step 1: Acknowledge the passenger's concern without dismissing. Step 2: Assess if the issue impacts safety—if yes, prioritize. Step 3: Delegate to cabin crew with clear CRM communication. Step 4: Document and brief post-flight. Qatar expects pilots to balance hospitality with operational authority." },
        { q: "How do you balance cultural sensitivity with assertive decision-making when operating in a multi-cultural crew environment?", type: 'behavioral', alignment: 'CBTA: Cultural Competency', modelAnswer: "Assertive communication in aviation is universal—use standard phraseology and SOPs to depersonalize decisions. Cultural sensitivity means listening actively before deciding, then communicating clearly using CRM tools like DESC (Describe, Express, Specify, Consequences). Qatar crews represent 160+ nationalities." },
        { q: "A first-class passenger is dissatisfied with service during a long-haul flight. How do you communicate this to cabin crew without disrupting CRM protocols?", type: 'situational', alignment: 'EBT: CRM & Communication', modelAnswer: "Use the brief/debrief model: during cruise, inform the Purser via interphone (not in front of passengers) using neutral language. Focus on facts, not emotions. Return to flight deck. Post-flight, document in the journey log. Never let passenger service override sterile cockpit rules." },
        { q: "What does 'excellence in passenger interaction' mean to you at 35,000 feet when faced with an in-flight medical emergency?", type: 'behavioral', alignment: 'CBTA: Service Under Pressure', modelAnswer: "Excellence means compartmentalization: CRM maintains flight path while cabin crew handles the emergency. The pilot's role is decision-making—divert or continue, communicate with MedLink, and manage fuel/time trade-offs. Passenger interaction is delegated. Situational awareness is non-negotiable." }
      ]
    },
    {
      pillar: 'Technical Excellence',
      questions: [
        { q: "You encounter an unexpected ECAM warning during critical phase of flight. Walk me through your decision-making process using SOP hierarchy.", type: 'technical', alignment: 'EBT: System Knowledge & SOP Adherence', modelAnswer: "Aviate: maintain flight path using raw data if necessary. Navigate: assess terrain/traffic. Communicate: ATC + cabin crew if needed. Memory items if applicable (take-off, landing). Then ECAM: cancel audio, read, do— Pilot Flying maintains aircraft while Pilot Monitoring executes. After landing, log and report." },
        { q: "How do you manage automation degradation from FMS failure while maintaining precision in RVSM airspace?", type: 'technical', alignment: 'CBTA: Automation Management', modelAnswer: "Immediate: maintain altitude using altimeter cross-check. Select heading/altitude modes on FCU. Raw data navigation using VOR/DME if available. Request ATC assistance—vectors or non-RVSM flight level. Document the failure post-flight. Qatar requires proficiency in raw data recovery drills." },
        { q: "Describe your approach to transition between Airbus and Boeing SOPs if required for fleet expansion.", type: 'technical', alignment: 'EBT: Type Rating Flexibility', modelAnswer: "Understand philosophy differences: Boeing pilot-in-command authority vs Airbus envelope protection. Study the FCOM differences document. Complete CBT modules before classroom. Request line training with a TRI/TRE. Respect the differences—don't bring old habits. Qatar expects dual-fleet flexibility." },
        { q: "You notice a subtle deviation in engine parameters that does not trigger a warning. What is your assessment protocol?", type: 'situational', alignment: 'CBTA: Procedural Awareness', modelAnswer: "Monitor for trend—take a snapshot via camera or memory. Cross-reference with QRH normal procedures section. If outside parameters but no ECAM: consider maintenance deferred item (MEL) review, fuel planning adjustment, and inform ATC if performance is affected. Log it. Qatar values proactive technical vigilance." }
      ]
    },
    {
      pillar: 'Team Leadership',
      questions: [
        { q: "Your First Officer disagrees with your go/no-go decision in marginal weather. How do you resolve this while maintaining authority gradient?", type: 'situational', alignment: 'EBT: CRM - Authority & Assertiveness', modelAnswer: "Listen: 'Tell me your concerns.' Evaluate against objective criteria—METAR, TAF, company limits. If still safe: 'I appreciate your input, my decision is to go. Here's why.' If uncertain: 'Let's get more info—request latest observation.' Never let ego override data. Debrief post-flight to build trust." },
        { q: "Describe a time you had to lead a crew through a high-workload phase while managing fatigue across multiple time zones.", type: 'behavioral', alignment: 'CBTA: Leadership Under Fatigue', modelAnswer: "Prioritize tasks: aviate-navigate-communicate. Use sterile cockpit below 10,000 feet. Assign specific duties—'You handle comms, I handle navigation.' Take controlled rest if approved on long sectors. Post-flight: report fatigue via company system, suggest rostering feedback. Lead by example on sleep hygiene." },
        { q: "How do you build trust with a new crew member from a different cultural background on a long-haul pairing?", type: 'behavioral', alignment: 'EBT: Crew Cohesion', modelAnswer: "Pre-flight: brief expectations using TEM model. During flight: standardize communication—no ambiguity. Post-flight: debrief openly. Ask about their previous airline's CRM culture. Share your own. Trust builds through predictability and consistency, not familiarity. Cultural curiosity accelerates crew cohesion." },
        { q: "A cabin crew member reports safety concerns that conflict with operational targets. How do you handle this?", type: 'situational', alignment: 'CBTA: Safety-First Decision Making', modelAnswer: "Safety always wins. Hear the concern fully—don't dismiss because of hierarchy. Assess against SOP and regulatory minimums. If valid: delay or return. If unclear: consult dispatch and maintenance. Report through confidential reporting channel. Never pressure crew to compromise safety for on-time performance. Qatar's safety culture depends on this." }
      ]
    },
    {
      pillar: 'Adaptability',
      questions: [
        { q: "You are rostered for a route you have never flown before with a 12-hour layover in an unfamiliar regulatory environment. How do you prepare?", type: 'situational', alignment: 'EBT: Preparation & Planning', modelAnswer: "Pre-flight: study the route using OFP, NOTAMs, and alternate analysis. Review the destination's AIP for local procedures. Crew rest: arrive early, adapt sleep schedule. On ground: brief with local handlers, understand customs/immigration. Qatar expects 160+ destination readiness—preparation is the standard." },
        { q: "Describe how you adapt your communication style when operating with ATC in regions with limited English proficiency.", type: 'behavioral', alignment: 'CBTA: Communication Flexibility', modelAnswer: "Slow down. Use ICAO standard phraseology only—no colloquialisms. Confirm readbacks. Write down clearances. If unsure: 'Say again' or request confirmation. In extremis: use simpler English. Qatar operates globally—patience and clarity reduce RTF errors. Expectation management is key." },
        { q: "Your schedule changes mid-duty period due to operational disruption across 160+ destination network. What is your response?", type: 'situational', alignment: 'EBT: Operational Resilience', modelAnswer: "Accept: operational control has authority. Assess: duty time limits, rest requirements, FDP legality. Communicate: confirm new roster via company app, adjust sleep plan. Execute: brief new route, check alternate weather. Adaptability is not passive acceptance—it is structured response under uncertainty." },
        { q: "How do you maintain performance consistency across varying sleep schedules, regulatory frameworks, and cultural contexts?", type: 'behavioral', alignment: 'CBTA: Self-Management', modelAnswer: "Systems: consistent pre-sleep routine, blackout, white noise. Nutrition: avoid heavy meals before night sectors. Exercise: hotel gym or bodyweight circuits. Mental: mindfulness or brief meditation pre-flight. Regulatory: study destination requirements before arrival. Cultural: respect local norms—dress, punctuality, interaction style. Consistency comes from discipline, not circumstance." }
      ]
    }
  ], expectations: [
    { title: '5-Star Service Standards', desc: 'Qatar Airways expects pilots to maintain the highest service standards. Excellence in passenger interaction and cultural sensitivity is essential.', bullets: ['Premium Service', 'Cultural Awareness', 'Communication Skills'], icon: Star, color: 'from-amber-500 to-orange-500' },
    { title: 'Technical Excellence', desc: 'Strict adherence to SOPs and automation management. Qatar operates modern Airbus and Boeing fleets requiring advanced technical proficiency.', bullets: ['SOP Compliance', 'Automation Mastery', 'Type Rating'], icon: Cpu, color: 'from-blue-500 to-cyan-500' },
    { title: 'Team Leadership', desc: 'CRM and crew resource management are critical. Pilots must demonstrate leadership in multi-cultural crew environments.', bullets: ['CRM Excellence', 'Leadership', 'Teamwork'], icon: Users, color: 'from-emerald-500 to-teal-500' },
    { title: 'Adaptability', desc: 'Global operations require flexibility with varying time zones, regulations, and cultural contexts across 160+ destinations.', bullets: ['Flexibility', 'Global Operations', 'Regulatory Knowledge'], icon: Globe, color: 'from-violet-500 to-purple-500' }
  ], futureFleetPlans: {
    newAircraft: ['Boeing 787-9', 'Airbus A350-1000', 'Boeing 777-9'],
    retiringAircraft: ['Airbus A380 (progressive phase-out)'],
    expansionPlans: 'Fleet modernization with focus on fuel-efficient aircraft'
  }, aircraftDemand: {
    airbusPreference: 55,
    boeingPreference: 45,
    primaryManufacturer: 'Mixed',
    trendingAircraft: ['Airbus A350', 'Boeing 787', 'Boeing 777X']
  }, pilotRequirements: {
    minHours: 1000,
    preferredHours: 7000,
    typeRatingRequired: ['B777', 'B787', 'A350', 'A321neo', 'B777X'],
    additionalCertifications: ['ETOPS experience', 'University Degree (tie-breaker)'],
    languageRequirements: ['English (Fluent/Level 4+)']
  }, detailedInfo: {
    entryRequirements: {
      captains: 'Direct Entry Captain (DEC): Minimum 6,000 hours total flying time. Command Experience: Minimum 2,000 hours as Pilot-in-Command (PIC) on multi-crew, multi-engine commercial jets with a MTOW of ≥50 Tonnes. Competitive Benchmark: Candidates with 7,000+ total hours and 3,000+ PIC hours on long-haul types (B777/A350) are prioritized.',
      firstOfficers: 'Non-Type Rated (NTR): Minimum 1,000 hours on multi-crew, multi-engine EFIS jets with a MTOW of ≥20 Tonnes. Type Rated: Minimum 500 hours on type (e.g., B777, B787, A320, A350) with a total time of 1,500+ hours.',
      licensesMedical: 'License: Valid ICAO ATPL (Frozen ATPL accepted for FO roles only). Medical: Valid ICAO Class 1 Medical Certificate. English: ICAO English Proficiency Level 4 minimum (Level 5 or 6 is the competitive standard for 2026).',
      recency: 'Must have operated as a pilot on a multi-crew, multi-engine jet within the last 12 months.'
    },
    assessmentProcess: {
      day1: 'Digital screening including personality assessment and cognitive reasoning tests.',
      technicalFocus: 'Technical assessment including written exams and competency-based interviews.',
      simulatorCheck: 'Simulator evaluation focusing on manual handling skills and CRM.'
    },
    workingConditions: {
      roster: 'Rosters can be demanding, often involving back-to-back night flights or long-haul routes. Guaranteed minimum of 8 days off per month, though these may be interspersed with standby days.',
      culture: 'High professional standards expected, with strict adherence to procedures and policies.',
      training: 'New joiners receiving type ratings may be required to sign training bonds.'
    },
    compensationBenefits: {
      salary: 'Competitive tax-free salary package with comprehensive benefits including housing allowances, education support, and flying pay. Specific figures should be confirmed during recruitment process.',
      livingSupport: 'Housing support provided through company housing or monthly allowance.',
      travelPerks: 'Global staff travel benefits for pilots and immediate family.',
      insurance: 'Comprehensive health coverage, life insurance, loss-of-license insurance, and education allowances.'
    },
    profileAlignment: {
      technicalMastery: 'Demonstrate strong technical knowledge and manual flying skills.',
      crmManualFlying: 'Emphasize CRM excellence and manual flying capabilities.',
      professionalism: 'Align with premium brand expectations and maintain high professional standards.',
      culturalAdaptability: 'Demonstrate willingness to relocate and cultural adaptability.'
    },
    latestUpdates: {
      fleetNews: 'Fleet modernization ongoing with focus on fuel-efficient aircraft.',
      futureOrders: 'Orders placed for next-generation aircraft with deliveries planned in coming years.',
      a380Status: 'Fleet adjustments in line with industry trends.',
      openings: 'Active recruitment ongoing for various positions.'
    },
    coreCompetencies: {
      oneTeam: 'Evaluated through group exercises assessing teamwork and leadership skills.',
      drivingExcellence: 'Tested through technical exams and interviews evaluating operational knowledge.',
      customerFirst: 'Assessed through scenarios evaluating operational reliability and brand alignment.',
      safetySituational: 'Tested in simulator assessments evaluating manual control and threat management.',
      futureFleetInsights: 'Understanding aircraft fleet composition helps pilots align their profiles with airline needs.'
    },
    recruitmentStatus: {
      typeRatedPositions: 'Continuous recruitment for type-rated positions.',
      directEntryCaptains: 'Direct entry captain positions available for qualified candidates.',
      applicationMethod: 'Apply through official airline career portals.',
      assessmentProcess: 'Multi-stage assessment process including technical evaluation and competency-based interviews.'
    },
    preparationResources: {
      psychometricCognitive: {
        description: 'Essential for the initial screening. Practice with personality questionnaires and cognitive reasoning tests.',
        cost: '~$50-100',
        providers: ['Various assessment providers']
      },
      atplQuestionBank: {
        description: 'Critical for technical written exams. Focus on performance, navigation, and operational procedures.',
        cost: '~$60-120',
        details: 'ATPL Question Bank (various providers)'
      },
      interviewCoaching: {
        description: 'Preparation for competency-based interviews using STAR method. Focus on airline values and aviation scenarios.',
        cost: '~$150-300',
        providers: ['Career coaching services'],
        topics: ['STAR Method', 'Airline Values', 'Competency Questions']
      },
      technicalGuides: {
        description: 'Essential for preparing for deep-dive questions on your current aircraft type, high-altitude aerodynamics, and performance.',
        cost: '~$60',
        examples: 'Technical interview preparation guides'
      },
      cvAudit: {
        description: 'To ensure your flight hours and professional experience meet the requirements.',
        cost: '~$150 - $300'
      }
    }
  } },
  { id: 'emirates', name: 'Emirates', location: 'UAE', salaryRange: '$130,000 - $280,000/year', flightHours: '4,000+ hrs TT', tags: ['5-Star Airline', 'Global Network', 'Tax-Free'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png', cardImage: 'https://download.logo.wine/logo/Emirates_(airline)/Emirates_(airline)-Logo.wine.png', description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.', fleet: 'Airbus A380, Boeing 777', region: 'Middle East', expectations: [
    { title: 'Wide-Body Proficiency', desc: 'Emirates operates exclusively wide-body aircraft. Pilots must demonstrate expertise in long-haul operations and large aircraft management.', bullets: ['A380 Operations', '777 Expertise', 'Long-Haul Experience'], icon: Cpu, color: 'from-blue-500 to-cyan-500' },
    { title: 'Global Operations', desc: 'Flying to 150+ destinations across 6 continents requires adaptability to diverse regulations, cultures, and time zones.', bullets: ['International Routes', 'Cultural Flexibility', 'Regulatory Knowledge'], icon: Globe, color: 'from-violet-500 to-purple-500' },
    { title: 'Premium Service', desc: 'As a 5-star airline, Emirates expects pilots to maintain high service standards in premium cabin operations.', bullets: ['First Class Service', 'Business Class', 'Premium Economy'], icon: Star, color: 'from-amber-500 to-orange-500' },
    { title: 'Training Excellence', desc: 'Emirates provides world-class training. Pilots are expected to be quick learners and continuously improve skills.', bullets: ['Advanced Training', 'Skill Development', 'Type Rating Mastery'], icon: Brain, color: 'from-emerald-500 to-teal-500' }
  ], futureFleetPlans: {
    newAircraft: ['Boeing 777-9', 'Boeing 787-9', 'Airbus A350'],
    retiringAircraft: ['Airbus A380 (phasing out 2025-2030)'],
    expansionPlans: 'Modernizing fleet with Boeing 777X and 787 Dreamliner, expanding African and South American routes'
  }, aircraftDemand: {
    airbusPreference: 30,
    boeingPreference: 70,
    primaryManufacturer: 'Boeing',
    trendingAircraft: ['Boeing 777X', 'Boeing 787', 'Airbus A350']
  }, pilotRequirements: {
    minHours: 4000,
    preferredHours: 7000,
    typeRatingRequired: ['B777', 'A380'],
    additionalCertifications: ['ICAO Level 5 English', 'ETOPS 180+ min'],
    languageRequirements: ['English (Native/Fluent)']
  } },
  { id: 'etihad', name: 'Etihad Airways', location: 'UAE', salaryRange: '$115,000 - $200,000/year', flightHours: '2,500+ hrs TT', tags: ['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Etihad-airways-logo.svg/1280px-Etihad-airways-logo.svg.png', description: 'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.', fleet: 'Boeing 787, 777, Airbus A350, A380', region: 'Middle East' },
  { id: 'elal', name: 'El Al Israel', location: 'Israel', salaryRange: '$70,000 - $130,000/year', flightHours: '2,000+ hrs TT', tags: ['Tel Aviv Hub', 'Middle East', 'Security Expert'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/el-al.jpg', cardImage: 'https://media.flughafen-zuerich.ch/-/jssmedia/airport/portal/logos/airline/el-al_transparent_neu.png?sc_lang=en&vs=1&sc_site=dxp-portal&rev=d985d5801cda43ffbab274a7e81df7db', description: 'El Al is Israel\'s flag carrier known for exceptional security standards. Pilots benefit from unique Middle Eastern operations and diverse international routes from Tel Aviv.', region: 'Middle East' },
  { id: 'royaljordanian', name: 'Royal Jordanian', location: 'Jordan', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Amman Hub', 'Oneworld', 'Middle East Gateway'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/royal-jordanian.jpg', cardImage: 'https://download.logo.wine/logo/Royal_Jordanian/Royal_Jordanian-Logo.wine.png', description: 'Royal Jordanian serves as a bridge between East and West from Amman. The airline offers pilots unique Middle Eastern operations with Oneworld alliance benefits.', region: 'Middle East' },
  { id: 'saudia', name: 'Saudia', location: 'Saudi Arabia', salaryRange: '$80,000 - $140,000/year', flightHours: '2,500+ hrs TT', tags: ['Jeddah Hub', 'Skyteam', 'Growing Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/saudia.jpg', cardImage: 'https://static.wikia.nocookie.net/aviation-airport/images/d/de/Logo_of_Saudia.svg.png/revision/latest?cb=20240530125824', description: 'Saudia is Saudi Arabia\'s flag carrier undergoing rapid transformation. Pilots have opportunities in a rapidly modernizing fleet with growing international destinations.', region: 'Middle East' },
  { id: 'omanair', name: 'Oman Air', location: 'Oman', salaryRange: '$65,000 - $120,000/year', flightHours: '2,000+ hrs TT', tags: ['Muscat Hub', 'Oneworld', 'Growing Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687736/airline-expectations/oman-air.webp', cardImage: 'https://download.logo.wine/logo/Oman_Air/Oman_Air-Logo.wine.png', description: 'Oman Air is the national carrier of Oman. Operating from Muscat with a growing Boeing 787 Dreamliner fleet, offering pilots opportunities in the dynamic Middle East market.', fleet: 'Boeing 787 Dreamliner, 737', region: 'Middle East' },
  // Asia
  { id: 'singapore', name: 'Singapore Airlines', location: 'Singapore', salaryRange: '$120,000 - $180,000/year', flightHours: '3,000+ hrs TT', tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg', cardImage: 'https://static.vecteezy.com/system/resources/previews/055/210/889/non_2x/singapore-airlines-logo-free-download-singapore-airlines-logo-free-png.png', description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location.', fleet: 'Airbus A350, A380 (phasing out), Boeing 777, 787', region: 'Asia', expectations: [
    { title: 'Singapore Girl Service', desc: 'World-renowned service standards. Pilots must exemplify the Singapore Girl tradition of excellence in passenger service.', bullets: ['Service Excellence', 'Hospitality', 'Professionalism'], icon: Star, color: 'from-amber-500 to-orange-500' },
    { title: 'Asian Network Expertise', desc: 'Strategic Singapore hub requires knowledge of Asian routes, weather patterns, and regional regulations.', bullets: ['Asian Routes', 'Regional Knowledge', 'Hub Operations'], icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { title: 'Technical Precision', desc: 'SIA operates modern Airbus and Boeing fleets with strict adherence to technical procedures and automation management.', bullets: ['Fleet Mastery', 'SOP Compliance', 'Automation Skills'], icon: Cpu, color: 'from-emerald-500 to-teal-500' },
    { title: 'Cultural Sensitivity', desc: 'Operating across diverse Asian cultures requires exceptional cultural awareness and communication abilities.', bullets: ['Cultural Awareness', 'Communication', 'Adaptability'], icon: Users, color: 'from-violet-500 to-purple-500' }
  ], futureFleetPlans: {
    newAircraft: ['Boeing 777-9', 'Airbus A350-1000'],
    retiringAircraft: ['Boeing 777-200ER', 'Airbus A330-300', 'Airbus A380 (progressive phase-out)'],
    expansionPlans: 'Focusing on long-haul expansion to Europe and North America with new A350 and 777X aircraft'
  }, aircraftDemand: {
    airbusPreference: 60,
    boeingPreference: 40,
    primaryManufacturer: 'Airbus',
    trendingAircraft: ['Airbus A350', 'Boeing 777X']
  }, pilotRequirements: {
    minHours: 3000,
    preferredHours: 5000,
    typeRatingRequired: ['B777', 'A350', 'A330', 'A380'],
    additionalCertifications: ['ICAO Level 5 English', 'ETOPS 180+ min'],
    languageRequirements: ['English (Native/Fluent)', 'Mandarin/Cantonese (Preferred)']
  } },
  { id: 'cathay', name: 'Cathay Pacific', location: 'Hong Kong', salaryRange: '$110,000 - $160,000/year', flightHours: '2,500+ hrs TT', tags: ['5-Star Airline', 'Asian Network', 'Career Growth'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg', cardImage: 'https://download.logo.wine/logo/Cathay_Pacific/Cathay_Pacific-Logo.wine.png', description: 'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage and strong career progression pathways.', fleet: 'Airbus A350, A330, Boeing 777', region: 'Asia' },
  { id: 'ana', name: 'ANA All Nippon', location: 'Japan', salaryRange: '$100,000 - $170,000/year', flightHours: '1,500+ hrs TT', tags: ['5-Star Airline', 'Tokyo Hub', 'Japanese Quality'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg', cardImage: 'https://download.logo.wine/logo/All_Nippon_Airways/All_Nippon_Airways-Logo.wine.png', description: 'ANA is Japan\'s largest airline and a 5-star carrier renowned for exceptional service. Pilots benefit from Japanese precision, excellent training, and access to key Asian markets.', fleet: 'Boeing 777, 787, Airbus A380, A320', region: 'Asia' },
  { id: 'jal', name: 'Japan Airlines', location: 'Japan', salaryRange: '$95,000 - $165,000/year', flightHours: '1,500+ hrs TT', tags: ['Premium Service', 'Tokyo Hub', 'Domestic + International'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg', cardImage: 'https://download.logo.wine/logo/Japan_Airlines/Japan_Airlines-Logo.wine.png', description: 'Japan Airlines represents the finest in Japanese hospitality combined with aviation excellence.', fleet: 'Boeing 737, 767, 777, 787, Airbus A350', region: 'Asia' },
  { id: 'korean', name: 'Korean Air', location: 'South Korea', salaryRange: '$85,000 - $150,000/year', flightHours: '2,000+ hrs TT', tags: ['Seoul Hub', 'North American Routes', 'Growing Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/korean-air.jpg', cardImage: 'https://crystalpng.com/wp-content/uploads/2025/03/korean-air-logo.png', description: 'Korean Air is South Korea\'s flagship carrier with a strong presence on trans-Pacific routes. Pilots enjoy competitive Asian compensation and a modern, expanding aircraft fleet.', region: 'Asia' },
  { id: 'asiana', name: 'Asiana Airlines', location: 'South Korea', salaryRange: '$80,000 - $140,000/year', flightHours: '1,800+ hrs TT', tags: ['Star Alliance', 'Incheon Hub', 'Service Excellence'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/asiana-airlines.webp', cardImage: 'https://download.logo.wine/logo/Asiana_Airlines/Asiana_Airlines-Logo.wine.png', description: 'Asiana Airlines is known for outstanding service quality and safety standards. The airline provides pilots with excellent training and opportunities on both regional and long-haul routes.', region: 'Asia' },
  { id: 'thai', name: 'Thai Airways', location: 'Thailand', salaryRange: '$60,000 - $110,000/year', flightHours: '1,500+ hrs TT', tags: ['Bangkok Hub', 'Southeast Asian Network', 'Royal Service'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/thai-airways.jpg', cardImage: 'https://download.logo.wine/logo/Thai_Airways/Thai_Airways-Logo.wine.png', description: 'Thai Airways offers a unique blend of Thai hospitality and international aviation standards. Pilots enjoy living in Thailand while flying to destinations across Asia and beyond.', region: 'Asia' },
  { id: 'malaysia', name: 'Malaysia Airlines', location: 'Malaysia', salaryRange: '$55,000 - $100,000/year', flightHours: '1,200+ hrs TT', tags: ['KL Hub', 'Southeast Asia', 'OneWorld Member'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/malaysia-airlines.jpg', cardImage: 'https://static.cdnlogo.com/logos/m/97/malaysia-airlines.png', description: 'Malaysia Airlines connects Southeast Asia with the world from its Kuala Lumpur hub. The airline offers pilots competitive compensation and exposure to diverse Asian markets.', region: 'Asia' },
  { id: 'garuda', name: 'Garuda Indonesia', location: 'Indonesia', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Jakarta Hub', 'Archipelago Network', 'Growing Market'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/garuda-indonesia.jpg', cardImage: 'https://s28477.pcdn.co/wp-content/uploads/2017/04/GA_900.png', description: 'Garuda Indonesia serves the world\'s largest archipelago nation. Pilots benefit from rapid fleet modernization and the opportunity to fly across one of Earth\'s most diverse geographic areas.', region: 'Asia' },
  { id: 'philippine', name: 'Philippine Airlines', location: 'Philippines', salaryRange: '$45,000 - $90,000/year', flightHours: '1,200+ hrs TT', tags: ['Manila Hub', 'Pacific Routes', 'Historic Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/philippine-airlines.webp', cardImage: 'https://i.logos-download.com/281/50-3370dc4884bc857d80e42e5dff74f2f1.png/Philippine_Airlines_Logo_1986.png?dl', description: 'Philippine Airlines is Asia\'s oldest commercial airline. It offers pilots a unique base in the Philippines with growing international connections to North America and Asia.', region: 'Asia' },
  { id: 'vietnam', name: 'Vietnam Airlines', location: 'Vietnam', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Hanoi Hub', 'Growing Economy', 'Modern Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/vietnam-airlines.jpg', cardImage: 'https://images.seeklogo.com/logo-png/48/2/vietnam-airlines-logo-png_seeklogo-482018.png', description: 'Vietnam Airlines represents one of Asia\'s fastest-growing economies. The airline is rapidly modernizing its fleet and expanding international routes.', region: 'Asia' },
  { id: 'china', name: 'Air China', location: 'China', salaryRange: '$70,000 - $120,000/year', flightHours: '2,000+ hrs TT', tags: ['Beijing Hub', 'Largest Market', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-china.jpg', cardImage: 'https://download.logo.wine/logo/Air_China/Air_China-Logo.wine.png', description: 'Air China is the flag carrier of the People\'s Republic of China and the world\'s largest aviation market.', region: 'Asia' },
  { id: 'chinaeastern', name: 'China Eastern', location: 'China', salaryRange: '$65,000 - $115,000/year', flightHours: '1,800+ hrs TT', tags: ['Shanghai Hub', 'Skyteam Member', 'Major Player'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-eastern.jpg', cardImage: 'https://download.logo.wine/logo/China_Eastern_Airlines/China_Eastern_Airlines-Logo.wine.png', description: 'China Eastern Airlines operates from Shanghai, connecting China with the world.', region: 'Asia' },
  { id: 'chinasouthern', name: 'China Southern', location: 'China', salaryRange: '$60,000 - $110,000/year', flightHours: '1,800+ hrs TT', tags: ['Guangzhou Hub', 'Largest Fleet', 'Asia Focus'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-southern.jpg', cardImage: 'https://download.logo.wine/logo/China_Southern_Airlines/China_Southern_Airlines-Logo.wine.png', description: 'China Southern operates China\'s largest fleet with extensive Asian coverage.', region: 'Asia' },
  { id: 'cathaydragon', name: 'Cathay Dragon', location: 'Hong Kong', salaryRange: '$70,000 - $120,000/year', flightHours: '1,500+ hrs TT', tags: ['Regional', 'Hong Kong Hub', 'Asia Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-dragon.webp', cardImage: 'https://download.logo.wine/logo/Cathay_Dragon/Cathay_Dragon-Logo.wine.png', description: 'Cathay Dragon served regional Asian destinations from Hong Kong. Now integrated into Cathay Pacific with excellent regional opportunities.', region: 'Asia' },
  { id: 'hkexpress', name: 'HK Express', location: 'Hong Kong', salaryRange: '$45,000 - $80,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Hong Kong Hub', 'Asia Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/hk-express.jpg', cardImage: 'https://images.vasystem.org/RaTF0GeycgYpI7xGesmehhU2CXL4ZZYNXla0o1Jtszc/rt:fill/g:sm/el:1/aHR0cHM6Ly9pbWFnZXMtc3RvcmFnZS52YXN5c3RlbS5vcmcvb25ld29ybGR2aXJ0dWFsL2Z4L1pkL2Z4WmRsTVplRGVSRnFmTm14RXBPb1F0THBwZ3Bwc3FzemNQY29NcFdIcnNRSXRZTVdKdVJJQWFzdVZ3VmlsQ1MucG5n', description: 'HK Express is Hong Kong\'s low-cost carrier. Part of Cathay Pacific group offering pilots dynamic short-haul Asian operations.', region: 'Asia' },
  { id: 'scoot', name: 'Scoot', location: 'Singapore', salaryRange: '$50,000 - $90,000/year', flightHours: '1,200+ hrs TT', tags: ['Low Cost', 'Singapore Hub', 'Long Haul LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/scoot.webp', cardImage: 'https://www.logo.wine/a/logo/Scoot/Scoot-Logo.wine.svg', description: 'Scoot is Singapore Airlines\' low-cost subsidiary. Operates Boeing 787 long-haul low-cost routes across Asia and beyond.', region: 'Asia' },
  { id: 'jetstar', name: 'Jetstar Asia', location: 'Singapore', salaryRange: '$45,000 - $80,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Singapore Hub', 'Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetstar-asia.jpg', cardImage: 'https://download.logo.wine/logo/Jetstar_Airways/Jetstar_Airways-Logo.wine.png', description: 'Jetstar Asia serves regional Southeast Asian markets. Part of Qantas Group offering pilots diverse Asian low-cost operations.', region: 'Asia' },
  { id: 'peach', name: 'Peach Aviation', location: 'Japan', salaryRange: '$40,000 - $70,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Osaka Hub', 'Domestic Japan'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/peach-aviation.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2021/07/Peach-Aviation-Logo-1.png', description: 'Peach Aviation is Japan\'s leading low-cost carrier. Based in Osaka with extensive domestic and regional Asian network.', region: 'Asia' },
  { id: 'spring', name: 'Spring Airlines', location: 'China', salaryRange: '$35,000 - $65,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Shanghai Hub', 'Largest LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spring-airlines.jpg', cardImage: 'https://download.logo.wine/logo/Spring_Airlines/Spring_Airlines-Logo.wine.png', description: 'Spring Airlines is China\'s largest low-cost carrier. Based in Shanghai with extensive domestic Chinese network.', region: 'Asia' },
  { id: 'indigo', name: 'IndiGo', location: 'India', salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Delhi Hub', 'India\'s Largest'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/indigo.jpg', cardImage: 'https://iconlogovector.com/uploads/images/2024/11/lg-672e09ff0beee-IndiGo.webp', description: 'IndiGo is India\'s largest airline by passengers. Fast-growing low-cost carrier with extensive domestic and international network.', region: 'Asia' },
  { id: 'airindia', name: 'Air India', location: 'India', salaryRange: '$40,000 - $75,000/year', flightHours: '1,500+ hrs TT', tags: ['Mumbai Hub', 'Star Alliance', 'Historic Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776689695/airline-expectations/air-india-new.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Air_India_logo_%282007–2023%29.svg', description: 'Air India is India\'s flag carrier now part of Tata Group. Star Alliance member with extensive international network.', region: 'Asia' },
  { id: 'spicejet', name: 'SpiceJet', location: 'India', salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Delhi Hub', 'Budget Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spicejet.jpg', cardImage: 'https://iconlogovector.com/uploads/images/2025/02/lg-67a93fc31f733-SpiceJet.webp', description: 'SpiceJet is one of India\'s leading low-cost carriers. Operating Boeing 737s across extensive Indian domestic network.', region: 'Asia' },
  { id: 'aigle', name: 'Air India Express', location: 'India', salaryRange: '$30,000 - $55,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Kochi Hub', 'Gulf Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-india-express.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Air_India_Express_Logo.svg/3840px-Air_India_Express_Logo.svg.png', description: 'Air India Express serves Gulf routes from Kerala. Low-cost subsidiary connecting Indian workers to Middle East destinations.', region: 'Asia' },
  { id: 'cebupacific', name: 'Cebu Pacific', location: 'Philippines', salaryRange: '$20,000 - $40,000/year', flightHours: '1,000+ hrs TT', tags: ['Manila Hub', 'Low Cost', 'Largest Philippine LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cebu-pacific.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2020/10/Cebu-Pacific-Logo.png', description: 'Cebu Pacific is the Philippines\' largest low-cost carrier. Operating from Manila with extensive domestic and growing international network.', region: 'Asia' },
  { id: 'srilankan', name: 'SriLankan Airlines', location: 'Sri Lanka', salaryRange: '$30,000 - $60,000/year', flightHours: '1,500+ hrs TT', tags: ['Colombo Hub', 'Oneworld', 'Indian Ocean'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/srilankan-airlines.jpg', cardImage: 'https://download.logo.wine/logo/SriLankan_Airlines/SriLankan_Airlines-Logo.wine.png', description: 'SriLankan Airlines serves as the Indian Ocean hub from Colombo. Oneworld member with excellent Asian and Middle East connections.', region: 'Asia' },
  { id: 'nepal', name: 'Nepal Airlines', location: 'Nepal', salaryRange: '$20,000 - $40,000/year', flightHours: '1,000+ hrs TT', tags: ['Kathmandu Hub', 'Mountain Flying', 'Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/nepal-airlines.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Nepal_Airlines_logo.png', description: 'Nepal Airlines operates in challenging Himalayan terrain. Unique mountain flying experience from Kathmandu to regional destinations.', region: 'Asia' },
  { id: 'biman', name: 'Biman Bangladesh', location: 'Bangladesh', salaryRange: '$25,000 - $45,000/year', flightHours: '1,500+ hrs TT', tags: ['Dhaka Hub', 'National Carrier', 'Gulf Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/bangladesh-biman.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2023/05/Biman-Bangladesh-Airlines-Logo.png', description: 'Biman Bangladesh is the national carrier of Bangladesh. Operating from Dhaka with focus on Middle East and Asian routes.', region: 'Asia' },
  // Europe
  { id: 'lufthansa', name: 'Lufthansa', location: 'Germany', salaryRange: '$90,000 - $160,000/year', flightHours: '1,500+ hrs TT', tags: ['European Leader', 'Star Alliance', 'Career Stability'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/1280px-Lufthansa_Logo_2018.svg.png', description: 'Lufthansa is Europe\'s largest airline and a founding member of Star Alliance. It offers excellent career stability, comprehensive benefits, and opportunities to fly to over 200 destinations worldwide.', fleet: 'Airbus A350, A330, Boeing 747-8, 777', region: 'Europe' },
  { id: 'british', name: 'British Airways', location: 'United Kingdom', salaryRange: '$85,000 - $150,000/year', flightHours: '1,500+ hrs TT', tags: ['Legacy Carrier', 'Heathrow Hub', 'Global Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg', cardImage: 'https://download.logo.wine/logo/British_Airways/British_Airways-Logo.wine.png', description: 'British Airways operates from its hub at London Heathrow, offering pilots access to a vast global network.', fleet: 'Boeing 777, 787, Airbus A350, A380', region: 'Europe' },
  { id: 'airfrance', name: 'Air France', location: 'France', salaryRange: '$80,000 - $140,000/year', flightHours: '1,500+ hrs TT', tags: ['French Flagship', 'CDG Hub', 'European Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg', cardImage: 'https://download.logo.wine/logo/Air_France/Air_France-Logo.wine.png', description: 'Air France is the French flag carrier with a rich history dating back to 1933. Pilots enjoy working in a multicultural environment with excellent French employment benefits.', fleet: 'Boeing 777, 787, Airbus A350, A330', region: 'Europe' },
  { id: 'klm', name: 'KLM', location: 'Netherlands', salaryRange: '$75,000 - $135,000/year', flightHours: '1,200+ hrs TT', tags: ['Dutch Legacy', 'Amsterdam Hub', 'Efficient Operations'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg', cardImage: 'https://global.discourse-cdn.com/infiniteflight/original/3X/c/0/c0bd00655c561aa489f269af91bb67da98f37a7e.png', description: 'KLM Royal Dutch Airlines is the oldest airline still operating under its original name. Known for efficient operations and excellent pilot relations.', fleet: 'Boeing 777, 787, Airbus A330', region: 'Europe' },
  { id: 'swiss', name: 'Swiss International', location: 'Switzerland', salaryRange: '$95,000 - $155,000/year', flightHours: '1,500+ hrs TT', tags: ['Premium Service', 'Swiss Quality', 'Zurich Hub'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Swiss_new.svg/3840px-Swiss_new.svg.png', description: 'Swiss International Air Lines combines traditional Swiss quality with modern aviation standards.', fleet: 'Airbus A320 family, A330, A340', region: 'Europe' },
  { id: 'turkish', name: 'Turkish Airlines', location: 'Turkey', salaryRange: '$70,000 - $130,000/year', flightHours: '2,000+ hrs TT', tags: ['Fast Growing', 'Istanbul Hub', '120+ Countries'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2020/04/Turkish_Airlines_logo.png', description: 'Turkish Airlines flies to more countries than any other airline. With its modern Istanbul Airport hub, it offers pilots exposure to diverse international routes.', fleet: 'Boeing 737, 777, 787, Airbus A320, A330, A350', region: 'Europe' },
  { id: 'iberia', name: 'Iberia', location: 'Spain', salaryRange: '$65,000 - $115,000/year', flightHours: '1,500+ hrs TT', tags: ['Madrid Hub', 'Oneworld', 'Latin America Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/iberia.jpg', cardImage: 'https://iconape.com/wp-content/files/sx/360713/png/360713.png', description: 'Iberia is Spain\'s flagship carrier with strong connections to Latin America. Pilots benefit from excellent Spanish employment benefits and extensive transatlantic operations.', region: 'Europe' },
  { id: 'alitalia', name: 'ITA Airways', location: 'Italy', salaryRange: '$55,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Rome Hub', 'Skyteam', 'Mediterranean Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ita-airways.jpg', cardImage: 'https://cdn.sanity.io/images/yge09889/production/59d99500e49415bd73913dd13d44f46120489557-1100x600.png', description: 'ITA Airways represents the rebirth of Italian aviation. Operating from Rome with modern Airbus fleet.', region: 'Europe' },
  { id: 'austrian', name: 'Austrian Airlines', location: 'Austria', salaryRange: '$60,000 - $110,000/year', flightHours: '1,500+ hrs TT', tags: ['Vienna Hub', 'Star Alliance', 'Eastern Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/austrian-airlines.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Austrian_Airlines_Logo_neu.svg/3840px-Austrian_Airlines_Logo_neu.svg.png', description: 'Austrian Airlines serves as the gateway to Eastern Europe from Vienna. Part of Lufthansa Group.', region: 'Europe' },
  { id: 'brussels', name: 'Brussels Airlines', location: 'Belgium', salaryRange: '$58,000 - $105,000/year', flightHours: '1,500+ hrs TT', tags: ['Brussels Hub', 'Star Alliance', 'Africa Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/brussels-airlines.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2020/04/Brussels-Airlines-Logo.png', description: 'Brussels Airlines is Belgium\'s flagship carrier with extensive African network. Part of Lufthansa Group.', region: 'Europe' },
  { id: 'sas', name: 'SAS Scandinavian', location: 'Denmark/Norway/Sweden', salaryRange: '$55,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Copenhagen Hub', 'Star Alliance', 'Nordic Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/sas.jpg', cardImage: 'https://iconlogovector.com/uploads/images/2024/10/lg-671807c8e5f49-Scandinavian-Airlines-SAS.webp', description: 'SAS serves Scandinavia with Copenhagen, Oslo and Stockholm hubs. Known for excellent pilot work-life balance and strong Nordic labor protections.', region: 'Europe' },
  { id: 'finnair', name: 'Finnair', location: 'Finland', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Helsinki Hub', 'Oneworld', 'Asia Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/finnair.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Finnair_Logo.svg/1280px-Finnair_Logo.svg.png', description: 'Finnair offers the shortest route between Europe and Asia via Helsinki. Modern Airbus A350 fleet.', region: 'Europe' },
  { id: 'tap', name: 'TAP Portugal', location: 'Portugal', salaryRange: '$45,000 - $85,000/year', flightHours: '1,500+ hrs TT', tags: ['Lisbon Hub', 'Star Alliance', 'Brazil Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/tap-portugal.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2019/12/TAP-Portugal-Logo.png', description: 'TAP Portugal connects Europe to Brazil and Africa from Lisbon. Known for warm Portuguese culture and growing international network.', region: 'Europe' },
  { id: 'aegean', name: 'Aegean Airlines', location: 'Greece', salaryRange: '$40,000 - $75,000/year', flightHours: '1,200+ hrs TT', tags: ['Athens Hub', 'Star Alliance', 'Island Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aegean.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Aegean_Airlines_Logo_2020.png', description: 'Aegean Airlines is Greece\'s largest carrier with extensive island network.', region: 'Europe' },
  { id: 'lot', name: 'LOT Polish', location: 'Poland', salaryRange: '$40,000 - $75,000/year', flightHours: '1,500+ hrs TT', tags: ['Warsaw Hub', 'Star Alliance', 'Eastern Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lot-polish.jpg', cardImage: 'https://iconlogovector.com/uploads/images/2025/03/lg-67dfe3d5892a8-LOT-Polish-Airlines.webp', description: 'LOT Polish Airlines is Eastern Europe\'s leading carrier. Growing long-haul network with Boeing 787 Dreamliners.', region: 'Europe' },
  { id: 'czech', name: 'Czech Airlines', location: 'Czech Republic', salaryRange: '$35,000 - $65,000/year', flightHours: '1,200+ hrs TT', tags: ['Prague Hub', 'Skyteam', 'Central Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/czech-airlines.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Czech_Airlines_Logo.svg/3840px-Czech_Airlines_Logo.svg.png', description: 'Czech Airlines serves Central Europe from historic Prague. One of the world\'s oldest airlines.', region: 'Europe' },
  { id: 'norwegian', name: 'Norwegian', location: 'Norway', salaryRange: '$45,000 - $80,000/year', flightHours: '1,500+ hrs TT', tags: ['Low Cost', 'Oslo Hub', 'Transatlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/norwegian.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Norwegian_Logo_2024.svg/1280px-Norwegian_Logo_2024.svg.png', description: 'Norwegian revolutionized low-cost transatlantic travel. Rebuilt fleet offering pilots extensive European and long-haul operations.', region: 'Europe' },
  { id: 'icelandair', name: 'Icelandair', location: 'Iceland', salaryRange: '$50,000 - $90,000/year', flightHours: '1,500+ hrs TT', tags: ['Reykjavik Hub', 'Iceland', 'North Atlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/icelandair.jpg', cardImage: 'https://download.logo.wine/logo/Icelandair/Icelandair-Logo.wine.png', description: 'Icelandair offers unique North Atlantic operations via Reykjavik. Pilots experience challenging weather operations and stunning scenery.', region: 'Europe' },
  { id: 'virginatlantic', name: 'Virgin Atlantic', location: 'United Kingdom', salaryRange: '$80,000 - $150,000/year', flightHours: '1,500+ hrs TT', tags: ['London Hub', 'Transatlantic', 'Premium Service'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-atlantic.jpg', cardImage: 'https://iconlogovector.com/uploads/images/2024/10/lg-6701093043726-Virgin-Atlantic.webp', description: 'Virgin Atlantic is a British airline known for its innovative service and transatlantic focus. Operating from London Heathrow and Gatwick with a modern fleet.', region: 'Europe' },
  // Americas
  { id: 'delta', name: 'Delta Air Lines', location: 'United States', salaryRange: '$110,000 - $250,000/year', flightHours: '1,500+ hrs TT', tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg', cardImage: 'https://logodix.com/logo/2219337.png', description: 'Delta is the world\'s largest airline by revenue and fleet size. It offers pilots industry-leading compensation, excellent benefits, and a vast domestic and international network.', fleet: 'Airbus A220, A320, A330, A350, Boeing 737, 757, 767, 777', region: 'Americas' },
  { id: 'american', name: 'American Airlines', location: 'United States', salaryRange: '$100,000 - $230,000/year', flightHours: '1,500+ hrs TT', tags: ['World\'s Largest', 'Dallas Hub', 'Oneworld Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/american-airlines.jpg', cardImage: 'https://s202.q4cdn.com/986123435/files/doc_downloads/logos/american-airlines/THUMB-aa_aa__ahz_4cp_grd_pos-(1).png', description: 'American Airlines is the world\'s largest airline by fleet size and passengers carried.', fleet: 'Airbus A320, A321, Boeing 737, 777, 787', region: 'Americas' },
  { id: 'united', name: 'United Airlines', location: 'United States', salaryRange: '$105,000 - $240,000/year', flightHours: '1,500+ hrs TT', tags: ['Global Network', 'Chicago Hub', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/united.jpg', cardImage: 'https://images.seeklogo.com/logo-png/25/3/united-airlines-logo-png_seeklogo-257841.png', description: 'United Airlines offers one of the most comprehensive global networks. With hubs across the US and Star Alliance membership.', fleet: 'Airbus A319, A320, Boeing 737, 757, 767, 777, 787', region: 'Americas' },
  { id: 'southwest', name: 'Southwest Airlines', location: 'United States', salaryRange: '$95,000 - $200,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost Leader', 'Domestic Focus', 'Great Culture'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/southwest.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Southwest_Airlines_logo_2014.svg/1280px-Southwest_Airlines_logo_2014.svg.png', description: 'Southwest Airlines is the world\'s largest low-cost carrier. Known for excellent pilot relations and unique company culture.', region: 'Americas' },
  { id: 'alaska', name: 'Alaska Airlines', location: 'United States', salaryRange: '$90,000 - $180,000/year', flightHours: '1,200+ hrs TT', tags: ['West Coast', 'Seattle Hub', 'Award Winning'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/alaska-airlines.jpg', cardImage: 'https://news.alaskaair.com/wp-content/uploads/2024/08/Alaska-Airlines-1.png', description: 'Alaska Airlines is consistently rated among the best US airlines. With its Seattle hub and West Coast focus.', region: 'Americas' },
  { id: 'jetblue', name: 'JetBlue Airways', location: 'United States', salaryRange: '$85,000 - $170,000/year', flightHours: '1,500+ hrs TT', tags: ['New York Hub', 'Transcontinental', 'Modern Experience'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetblue.jpg', cardImage: 'https://1000logos.net/wp-content/uploads/2019/12/JetBlue-Airways-Logo.png', description: 'JetBlue Airways revolutionized US domestic travel with its premium economy approach. Based in New York.', region: 'Americas' },
  { id: 'aircanada', name: 'Air Canada', location: 'Canada', salaryRange: '$80,000 - $160,000/year', flightHours: '1,500+ hrs TT', tags: ['Toronto Hub', 'Star Alliance', 'Transatlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-canada.jpg', cardImage: 'https://download.logo.wine/logo/Air_Canada/Air_Canada-Logo.wine.png', description: 'Air Canada is Canada\'s flag carrier and largest airline. Pilots enjoy flying to over 200 destinations worldwide.', region: 'Americas' },
  { id: 'westjet', name: 'WestJet', location: 'Canada', salaryRange: '$70,000 - $140,000/year', flightHours: '1,200+ hrs TT', tags: ['Calgary Hub', 'Canadian Leader', 'Growing International'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/westjet.jpg', cardImage: 'https://download.logo.wine/logo/WestJet/WestJet-Logo.wine.png', description: 'WestJet is Canada\'s second-largest airline and growing internationally.', region: 'Americas' },
  { id: 'latam', name: 'LATAM Airlines', location: 'Chile', salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT', tags: ['Santiago Hub', 'South America', 'Largest Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/latam.jpg', cardImage: 'https://s.latamairlines.com/images/seo/logo-latam-airlines.png', description: 'LATAM is Latin America\'s largest airline group. From Santiago, pilots access an unmatched South American network.', region: 'Americas' },
  { id: 'avianca', name: 'Avianca', location: 'Colombia', salaryRange: '$55,000 - $110,000/year', flightHours: '1,200+ hrs TT', tags: ['Bogota Hub', 'Star Alliance', 'Historic Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/avianca.jpg', cardImage: 'https://download.logo.wine/logo/Avianca/Avianca-Logo.wine.png', description: 'Avianca is one of the world\'s oldest continuously operating airlines. Its Bogota hub provides pilots access to diverse South American destinations.', region: 'Americas' },
  { id: 'aeromexico', name: 'Aeromexico', location: 'Mexico', salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Mexico City Hub', 'Skyteam', 'Regional Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aeromexico.jpg', cardImage: 'https://cdn.freebiesupply.com/logos/thumbs/1x/aeromexico-logo.png', description: 'Aeromexico connects Latin America with the world from Mexico City.', region: 'Americas' },
  { id: 'copaair', name: 'Copa Airlines', location: 'Panama', salaryRange: '$65,000 - $125,000/year', flightHours: '1,500+ hrs TT', tags: ['Panama Hub', 'Hub Americas', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/copa-airlines.jpg', cardImage: 'https://www.travelinti.com/wp-content/uploads/Copa-airlines-logo.webp', description: 'Copa Airlines operates the Hub of the Americas in Panama. Pilots benefit from the strategic location connecting North and South America.', region: 'Americas' },
  { id: 'gol', name: 'GOL Linhas', location: 'Brazil', salaryRange: '$55,000 - $105,000/year', flightHours: '1,200+ hrs TT', tags: ['Sao Paulo Hub', 'Low Cost Brazil', 'Domestic Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/gol.jpg', cardImage: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Gol_airlines_logo.png', description: 'GOL is Brazil\'s largest domestic airline. Pilots fly within one of the world\'s most geographically diverse countries.', region: 'Americas' },
  // Oceania
  { id: 'qantas', name: 'Qantas', location: 'Australia', salaryRange: '$95,000 - $180,000/year', flightHours: '2,000+ hrs TT', tags: ['Sydney Hub', 'Oneworld', 'Safest Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qantas.jpg', cardImage: 'https://logodownload.org/wp-content/uploads/2020/03/qantas-airways-logo-0.png', description: 'Qantas is Australia\'s flag carrier and one of the world\'s safest airlines. Known for its Sydney-London Kangaroo Route.', region: 'Oceania' },
  { id: 'virginaustralia', name: 'Virgin Australia', location: 'Australia', salaryRange: '$75,000 - $145,000/year', flightHours: '1,500+ hrs TT', tags: ['Brisbane Hub', 'Competitive Service', 'Domestic Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-australia.png', description: 'Virgin Australia brings competitive service to the Australian market. Pilots enjoy modern aircraft and a focus on customer experience.', region: 'Oceania' },
  // Africa
  { id: 'egyptair', name: 'EgyptAir', location: 'Egypt', salaryRange: '$45,000 - $85,000/year', flightHours: '1,500+ hrs TT', tags: ['Cairo Hub', 'Star Alliance', 'African Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687052/airline-expectations/egypt-air.jpg', cardImage: 'https://download.logo.wine/logo/EgyptAir/EgyptAir-Logo.wine.png', description: 'EgyptAir connects Africa with the world from historic Cairo. Pilots benefit from unique African operations.', region: 'Africa' },
  { id: 'ethiopian', name: 'Ethiopian Airlines', location: 'Ethiopia', salaryRange: '$50,000 - $90,000/year', flightHours: '1,500+ hrs TT', tags: ['Addis Ababa Hub', 'Star Alliance', 'African Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ethiopian-airlines.jpg', cardImage: 'https://brandlogos.net/wp-content/uploads/2022/01/ethiopian_airlines-logo-brandlogo.net_-300x300.png', description: 'Ethiopian Airlines is Africa\'s largest and most successful airline. From Addis Ababa, pilots access the continent\'s most extensive network.', region: 'Africa' },
  { id: 'southafrican', name: 'South African Airways', location: 'South Africa', salaryRange: '$40,000 - $80,000/year', flightHours: '1,200+ hrs TT', tags: ['Johannesburg Hub', 'Star Alliance', 'Southern Africa'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/south-african-airways.jpg', cardImage: 'https://static.wikia.nocookie.net/aircraft/images/0/00/South_African_Logo.svg.png/revision/latest/thumbnail/width/360/height/360?cb=20220427094717', description: 'South African Airways connects the African continent from Johannesburg. Pilots enjoy diverse flying opportunities across Africa.', region: 'Africa' },
];

const CORE_EXPECTATIONS = [
  {
    title: 'Technical Mastery',
    desc: 'Airlines assess automation management, systems knowledge, and manual flight path precision. Our EBT CBTA framework ensures competencies align with manufacturer standards.',
    icon: Cpu,
    color: 'from-blue-500 to-cyan-500',
    bullets: ['Automation Logic', 'Manual Precision', 'Systems Mastery'],
  },
  {
    title: 'Behavioral Competency',
    desc: 'CRM, crew leadership, and communication are evaluated through observed scenarios. 50 hours of verifiable mentorship validates behavioral competencies practically.',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    bullets: ['CRM Excellence', 'Decision Making', 'Balanced Leadership'],
  },
  {
    title: 'Cognitive Resilience',
    desc: 'Situational awareness, workload management, and pressure decision-making are assessed through EBT CBTA-aligned frameworks and recognition-based profiling.',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    bullets: ['Mental Agility', 'Situational Awareness', 'Workload Management'],
  },
  {
    title: 'Professional Persona',
    desc: 'Commitment to safety culture, airline values, and long-term career stewardship. Objective pathway matching based on verified competencies, not connections.',
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    bullets: ['Safety Culture', 'Company Fit', 'Ethics & Integrity'],
  },
];

const ASSESSMENT_PIPELINE = [
  { title: 'Screening', desc: 'Digital audit of your ATLAS CV and minimum legal credentials.', icon: Search },
  { title: 'Psychometrics', desc: 'Cognitive ability, spatial awareness, and personality fit testing.', icon: Target },
  { title: 'Technical / HR', desc: 'Competency-based interviews and SOP knowledge assessment.', icon: Briefcase },
  { title: 'Simulator Audit', desc: 'Practical EBT/CBTA competency demonstration in multi-crew environment.', icon: Zap },
];

export interface PortalAirlineExpectationsPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
  isDarkMode?: boolean;
}

export const PortalAirlineExpectationsPage: React.FC<PortalAirlineExpectationsPageProps> = ({
  onBack,
  onNavigate,
  isDarkMode = true,
}) => {
  const { userProfile, currentUser } = useAuth();
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [hasRecognitionAccess, setHasRecognitionAccess] = useState(false);

  // Check for recognition access
  useEffect(() => {
    if (userProfile?.isRecognitionPlusMember) {
      setHasRecognitionAccess(true);
    }
  }, [userProfile]);

  // Helper function to get salary range based on recognition access
  const getSalaryRange = (airline: Airline) => {
    if (hasRecognitionAccess && airline.salaryRangeDetailed) {
      return airline.salaryRangeDetailed;
    }
    return airline.salaryRangePublic || airline.salaryRange;
  };

  // Helper function to get assessment process based on recognition access
  const getAssessmentProcess = (airline: Airline) => {
    if (hasRecognitionAccess && airline.assessmentProcessDetailed) {
      return airline.assessmentProcessDetailed;
    }
    return airline.assessmentProcessPublic || 'Multi-stage assessment process';
  };

  const filteredAirlines = AIRLINES.filter(a => {
    const matchesRegion = regionFilter === 'All' || a.region === regionFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
    return matchesRegion && matchesSearch;
  });

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  // Normalize fleet string: ensure consistent manufacturer prefixes
  const normalizeFleet = (fleetStr: string): string[] => {
    return fleetStr.split(',').map(ac => {
      let a = ac.trim();
      // Add "Boeing" prefix to bare numeric models
      if (/^(7[3-9][0-9])/i.test(a)) a = 'Boeing ' + a;
      // Add "Airbus" prefix to bare A-models
      if (/^A(3[0-9]{2}|220)/i.test(a)) a = 'Airbus ' + a;
      // Normalize B-prefix to Boeing
      a = a.replace(/^B(7[3-9][0-9])/i, 'Boeing $1');
      // Normalize A-prefix (standalone) to Airbus
      a = a.replace(/^A(3[0-9]{2})/i, 'Airbus A$1');
      return a;
    });
  };

  const bg = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const card = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400';

  return (
    <div className="min-h-screen relative text-slate-900 font-sans">
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#ffffff", "#f8fbff", "#f0f7ff", "#e8f5ff"]}
          speed={1.0}
        />
      </div>
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-0" />

      {/* Header Nav */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 backdrop-blur-sm">
        <div className="mx-auto pr-6 py-4 w-full max-w-[1800px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => {
                    if (onBack) {
                      onBack();
                    } else {
                      window.location.href = '/';
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform hover:scale-105"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* Logo */}
                <div className="flex flex-col">
                  <span style={{ fontFamily: 'Georgia, serif' }} className="text-black text-2xl font-normal">
                    Discover <span className="text-red-600">Expectations</span>
                  </span>
                  <span className="text-xs text-slate-600 font-normal">
                    pilotrecognition.com
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                { label: 'Pilot Pathways', page: 'pathways-modern' },
                { label: 'Job Listings', page: 'job-listings' },
              ].map(({ label, page }) => {
                const isActive = page === 'portal-airline-expectations';
                return (
                <button
                  key={page}
                  onClick={() => onNavigate && onNavigate(page)}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap"
                  style={{
                    color: isActive ? '#2563eb' : '#0f172a',
                    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                    paddingBottom: '4px'
                  }}
                >
                  {label}
                </button>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-3">
              {/* Profile section */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">
                      {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                    </span>
                    <span className="text-[10px] text-slate-500">Signed In</span>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {userProfile?.profile_image_url ? (
                      <img
                        src={userProfile.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {currentUser?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate('login')}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('become-member')}
                    className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Become Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3"><span className="text-black">Discover</span> <span className="text-red-600">Expectations</span></p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4">
            <span className="text-black">Airline </span><span className="text-red-600">Expectations</span><span className="text-black"> Search</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
            Requirements · Expectations · Career Pathways
          </p>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-black mt-4">
            Understanding what airlines really look for—beyond the 1,500-hour requirement. We bridge the gap between "having the hours" and "being the right candidate" through AI-powered pathway matching.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${subtext}`} />
            <input
              type="text"
              placeholder="Search airlines, locations, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {([
              { label: 'Airline Expectations', page: 'portal-airline-expectations' },
              { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
              { label: 'Pilot Pathways', page: 'pathways-modern' },
              { label: 'Job Listings', page: 'job-listings' },
            ] as { label: string; page: string }[]).map(({ label, page }) => (
              <button
                key={page}
                onClick={() => onNavigate ? onNavigate(page) : onBack()}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  page === 'portal-airline-expectations'
                    ? 'bg-sky-400 text-white'
                    : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Airline Carousel */}
      <div className="px-0 mb-12 relative z-30">
        <div className="max-w-7xl mx-auto px-6 mb-4 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-300 dark:border-slate-700">
          <div className="mb-4">
            <h2 className="text-2xl font-serif font-normal text-black">Browse Airlines</h2>
            <p className={`text-sm ${subtext}`}>{filteredAirlines.length} airlines available</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1.5 flex-wrap">
              {(['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'] as Region[]).map(r => (
                <button
                  key={r}
                  onClick={() => { setRegionFilter(r); setSelectedAirline(null); }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border-2 ${
                    regionFilter === r
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                      : isDarkMode ? 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => scroll('left')} className={`p-2 rounded-lg transition-colors border-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'}`}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} className={`p-2 rounded-lg transition-colors border-2 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'}`}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {filteredAirlines.map(airline => (
            <button
              key={airline.id}
              onClick={() => setSelectedAirline(airline)}
              className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                selectedAirline?.id === airline.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/30'
                  : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/30 hover:from-white/20 hover:shadow-lg shadow-black/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
              <img
                src={airline.cardImage || airline.image}
                alt={airline.name}
                className="w-48 h-48 object-contain mx-auto relative z-10"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section - Unified component for both default and airline-specific content */}
      <div className="relative overflow-hidden mb-12 z-10 min-h-[600px]">
        {/* Background - maroon for Qatar Airways, blue for others */}
        <div className={`absolute inset-0 z-0 ${
          selectedAirline?.id === 'qatar-airways'
            ? 'bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900'
            : 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {!selectedAirline ? (
            <div className="text-center text-white">
              {/* Worldwide Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-slate-300">Airlines Worldwide</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">350,000+</div>
                  <div className="text-sm text-slate-300">Active Pilots</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">25,000+</div>
                  <div className="text-sm text-slate-300">Aircraft in Service</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">150+</div>
                  <div className="text-sm text-slate-300">Countries Served</div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4">
                Discover Airline Expectations & Requirements
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
                Understanding what airlines really look for in pilot candidates—beyond flight hours.
                Explore requirements, expectations, and career pathways from leading airlines worldwide.
              </p>
              
              <div className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
                <p className="mb-4">
                  Browse through our comprehensive database of airline requirements, including minimum qualifications,
                  preferred credentials, training pathways, and career progression opportunities. Our programs are built using publicly available EBT/CBTA frameworks and industry-standard competency criteria to help pilots understand what leading airlines require.
                </p>
                <p>
                  From legacy carriers to regional airlines and emerging carriers, understand what each airline values
                  in pilot candidates and how to position yourself for success in your aviation career.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left - Airline Identity & Quick Stats */}
                <div className="md:w-1/2">
                  <h2 className="text-5xl md:text-7xl font-serif font-normal mb-4">{selectedAirline.name}</h2>
                  <div className="flex items-center gap-4 text-slate-300 text-sm mb-6">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedAirline.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      <span>{selectedAirline.region}</span>
                    </div>
                  </div>
                  
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 relative overflow-hidden">
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Salary Range</div>
                      <div className={`text-lg font-bold leading-tight ${!hasRecognitionAccess && selectedAirline.salaryRangeDetailed ? 'blur-sm select-none' : ''}`}>
                        {getSalaryRange(selectedAirline)}
                      </div>
                      {!hasRecognitionAccess && selectedAirline.salaryRangeDetailed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-xl">
                          <span className="text-[10px] bg-white/10 text-white border border-white/20 px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1">
                            <Shield className="w-3 h-3" /> PilotRecognition+
                          </span>
                        </div>
                      )}
                      {hasRecognitionAccess && selectedAirline.salaryRangeDetailed && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full mt-1 inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Unlocked</span>
                      )}
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Flight Hours</div>
                      <div className="text-lg font-bold leading-tight">{selectedAirline.flightHours}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 col-span-2">
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-2">Fleet</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAirline.fleetWithEndOfService
                          ? selectedAirline.fleetWithEndOfService.map((item, i) => {
                              const isPhasing = item.endOfService.toLowerCase().includes('phasing');
                              return (
                                <div key={i} className={`relative overflow-hidden rounded-full ${isPhasing ? 'cursor-not-allowed' : ''}`}>
                                  <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${isPhasing ? 'bg-white/10 text-white blur-sm select-none' : 'bg-white/10 text-white'}`}>
                                    {item.aircraft}
                                  </span>
                                  {isPhasing && (
                                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-full z-10">
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/90 text-white shadow-sm">
                                        Phasing Out
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          : normalizeFleet(selectedAirline.fleet || 'Modern Aircraft Fleet').map((ac, i) => (
                              <span key={i} className="text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">{ac}</span>
                            ))
                        }
                      </div>
                    </div>

                    {selectedAirline.id === 'qatar' && selectedAirline.fleetWithEndOfService && (
                      <div className="col-span-2 text-center">
                        <p className="text-white/70 text-[10px] font-medium">
                          Subscribe to <span className="text-sky-400 font-semibold">PilotRecognition+</span> to view phasing and new demand fleets to secure your type ratings with Etihads Expectations.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedAirline.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full border border-sky-500/30">{tag}</span>
                    ))}
                  </div>

                  {/* Profile Comparison CTA */}
                  <div className="mt-4 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                    {currentUser && hasRecognitionAccess ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-white">Profile Match</span>
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Recognition+</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" style={{ width: '60%' }} />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-emerald-300">--</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5">Complete your profile to unlock your match score</p>
                        <button
                          onClick={() => onNavigate && onNavigate('pilot-profile')}
                          className="mt-2 w-full py-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
                        >
                          View Full Match
                        </button>
                      </div>
                    ) : currentUser ? (
                      <div>
                        <p className="text-xs font-semibold text-white mb-1">Compare Your Profile</p>
                        <p className="text-[10px] text-slate-400 mb-2">See how your experience matches {selectedAirline.name} requirements</p>
                        <button
                          onClick={() => onNavigate && onNavigate('become-member')}
                          className="w-full py-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
                        >
                          Upgrade to PilotRecognition+
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-white mb-1">Compare Your Profile</p>
                        <p className="text-[10px] text-slate-400 mb-2">See how your experience matches {selectedAirline.name} requirements</p>
                        <button
                          onClick={() => onNavigate && onNavigate('login')}
                          className="w-full py-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all"
                        >
                          Sign In to Compare
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right - Description & Requirements */}
                <div className="md:w-1/2 flex items-center">
                  <div className="text-slate-300 text-sm leading-relaxed space-y-5">
                    <p>{selectedAirline.description}</p>
                    
                    {/* Minimum Requirements — data-driven */}
                    <div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2">Minimum Requirements</p>
                      <div className="space-y-1.5 text-xs">
                        {selectedAirline.pilotRequirements ? (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{selectedAirline.pilotRequirements.minHours.toLocaleString()} hrs total flight time</span>
                            </div>
                            {selectedAirline.pilotRequirements.typeRatingRequired.length > 0 && (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span>Type rating: {selectedAirline.pilotRequirements.typeRatingRequired.join(', ')}</span>
                              </div>
                            )}
                            {selectedAirline.pilotRequirements.additionalCertifications.map((cert, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span>{cert}</span>
                              </div>
                            ))}
                            {selectedAirline.pilotRequirements.languageRequirements.map((lang, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span>{lang}</span>
                              </div>
                            ))}
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>Valid ATPL/CPL & Class 1 Medical</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>{selectedAirline.flightHours} Total Flight Time</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>Valid ATPL or CPL</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>ICAO English Level 4+</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              <span>Class 1 Medical Certificate</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Preferred — data-driven */}
                    <div>
                      <p className="font-semibold text-white text-xs uppercase tracking-wider mb-2">Preferred</p>
                      <div className="space-y-1.5 text-xs">
                        {selectedAirline.pilotRequirements ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>{selectedAirline.pilotRequirements.preferredHours.toLocaleString()} hrs total flight time</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>Previous airline / commercial experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>EBT / CBTA certification</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>Recent line experience (last 12 months)</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>Type Rating on {selectedAirline.name} fleet aircraft</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>Previous airline / commercial experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>EBT / CBTA certification</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span>Recent line experience (last 12 months)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Airline Detail */}
      {selectedAirline && (
        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
          <div className={`rounded-2xl overflow-hidden border ${card}`}>
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={selectedAirline.image}
                alt={selectedAirline.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-r ${selectedAirline.id === 'qatar' ? 'from-[#800000]/70 via-transparent to-transparent' : 'from-black/70 via-transparent to-transparent'}`} />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedAirline.flag}</span>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                    Selected Airline
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAirline.name}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin className="w-4 h-4" />{selectedAirline.location}</span>
                  <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium relative">
                    <DollarSign className="w-4 h-4" />
                    <span className={`${!hasRecognitionAccess && selectedAirline.salaryRangeDetailed ? 'blur-sm select-none' : ''}`}>
                      {getSalaryRange(selectedAirline)}
                    </span>
                    {!hasRecognitionAccess && selectedAirline.salaryRangeDetailed && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-white/80" />
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm"><Clock className="w-4 h-4" />{selectedAirline.flightHours}</span>
                </div>
              </div>

              {/* Top center notice */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-center pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 pointer-events-auto">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-white/80 text-xs">
                    Subscribe to <span className="text-sky-400 font-semibold">PilotRecognition+</span> for detailed insights, profile matching, latest aircraft demands & phasing out aircraft
                  </span>
                </div>
              </div>
            </div>

            {/* Stay Updated Banner */}
            <div className={`px-6 md:px-8 py-2.5 ${isDarkMode ? 'bg-slate-800/80 border-b border-slate-700' : 'bg-slate-50/90 border-b border-slate-200'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Bell className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                  <p className={`text-xs truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Stay up to date with phasing out aircraft, salary data changes & expectation updates
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-sky-500/15 text-sky-300 border border-sky-500/20' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                  <Shield className="w-3 h-3" /> PilotRecognition+
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} px-6 md:px-8 bg-white dark:bg-slate-900`}>
              <div className="flex gap-1 overflow-x-auto">
                {['Overview', 'Expectations', 'Fleet', 'Requirements', 'Profile', 'Recruitment', 'Career', 'Recognition Plus', 'Aptitude Test'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      tab === 'Recognition Plus'
                        ? activeTab === tab
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-amber-600 hover:border-amber-500'
                        : activeTab === tab
                          ? 'border-sky-500 text-sky-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'Overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${text}`}>About</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${subtext}`}>{selectedAirline.description}</p>

                    {selectedAirline.fleet && (
                      <>
                        <h3 className={`text-lg font-semibold mb-3 ${text}`}>Fleet</h3>
                        <p className={`text-xs ${subtext} mb-3`}>Click on the aircraft to read more and learn more about type ratings from the manufacturer</p>
                        
                        {/* Define helper functions outside the conditional to make them available in both sections */}
                        {(() => {
                          // Determine manufacturer based on aircraft name
                          const getManufacturerId = (aircraftName: string) => {
                            const name = aircraftName.toLowerCase().trim();
                            if (name.includes('airbus') || name.includes('a3') || name.includes('a2') || name.includes('a35') || name.includes('a38') || name.includes('a31') || name.includes('a33') || name.includes('a34') || name.includes('acj')) return 'airbus';
                            if (name.includes('boeing') || name.includes('b7') || name.includes('b787') || name.includes('b777') || name.includes('b767') || name.includes('b757') || name.includes('b747') || name.includes('b737')) return 'boeing';
                            if (name.includes('embraer') || name.includes('e1') || name.includes('e19') || name.includes('e17') || name.includes('e14')) return 'embraer';
                            if (name.includes('bombardier') || name.includes('crj') || name.includes('c series') || name.includes('challenger') || name.includes('global')) return 'bombardier';
                            if (name.includes('atr')) return 'atr';
                            if (name.includes('gulfstream') || name.includes('g')) return 'gulfstream';
                            if (name.includes('cessna') || name.includes('citation')) return 'cessna';
                            if (name.includes('dassault') || name.includes('falcon')) return 'dassault-falcon';
                            if (name.includes('pilatus')) return 'pilatus';
                            if (name.includes('beechcraft') || name.includes('bonanza') || name.includes('king air')) return 'beechcraft';
                            if (name.includes('sikorsky')) return 'sikorsky';
                            if (name.includes('leonardo') || name.includes('aw') || name.includes('agusta')) return 'leonardo';
                            if (name.includes('de havilland') || name.includes('dhc')) return 'de-havilland';
                            if (name.includes('mitsubishi') || name.includes('mrj')) return 'mitsubishi-mrj';
                            if (name.includes('comac')) return 'comac-c919';
                            if (name.includes('tecnam')) return 'tecnam';
                            if (name.includes('piper')) return 'piper';
                            if (name.includes('cirrus')) return 'cirrus';
                            if (name.includes('let')) return 'let';
                            if (name.includes('aeroprakt')) return 'aeroprakt';
                            return null;
                          };

                          // Get aircraft ID based on aircraft name - simplified to match actual data
                          const getAircraftId = (aircraftName: string, manufacturerId: string) => {
                            // Remove extra text in parentheses and trim
                            const name = aircraftName.toLowerCase().trim().replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\[.*?\]\s*/g, '').trim();
                            
                            // Airbus aircraft
                            if (manufacturerId === 'airbus') {
                              if (name.includes('a350')) return 'a350';
                              if (name.includes('a380')) return 'a380';
                              if (name.includes('a321neo')) return 'a321neo';
                              if (name.includes('a321')) return 'a321';
                              if (name.includes('a320neo')) return 'a320neo';
                              if (name.includes('a320')) return 'a320';
                              if (name.includes('a330')) return 'a330-900';
                              if (name.includes('a220')) return 'a220-300';
                            }
                            
                            // Boeing aircraft
                            if (manufacturerId === 'boeing') {
                              if (name.includes('777-9') || name.includes('777x')) return 'b777x';
                              if (name.includes('777')) return 'b777-300er';
                              if (name.includes('787')) return 'b787';
                              if (name.includes('737')) return 'b737-max-8';
                              if (name.includes('747')) return 'b747-8';
                              if (name.includes('767')) return 'b767-300er';
                            }
                            
                            // Embraer aircraft
                            if (manufacturerId === 'embraer') {
                              if (name.includes('e195')) return 'e195';
                              if (name.includes('e190')) return 'e190';
                              if (name.includes('e175')) return 'e175';
                              if (name.includes('e170')) return 'e170';
                            }
                            
                            // Bombardier aircraft
                            if (manufacturerId === 'bombardier') {
                              if (name.includes('crj900')) return 'crj900';
                              if (name.includes('crj700')) return 'crj700';
                              if (name.includes('challenger')) return 'challenger-650';
                              if (name.includes('global')) return 'global-7500';
                            }
                            
                            // Gulfstream aircraft
                            if (manufacturerId === 'gulfstream') {
                              if (name.includes('g650')) return 'g650';
                              if (name.includes('g700')) return 'g700';
                              if (name.includes('g600')) return 'g600';
                              if (name.includes('g500')) return 'g500';
                            }
                            
                            // Cessna aircraft
                            if (manufacturerId === 'cessna') {
                              if (name.includes('citation')) return 'ce-525';
                              if (name.includes('caravan')) return 'caravan';
                            }
                            
                            // Dassault aircraft
                            if (manufacturerId === 'dassault-falcon') {
                              if (name.includes('falcon')) return 'falcon-7x';
                            }
                            
                            // ATR aircraft
                            if (manufacturerId === 'atr') {
                              if (name.includes('72')) return 'atr-72-600';
                              if (name.includes('42')) return 'atr-42-600';
                            }
                            
                            return null;
                          };

                          // Store functions in window for use in the JSX below
                          (window as any).getManufacturerId = getManufacturerId;
                          (window as any).getAircraftId = getAircraftId;
                          return null;
                        })()}
                        
                        {selectedAirline.id === 'qatar' && selectedAirline.fleetWithEndOfService ? (
                          <>
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} mb-4`}>
                              <h4 className={`text-sm font-semibold mb-3 ${text}`}>Current Fleet</h4>
                              <div className="space-y-2">
                                {selectedAirline.fleetWithEndOfService.map((item, idx) => {
                                  const manufacturerId = (window as any).getManufacturerId(item.aircraft);
                                  const aircraftId = (window as any).getAircraftId(item.aircraft, manufacturerId);
                                  const isPhasing = item.endOfService.toLowerCase().includes('phasing');

                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        if (manufacturerId) {
                                          const params = new URLSearchParams();
                                          params.set('manufacturer', manufacturerId);
                                          if (aircraftId) {
                                            params.set('aircraft', aircraftId);
                                          }
                                          window.location.href = `/type-rating-search?${params.toString()}`;
                                        }
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                                        isDarkMode ? 'bg-slate-700/50 text-sky-300 hover:bg-slate-700' : 'bg-white text-sky-700 hover:bg-sky-50 border border-slate-200'
                                      } ${!manufacturerId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                      disabled={!manufacturerId || isPhasing}
                                    >
                                      <div className={`flex items-center justify-between w-full ${isPhasing ? 'blur-sm select-none' : ''}`}>
                                        <span className="text-xs">{item.aircraft}</span>
                                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                                          item.endOfService === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400' :
                                          item.endOfService === '2032' ? 'bg-amber-500/20 text-amber-400' :
                                          'bg-rose-500/20 text-rose-400'
                                        }`}>
                                          {item.endOfService}
                                        </span>
                                        {manufacturerId && <ChevronRight className="w-4 h-4" />}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* PilotRecognition+ banner for phasing out aircraft */}
                              {selectedAirline.fleetWithEndOfService.some((item: any) => item.endOfService.toLowerCase().includes('phasing')) && (
                                <div className={`mt-4 p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}>
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 bg-rose-500/90 text-white shadow-sm">
                                    <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                                  </div>
                                  <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Subscribe to view aircrafts reaching end of service!
                                  </p>
                                  <button
                                    onClick={() => onNavigate && onNavigate('become-member')}
                                    className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                                  >
                                    Unlock Access
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} relative`}>
                              <h4 className={`text-sm font-semibold mb-3 ${text}`}>Future Demand</h4>
                              <div className="space-y-2 blur-sm select-none">
                                {selectedAirline.futureDemand && selectedAirline.futureDemand.split(',').map((aircraft, idx) => (
                                  <div key={idx} className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                                    isDarkMode ? 'bg-slate-700/50 text-sky-300' : 'bg-white text-sky-700 border border-slate-200'
                                  }`}>
                                    <span className="text-xs">{aircraft.trim()}</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                ))}
                              </div>
                              <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-sm rounded-xl z-10`}>
                                <div className="text-center">
                                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}>
                                    <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                                  </div>
                                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subscribe to view future demand</p>
                                  <button className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}>
                                    Unlock Access
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className="space-y-2">
                              {selectedAirline.fleet.split(',').map((aircraft, idx) => {
                                const manufacturerId = (window as any).getManufacturerId(aircraft);
                                const aircraftId = (window as any).getAircraftId(aircraft, manufacturerId);

                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      if (manufacturerId) {
                                        const params = new URLSearchParams();
                                        params.set('manufacturer', manufacturerId);
                                        if (aircraftId) {
                                          params.set('aircraft', aircraftId);
                                        }
                                        window.location.href = `/type-rating-search?${params.toString()}`;
                                      }
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                                      isDarkMode ? 'bg-slate-700/50 text-sky-300 hover:bg-slate-700' : 'bg-white text-sky-700 hover:bg-sky-50 border border-slate-200'
                                    } ${!manufacturerId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!manufacturerId}
                                  >
                                    <span className="text-xs">{aircraft.trim()}</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right - Additional Info */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${text}`}>Key Features</h3>
                    <div className="space-y-2 mb-6">
                      {selectedAirline.tags.map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <span className={`text-sm ${subtext}`}>{tag}</span>
                        </div>
                      ))}
                    </div>

                    <QuickStats
                      airline={selectedAirline}
                      hasRecognitionAccess={hasRecognitionAccess}
                      isDarkMode={isDarkMode}
                      getSalaryRange={getSalaryRange}
                      getAssessmentProcess={getAssessmentProcess}
                    />

                    {/* CTA for Aptitude Test */}
                    <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-sky-900/50 to-blue-900/50 border border-sky-500/30' : 'bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200'}`}>
                      <div className="flex items-start gap-3">
                        <Brain className="w-6 h-6 text-sky-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm mb-2 ${text}`}>Test Your Skills Against {selectedAirline.name} Expectations</h4>
                          <p className={`text-xs ${subtext} mb-3`}>Take our pilot aptitude test to see if your skills match with this airline's expectations and requirements.</p>
                          <button
                            onClick={() => setActiveTab('Aptitude Test')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors bg-sky-500 hover:bg-sky-600 text-white`}
                          >
                            Try Our Aptitude Test
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

              {activeTab === 'Expectations' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className={`text-3xl font-serif font-normal ${text} mb-3`}>What {selectedAirline.name} Really Looks For</h3>
                    <p className={`text-sm ${subtext} max-w-2xl mx-auto`}>Understanding the key expectations and requirements that airlines evaluate when selecting pilots. These competencies are assessed through our EBT CBTA-aligned framework.</p>
                  </div>

                  {/* Context banner */}
                  <div className={`relative overflow-hidden rounded-xl p-5 ${isDarkMode ? 'bg-slate-800/60 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm mb-1 ${text}`}>These competencies are what {selectedAirline.name} evaluates in the Pulling System</h4>
                        <p className={`text-xs ${subtext} leading-relaxed`}>Your Recognition Score measures how you stack up against each of these pillars. Pilots with higher scores get priority access when {selectedAirline.name} pulls from our live database. This is not a job board — it is your currency for pathway access.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {(selectedAirline.expectations || CORE_EXPECTATIONS).map((exp, idx) => {
                      const Icon = exp.icon;
                      const num = String(idx + 1).padStart(2, '0');
                      return (
                        <div key={idx} className={`group rounded-xl border p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-sm' : 'bg-white/60 border-slate-200/60 backdrop-blur-sm'}`}>
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exp.color || 'from-slate-500 to-slate-600'} opacity-[0.07] group-hover:opacity-[0.12] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-300`} />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              {Icon && (
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color || 'from-slate-500 to-slate-600'} flex items-center justify-center shadow-sm`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <span className={`text-2xl font-bold opacity-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{num}</span>
                            </div>
                            <h4 className={`font-semibold text-lg mb-2 ${text}`}>{exp.title}</h4>
                            <p className={`text-sm leading-relaxed mb-4 ${subtext}`}>{exp.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {exp.bullets && exp.bullets.map(b => (
                                <span key={b} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-700/60 text-slate-300 group-hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:bg-slate-200/60'}`}>{b}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Your Gap Analysis Teaser */}
                  <div className={`relative overflow-hidden rounded-xl ${isDarkMode ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/60 border border-slate-200/60'}`}>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-semibold text-lg ${text}`}>Your Gap Analysis</h4>
                          <p className={`text-xs ${subtext}`}>See where you stand against {selectedAirline.name} expectations</p>
                        </div>
                      </div>

                      {!hasRecognitionAccess ? (
                        <div className="relative">
                          <div className="blur-sm select-none space-y-3">
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>Technical Excellence</span>
                                <span className="text-xs text-amber-400 font-semibold">Gap: 2 competencies</span>
                              </div>
                              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-amber-400 w-[60%]" /></div>
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>5-Star Service Standards</span>
                                <span className="text-xs text-emerald-400 font-semibold">Aligned</span>
                              </div>
                              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-emerald-400 w-[85%]" /></div>
                            </div>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>Team Leadership</span>
                                <span className="text-xs text-amber-400 font-semibold">Gap: 1 competency</span>
                              </div>
                              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-amber-400 w-[70%]" /></div>
                            </div>
                          </div>
                          <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/70'} backdrop-blur-sm rounded-xl`}>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-3 bg-slate-500/90 text-white shadow-sm">
                              <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                            </div>
                            <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                              Unlock your personalized gap analysis
                            </p>
                            <button
                              onClick={() => onNavigate && onNavigate('become-member')}
                              className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                            >
                              Unlock Access
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>Technical Excellence</span>
                              <span className="text-xs text-amber-400 font-semibold">Gap: 2 competencies</span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-amber-400 w-[60%]" /></div>
                            <p className={`text-xs mt-2 ${subtext}`}>Strengthen SOP Compliance and Automation Mastery via our Transition Program</p>
                          </div>
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>5-Star Service Standards</span>
                              <span className="text-xs text-emerald-400 font-semibold">Aligned</span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-emerald-400 w-[85%]" /></div>
                          </div>
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>Team Leadership</span>
                              <span className="text-xs text-amber-400 font-semibold">Gap: 1 competency</span>
                            </div>
                            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}><div className="h-2 rounded-full bg-amber-400 w-[70%]" /></div>
                            <p className={`text-xs mt-2 ${subtext}`}>Book verified mentorship to close CRM Excellence gap</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* How We Assess — gated */}
                  <div className={`relative overflow-hidden rounded-xl ${isDarkMode ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/60 border border-slate-200/60'}`}>
                    <div className="p-6">
                      <h4 className={`font-semibold text-lg mb-5 ${text}`}>How We Assess These Expectations</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-2`}>
                            <Target className={`w-5 h-5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>EBT CBTA Framework</h5>
                          <p className={`text-xs ${subtext}`}>Evidence-based training aligned with manufacturer standards</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2`}>
                            <Shield className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>Verified Mentorship</h5>
                          <p className={`text-xs ${subtext}`}>50+ hours of practical validation with industry mentors</p>
                        </div>
                        <div className="text-center">
                          <div className={`w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2`}>
                            <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>Recognition Profile</h5>
                          <p className={`text-xs ${subtext}`}>Comprehensive scoring system for career advancement</p>
                        </div>
                      </div>
                    </div>
                    {!hasRecognitionAccess && (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-900/70' : 'bg-white/80'} backdrop-blur-sm rounded-xl z-10`}>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-3 bg-slate-500/90 text-white shadow-sm">
                          <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                        </div>
                        <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Unlock detailed assessment methodology
                        </p>
                        <button
                          onClick={() => onNavigate && onNavigate('become-member')}
                          className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                        >
                          Unlock Access
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Requirements' && (
                <div className="space-y-6">
                  {/* Pilot Requirements — always visible */}
                  {selectedAirline.pilotRequirements && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Pilot Requirements</h3>
                      <p className={`text-sm ${subtext} mb-4`}>Detailed requirements and qualifications needed</p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>Flight Hours</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={subtext}>Minimum</span>
                              <span className={`font-semibold ${text}`}>{selectedAirline.pilotRequirements.minHours.toLocaleString()} hrs</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className={subtext}>Preferred</span>
                              <span className={`font-semibold ${text}`}>{selectedAirline.pilotRequirements.preferredHours.toLocaleString()} hrs</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>Type Ratings Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.typeRatingRequired.map(rating => (
                              <button
                                key={rating}
                                onClick={() => window.location.href = '/type-ratings'}
                                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                  isDarkMode ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>Additional Certifications</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.additionalCertifications.map(cert => (
                              <span key={cert} className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-50 text-teal-700'}`}>{cert}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>Language Requirements</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.languageRequirements.map(lang => (
                              <span key={lang} className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-50 text-rose-700'}`}>{lang}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Requirements — behind paywall */}
                  {selectedAirline.detailedInfo && (
                  <>
                  {!hasRecognitionAccess ? (
                    <div className={`rounded-xl p-8 text-center ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <Shield className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                      <h4 className={`text-lg font-semibold mb-2 ${text}`}>Recognition Plus Required</h4>
                      <p className={`text-sm ${subtext} mb-4`}>Detailed entry requirements, assessment processes, and compensation information require PilotRecognition+ membership for access.</p>
                      <div className={`inline-block px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium`}>
                        Upgrade to PilotRecognition+ for detailed insights
                      </div>
                    </div>
                  ) : (
                    <>
                      {selectedAirline.detailedInfo.entryRequirements && (
                        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-semibold ${text}`}>Entry Requirements (2026)</h4>
                            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">Recognition Plus</span>
                          </div>
                          <div className="space-y-3">
                            {selectedAirline.detailedInfo.entryRequirements.captains && (
                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                                <p className={`font-semibold text-sm mb-2 ${text}`}>Captain Requirements</p>
                                <ul className={`space-y-1 text-xs ${subtext}`}>
                                  {selectedAirline.detailedInfo.entryRequirements.captains.split('\n').map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-sky-500">•</span>
                                      <span>{req.trim()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.entryRequirements.firstOfficers && (
                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                                <p className={`font-semibold text-sm mb-2 ${text}`}>First Officer Requirements</p>
                                <ul className={`space-y-1 text-xs ${subtext}`}>
                                  {selectedAirline.detailedInfo.entryRequirements.firstOfficers.split('\n').map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-sky-500">•</span>
                                      <span>{req.trim()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.entryRequirements.licensesMedical && (
                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                                <p className={`font-semibold text-sm mb-2 ${text}`}>Licenses & Certifications</p>
                                <ul className={`space-y-1 text-xs ${subtext}`}>
                                  {selectedAirline.detailedInfo.entryRequirements.licensesMedical.split('\n').map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-sky-500">•</span>
                                      <span>{req.trim()}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.entryRequirements.recency && (
                              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                                <p className={`font-semibold text-sm mb-2 ${text}`}>Recency Requirements</p>
                                <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.entryRequirements.recency}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                  {selectedAirline.detailedInfo.assessmentProcess && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Assessment Process (2026)</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.assessmentProcess.day1 && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Day 1: Digital Screening</p>
                            <ul className={`space-y-1 text-xs ${subtext}`}>
                              {selectedAirline.detailedInfo.assessmentProcess.day1.split('\n').map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-sky-500">•</span>
                                  <span>{req.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.assessmentProcess.day2 && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Day 2: Technical & HR Assessment</p>
                            <ul className={`space-y-1 text-xs ${subtext}`}>
                              {selectedAirline.detailedInfo.assessmentProcess.day2.split('\n').map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-sky-500">•</span>
                                  <span>{req.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.assessmentProcess.day3 && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Day 3: Simulator Check</p>
                            <ul className={`space-y-1 text-xs ${subtext}`}>
                              {selectedAirline.detailedInfo.assessmentProcess.day3.split('\n').map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-sky-500">•</span>
                                  <span>{req.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAirline.detailedInfo.workingConditions && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Working Conditions & Lifestyle</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.workingConditions.roster && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Rostering Pattern</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.workingConditions.roster}</p>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.workingConditions.culture && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Culture</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.workingConditions.culture}</p>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.workingConditions.training && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Training & Bonds</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.workingConditions.training}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAirline.detailedInfo.compensationBenefits && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`text-lg font-semibold ${text}`}>Compensation & Benefits</h4>
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">Recognition Plus</span>
                      </div>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.compensationBenefits.salary && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Salary Structure</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.compensationBenefits.salary}</p>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.compensationBenefits.livingSupport && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Living Support</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.compensationBenefits.livingSupport}</p>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.compensationBenefits.travelPerks && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Travel Perks</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.compensationBenefits.travelPerks}</p>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.compensationBenefits.insurance && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                            <p className={`font-semibold text-sm mb-2 ${text}`}>Insurance</p>
                            <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.compensationBenefits.insurance}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                    </>
                  )}
                  </>
                  )}
                </div>
              )}

              {activeTab === 'Profile' && selectedAirline.detailedInfo && (
                <div className="space-y-6">
                  {selectedAirline.detailedInfo.profileAlignment && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Profile Alignment Tips</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.profileAlignment.technicalMastery && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Technical Mastery</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.profileAlignment.technicalMastery}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.crmManualFlying && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>CRM & Manual Flying</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.profileAlignment.crmManualFlying}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.professionalism && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Professionalism</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.profileAlignment.professionalism}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.culturalAdaptability && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Cultural Adaptability</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.profileAlignment.culturalAdaptability}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Recognition Plus' && (
                <div className="space-y-6">
                  <h3 className={`text-2xl font-serif font-normal ${text} mb-2`}>Profile Alignment Tips</h3>
                  <p className={`text-sm ${subtext} mb-6`}>Core competencies and interview guidance for recognition plus members</p>

                  {!userProfile?.isRecognitionPlusMember ? (
                    <div className="relative">
                      <div className="blur-sm select-none">
                        {selectedAirline.detailedInfo?.coreCompetencies ? (
                          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <h4 className={`text-lg font-semibold mb-4 ${text}`}>Core Competency Alignment (2026 Standards)</h4>
                            <p className={`text-xs ${subtext} mb-4`}>{selectedAirline.name} evaluates candidates against five primary core values during the HR panel, which overlap with the 9 industry-standard pilot competencies.</p>
                            <div className="space-y-3">
                              {selectedAirline.detailedInfo.coreCompetencies.oneTeam && (
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>One Team (Leadership & Teamwork)</p>
                                    <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.oneTeam}</p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.drivingExcellence && (
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>Driving Excellence (Application of Knowledge & Procedures)</p>
                                    <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.drivingExcellence}</p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.customerFirst && (
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>Customer First (Professionalism)</p>
                                    <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.customerFirst}</p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.safetySituational && (
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>Safety & Situational Awareness</p>
                                    <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.safetySituational}</p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.futureFleetInsights && (
                                <div className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>Future Fleet & Strategic Insights</p>
                                    <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.futureFleetInsights}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <p className={`text-sm ${subtext}`}>Core competency alignment information is not yet available for {selectedAirline.name}.</p>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
                        <div className="text-center">
                          <span className="font-bold text-xl tracking-wider brand-font mb-2 block">
                            <span className="text-black">PILOT</span> <span className="text-red-500">RECOGNITION+</span>
                          </span>
                          <button className="text-sm font-semibold text-black bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 hover:bg-white/90 transition-colors">
                            Subscribe to view profile alignment tips
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedAirline.detailedInfo?.coreCompetencies ? (
                        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <h4 className={`text-lg font-semibold mb-4 ${text}`}>Core Competency Alignment (2026 Standards)</h4>
                          <p className={`text-xs ${subtext} mb-4`}>{selectedAirline.name} evaluates candidates against five primary core values during the HR panel, which overlap with the 9 industry-standard pilot competencies.</p>
                          <div className="space-y-3">
                            {selectedAirline.detailedInfo.coreCompetencies.oneTeam && (
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>One Team (Leadership & Teamwork)</p>
                                  <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.oneTeam}</p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.drivingExcellence && (
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>Driving Excellence (Application of Knowledge & Procedures)</p>
                                  <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.drivingExcellence}</p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.customerFirst && (
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>Customer First (Professionalism)</p>
                                  <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.customerFirst}</p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.safetySituational && (
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>Safety & Situational Awareness</p>
                                  <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.safetySituational}</p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.futureFleetInsights && (
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>Future Fleet & Strategic Insights</p>
                                  <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.coreCompetencies.futureFleetInsights}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <p className={`text-sm ${subtext}`}>Core competency alignment information is not yet available for {selectedAirline.name}.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Recruitment' && selectedAirline.detailedInfo && (
                <div className="space-y-6">
                  {selectedAirline.detailedInfo.latestUpdates && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Latest Fleet & Recruitment News</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.latestUpdates.fleetNews && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Fleet News</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.latestUpdates.fleetNews}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.futureOrders && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Future Orders</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.latestUpdates.futureOrders}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.a380Status && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>A380 Status</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.latestUpdates.a380Status}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.openings && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Current Openings</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.latestUpdates.openings}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAirline.detailedInfo.recruitmentStatus && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Recruitment Status</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.recruitmentStatus.typeRatedPositions && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Type-Rated First Officers & Captains</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.recruitmentStatus.typeRatedPositions}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.directEntryCaptains && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Direct Entry Captains</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.recruitmentStatus.directEntryCaptains}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.applicationMethod && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Application Method</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.recruitmentStatus.applicationMethod}</p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.assessmentProcess && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Assessment Process</p>
                              <p className={`text-xs ${subtext}`}>{selectedAirline.detailedInfo.recruitmentStatus.assessmentProcess}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Fleet' && (
                <div>
                  {selectedAirline.id === 'qatar' && selectedAirline.fleetWithEndOfService && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4`}>
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Current Fleet</h3>
                      <p className={`text-sm ${subtext} mb-4`}>Active aircraft in Qatar Airways fleet</p>
                      <div className="space-y-2">
                        {selectedAirline.fleetWithEndOfService.map((item, idx) => {
                          const isPhasing = item.endOfService.toLowerCase().includes('phasing');
                          return (
                            <div key={idx} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}>
                              <div className={`flex items-center justify-between ${isPhasing ? 'blur-sm select-none' : ''}`}>
                                <span className={`font-medium text-sm ${text}`}>{item.aircraft}</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  item.endOfService === 'Ongoing' ? 'bg-emerald-500/20 text-emerald-400' :
                                  item.endOfService === '2032' ? 'bg-amber-500/20 text-amber-400' :
                                  'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {item.endOfService}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* PilotRecognition+ banner for phasing out aircraft */}
                      {selectedAirline.fleetWithEndOfService.some((item: any) => item.endOfService.toLowerCase().includes('phasing')) && (
                        <div className={`mt-4 p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 bg-rose-500/90 text-white shadow-sm">
                            <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                          </div>
                          <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Subscribe to view aircrafts reaching end of service!
                          </p>
                          <button
                            onClick={() => onNavigate && onNavigate('become-member')}
                            className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                          >
                            Unlock Access
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedAirline.futureFleetPlans && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4 relative`}>
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Future Fleet Plans</h3>
                      <p className={`text-sm ${subtext} mb-4`}>Upcoming fleet changes and expansion strategy</p>
                      
                      <div className="relative">
                        <div className="blur-sm select-none">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className={`font-semibold mb-2 ${text} text-sm`}>New Aircraft</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAirline.futureFleetPlans.newAircraft.map(aircraft => (
                                  <button
                                    key={aircraft}
                                    onClick={() => window.location.href = '/type-ratings'}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                      isDarkMode ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                  >
                                    {aircraft}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className={`font-semibold mb-2 ${text} text-sm`}>Retiring Aircraft</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAirline.futureFleetPlans.retiringAircraft.map(aircraft => (
                                  <button
                                    key={aircraft}
                                    onClick={() => window.location.href = '/type-ratings'}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                      isDarkMode ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                    }`}
                                  >
                                    {aircraft}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className={`text-xs ${subtext}`}>{selectedAirline.futureFleetPlans.expansionPlans}</p>
                        </div>
                        
                        <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-sm rounded-xl z-10`}>
                          <div className="text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}>
                              <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                            </div>
                            <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Subscribe to view future fleet plans</p>
                            <button className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}>
                              Unlock Access
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAirline.aircraftDemand && (
                    <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} relative ${selectedAirline.id === 'qatar' ? '' : ''}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Aircraft Demand Analysis</h3>
                      <p className={`text-sm ${subtext} mb-4`}>Fleet composition and manufacturer preferences</p>
                      
                      {selectedAirline.id === 'qatar' ? (
                        <div className="relative">
                          <div className="blur-sm select-none">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className={`font-semibold mb-2 ${text} text-sm`}>Manufacturer Preference</h4>
                                <div className="flex gap-2 mb-2">
                                  <div className="flex-1">
                                    <div className="text-xs mb-1 text-slate-400">Airbus</div>
                                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                      <div className="h-full bg-sky-500" style={{ width: `${selectedAirline.aircraftDemand.airbusPreference}%` }} />
                                    </div>
                                    <div className="text-xs mt-1 font-semibold text-sky-400">{selectedAirline.aircraftDemand.airbusPreference}%</div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs mb-1 text-slate-400">Boeing</div>
                                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                      <div className="h-full bg-indigo-500" style={{ width: `${selectedAirline.aircraftDemand.boeingPreference}%` }} />
                                    </div>
                                    <div className="text-xs mt-1 font-semibold text-indigo-400">{selectedAirline.aircraftDemand.boeingPreference}%</div>
                                  </div>
                                </div>
                                <div className={`text-xs font-semibold ${text}`}>Primary: {selectedAirline.aircraftDemand.primaryManufacturer}</div>
                              </div>
                              <div>
                                <h4 className={`font-semibold mb-2 ${text} text-sm`}>Trending Aircraft</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedAirline.aircraftDemand.trendingAircraft.map(aircraft => (
                                    <button
                                      key={aircraft}
                                      onClick={() => window.location.href = '/type-ratings'}
                                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                        isDarkMode ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                      }`}
                                    >
                                      {aircraft}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
                            <div className="text-center">
                              <span className="font-bold text-xl tracking-wider brand-font mb-2 block">
                                <span className="text-black">PILOT</span> <span className="text-red-500">RECOGNITION+</span>
                              </span>
                              <button className="text-sm font-semibold text-black bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 hover:bg-white/90 transition-colors">
                                Subscribe to view aircraft demand analysis
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className={`font-semibold mb-2 ${text} text-sm`}>Manufacturer Preference</h4>
                            <div className="flex gap-2 mb-2">
                              <div className="flex-1">
                                <div className="text-xs mb-1 text-slate-400">Airbus</div>
                                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                  <div className="h-full bg-sky-500" style={{ width: `${selectedAirline.aircraftDemand.airbusPreference}%` }} />
                                </div>
                                <div className="text-xs mt-1 font-semibold text-sky-400">{selectedAirline.aircraftDemand.airbusPreference}%</div>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs mb-1 text-slate-400">Boeing</div>
                                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                  <div className="h-full bg-indigo-500" style={{ width: `${selectedAirline.aircraftDemand.boeingPreference}%` }} />
                                </div>
                                <div className="text-xs mt-1 font-semibold text-indigo-400">{selectedAirline.aircraftDemand.boeingPreference}%</div>
                              </div>
                            </div>
                            <div className={`text-xs font-semibold ${text}`}>Primary: {selectedAirline.aircraftDemand.primaryManufacturer}</div>
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-2 ${text} text-sm`}>Trending Aircraft</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedAirline.aircraftDemand.trendingAircraft.map(aircraft => (
                                <button
                                  key={aircraft}
                                  onClick={() => window.location.href = '/type-ratings'}
                                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                    isDarkMode ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                  }`}
                                >
                                  {aircraft}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Career' && (
                <div>
                  <h3 className={`text-2xl font-serif font-normal ${text} mb-2`}>The Assessment Pipeline</h3>
                  <p className={`text-sm ${subtext} mb-6`}>From application to final offer — know every stage</p>
                  <div className="grid md:grid-cols-4 gap-4">
                    {ASSESSMENT_PIPELINE.map((stage, i) => {
                      const Icon = stage.icon;
                      return (
                        <div key={stage.title} className={`rounded-xl border p-5 relative ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                          <div className={`absolute top-4 right-4 text-2xl font-serif font-bold ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <Icon className="w-5 h-5 text-sky-400" />
                          </div>
                          <h4 className={`font-semibold mb-2 ${text}`}>{stage.title}</h4>
                          <p className={`text-xs leading-relaxed ${subtext}`}>{stage.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'Aptitude Test' && (
                <PilotAptitudeTest airlineName={selectedAirline.name} isDarkMode={isDarkMode} />
              )}
            </div>

            {/* Tags */}
            <div className={`px-6 md:px-8 pb-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-5`}>
              <div className="flex flex-wrap gap-2">
                {selectedAirline.tags.map(tag => (
                  <span key={tag} className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDarkMode ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Data Disclaimer */}
            <div className={`px-6 md:px-8 pb-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-5`}>
              <div className={`p-3 rounded-lg bg-slate-100 border border-slate-300`}>
                <div className="flex items-start gap-2">
                  <Shield className={`w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className={`text-xs font-semibold text-slate-900 mb-1`}>Data Disclaimer</p>
                    <p className={`text-xs text-slate-800 leading-relaxed`}>
                      PilotRecognition.com is operated by a university research pilot group for the benefit of helping pilots to be aware and connect more to the industry. This platform matches pilots with current industry information publicly available and sourced across the internet through various credible sources to help pilots align their profiles. All information presented is compiled from publicly available sources for informational purposes only. This platform is not currently affiliated with, endorsed by, or sponsored by any airline, though we plan to establish partnerships in the future. Airline logos, trademarks, and branding are used under fair use principles solely for identification and informational purposes to help pilots understand industry requirements. No airline has verified, endorsed, or approved any information on this platform. All salary ranges, requirements, and assessment processes are estimates based on available public data and may not reflect current airline policies. Airbus aircraft specifications and fleet information are sourced from public Airbus announcements, aviation industry reports, and publicly available delivery data for pilot awareness purposes only—not for competitive intelligence. We welcome data sharing agreements with Airbus to ensure accuracy and offer to remove or correct inaccurate data per Airbus request. PilotRecognition+ membership provides AI-powered data comparison tools to help pilots align their profiles with airline expectations. This platform serves as a pilot recognition channel for Airbus and other manufacturers to address pilots with recognition profiles. Any fees charged are solely for platform development and AI optimization services, not for access to airline data. Users should conduct their own due diligence and verify all information directly with official airline sources before making career decisions. This platform provides general guidance only and does not constitute professional career, legal, or financial advice. We assume no liability for decisions made based on information provided herein.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default PortalAirlineExpectationsPage;
