import React, { useState } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import {
  Globe,
  Star,
  Cpu,
  Users,
  Brain,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  DollarSign,
  Clock,
  Shield,
  Target,
  CheckCircle2,
  Briefcase,
  Zap,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MeshGradient } from '@paper-design/shaders-react';
import { PathwaysSidebar } from '../../components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '../../components/website/components/PlatformNavbar';
import { AirlineShowcaseHero } from '../../components/website/components/pilot-recognition/AirlineShowcaseHero';
import { PilotAptitudeTest } from '../../components/PilotAptitudeTest';
import { QuickStats } from '../components/QuickStats';
import { AirlineDescription } from '../components/AirlineDescription';

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
  logo?: string;
  heroImage?: string;
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
    icon?: React.ComponentType<{ className?: string }>;
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
  {
    id: 'qatar',
    logo: '/images/airline-logos/middle-east/qatar/international-operators/qatar-airways.svg',
    heroImage:
      '/images/airline-logos/middle-east/qatar/international-operators/qatar-airways-aircraft.jpg',
    name: 'Qatar Airways',
    location: 'Qatar',
    salaryRange: '$100,000 – $300,000 USD/Year (Total Package)',
    salaryRangePublic: '$100,000-300,000/year',
    salaryRangeDetailed: '$100,000 – $300,000 USD/Year (Total Package)',
    assessmentProcessPublic:
      'Multi-stage assessment including psychometric testing, technical exams, simulator evaluation, and competency-based interviews',
    assessmentProcessDetailed:
      'Multi-stage assessment including psychometric testing, technical exams, simulator evaluation, and competency-based interviews',
    flightHours: '1,000 hrs (FO) / 6,000 hrs (DEC)',
    tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
    cardImage: '',
    description:
      'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. With competitive tax-free salary packages, modern aircraft fleet, and rapid career progression opportunities.',
    fleet: 'Boeing 777, 787, Airbus A350, A380, A320, A321neo, B777-9',
    currentFleet: 'Boeing 777, 787, Airbus A350, A380, A320, A321neo',
    dataSource:
      'Airbus public delivery data, aviation industry reports, pilot community forums, Qatar Airways career portal',
    lastUpdated: 'April 2026',
    verificationStatus: 'unverified',
    verificationNotes:
      'This airline is currently unverified on pilotrecognition.com. Airbus aircraft specifications sourced from public Airbus announcements and industry reports for pilot awareness purposes—not for competitive intelligence.',
    fleetWithEndOfService: [
      { aircraft: 'Boeing 777', endOfService: 'Ongoing' },
      { aircraft: 'Boeing 787', endOfService: 'Ongoing' },
      { aircraft: 'Airbus A350', endOfService: 'Ongoing' },
      { aircraft: 'Airbus A380', endOfService: 'Phasing out (fleet reduction ongoing)' },
      { aircraft: 'Airbus A320', endOfService: 'Phasing out' },
    ],
    futureDemand:
      'Fleet modernization with new aircraft deliveries planned (Source: Airbus Orders & Deliveries data)',
    region: 'Middle East',
    questionBank: [
      {
        pillar: '5-Star Service Standards',
        questions: [
          {
            q: 'Describe a situation where you had to manage a passenger complaint while maintaining operational safety priorities.',
            type: 'situational',
            alignment: 'EBT: Situational Judgment - Passenger Interaction',
            modelAnswer:
              "Step 1: Acknowledge the passenger's concern without dismissing. Step 2: Assess if the issue impacts safety—if yes, prioritize. Step 3: Delegate to cabin crew with clear CRM communication. Step 4: Document and brief post-flight. Qatar expects pilots to balance hospitality with operational authority.",
          },
          {
            q: 'How do you balance cultural sensitivity with assertive decision-making when operating in a multi-cultural crew environment?',
            type: 'behavioral',
            alignment: 'CBTA: Cultural Competency',
            modelAnswer:
              'Assertive communication in aviation is universal—use standard phraseology and SOPs to depersonalize decisions. Cultural sensitivity means listening actively before deciding, then communicating clearly using CRM tools like DESC (Describe, Express, Specify, Consequences). Qatar crews represent 160+ nationalities.',
          },
          {
            q: 'A first-class passenger is dissatisfied with service during a long-haul flight. How do you communicate this to cabin crew without disrupting CRM protocols?',
            type: 'situational',
            alignment: 'EBT: CRM & Communication',
            modelAnswer:
              'Use the brief/debrief model: during cruise, inform the Purser via interphone (not in front of passengers) using neutral language. Focus on facts, not emotions. Return to flight deck. Post-flight, document in the journey log. Never let passenger service override sterile cockpit rules.',
          },
          {
            q: "What does 'excellence in passenger interaction' mean to you at 35,000 feet when faced with an in-flight medical emergency?",
            type: 'behavioral',
            alignment: 'CBTA: Service Under Pressure',
            modelAnswer:
              "Excellence means compartmentalization: CRM maintains flight path while cabin crew handles the emergency. The pilot's role is decision-making—divert or continue, communicate with MedLink, and manage fuel/time trade-offs. Passenger interaction is delegated. Situational awareness is non-negotiable.",
          },
        ],
      },
      {
        pillar: 'Technical Excellence',
        questions: [
          {
            q: 'You encounter an unexpected ECAM warning during critical phase of flight. Walk me through your decision-making process using SOP hierarchy.',
            type: 'technical',
            alignment: 'EBT: System Knowledge & SOP Adherence',
            modelAnswer:
              'Aviate: maintain flight path using raw data if necessary. Navigate: assess terrain/traffic. Communicate: ATC + cabin crew if needed. Memory items if applicable (take-off, landing). Then ECAM: cancel audio, read, do— Pilot Flying maintains aircraft while Pilot Monitoring executes. After landing, log and report.',
          },
          {
            q: 'How do you manage automation degradation from FMS failure while maintaining precision in RVSM airspace?',
            type: 'technical',
            alignment: 'CBTA: Automation Management',
            modelAnswer:
              'Immediate: maintain altitude using altimeter cross-check. Select heading/altitude modes on FCU. Raw data navigation using VOR/DME if available. Request ATC assistance—vectors or non-RVSM flight level. Document the failure post-flight. Qatar requires proficiency in raw data recovery drills.',
          },
          {
            q: 'Describe your approach to transition between Airbus and Boeing SOPs if required for fleet expansion.',
            type: 'technical',
            alignment: 'EBT: Type Rating Flexibility',
            modelAnswer:
              "Understand philosophy differences: Boeing pilot-in-command authority vs Airbus envelope protection. Study the FCOM differences document. Complete CBT modules before classroom. Request line training with a TRI/TRE. Respect the differences—don't bring old habits. Qatar expects dual-fleet flexibility.",
          },
          {
            q: 'You notice a subtle deviation in engine parameters that does not trigger a warning. What is your assessment protocol?',
            type: 'situational',
            alignment: 'CBTA: Procedural Awareness',
            modelAnswer:
              'Monitor for trend—take a snapshot via camera or memory. Cross-reference with QRH normal procedures section. If outside parameters but no ECAM: consider maintenance deferred item (MEL) review, fuel planning adjustment, and inform ATC if performance is affected. Log it. Qatar values proactive technical vigilance.',
          },
        ],
      },
      {
        pillar: 'Team Leadership',
        questions: [
          {
            q: 'Your First Officer disagrees with your go/no-go decision in marginal weather. How do you resolve this while maintaining authority gradient?',
            type: 'situational',
            alignment: 'EBT: CRM - Authority & Assertiveness',
            modelAnswer:
              "Listen: 'Tell me your concerns.' Evaluate against objective criteria—METAR, TAF, company limits. If still safe: 'I appreciate your input, my decision is to go. Here's why.' If uncertain: 'Let's get more info—request latest observation.' Never let ego override data. Debrief post-flight to build trust.",
          },
          {
            q: 'Describe a time you had to lead a crew through a high-workload phase while managing fatigue across multiple time zones.',
            type: 'behavioral',
            alignment: 'CBTA: Leadership Under Fatigue',
            modelAnswer:
              "Prioritize tasks: aviate-navigate-communicate. Use sterile cockpit below 10,000 feet. Assign specific duties—'You handle comms, I handle navigation.' Take controlled rest if approved on long sectors. Post-flight: report fatigue via company system, suggest rostering feedback. Lead by example on sleep hygiene.",
          },
          {
            q: 'How do you build trust with a new crew member from a different cultural background on a long-haul pairing?',
            type: 'behavioral',
            alignment: 'EBT: Crew Cohesion',
            modelAnswer:
              "Pre-flight: brief expectations using TEM model. During flight: standardize communication—no ambiguity. Post-flight: debrief openly. Ask about their previous airline's CRM culture. Share your own. Trust builds through predictability and consistency, not familiarity. Cultural curiosity accelerates crew cohesion.",
          },
          {
            q: 'A cabin crew member reports safety concerns that conflict with operational targets. How do you handle this?',
            type: 'situational',
            alignment: 'CBTA: Safety-First Decision Making',
            modelAnswer:
              "Safety always wins. Hear the concern fully—don't dismiss because of hierarchy. Assess against SOP and regulatory minimums. If valid: delay or return. If unclear: consult dispatch and maintenance. Report through confidential reporting channel. Never pressure crew to compromise safety for on-time performance. Qatar's safety culture depends on this.",
          },
        ],
      },
      {
        pillar: 'Adaptability',
        questions: [
          {
            q: 'You are rostered for a route you have never flown before with a 12-hour layover in an unfamiliar regulatory environment. How do you prepare?',
            type: 'situational',
            alignment: 'EBT: Preparation & Planning',
            modelAnswer:
              "Pre-flight: study the route using OFP, NOTAMs, and alternate analysis. Review the destination's AIP for local procedures. Crew rest: arrive early, adapt sleep schedule. On ground: brief with local handlers, understand customs/immigration. Qatar expects 160+ destination readiness—preparation is the standard.",
          },
          {
            q: 'Describe how you adapt your communication style when operating with ATC in regions with limited English proficiency.',
            type: 'behavioral',
            alignment: 'CBTA: Communication Flexibility',
            modelAnswer:
              "Slow down. Use ICAO standard phraseology only—no colloquialisms. Confirm readbacks. Write down clearances. If unsure: 'Say again' or request confirmation. In extremis: use simpler English. Qatar operates globally—patience and clarity reduce RTF errors. Expectation management is key.",
          },
          {
            q: 'Your schedule changes mid-duty period due to operational disruption across 160+ destination network. What is your response?',
            type: 'situational',
            alignment: 'EBT: Operational Resilience',
            modelAnswer:
              'Accept: operational control has authority. Assess: duty time limits, rest requirements, FDP legality. Communicate: confirm new roster via company app, adjust sleep plan. Execute: brief new route, check alternate weather. Adaptability is not passive acceptance—it is structured response under uncertainty.',
          },
          {
            q: 'How do you maintain performance consistency across varying sleep schedules, regulatory frameworks, and cultural contexts?',
            type: 'behavioral',
            alignment: 'CBTA: Self-Management',
            modelAnswer:
              'Systems: consistent pre-sleep routine, blackout, white noise. Nutrition: avoid heavy meals before night sectors. Exercise: hotel gym or bodyweight circuits. Mental: mindfulness or brief meditation pre-flight. Regulatory: study destination requirements before arrival. Cultural: respect local norms—dress, punctuality, interaction style. Consistency comes from discipline, not circumstance.',
          },
        ],
      },
    ],
    expectations: [
      {
        title: '5-Star Service Standards',
        desc: 'Qatar Airways expects pilots to maintain the highest service standards. Excellence in passenger interaction and cultural sensitivity is essential.',
        bullets: ['Premium Service', 'Cultural Awareness', 'Communication Skills'],
        icon: Star,
        color: 'from-amber-500 to-orange-500',
      },
      {
        title: 'Technical Excellence',
        desc: 'Strict adherence to SOPs and automation management. Qatar operates modern Airbus and Boeing fleets requiring advanced technical proficiency.',
        bullets: ['SOP Compliance', 'Automation Mastery', 'Type Rating'],
        icon: Cpu,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Team Leadership',
        desc: 'CRM and crew resource management are critical. Pilots must demonstrate leadership in multi-cultural crew environments.',
        bullets: ['CRM Excellence', 'Leadership', 'Teamwork'],
        icon: Users,
        color: 'from-emerald-500 to-teal-500',
      },
      {
        title: 'Adaptability',
        desc: 'Global operations require flexibility with varying time zones, regulations, and cultural contexts across 160+ destinations.',
        bullets: ['Flexibility', 'Global Operations', 'Regulatory Knowledge'],
        icon: Globe,
        color: 'from-violet-500 to-purple-500',
      },
    ],
    futureFleetPlans: {
      newAircraft: ['Boeing 787-9', 'Airbus A350-1000', 'Boeing 777-9'],
      retiringAircraft: ['Airbus A380 (progressive phase-out)'],
      expansionPlans: 'Fleet modernization with focus on fuel-efficient aircraft',
    },
    aircraftDemand: {
      airbusPreference: 55,
      boeingPreference: 45,
      primaryManufacturer: 'Mixed',
      trendingAircraft: ['Airbus A350', 'Boeing 787', 'Boeing 777X'],
    },
    pilotRequirements: {
      minHours: 1000,
      preferredHours: 7000,
      typeRatingRequired: ['B777', 'B787', 'A350', 'A321neo', 'B777X'],
      additionalCertifications: ['ETOPS experience', 'University Degree (tie-breaker)'],
      languageRequirements: ['English (Fluent/Level 4+)'],
    },
    detailedInfo: {
      entryRequirements: {
        captains:
          'Direct Entry Captain (DEC): Minimum 6,000 hours total flying time. Command Experience: Minimum 2,000 hours as Pilot-in-Command (PIC) on multi-crew, multi-engine commercial jets with a MTOW of ≥50 Tonnes. Competitive Benchmark: Candidates with 7,000+ total hours and 3,000+ PIC hours on long-haul types (B777/A350) are prioritized.',
        firstOfficers:
          'Non-Type Rated (NTR): Minimum 1,000 hours on multi-crew, multi-engine EFIS jets with a MTOW of ≥20 Tonnes. Type Rated: Minimum 500 hours on type (e.g., B777, B787, A320, A350) with a total time of 1,500+ hours.',
        licensesMedical:
          'License: Valid ICAO ATPL (Frozen ATPL accepted for FO roles only). Medical: Valid ICAO Class 1 Medical Certificate. English: ICAO English Proficiency Level 4 minimum (Level 5 or 6 is the competitive standard for 2026).',
        recency:
          'Must have operated as a pilot on a multi-crew, multi-engine jet within the last 12 months.',
      },
      assessmentProcess: {
        day1: 'Digital screening including personality assessment and cognitive reasoning tests.',
        technicalFocus:
          'Technical assessment including written exams and competency-based interviews.',
        simulatorCheck: 'Simulator evaluation focusing on manual handling skills and CRM.',
      },
      workingConditions: {
        roster:
          'Rosters can be demanding, often involving back-to-back night flights or long-haul routes. Guaranteed minimum of 8 days off per month, though these may be interspersed with standby days.',
        culture:
          'High professional standards expected, with strict adherence to procedures and policies.',
        training: 'New joiners receiving type ratings may be required to sign training bonds.',
      },
      compensationBenefits: {
        salary:
          'Competitive tax-free salary package with comprehensive benefits including housing allowances, education support, and flying pay. Specific figures should be confirmed during recruitment process.',
        livingSupport: 'Housing support provided through company housing or monthly allowance.',
        travelPerks: 'Global staff travel benefits for pilots and immediate family.',
        insurance:
          'Comprehensive health coverage, life insurance, loss-of-license insurance, and education allowances.',
      },
      profileAlignment: {
        technicalMastery: 'Demonstrate strong technical knowledge and manual flying skills.',
        crmManualFlying: 'Emphasize CRM excellence and manual flying capabilities.',
        professionalism:
          'Align with premium brand expectations and maintain high professional standards.',
        culturalAdaptability: 'Demonstrate willingness to relocate and cultural adaptability.',
      },
      latestUpdates: {
        fleetNews: 'Fleet modernization ongoing with focus on fuel-efficient aircraft.',
        futureOrders:
          'Orders placed for next-generation aircraft with deliveries planned in coming years.',
        a380Status: 'Fleet adjustments in line with industry trends.',
        openings: 'Active recruitment ongoing for various positions.',
      },
      coreCompetencies: {
        oneTeam: 'Evaluated through group exercises assessing teamwork and leadership skills.',
        drivingExcellence:
          'Tested through technical exams and interviews evaluating operational knowledge.',
        customerFirst:
          'Assessed through scenarios evaluating operational reliability and brand alignment.',
        safetySituational:
          'Tested in simulator assessments evaluating manual control and threat management.',
        futureFleetInsights:
          'Understanding aircraft fleet composition helps pilots align their profiles with airline needs.',
      },
      recruitmentStatus: {
        typeRatedPositions: 'Continuous recruitment for type-rated positions.',
        directEntryCaptains: 'Direct entry captain positions available for qualified candidates.',
        applicationMethod: 'Submit interest through official airline pathway portals.',
        assessmentProcess:
          'Multi-stage assessment process including technical evaluation and competency-based interviews.',
      },
      preparationResources: {
        psychometricCognitive: {
          description:
            'Essential for the initial screening. Practice with personality questionnaires and cognitive reasoning tests.',
          cost: '~$50-100',
          providers: ['Various assessment providers'],
        },
        atplQuestionBank: {
          description:
            'Critical for technical written exams. Focus on performance, navigation, and operational procedures.',
          cost: '~$60-120',
          details: 'ATPL Question Bank (various providers)',
        },
        interviewCoaching: {
          description:
            'Preparation for competency-based interviews using STAR method. Focus on airline values and aviation scenarios.',
          cost: '~$150-300',
          providers: ['Career coaching services'],
          topics: ['STAR Method', 'Airline Values', 'Competency Questions'],
        },
        technicalGuides: {
          description:
            'Essential for preparing for deep-dive questions on your current aircraft type, high-altitude aerodynamics, and performance.',
          cost: '~$60',
          examples: 'Technical interview preparation guides',
        },
        cvAudit: {
          description:
            'To ensure your flight hours and professional experience meet the requirements.',
          cost: '~$150 - $300',
        },
      },
    },
  },
  {
    id: 'emirates',
    logo: '/images/airline-logos/middle-east/united-arab-emirates/international-operators/emirates.svg',
    heroImage:
      '/images/airline-logos/middle-east/united-arab-emirates/international-operators/emirates-aircraft.jpg',
    name: 'Emirates',
    location: 'UAE',
    salaryRange: '$130,000 - $280,000/year',
    flightHours: '4,000+ hrs TT',
    tags: ['5-Star Airline', 'Global Network', 'Tax-Free'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
    cardImage: '',
    description:
      'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.',
    fleet: 'Airbus A380, Boeing 777',
    region: 'Middle East',
    expectations: [
      {
        title: 'Wide-Body Proficiency',
        desc: 'Emirates operates exclusively wide-body aircraft. Pilots must demonstrate expertise in long-haul operations and large aircraft management.',
        bullets: ['A380 Operations', '777 Expertise', 'Long-Haul Experience'],
        icon: Cpu,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Global Operations',
        desc: 'Flying to 150+ destinations across 6 continents requires adaptability to diverse regulations, cultures, and time zones.',
        bullets: ['International Routes', 'Cultural Flexibility', 'Regulatory Knowledge'],
        icon: Globe,
        color: 'from-violet-500 to-purple-500',
      },
      {
        title: 'Premium Service',
        desc: 'As a 5-star airline, Emirates expects pilots to maintain high service standards in premium cabin operations.',
        bullets: ['First Class Service', 'Business Class', 'Premium Economy'],
        icon: Star,
        color: 'from-amber-500 to-orange-500',
      },
      {
        title: 'Training Excellence',
        desc: 'Emirates provides world-class training. Pilots are expected to be quick learners and continuously improve skills.',
        bullets: ['Advanced Training', 'Skill Development', 'Type Rating Mastery'],
        icon: Brain,
        color: 'from-emerald-500 to-teal-500',
      },
    ],
    futureFleetPlans: {
      newAircraft: ['Boeing 777-9', 'Boeing 787-9', 'Airbus A350'],
      retiringAircraft: ['Airbus A380 (phasing out 2025-2030)'],
      expansionPlans:
        'Modernizing fleet with Boeing 777X and 787 Dreamliner, expanding African and South American routes',
    },
    aircraftDemand: {
      airbusPreference: 30,
      boeingPreference: 70,
      primaryManufacturer: 'Boeing',
      trendingAircraft: ['Boeing 777X', 'Boeing 787', 'Airbus A350'],
    },
    pilotRequirements: {
      minHours: 4000,
      preferredHours: 7000,
      typeRatingRequired: ['B777', 'A380'],
      additionalCertifications: ['ICAO Level 5 English', 'ETOPS 180+ min'],
      languageRequirements: ['English (Native/Fluent)'],
    },
  },
  {
    id: 'etihad',
    logo: '/images/airline-logos/middle-east/united-arab-emirates/international-operators/etihad-airways.svg',
    heroImage:
      '/images/airline-logos/middle-east/united-arab-emirates/international-operators/etihad-airways-aircraft.jpg',
    name: 'Etihad Airways',
    location: 'UAE',
    salaryRange: '$115,000 - $200,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
    cardImage: '',
    description:
      'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.',
    fleet: 'Boeing 787, 777, Airbus A350, A380',
    region: 'Middle East',
  },
  {
    id: 'elal',
    logo: '/images/airline-logos/middle-east/israel/international-operators/el-al.svg',
    heroImage:
      '/images/airline-logos/middle-east/israel/international-operators/el-al-aircraft.jpg',
    name: 'El Al Israel',
    location: 'Israel',
    salaryRange: '$70,000 - $130,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Tel Aviv Hub', 'Middle East', 'Security Expert'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/el-al.jpg',
    cardImage: '',
    description:
      "El Al is Israel's flag carrier known for exceptional security standards. Pilots benefit from unique Middle Eastern operations and diverse international routes from Tel Aviv.",
    region: 'Middle East',
  },
  {
    id: 'royaljordanian',
    logo: '/images/airline-logos/middle-east/jordan/international-operators/royal-jordanian.svg',
    heroImage:
      '/images/airline-logos/middle-east/jordan/international-operators/royal-jordanian-aircraft.jpg',
    name: 'Royal Jordanian',
    location: 'Jordan',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Amman Hub', 'Oneworld', 'Middle East Gateway'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/royal-jordanian.jpg',
    cardImage: '',
    description:
      'Royal Jordanian serves as a bridge between East and West from Amman. The airline offers pilots unique Middle Eastern operations with Oneworld alliance benefits.',
    region: 'Middle East',
  },
  {
    id: 'saudia',
    logo: '/images/airline-logos/middle-east/saudi-arabia/international-operators/saudia.svg',
    heroImage:
      '/images/airline-logos/middle-east/saudi-arabia/international-operators/saudia-aircraft.jpg',
    name: 'Saudia',
    location: 'Saudi Arabia',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Jeddah Hub', 'Skyteam', 'Growing Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/saudia.jpg',
    cardImage: '',
    description:
      "Saudia is Saudi Arabia's flag carrier undergoing rapid transformation. Pilots have opportunities in a rapidly modernizing fleet with growing international destinations.",
    region: 'Middle East',
  },
  {
    id: 'omanair',
    logo: '/images/airline-logos/middle-east/oman/international-operators/oman-air.svg',
    heroImage:
      '/images/airline-logos/middle-east/oman/international-operators/oman-air-aircraft.jpg',
    name: 'Oman Air',
    location: 'Oman',
    salaryRange: '$65,000 - $120,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Muscat Hub', 'Oneworld', 'Growing Fleet'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776687736/airline-expectations/oman-air.webp',
    cardImage: '',
    description:
      'Oman Air is the national carrier of Oman. Operating from Muscat with a growing Boeing 787 Dreamliner fleet, offering pilots opportunities in the dynamic Middle East market.',
    fleet: 'Boeing 787 Dreamliner, 737',
    region: 'Middle East',
  },
  // Asia
  {
    id: 'singapore',
    logo: '/images/airline-logos/APAC/singapore/international-operators/singapore-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/singapore/international-operators/singapore-airlines-aircraft.jpg',
    name: 'Singapore Airlines',
    location: 'Singapore',
    salaryRange: '$120,000 - $180,000/year',
    flightHours: '3,000+ hrs TT',
    tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg',
    cardImage: '',
    description:
      'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location.',
    fleet: 'Airbus A350, A380 (phasing out), Boeing 777, 787',
    region: 'Asia',
    expectations: [
      {
        title: 'Singapore Girl Service',
        desc: 'World-renowned service standards. Pilots must exemplify the Singapore Girl tradition of excellence in passenger service.',
        bullets: ['Service Excellence', 'Hospitality', 'Professionalism'],
        icon: Star,
        color: 'from-amber-500 to-orange-500',
      },
      {
        title: 'Asian Network Expertise',
        desc: 'Strategic Singapore hub requires knowledge of Asian routes, weather patterns, and regional regulations.',
        bullets: ['Asian Routes', 'Regional Knowledge', 'Hub Operations'],
        icon: Globe,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        title: 'Technical Precision',
        desc: 'SIA operates modern Airbus and Boeing fleets with strict adherence to technical procedures and automation management.',
        bullets: ['Fleet Mastery', 'SOP Compliance', 'Automation Skills'],
        icon: Cpu,
        color: 'from-emerald-500 to-teal-500',
      },
      {
        title: 'Cultural Sensitivity',
        desc: 'Operating across diverse Asian cultures requires exceptional cultural awareness and communication abilities.',
        bullets: ['Cultural Awareness', 'Communication', 'Adaptability'],
        icon: Users,
        color: 'from-violet-500 to-purple-500',
      },
    ],
    futureFleetPlans: {
      newAircraft: ['Boeing 777-9', 'Airbus A350-1000'],
      retiringAircraft: [
        'Boeing 777-200ER',
        'Airbus A330-300',
        'Airbus A380 (progressive phase-out)',
      ],
      expansionPlans:
        'Focusing on long-haul expansion to Europe and North America with new A350 and 777X aircraft',
    },
    aircraftDemand: {
      airbusPreference: 60,
      boeingPreference: 40,
      primaryManufacturer: 'Airbus',
      trendingAircraft: ['Airbus A350', 'Boeing 777X'],
    },
    pilotRequirements: {
      minHours: 3000,
      preferredHours: 5000,
      typeRatingRequired: ['B777', 'A350', 'A330', 'A380'],
      additionalCertifications: ['ICAO Level 5 English', 'ETOPS 180+ min'],
      languageRequirements: ['English (Native/Fluent)', 'Mandarin/Cantonese (Preferred)'],
    },
  },
  {
    id: 'cathay',
    logo: '/images/airline-logos/APAC/hong-kong/international-operators/cathay-pacific.svg',
    heroImage:
      '/images/airline-logos/APAC/hong-kong/international-operators/cathay-pacific-aircraft.jpg',
    name: 'Cathay Pacific',
    location: 'Hong Kong',
    salaryRange: '$110,000 - $160,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['5-Star Airline', 'Asian Network', 'Career Growth'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
    cardImage: '',
    description:
      'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage and strong career progression pathways.',
    fleet: 'Airbus A350, A330, Boeing 777',
    region: 'Asia',
  },
  {
    id: 'ana',
    logo: '/images/airline-logos/APAC/japan/international-operators/all-nippon-airways.svg',
    heroImage:
      '/images/airline-logos/APAC/japan/international-operators/all-nippon-airways-aircraft.jpg',
    name: 'ANA All Nippon',
    location: 'Japan',
    salaryRange: '$100,000 - $170,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['5-Star Airline', 'Tokyo Hub', 'Japanese Quality'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg',
    cardImage: '',
    description:
      "ANA is Japan's largest airline and a 5-star carrier renowned for exceptional service. Pilots benefit from Japanese precision, excellent training, and access to key Asian markets.",
    fleet: 'Boeing 777, 787, Airbus A380, A320',
    region: 'Asia',
  },
  {
    id: 'jal',
    logo: '/images/airline-logos/APAC/japan/international-operators/japan-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/japan/international-operators/japan-airlines-aircraft.jpg',
    name: 'Japan Airlines',
    location: 'Japan',
    salaryRange: '$95,000 - $165,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Premium Service', 'Tokyo Hub', 'Domestic + International'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg',
    cardImage: '',
    description:
      'Japan Airlines represents the finest in Japanese hospitality combined with aviation excellence.',
    fleet: 'Boeing 737, 767, 777, 787, Airbus A350',
    region: 'Asia',
  },
  {
    id: 'korean',
    logo: '/images/airline-logos/APAC/south-korea/international-operators/korean-air.svg',
    heroImage:
      '/images/airline-logos/APAC/south-korea/international-operators/korean-air-aircraft.jpg',
    name: 'Korean Air',
    location: 'South Korea',
    salaryRange: '$85,000 - $150,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Seoul Hub', 'North American Routes', 'Growing Fleet'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/korean-air.jpg',
    cardImage: '',
    description:
      "Korean Air is South Korea's flagship carrier with a strong presence on trans-Pacific routes. Pilots enjoy competitive Asian compensation and a modern, expanding aircraft fleet.",
    region: 'Asia',
  },
  {
    id: 'asiana',
    logo: '/images/airline-logos/APAC/south-korea/international-operators/asiana-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/south-korea/international-operators/asiana-airlines-aircraft.jpg',
    name: 'Asiana Airlines',
    location: 'South Korea',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Star Alliance', 'Incheon Hub', 'Service Excellence'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/asiana-airlines.webp',
    cardImage: '',
    description:
      'Asiana Airlines is known for outstanding service quality and safety standards. The airline provides pilots with excellent training and opportunities on both regional and long-haul routes.',
    region: 'Asia',
  },
  {
    id: 'thai',
    logo: '/images/airline-logos/APAC/thailand/international-operators/thai-airways.svg',
    heroImage:
      '/images/airline-logos/APAC/thailand/international-operators/thai-airways-aircraft.jpg',
    name: 'Thai Airways',
    location: 'Thailand',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bangkok Hub', 'Southeast Asian Network', 'Royal Service'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/thai-airways.jpg',
    cardImage: '',
    description:
      'Thai Airways offers a unique blend of Thai hospitality and international aviation standards. Pilots enjoy living in Thailand while flying to destinations across Asia and beyond.',
    region: 'Asia',
  },
  {
    id: 'malaysia',
    logo: '/images/airline-logos/APAC/malaysia/international-operators/malaysia-airlines.png',
    heroImage:
      '/images/airline-logos/APAC/malaysia/international-operators/malaysia-airlines-aircraft.jpg',
    name: 'Malaysia Airlines',
    location: 'Malaysia',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['KL Hub', 'Southeast Asia', 'OneWorld Member'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/malaysia-airlines.jpg',
    cardImage: '',
    description:
      'Malaysia Airlines connects Southeast Asia with the world from its Kuala Lumpur hub. The airline offers pilots competitive compensation and exposure to diverse Asian markets.',
    region: 'Asia',
  },
  {
    id: 'garuda',
    logo: '/images/airline-logos/APAC/indonesia/international-operators/garuda-indonesia.png',
    heroImage:
      '/images/airline-logos/APAC/indonesia/international-operators/garuda-indonesia-aircraft.jpg',
    name: 'Garuda Indonesia',
    location: 'Indonesia',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Jakarta Hub', 'Archipelago Network', 'Growing Market'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/garuda-indonesia.jpg',
    cardImage: '',
    description:
      "Garuda Indonesia serves the world's largest archipelago nation. Pilots benefit from rapid fleet modernization and the opportunity to fly across one of Earth's most diverse geographic areas.",
    region: 'Asia',
  },
  {
    id: 'philippine',
    logo: '/images/airline-logos/APAC/philippines/international-operators/philippine-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/philippines/international-operators/philippine-airlines-aircraft.jpg',
    name: 'Philippine Airlines',
    location: 'Philippines',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Manila Hub', 'Pacific Routes', 'Historic Carrier'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/philippine-airlines.webp',
    cardImage: '',
    description:
      "Philippine Airlines is Asia's oldest commercial airline. It offers pilots a unique base in the Philippines with growing international connections to North America and Asia.",
    region: 'Asia',
  },
  {
    id: 'vietnam',
    logo: '/images/airline-logos/APAC/vietnam/international-operators/vietnam-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/vietnam/international-operators/vietnam-airlines-aircraft.jpg',
    name: 'Vietnam Airlines',
    location: 'Vietnam',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Hanoi Hub', 'Growing Economy', 'Modern Fleet'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/vietnam-airlines.jpg',
    cardImage: '',
    description:
      "Vietnam Airlines represents one of Asia's fastest-growing economies. The airline is rapidly modernizing its fleet and expanding international routes.",
    region: 'Asia',
  },
  {
    id: 'china',
    logo: '/images/airline-logos/APAC/china/international-operators/air-china.svg',
    heroImage: '/images/airline-logos/APAC/china/international-operators/air-china-aircraft.jpg',
    name: 'Air China',
    location: 'China',
    salaryRange: '$70,000 - $120,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Beijing Hub', 'Largest Market', 'Star Alliance'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-china.jpg',
    cardImage: '',
    description:
      "Air China is the flag carrier of the People's Republic of China and the world's largest aviation market.",
    region: 'Asia',
  },
  {
    id: 'chinaeastern',
    logo: '/images/airline-logos/APAC/china/international-operators/china-eastern-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/china/international-operators/china-eastern-airlines-aircraft.jpg',
    name: 'China Eastern',
    location: 'China',
    salaryRange: '$65,000 - $115,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Shanghai Hub', 'Skyteam Member', 'Major Player'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-eastern.jpg',
    cardImage: '',
    description: 'China Eastern Airlines operates from Shanghai, connecting China with the world.',
    region: 'Asia',
  },
  {
    id: 'chinasouthern',
    logo: '/images/airline-logos/APAC/china/international-operators/china-southern-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/china/international-operators/china-southern-airlines-aircraft.jpg',
    name: 'China Southern',
    location: 'China',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Guangzhou Hub', 'Largest Fleet', 'Asia Focus'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-southern.jpg',
    cardImage: '',
    description: "China Southern operates China's largest fleet with extensive Asian coverage.",
    region: 'Asia',
  },
  {
    id: 'cathaydragon',
    logo: '/images/airline-logos/APAC/hong-kong/international-operators/cathay-pacific.svg',
    heroImage:
      '/images/airline-logos/APAC/hong-kong/international-operators/cathay-dragon-aircraft.jpg',
    name: 'Cathay Dragon',
    location: 'Hong Kong',
    salaryRange: '$70,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Regional', 'Hong Kong Hub', 'Asia Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-dragon.webp',
    cardImage: '',
    description:
      'Cathay Dragon served regional Asian destinations from Hong Kong. Now integrated into Cathay Pacific with excellent regional opportunities.',
    region: 'Asia',
  },
  {
    id: 'hkexpress',
    logo: '/images/airline-logos/APAC/hong-kong/regional-operators/hong-kong-express.svg',
    heroImage:
      '/images/airline-logos/APAC/hong-kong/regional-operators/hong-kong-express-aircraft.jpg',
    name: 'HK Express',
    location: 'Hong Kong',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Hong Kong Hub', 'Asia Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/hk-express.jpg',
    cardImage: '',
    description:
      "HK Express is Hong Kong's low-cost carrier. Part of Cathay Pacific group offering pilots dynamic short-haul Asian operations.",
    region: 'Asia',
  },
  {
    id: 'scoot',
    logo: '/images/airline-logos/APAC/singapore/regional-operators/scoot.svg',
    heroImage: '/images/airline-logos/APAC/singapore/regional-operators/scoot-aircraft.jpg',
    name: 'Scoot',
    location: 'Singapore',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Long Haul LCC'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/scoot.webp',
    cardImage: '',
    description:
      "Scoot is Singapore Airlines' low-cost subsidiary. Operates Boeing 787 long-haul low-cost routes across Asia and beyond.",
    region: 'Asia',
  },
  {
    id: 'jetstar',
    logo: '/images/airline-logos/APAC/australia/international-operators/jetstar.svg',
    heroImage: '/images/airline-logos/APAC/australia/international-operators/jetstar-aircraft.jpg',
    name: 'Jetstar Asia',
    location: 'Singapore',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Regional'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetstar-asia.jpg',
    cardImage: '',
    description:
      'Jetstar Asia serves regional Southeast Asian markets. Part of Qantas Group offering pilots diverse Asian low-cost operations.',
    region: 'Asia',
  },
  {
    id: 'peach',
    logo: '/images/airline-logos/APAC/japan/regional-operators/peach-aviation.svg',
    heroImage: '/images/airline-logos/APAC/japan/regional-operators/peach-aviation-aircraft.jpg',
    name: 'Peach Aviation',
    location: 'Japan',
    salaryRange: '$40,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Osaka Hub', 'Domestic Japan'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/peach-aviation.jpg',
    cardImage: '',
    description:
      "Peach Aviation is Japan's leading low-cost carrier. Based in Osaka with extensive domestic and regional Asian network.",
    region: 'Asia',
  },
  {
    id: 'spring',
    logo: '/images/airline-logos/APAC/china/regional-operators/spring-airlines.png',
    heroImage: '/images/airline-logos/APAC/china/regional-operators/spring-airlines-aircraft.jpg',
    name: 'Spring Airlines',
    location: 'China',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Shanghai Hub', 'Largest LCC'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spring-airlines.jpg',
    cardImage: '',
    description:
      "Spring Airlines is China's largest low-cost carrier. Based in Shanghai with extensive domestic Chinese network.",
    region: 'Asia',
  },
  {
    id: 'indigo',
    logo: '/images/airline-logos/APAC/india/regional-operators/indigo.svg',
    heroImage: '/images/airline-logos/APAC/india/regional-operators/indigo-aircraft.jpg',
    name: 'IndiGo',
    location: 'India',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', "India's Largest"],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/indigo.jpg',
    cardImage: '',
    description:
      "IndiGo is India's largest airline by passengers. Fast-growing low-cost carrier with extensive domestic and international network.",
    region: 'Asia',
  },
  {
    id: 'airindia',
    logo: '/images/airline-logos/APAC/india/international-operators/air-india.svg',
    heroImage: '/images/airline-logos/APAC/india/international-operators/air-india-aircraft.jpg',
    name: 'Air India',
    location: 'India',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mumbai Hub', 'Star Alliance', 'Historic Carrier'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776689695/airline-expectations/air-india-new.jpg',
    cardImage: '',
    description:
      "Air India is India's flag carrier now part of Tata Group. Star Alliance member with extensive international network.",
    region: 'Asia',
  },
  {
    id: 'spicejet',
    logo: '/images/airline-logos/APAC/india/regional-operators/spicejet.png',
    heroImage: '/images/airline-logos/APAC/india/regional-operators/spicejet-aircraft.jpg',
    name: 'SpiceJet',
    location: 'India',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', 'Budget Carrier'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spicejet.jpg',
    cardImage: '',
    description:
      "SpiceJet is one of India's leading low-cost carriers. Operating Boeing 737s across extensive Indian domestic network.",
    region: 'Asia',
  },
  {
    id: 'aigle',
    logo: '/images/airline-logos/APAC/india/regional-operators/air-india-express.png',
    heroImage: '/images/airline-logos/APAC/india/regional-operators/air-india-express-aircraft.jpg',
    name: 'Air India Express',
    location: 'India',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Kochi Hub', 'Gulf Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-india-express.jpg',
    cardImage: '',
    description:
      'Air India Express serves Gulf routes from Kerala. Low-cost subsidiary connecting Indian workers to Middle East destinations.',
    region: 'Asia',
  },
  {
    id: 'cebupacific',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/cebu-pacific.svg',
    heroImage:
      '/images/airline-logos/APAC/philippines/regional-operators/cebu-pacific-aircraft.jpg',
    name: 'Cebu Pacific',
    location: 'Philippines',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Low Cost', 'Largest Philippine LCC'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cebu-pacific.jpg',
    cardImage: '',
    description:
      "Cebu Pacific is the Philippines' largest low-cost carrier. Operating from Manila with extensive domestic and growing international network.",
    region: 'Asia',
  },
  {
    id: 'srilankan',
    logo: '/images/airline-logos/APAC/sri-lanka/international-operators/srilankan-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/sri-lanka/international-operators/srilankan-airlines-aircraft.jpg',
    name: 'SriLankan Airlines',
    location: 'Sri Lanka',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Colombo Hub', 'Oneworld', 'Indian Ocean'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/srilankan-airlines.jpg',
    cardImage: '',
    description:
      'SriLankan Airlines serves as the Indian Ocean hub from Colombo. Oneworld member with excellent Asian and Middle East connections.',
    region: 'Asia',
  },
  {
    id: 'nepal',
    logo: '/images/airline-logos/APAC/nepal/international-operators/nepal-airlines.png',
    heroImage:
      '/images/airline-logos/APAC/nepal/international-operators/nepal-airlines-aircraft.jpg',
    name: 'Nepal Airlines',
    location: 'Nepal',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Kathmandu Hub', 'Mountain Flying', 'Regional'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/nepal-airlines.jpg',
    cardImage: '',
    description:
      'Nepal Airlines operates in challenging Himalayan terrain. Unique mountain flying experience from Kathmandu to regional destinations.',
    region: 'Asia',
  },
  {
    id: 'biman',
    logo: '/images/airline-logos/APAC/bangladesh/international-operators/biman-bangladesh-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/bangladesh/international-operators/biman-bangladesh-airlines-aircraft.jpg',
    name: 'Biman Bangladesh',
    location: 'Bangladesh',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Dhaka Hub', 'National Carrier', 'Gulf Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/bangladesh-biman.jpg',
    cardImage: '',
    description:
      'Biman Bangladesh is the national carrier of Bangladesh. Operating from Dhaka with focus on Middle East and Asian routes.',
    region: 'Asia',
  },
  // Europe
  {
    id: 'lufthansa',
    logo: '/images/airlines/lufthansa/logo/lufthansa-logo.svg',
    heroImage:
      '/images/airline-logos/europe/germany/international-operators/lufthansa-aircraft.jpg',
    name: 'Lufthansa',
    location: 'Germany',
    salaryRange: '$90,000 - $160,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['European Leader', 'Star Alliance', 'Career Stability'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
    cardImage: '',
    description:
      "Lufthansa is Europe's largest airline and a founding member of Star Alliance. It offers excellent career stability, comprehensive benefits, and opportunities to fly to over 200 destinations worldwide.",
    fleet: 'Airbus A350, A330, Boeing 747-8, 777',
    region: 'Europe',
  },
  {
    id: 'british',
    logo: '/images/airline-logos/europe/united-kingdom/international-operators/british-airways.svg',
    heroImage:
      '/images/airline-logos/europe/united-kingdom/international-operators/british-airways-aircraft.jpg',
    name: 'British Airways',
    location: 'United Kingdom',
    salaryRange: '$85,000 - $150,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Legacy Carrier', 'Heathrow Hub', 'Global Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
    cardImage: '',
    description:
      'British Airways operates from its hub at London Heathrow, offering pilots access to a vast global network.',
    fleet: 'Boeing 777, 787, Airbus A350, A380',
    region: 'Europe',
  },
  {
    id: 'airfrance',
    logo: '/images/airline-logos/europe/france/international-operators/airfrance.svg',
    heroImage: '/images/airline-logos/europe/france/international-operators/airfrance-aircraft.jpg',
    name: 'Air France',
    location: 'France',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['French Flagship', 'CDG Hub', 'European Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg',
    cardImage: '',
    description:
      'Air France is the French flag carrier with a rich history dating back to 1933. Pilots enjoy working in a multicultural environment with excellent French employment benefits.',
    fleet: 'Boeing 777, 787, Airbus A350, A330',
    region: 'Europe',
  },
  {
    id: 'klm',
    logo: '/images/airline-logos/europe/netherlands/international-operators/klm.svg',
    heroImage: '/images/airline-logos/europe/netherlands/international-operators/klm-aircraft.jpg',
    name: 'KLM',
    location: 'Netherlands',
    salaryRange: '$75,000 - $135,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Dutch Legacy', 'Amsterdam Hub', 'Efficient Operations'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg',
    cardImage: '',
    description:
      'KLM Royal Dutch Airlines is the oldest airline still operating under its original name. Known for efficient operations and excellent pilot relations.',
    fleet: 'Boeing 777, 787, Airbus A330',
    region: 'Europe',
  },
  {
    id: 'swiss',
    logo: '/images/airline-logos/europe/switzerland/international-operators/swiss.svg',
    heroImage:
      '/images/airline-logos/europe/switzerland/international-operators/swiss-aircraft.jpg',
    name: 'Swiss International',
    location: 'Switzerland',
    salaryRange: '$95,000 - $155,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Premium Service', 'Swiss Quality', 'Zurich Hub'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg',
    cardImage: '',
    description:
      'Swiss International Air Lines combines traditional Swiss quality with modern aviation standards.',
    fleet: 'Airbus A320 family, A330, A340',
    region: 'Europe',
  },
  {
    id: 'turkish',
    logo: '/images/airline-logos/europe/turkey/international-operators/turkish.svg',
    heroImage: '/images/airline-logos/europe/turkey/international-operators/turkish-aircraft.jpg',
    name: 'Turkish Airlines',
    location: 'Turkey',
    salaryRange: '$70,000 - $130,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Fast Growing', 'Istanbul Hub', '120+ Countries'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg',
    cardImage: '',
    description:
      'Turkish Airlines flies to more countries than any other airline. With its modern Istanbul Airport hub, it offers pilots exposure to diverse international routes.',
    fleet: 'Boeing 737, 777, 787, Airbus A320, A330, A350',
    region: 'Europe',
  },
  {
    id: 'iberia',
    logo: '/images/airline-logos/europe/spain/international-operators/iberia.svg',
    heroImage: '/images/airline-logos/europe/spain/international-operators/iberia-aircraft.jpg',
    name: 'Iberia',
    location: 'Spain',
    salaryRange: '$65,000 - $115,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Madrid Hub', 'Oneworld', 'Latin America Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/iberia.jpg',
    cardImage: '',
    description:
      "Iberia is Spain's flagship carrier with strong connections to Latin America. Pilots benefit from excellent Spanish employment benefits and extensive transatlantic operations.",
    region: 'Europe',
  },
  {
    id: 'alitalia',
    logo: '/images/airline-logos/europe/italy/international-operators/alitalia.png',
    heroImage: '/images/airline-logos/europe/italy/international-operators/alitalia-aircraft.jpg',
    name: 'ITA Airways',
    location: 'Italy',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Rome Hub', 'Skyteam', 'Mediterranean Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ita-airways.jpg',
    cardImage: '',
    description:
      'ITA Airways represents the rebirth of Italian aviation. Operating from Rome with modern Airbus fleet.',
    region: 'Europe',
  },
  {
    id: 'austrian',
    logo: '/images/airline-logos/europe/austria/international-operators/austrian.svg',
    heroImage: '/images/airline-logos/europe/austria/international-operators/austrian-aircraft.jpg',
    name: 'Austrian Airlines',
    location: 'Austria',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Vienna Hub', 'Star Alliance', 'Eastern Europe'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/austrian-airlines.jpg',
    cardImage: '',
    description:
      'Austrian Airlines serves as the gateway to Eastern Europe from Vienna. Part of Lufthansa Group.',
    region: 'Europe',
  },
  {
    id: 'brussels',
    logo: '/images/airline-logos/europe/belgium/international-operators/brussels.png',
    heroImage: '/images/airline-logos/europe/belgium/international-operators/brussels-aircraft.jpg',
    name: 'Brussels Airlines',
    location: 'Belgium',
    salaryRange: '$58,000 - $105,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brussels Hub', 'Star Alliance', 'Africa Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/brussels-airlines.jpg',
    cardImage: '',
    description:
      "Brussels Airlines is Belgium's flagship carrier with extensive African network. Part of Lufthansa Group.",
    region: 'Europe',
  },
  {
    id: 'sas',
    logo: '/images/airline-logos/europe/denmark/international-operators/sas.png',
    heroImage: '/images/airline-logos/europe/denmark/international-operators/sas-aircraft.jpg',
    name: 'SAS Scandinavian',
    location: 'Denmark/Norway/Sweden',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Copenhagen Hub', 'Star Alliance', 'Nordic Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/sas.jpg',
    cardImage: '',
    description:
      'SAS serves Scandinavia with Copenhagen, Oslo and Stockholm hubs. Known for excellent pilot work-life balance and strong Nordic labor protections.',
    region: 'Europe',
  },
  {
    id: 'finnair',
    logo: '/images/airline-logos/europe/finland/international-operators/finnair.png',
    heroImage: '/images/airline-logos/europe/finland/international-operators/finnair-aircraft.jpg',
    name: 'Finnair',
    location: 'Finland',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Helsinki Hub', 'Oneworld', 'Asia Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/finnair.jpg',
    cardImage: '',
    description:
      'Finnair offers the shortest route between Europe and Asia via Helsinki. Modern Airbus A350 fleet.',
    region: 'Europe',
  },
  {
    id: 'tap',
    logo: '/images/airline-logos/europe/portugal/international-operators/tap.png',
    heroImage: '/images/airline-logos/europe/portugal/international-operators/tap-aircraft.jpg',
    name: 'TAP Portugal',
    location: 'Portugal',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Lisbon Hub', 'Star Alliance', 'Brazil Routes'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/tap-portugal.jpg',
    cardImage: '',
    description:
      'TAP Portugal connects Europe to Brazil and Africa from Lisbon. Known for warm Portuguese culture and growing international network.',
    region: 'Europe',
  },
  {
    id: 'aegean',
    logo: '/images/airline-logos/europe/greece/international-operators/aegean.png',
    heroImage: '/images/airline-logos/europe/greece/international-operators/aegean-aircraft.jpg',
    name: 'Aegean Airlines',
    location: 'Greece',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Athens Hub', 'Star Alliance', 'Island Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aegean.jpg',
    cardImage: '',
    description: "Aegean Airlines is Greece's largest carrier with extensive island network.",
    region: 'Europe',
  },
  {
    id: 'lot',
    logo: '/images/airline-logos/europe/poland/international-operators/lot.png',
    heroImage: '/images/airline-logos/europe/poland/international-operators/lot-aircraft.jpg',
    name: 'LOT Polish',
    location: 'Poland',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Warsaw Hub', 'Star Alliance', 'Eastern Europe'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lot-polish.jpg',
    cardImage: '',
    description:
      "LOT Polish Airlines is Eastern Europe's leading carrier. Growing long-haul network with Boeing 787 Dreamliners.",
    region: 'Europe',
  },
  {
    id: 'czech',
    logo: '/images/airline-logos/europe/czech-republic/international-operators/czech.png',
    heroImage:
      '/images/airline-logos/europe/czech-republic/international-operators/czech-aircraft.jpg',
    name: 'Czech Airlines',
    location: 'Czech Republic',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Prague Hub', 'Skyteam', 'Central Europe'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/czech-airlines.jpg',
    cardImage: '',
    description:
      "Czech Airlines serves Central Europe from historic Prague. One of the world's oldest airlines.",
    region: 'Europe',
  },
  {
    id: 'norwegian',
    logo: '/images/airline-logos/europe/norway/international-operators/norwegian.png',
    heroImage: '/images/airline-logos/europe/norway/international-operators/norwegian-aircraft.jpg',
    name: 'Norwegian',
    location: 'Norway',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Low Cost', 'Oslo Hub', 'Transatlantic'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/norwegian.jpg',
    cardImage: '',
    description:
      'Norwegian revolutionized low-cost transatlantic travel. Rebuilt fleet offering pilots extensive European and long-haul operations.',
    region: 'Europe',
  },
  {
    id: 'icelandair',
    logo: '/images/airline-logos/europe/iceland/international-operators/icelandair.png',
    heroImage:
      '/images/airline-logos/europe/iceland/international-operators/icelandair-aircraft.jpg',
    name: 'Icelandair',
    location: 'Iceland',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Reykjavik Hub', 'Iceland', 'North Atlantic'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/icelandair.jpg',
    cardImage: '',
    description:
      'Icelandair offers unique North Atlantic operations via Reykjavik. Pilots experience challenging weather operations and stunning scenery.',
    region: 'Europe',
  },
  {
    id: 'virginatlantic',
    logo: '/images/airline-logos/europe/united-kingdom/international-operators/virginatlantic.png',
    heroImage:
      '/images/airline-logos/europe/united-kingdom/international-operators/virginatlantic-aircraft.jpg',
    name: 'Virgin Atlantic',
    location: 'United Kingdom',
    salaryRange: '$80,000 - $150,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['London Hub', 'Transatlantic', 'Premium Service'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-atlantic.jpg',
    cardImage: '',
    description:
      'Virgin Atlantic is a British airline known for its innovative service and transatlantic focus. Operating from London Heathrow and Gatwick with a modern fleet.',
    region: 'Europe',
  },
  // Americas
  {
    id: 'delta',
    logo: '/images/airlines/delta-air-lines/logo/delta-air-lines-logo.svg',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/delta-aircraft.jpg',
    name: 'Delta Air Lines',
    location: 'United States',
    salaryRange: '$110,000 - $250,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg',
    cardImage: '',
    description:
      "Delta is the world's largest airline by revenue and fleet size. It offers pilots industry-leading compensation, excellent benefits, and a vast domestic and international network.",
    fleet: 'Airbus A220, A320, A330, A350, Boeing 737, 757, 767, 777',
    region: 'Americas',
  },
  {
    id: 'american',
    logo: '/images/airlines/american-airlines/logo/american-airlines-logo.svg',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/american-airlines-aircraft.jpg',
    name: 'American Airlines',
    location: 'United States',
    salaryRange: '$100,000 - $230,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ["World's Largest", 'Dallas Hub', 'Oneworld Leader'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/american-airlines.jpg',
    cardImage: '',
    description:
      "American Airlines is the world's largest airline by fleet size and passengers carried.",
    fleet: 'Airbus A320, A321, Boeing 737, 777, 787',
    region: 'Americas',
  },
  {
    id: 'united',
    logo: '/images/airline-logos/americas/united-states/international-operators/united.png',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/united-aircraft.jpg',
    name: 'United Airlines',
    location: 'United States',
    salaryRange: '$105,000 - $240,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Global Network', 'Chicago Hub', 'Star Alliance'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/united.jpg',
    cardImage: '',
    description:
      'United Airlines offers one of the most comprehensive global networks. With hubs across the US and Star Alliance membership.',
    fleet: 'Airbus A319, A320, Boeing 737, 757, 767, 777, 787',
    region: 'Americas',
  },
  {
    id: 'southwest',
    logo: '/images/airlines/southwest-airlines/logo/southwest-airlines-logo.svg',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/southwest-aircraft.jpg',
    name: 'Southwest Airlines',
    location: 'United States',
    salaryRange: '$95,000 - $200,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost Leader', 'Domestic Focus', 'Great Culture'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/southwest.jpg',
    cardImage: '',
    description:
      "Southwest Airlines is the world's largest low-cost carrier. Known for excellent pilot relations and unique company culture.",
    region: 'Americas',
  },
  {
    id: 'alaska',
    logo: '/images/airline-logos/americas/united-states/international-operators/alaska.png',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/alaska-aircraft.jpg',
    name: 'Alaska Airlines',
    location: 'United States',
    salaryRange: '$90,000 - $180,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['West Coast', 'Seattle Hub', 'Award Winning'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/alaska-airlines.jpg',
    cardImage: '',
    description:
      'Alaska Airlines is consistently rated among the best US airlines. With its Seattle hub and West Coast focus.',
    region: 'Americas',
  },
  {
    id: 'jetblue',
    logo: '/images/airline-logos/americas/united-states/international-operators/jetblue.png',
    heroImage:
      '/images/airline-logos/americas/united-states/international-operators/jetblue-aircraft.jpg',
    name: 'JetBlue Airways',
    location: 'United States',
    salaryRange: '$85,000 - $170,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['New York Hub', 'Transcontinental', 'Modern Experience'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetblue.jpg',
    cardImage: '',
    description:
      'JetBlue Airways revolutionized US domestic travel with its premium economy approach. Based in New York.',
    region: 'Americas',
  },
  {
    id: 'aircanada',
    logo: '/images/airline-logos/americas/canada/international-operators/aircanada.png',
    heroImage:
      '/images/airline-logos/americas/canada/international-operators/aircanada-aircraft.jpg',
    name: 'Air Canada',
    location: 'Canada',
    salaryRange: '$80,000 - $160,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Star Alliance', 'Transatlantic'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-canada.jpg',
    cardImage: '',
    description:
      "Air Canada is Canada's flag carrier and largest airline. Pilots enjoy flying to over 200 destinations worldwide.",
    region: 'Americas',
  },
  {
    id: 'westjet',
    logo: '/images/airline-logos/americas/canada/international-operators/westjet.png',
    heroImage: '/images/airline-logos/americas/canada/international-operators/westjet-aircraft.jpg',
    name: 'WestJet',
    location: 'Canada',
    salaryRange: '$70,000 - $140,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Calgary Hub', 'Canadian Leader', 'Growing International'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/westjet.jpg',
    cardImage: '',
    description: "WestJet is Canada's second-largest airline and growing internationally.",
    region: 'Americas',
  },
  {
    id: 'latam',
    logo: '/images/airline-logos/americas/chile/international-operators/latam.png',
    heroImage: '/images/airline-logos/americas/chile/international-operators/latam-aircraft.jpg',
    name: 'LATAM Airlines',
    location: 'Chile',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'South America', 'Largest Regional'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/latam.jpg',
    cardImage: '',
    description:
      "LATAM is Latin America's largest airline group. From Santiago, pilots access an unmatched South American network.",
    region: 'Americas',
  },
  {
    id: 'avianca',
    logo: '/images/airline-logos/americas/colombia/international-operators/avianca.png',
    heroImage:
      '/images/airline-logos/americas/colombia/international-operators/avianca-aircraft.jpg',
    name: 'Avianca',
    location: 'Colombia',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Bogota Hub', 'Star Alliance', 'Historic Airline'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/avianca.jpg',
    cardImage: '',
    description:
      "Avianca is one of the world's oldest continuously operating airlines. Its Bogota hub provides pilots access to diverse South American destinations.",
    region: 'Americas',
  },
  {
    id: 'aeromexico',
    logo: '/images/airline-logos/americas/mexico/international-operators/aeromexico.png',
    heroImage:
      '/images/airline-logos/americas/mexico/international-operators/aeromexico-aircraft.jpg',
    name: 'Aeromexico',
    location: 'Mexico',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mexico City Hub', 'Skyteam', 'Regional Leader'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aeromexico.jpg',
    cardImage: '',
    description: 'Aeromexico connects Latin America with the world from Mexico City.',
    region: 'Americas',
  },
  {
    id: 'copaair',
    logo: '/images/airline-logos/americas/panama/international-operators/copaair.png',
    heroImage: '/images/airline-logos/americas/panama/international-operators/copaair-aircraft.jpg',
    name: 'Copa Airlines',
    location: 'Panama',
    salaryRange: '$65,000 - $125,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Panama Hub', 'Hub Americas', 'Star Alliance'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/copa-airlines.jpg',
    cardImage: '',
    description:
      'Copa Airlines operates the Hub of the Americas in Panama. Pilots benefit from the strategic location connecting North and South America.',
    region: 'Americas',
  },
  {
    id: 'gol',
    logo: '/images/airline-logos/americas/brazil/international-operators/gol.png',
    heroImage: '/images/airline-logos/americas/brazil/international-operators/gol-aircraft.jpg',
    name: 'GOL Linhas',
    location: 'Brazil',
    salaryRange: '$55,000 - $105,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Sao Paulo Hub', 'Low Cost Brazil', 'Domestic Leader'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/gol.jpg',
    cardImage: '',
    description:
      "GOL is Brazil's largest domestic airline. Pilots fly within one of the world's most geographically diverse countries.",
    region: 'Americas',
  },
  // Oceania
  {
    id: 'qantas',
    logo: '/images/airline-logos/APAC/australia/international-operators/qantas.svg',
    heroImage: '/images/airline-logos/APAC/australia/international-operators/qantas-aircraft.jpg',
    name: 'Qantas',
    location: 'Australia',
    salaryRange: '$95,000 - $180,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Sydney Hub', 'Oneworld', 'Safest Airline'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qantas.jpg',
    cardImage: '',
    description:
      "Qantas is Australia's flag carrier and one of the world's safest airlines. Known for its Sydney-London Kangaroo Route.",
    region: 'Oceania',
  },
  {
    id: 'virginaustralia',
    logo: '/images/airline-logos/APAC/australia/international-operators/virgin-australia.svg',
    heroImage:
      '/images/airline-logos/APAC/australia/international-operators/virgin-australia-aircraft.jpg',
    name: 'Virgin Australia',
    location: 'Australia',
    salaryRange: '$75,000 - $145,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brisbane Hub', 'Competitive Service', 'Domestic Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-australia.png',
    description:
      'Virgin Australia brings competitive service to the Australian market. Pilots enjoy modern aircraft and a focus on customer experience.',
    region: 'Oceania',
  },
  // Africa
  {
    id: 'egyptair',
    logo: '/images/airline-logos/africa/egypt/international-operators/egyptair.png',
    heroImage: '/images/airline-logos/africa/egypt/international-operators/egyptair-aircraft.jpg',
    name: 'EgyptAir',
    location: 'Egypt',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Cairo Hub', 'Star Alliance', 'African Network'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776687052/airline-expectations/egypt-air.jpg',
    cardImage: '',
    description:
      'EgyptAir connects Africa with the world from historic Cairo. Pilots benefit from unique African operations.',
    region: 'Africa',
  },
  {
    id: 'ethiopian',
    logo: '/images/airline-logos/africa/ethiopia/international-operators/ethiopian.png',
    heroImage:
      '/images/airline-logos/africa/ethiopia/international-operators/ethiopian-aircraft.jpg',
    name: 'Ethiopian Airlines',
    location: 'Ethiopia',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Addis Ababa Hub', 'Star Alliance', 'African Leader'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ethiopian-airlines.jpg',
    cardImage: '',
    description:
      "Ethiopian Airlines is Africa's largest and most successful airline. From Addis Ababa, pilots access the continent's most extensive network.",
    region: 'Africa',
  },
  {
    id: 'southafrican',
    logo: '/images/airline-logos/africa/south-africa/international-operators/southafrican.png',
    heroImage:
      '/images/airline-logos/africa/south-africa/international-operators/southafrican-aircraft.jpg',
    name: 'South African Airways',
    location: 'South Africa',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Johannesburg Hub', 'Star Alliance', 'Southern Africa'],
    image:
      'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/south-african-airways.jpg',
    cardImage: '',
    description:
      'South African Airways connects the African continent from Johannesburg. Pilots enjoy diverse flying opportunities across Africa.',
    region: 'Africa',
  },
  // ===== NEW AIRLINES =====
  {
    id: 'rex',
    logo: '/images/airline-logos/APAC/australia/regional-operators/rex-airlines.svg',
    name: 'Rex Airlines',
    location: 'Australia',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Regional Carrier', 'Sydney Hub', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Rex Airlines is a major Australian regional carrier operating domestic and regional routes across Australia.',
    fleet: 'Saab 340, Boeing 737-800',
    region: 'Oceania',
  },
  {
    id: 'royalbrunei',
    logo: '/images/airline-logos/APAC/brunei/international-operators/royal-brunei-airlines.svg',
    heroImage:
      '/images/airline-logos/APAC/brunei/international-operators/royal-brunei-airlines-aircraft.jpg',
    name: 'Royal Brunei Airlines',
    location: 'Brunei',
    salaryRange: '$70,000 - $140,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bandar Seri Begawan Hub', 'Flag Carrier', 'Southeast Asia'],
    image: '',
    cardImage: '',
    description:
      'Royal Brunei Airlines is the flag carrier of Brunei, operating regional and long-haul routes from Bandar Seri Begawan.',
    fleet: 'Boeing 787, Airbus A320neo',
    region: 'Asia',
  },
  {
    id: 'hainan',
    logo: '/images/airline-logos/APAC/china/international-operators/hainan-airlines.svg',
    name: 'Hainan Airlines',
    location: 'China',
    salaryRange: '$60,000 - $130,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['5-Star Airline', 'Haikou Hub', 'Skytrax Award Winner'],
    image: '',
    cardImage: '',
    description:
      "Hainan Airlines is a 5-star Skytrax rated carrier and one of China's largest airlines, operating domestic and international routes.",
    fleet: 'Boeing 787, 737, Airbus A330',
    region: 'Asia',
  },
  {
    id: 'xiamen',
    logo: '/images/airline-logos/APAC/china/international-operators/xiamen-airlines.jpg',
    name: 'Xiamen Airlines',
    location: 'China',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Xiamen Hub', 'Boeing Fleet', 'SkyTeam'],
    image: '',
    cardImage: '',
    description:
      'Xiamen Airlines is a major Chinese carrier operating an all-Boeing fleet from its Xiamen hub.',
    fleet: 'Boeing 737, 787, 757',
    region: 'Asia',
  },
  {
    id: 'shanghai',
    logo: '/images/airline-logos/APAC/china/regional-operators/shanghai-airlines.svg',
    name: 'Shanghai Airlines',
    location: 'China',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Shanghai Hub', 'SkyTeam', 'Domestic Focus'],
    image: '',
    cardImage: '',
    description:
      'Shanghai Airlines operates domestic and regional international routes from Shanghai Pudong and Hongqiao.',
    fleet: 'Boeing 737, 787',
    region: 'Asia',
  },
  {
    id: 'shenzhen',
    logo: '/images/airline-logos/APAC/china/regional-operators/shenzhen-airlines.svg',
    name: 'Shenzhen Airlines',
    location: 'China',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Shenzhen Hub', 'Star Alliance', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Shenzhen Airlines is a major Chinese carrier based in Shenzhen, operating domestic and regional routes.',
    fleet: 'Airbus A320, A319, Boeing 737',
    region: 'Asia',
  },
  {
    id: 'sichuan',
    logo: '/images/airline-logos/APAC/china/regional-operators/sichuan-airlines.svg',
    name: 'Sichuan Airlines',
    location: 'China',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Chengdu Hub', 'Airbus Fleet', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Sichuan Airlines operates from Chengdu with an all-Airbus fleet, serving domestic and international routes.',
    fleet: 'Airbus A320, A321, A330',
    region: 'Asia',
  },
  {
    id: 'fiji',
    logo: '/images/airline-logos/APAC/fiji/international-operators/fiji-airways.svg',
    name: 'Fiji Airways',
    location: 'Fiji',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Nadi Hub', 'Flag Carrier', 'South Pacific'],
    image: '',
    cardImage: '',
    description:
      'Fiji Airways is the flag carrier of Fiji, connecting the South Pacific with Asia, North America, and Australia.',
    fleet: 'Airbus A350, A330, Boeing 737',
    region: 'Oceania',
  },
  {
    id: 'airtahitinui',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/french-polynesia/international-operators/air-tahiti-nui-aircraft.jpg',
    name: 'Air Tahiti Nui',
    location: 'French Polynesia',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Papeete Hub', 'Flag Carrier', 'South Pacific'],
    image: '',
    cardImage: '',
    description:
      'Air Tahiti Nui connects French Polynesia with the world, operating long-haul routes from Papeete.',
    fleet: 'Boeing 787-9',
    region: 'Oceania',
  },
  {
    id: 'hongkongairlines',
    logo: '/images/airline-logos/APAC/hong-kong/international-operators/hong-kong-airlines.svg',
    name: 'Hong Kong Airlines',
    location: 'Hong Kong',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Hong Kong Hub', 'Regional Carrier', 'Asia Network'],
    image: '',
    cardImage: '',
    description:
      'Hong Kong Airlines operates regional and long-haul routes from Hong Kong International Airport.',
    fleet: 'Airbus A330, A350',
    region: 'Asia',
  },
  {
    id: 'akasa',
    logo: '/images/airline-logos/APAC/india/regional-operators/akasa-air.svg',
    name: 'Akasa Air',
    location: 'India',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Mumbai Hub', 'Low-Cost Carrier', 'New Airline'],
    image: '',
    cardImage: '',
    description:
      'Akasa Air is a new Indian low-cost carrier operating a modern Boeing 737 MAX fleet.',
    fleet: 'Boeing 737 MAX',
    region: 'Asia',
  },
  {
    id: 'batik',
    logo: '/images/airline-logos/APAC/indonesia/regional-operators/batik-air.svg',
    name: 'Batik Air',
    location: 'Indonesia',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Lion Air Group', 'Full Service'],
    image: '',
    cardImage: '',
    description:
      'Batik Air is a full-service carrier under the Lion Air Group, operating domestic and regional routes in Indonesia.',
    fleet: 'Airbus A320, Boeing 737',
    region: 'Asia',
  },
  {
    id: 'citilink',
    logo: '/images/airline-logos/APAC/indonesia/regional-operators/citilink.svg',
    name: 'Citilink',
    location: 'Indonesia',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Garuda Subsidiary', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Citilink is the low-cost subsidiary of Garuda Indonesia, operating domestic and regional routes.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'lionair',
    logo: '/images/airline-logos/APAC/indonesia/regional-operators/lion-air.svg',
    name: 'Lion Air',
    location: 'Indonesia',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Largest LCC', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      "Lion Air is Indonesia's largest low-cost carrier, operating an extensive domestic and regional network.",
    fleet: 'Boeing 737, 737 MAX, Airbus A330',
    region: 'Asia',
  },
  {
    id: 'zipair',
    logo: '/images/airline-logos/APAC/japan/international-operators/zipair.svg',
    name: 'Zipair Tokyo',
    location: 'Japan',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Tokyo Hub', 'JAL Subsidiary', 'Long-Haul LCC'],
    image: '',
    cardImage: '',
    description:
      'Zipair Tokyo is a long-haul low-cost carrier and subsidiary of Japan Airlines, operating from Narita.',
    fleet: 'Boeing 787-8',
    region: 'Asia',
  },
  {
    id: 'skymark',
    logo: '/images/airline-logos/APAC/japan/regional-operators/skymark-airlines.svg',
    name: 'Skymark Airlines',
    location: 'Japan',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Tokyo Hub', 'Domestic LCC', 'Boeing Fleet'],
    image: '',
    cardImage: '',
    description:
      'Skymark Airlines is a Japanese low-cost carrier operating domestic routes from Tokyo Haneda.',
    fleet: 'Boeing 737',
    region: 'Asia',
  },
  {
    id: 'solaseed',
    logo: '/images/airline-logos/APAC/japan/regional-operators/solaseed-air.svg',
    name: 'Solaseed Air',
    location: 'Japan',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Miyazaki Hub', 'Regional Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Solaseed Air is a Japanese regional carrier operating domestic routes, primarily from Miyazaki and Naha.',
    fleet: 'Boeing 737',
    region: 'Asia',
  },
  {
    id: 'starflyer',
    logo: '/images/airline-logos/APAC/japan/regional-operators/star-flyer.svg',
    name: 'Star Flyer',
    location: 'Japan',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kitakyushu Hub', 'Premium LCC', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Star Flyer is a Japanese premium low-cost carrier operating from Kitakyushu with domestic routes.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'airkiribati',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/kiribati/international-operators/air-kiribati-aircraft.jpg',
    name: 'Air Kiribati',
    location: 'Kiribati',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Tarawa Hub', 'Flag Carrier', 'Pacific Islands'],
    image: '',
    cardImage: '',
    description:
      'Air Kiribati is the flag carrier of Kiribati, operating inter-island services across the Pacific archipelago.',
    fleet: 'De Havilland Canada DHC-6, Harbin Y-12',
    region: 'Oceania',
  },
  {
    id: 'laoairlines',
    logo: '/images/airline-logos/APAC/laos/international-operators/laos-airlines.png',
    heroImage: '/images/airline-logos/APAC/laos/international-operators/lao-airlines-aircraft.jpg',
    name: 'Lao Airlines',
    location: 'Laos',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Vientiane Hub', 'Flag Carrier', 'Mekong Region'],
    image: '',
    cardImage: '',
    description:
      'Lao Airlines is the flag carrier of Laos, operating domestic and regional routes from Vientiane.',
    fleet: 'Airbus A320, ATR 72',
    region: 'Asia',
  },
  {
    id: 'airasia',
    logo: '/images/airline-logos/APAC/malaysia/international-operators/airasia.svg',
    name: 'AirAsia',
    location: 'Malaysia',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Kuala Lumpur Hub', "World's Best LCC", 'Pan-Asian Network'],
    image: '',
    cardImage: '',
    description:
      'AirAsia is one of the largest low-cost carriers in Asia, operating an extensive network from Kuala Lumpur.',
    fleet: 'Airbus A320, A321, A330',
    region: 'Asia',
  },
  {
    id: 'airasiax',
    logo: '/images/airline-logos/APAC/malaysia/international-operators/airasia.svg',
    heroImage: '/images/airline-logos/APAC/malaysia/international-operators/airasia-x-aircraft.jpg',
    name: 'AirAsia X',
    location: 'Malaysia',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kuala Lumpur Hub', 'Long-Haul LCC', 'Wide-Body Fleet'],
    image: '',
    cardImage: '',
    description:
      'AirAsia X is the long-haul arm of AirAsia, operating wide-body aircraft on medium and long-haul routes.',
    fleet: 'Airbus A330, A321XLR',
    region: 'Asia',
  },
  {
    id: 'maldivian',
    logo: '/images/airline-logos/APAC/maldives/regional-operators/maldivian.svg',
    name: 'Maldivian',
    location: 'Maldives',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Male Hub', 'Flag Carrier', 'Island Network'],
    image: '',
    cardImage: '',
    description:
      'Maldivian is the flag carrier of the Maldives, operating inter-island and regional routes.',
    fleet: 'Airbus A320, ATR 42, DHC-6',
    region: 'Asia',
  },
  {
    id: 'myanmarairways',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/myanmar/international-operators/myanmar-airways-aircraft.jpg',
    name: 'Myanmar Airways',
    location: 'Myanmar',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Yangon Hub', 'Flag Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Myanmar Airways is the flag carrier of Myanmar, operating domestic and regional routes from Yangon.',
    fleet: 'Embraer E190, ATR 72',
    region: 'Asia',
  },
  {
    id: 'aircalin',
    logo: '/images/airline-logos/APAC/new-caledonia/international-operators/air-calin.svg',
    name: 'Air Calédonie',
    location: 'New Caledonia',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Noumea Hub', 'Flag Carrier', 'South Pacific'],
    image: '',
    cardImage: '',
    description:
      'Air Calédonie (AirCalin) is the flag carrier of New Caledonia, connecting Noumea with the Pacific and Asia.',
    fleet: 'Airbus A330, A320',
    region: 'Oceania',
  },
  {
    id: 'airnz',
    logo: '/images/airline-logos/APAC/new-zealand/international-operators/air-new-zealand.svg',
    name: 'Air New Zealand',
    location: 'New Zealand',
    salaryRange: '$70,000 - $150,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Auckland Hub', 'Star Alliance', '5-Star Safety'],
    image: '',
    cardImage: '',
    description:
      'Air New Zealand is the flag carrier of New Zealand, known for innovative service and an extensive domestic and international network.',
    fleet: 'Boeing 787, 777, Airbus A320, A321neo, ATR 72',
    region: 'Oceania',
  },
  {
    id: 'sereneair',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/pakistan/international-operators/serene-air-aircraft.jpg',
    name: 'SereneAir',
    location: 'Pakistan',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Karachi Hub', 'Private Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'SereneAir is a Pakistani private airline operating domestic routes from Karachi and Islamabad.',
    fleet: 'Boeing 737-800',
    region: 'Asia',
  },
  {
    id: 'pia',
    logo: '/images/airline-logos/APAC/pakistan/international-operators/pakistan-international-airlines.svg',
    name: 'Pakistan International Airlines',
    location: 'Pakistan',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Karachi Hub', 'Flag Carrier', 'Domestic & International'],
    image: '',
    cardImage: '',
    description:
      'PIA is the flag carrier of Pakistan, operating domestic and international routes from Karachi.',
    fleet: 'Boeing 777, 737, Airbus A320',
    region: 'Asia',
  },
  {
    id: 'airblue',
    logo: '/images/airline-logos/APAC/pakistan/regional-operators/airblue.svg',
    name: 'Airblue',
    location: 'Pakistan',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Islamabad Hub', 'Private Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description: 'Airblue is a Pakistani private airline operating domestic and regional routes.',
    fleet: 'Airbus A320, A321',
    region: 'Asia',
  },
  {
    id: 'airniugini',
    logo: '/images/airline-logos/APAC/papua-new-guinea/international-operators/air-niugini.svg',
    name: 'Air Niugini',
    location: 'Papua New Guinea',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Port Moresby Hub', 'Flag Carrier', 'Pacific Network'],
    image: '',
    cardImage: '',
    description:
      'Air Niugini is the flag carrier of Papua New Guinea, operating domestic and regional international routes.',
    fleet: 'Boeing 737, 767, Fokker 70, Fokker 100',
    region: 'Oceania',
  },
  {
    id: 'airjuan',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/air-juan.png',
    name: 'Air Juan',
    location: 'Philippines',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Regional Carrier', 'Island Routes', 'Charter Services'],
    image: '',
    cardImage: '',
    description:
      'Air Juan is a Philippine regional carrier operating inter-island flights and charter services.',
    fleet: 'ATR 72, DHC-6',
    region: 'Asia',
  },
  {
    id: 'cebgo',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/cebgo.png',
    name: 'Cebgo',
    location: 'Philippines',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Cebu Hub', 'Cebu Pacific Subsidiary', 'Regional Carrier'],
    image: '',
    cardImage: '',
    description:
      'Cebgo is the regional subsidiary of Cebu Pacific, operating inter-island routes in the Philippines.',
    fleet: 'ATR 72',
    region: 'Asia',
  },
  {
    id: 'palexpress',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/pal-express.svg',
    name: 'PAL Express',
    location: 'Philippines',
    salaryRange: '$25,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'PAL Subsidiary', 'Regional Carrier'],
    image: '',
    cardImage: '',
    description:
      'PAL Express is the regional subsidiary of Philippine Airlines, operating domestic routes.',
    fleet: 'Airbus A320, ATR 72, De Havilland Q400',
    region: 'Asia',
  },
  {
    id: 'philairasia',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/philippines-airasia.svg',
    name: 'Philippines AirAsia',
    location: 'Philippines',
    salaryRange: '$25,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'AirAsia Group', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Philippines AirAsia is the Philippine affiliate of the AirAsia group, operating domestic and regional routes.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'royalair',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/royal-air-philippines.png',
    name: 'Royal Air Philippines',
    location: 'Philippines',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Charter Carrier', 'Domestic Routes'],
    image: '',
    cardImage: '',
    description: 'Royal Air Philippines is a charter and domestic carrier operating from Manila.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'skypasada',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/sky-pasada.png',
    name: 'Sky Pasada',
    location: 'Philippines',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '500+ hrs TT',
    tags: ['Regional Carrier', 'Mountain Routes', 'Inter-Island'],
    image: '',
    cardImage: '',
    description:
      'Sky Pasada is a Philippine regional carrier specializing in inter-island and mountain routes.',
    fleet: 'DHC-6 Twin Otter',
    region: 'Asia',
  },
  {
    id: 'skyjet',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/skyjet-airlines.png',
    name: 'SkyJet Airlines',
    location: 'Philippines',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Premium Service', 'Domestic Routes'],
    image: '',
    cardImage: '',
    description:
      'SkyJet Airlines is a Philippine premium carrier operating domestic routes to popular tourist destinations.',
    fleet: 'British Aerospace 146 (BAe 146)',
    region: 'Asia',
  },
  {
    id: 'sunlightair',
    logo: '/images/airline-logos/APAC/philippines/regional-operators/sunlight-air.png',
    name: 'Sunlight Air',
    location: 'Philippines',
    salaryRange: '$20,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Regional Carrier', 'Inter-Island', 'Tourism Focus'],
    image: '',
    cardImage: '',
    description:
      'Sunlight Air is a Philippine regional carrier operating inter-island flights to tourist destinations.',
    fleet: 'ATR 72',
    region: 'Asia',
  },
  {
    id: 'samoaairways',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/samoa/international-operators/samoa-airways-aircraft.jpg',
    name: 'Samoa Airways',
    location: 'Samoa',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Apia Hub', 'Flag Carrier', 'South Pacific'],
    image: '',
    cardImage: '',
    description:
      'Samoa Airways is the flag carrier of Samoa, operating inter-island and regional routes from Apia.',
    fleet: 'De Havilland Canada DHC-6, Saab 340',
    region: 'Oceania',
  },
  {
    id: 'solomonairlines',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/solomon-islands/international-operators/solomon-airlines-aircraft.jpg',
    name: 'Solomon Airlines',
    location: 'Solomon Islands',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Honiara Hub', 'Flag Carrier', 'Pacific Islands'],
    image: '',
    cardImage: '',
    description:
      'Solomon Airlines is the flag carrier of the Solomon Islands, operating domestic and regional international routes.',
    fleet: 'Airbus A320, De Havilland Canada DHC-6, DHC-3',
    region: 'Oceania',
  },
  {
    id: 'airbusan',
    logo: '/images/airline-logos/APAC/south-korea/regional-operators/air-busan.svg',
    name: 'Air Busan',
    location: 'South Korea',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Busan Hub', 'Asiana Subsidiary', 'Regional Carrier'],
    image: '',
    cardImage: '',
    description:
      'Air Busan is a regional carrier and subsidiary of Asiana Airlines, operating from Busan.',
    fleet: 'Airbus A320, A321',
    region: 'Asia',
  },
  {
    id: 'airseoul',
    logo: '/images/airline-logos/APAC/south-korea/regional-operators/air-seoul.svg',
    name: 'Air Seoul',
    location: 'South Korea',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Asiana Subsidiary', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Air Seoul is a low-cost carrier and subsidiary of Asiana Airlines, operating from Incheon.',
    fleet: 'Airbus A320, A321',
    region: 'Asia',
  },
  {
    id: 'eastarjet',
    logo: '/images/airline-logos/APAC/south-korea/regional-operators/eastar-jet.svg',
    name: 'Eastar Jet',
    location: 'South Korea',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Low-Cost Carrier', 'Regional Network'],
    image: '',
    cardImage: '',
    description:
      'Eastar Jet is a South Korean low-cost carrier operating domestic and regional international routes.',
    fleet: 'Boeing 737',
    region: 'Asia',
  },
  {
    id: 'jejuair',
    logo: '/images/airline-logos/APAC/south-korea/regional-operators/jeju-air.svg',
    name: 'Jeju Air',
    location: 'South Korea',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Jeju Hub', 'Largest Korean LCC', 'Asia Network'],
    image: '',
    cardImage: '',
    description:
      "Jeju Air is South Korea's largest low-cost carrier, operating domestic and international routes.",
    fleet: 'Boeing 737-800',
    region: 'Asia',
  },
  {
    id: 'twayair',
    logo: '/images/airline-logos/APAC/south-korea/regional-operators/tway-air.svg',
    name: "T'way Air",
    location: 'South Korea',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Low-Cost Carrier', 'Asia Network'],
    image: '',
    cardImage: '',
    description:
      "T'way Air is a South Korean low-cost carrier operating domestic and regional international routes.",
    fleet: 'Boeing 737',
    region: 'Asia',
  },
  {
    id: 'chinaairlines',
    logo: '/images/airline-logos/APAC/taiwan/international-operators/china-airlines.png',
    name: 'China Airlines',
    location: 'Taiwan',
    salaryRange: '$60,000 - $130,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', 'SkyTeam', 'Flag Carrier'],
    image: '',
    cardImage: '',
    description:
      'China Airlines is the flag carrier of Taiwan, operating an extensive international network from Taipei.',
    fleet: 'Boeing 777, 747, 787, Airbus A350, A330, A321neo',
    region: 'Asia',
  },
  {
    id: 'evaair',
    logo: '/images/airline-logos/APAC/taiwan/international-operators/eva-air.svg',
    name: 'EVA Air',
    location: 'Taiwan',
    salaryRange: '$60,000 - $130,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', '5-Star Airline', 'Star Alliance'],
    image: '',
    cardImage: '',
    description:
      'EVA Air is a 5-star Taiwanese airline operating from Taipei with an extensive global network.',
    fleet: 'Boeing 777, 787, Airbus A330, A321',
    region: 'Asia',
  },
  {
    id: 'starlux',
    logo: '/images/airline-logos/APAC/taiwan/international-operators/starlux-airlines.svg',
    name: 'Starlux Airlines',
    location: 'Taiwan',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', 'Premium Carrier', 'New Airline'],
    image: '',
    cardImage: '',
    description:
      'Starlux Airlines is a premium Taiwanese carrier launched in 2020, operating from Taipei with a modern fleet.',
    fleet: 'Airbus A321neo, A330neo, A350',
    region: 'Asia',
  },
  {
    id: 'mandarin',
    logo: '/images/airline-logos/APAC/taiwan/regional-operators/mandarin-airlines.svg',
    name: 'Mandarin Airlines',
    location: 'Taiwan',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'China Airlines Subsidiary', 'Regional Carrier'],
    image: '',
    cardImage: '',
    description:
      'Mandarin Airlines is a regional subsidiary of China Airlines, operating domestic and regional routes.',
    fleet: 'ATR 72, Airbus A321',
    region: 'Asia',
  },
  {
    id: 'tigerairtw',
    logo: '/images/airline-logos/APAC/taiwan/regional-operators/tigerair-taiwan.svg',
    name: 'Tigerair Taiwan',
    location: 'Taiwan',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'Low-Cost Carrier', 'Domestic & Regional'],
    image: '',
    cardImage: '',
    description:
      'Tigerair Taiwan is a low-cost carrier operating domestic and regional routes from Taipei.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'uniair',
    logo: '/images/airline-logos/APAC/taiwan/regional-operators/uni-air.png',
    name: 'UNI Air',
    location: 'Taiwan',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'EVA Air Subsidiary', 'Regional Carrier'],
    image: '',
    cardImage: '',
    description:
      'UNI Air is a regional subsidiary of EVA Air, operating domestic and regional routes in Taiwan.',
    fleet: 'ATR 72, Airbus A321',
    region: 'Asia',
  },
  {
    id: 'bangkokair',
    logo: '/images/airline-logos/APAC/thailand/regional-operators/bangkok-airways.svg',
    heroImage:
      '/images/airline-logos/APAC/thailand/regional-operators/bangkok-airways-aircraft.jpg',
    name: 'Bangkok Airways',
    location: 'Thailand',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Premium Regional', 'Asia Network'],
    image: '',
    cardImage: '',
    description:
      'Bangkok Airways is a regional carrier operating from Bangkok with premium service to destinations across Asia.',
    fleet: 'Airbus A319, A320, ATR 72',
    region: 'Asia',
  },
  {
    id: 'nokair',
    logo: '/images/airline-logos/APAC/thailand/regional-operators/nok-air.jpg',
    name: 'Nok Air',
    location: 'Thailand',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Low-Cost Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Nok Air is a Thai low-cost carrier operating domestic and regional routes from Bangkok.',
    fleet: 'Boeing 737, 737 MAX, De Havilland Q400',
    region: 'Asia',
  },
  {
    id: 'thaiairasia',
    logo: '/images/airline-logos/APAC/thailand/regional-operators/thai-airasia.png',
    name: 'Thai AirAsia',
    location: 'Thailand',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'AirAsia Group', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Thai AirAsia is the Thai affiliate of AirAsia, operating domestic and regional international routes.',
    fleet: 'Airbus A320',
    region: 'Asia',
  },
  {
    id: 'thailionair',
    logo: '/images/airline-logos/APAC/thailand/regional-operators/thai-lion-air.svg',
    name: 'Thai Lion Air',
    location: 'Thailand',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Lion Air Group', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Thai Lion Air is the Thai affiliate of the Lion Air Group, operating domestic and regional routes.',
    fleet: 'Boeing 737, 737 MAX',
    region: 'Asia',
  },
  {
    id: 'airvanuatu',
    logo: '',
    heroImage:
      '/images/airline-logos/APAC/vanuatu/international-operators/air-vanuatu-aircraft.jpg',
    name: 'Air Vanuatu',
    location: 'Vanuatu',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Port Vila Hub', 'Flag Carrier', 'South Pacific'],
    image: '',
    cardImage: '',
    description:
      'Air Vanuatu is the flag carrier of Vanuatu, operating domestic and regional international routes from Port Vila.',
    fleet: 'ATR 72, De Havilland Canada DHC-6, Boeing 737',
    region: 'Oceania',
  },
  {
    id: 'bambooairways',
    logo: '/images/airline-logos/APAC/vietnam/regional-operators/bamboo-airways.svg',
    heroImage: '/images/airline-logos/APAC/vietnam/regional-operators/bamboo-airways-aircraft.jpg',
    name: 'Bamboo Airways',
    location: 'Vietnam',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Hanoi Hub', 'Hybrid Carrier', 'Domestic & International'],
    image: '',
    cardImage: '',
    description:
      'Bamboo Airways is a Vietnamese carrier offering both domestic and international service with a modern fleet.',
    fleet: 'Boeing 787, 777, Airbus A320, A321',
    region: 'Asia',
  },
  {
    id: 'vietjet',
    logo: '/images/airline-logos/APAC/vietnam/regional-operators/vietjet-air.svg',
    name: 'VietJet Air',
    location: 'Vietnam',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ho Chi Minh Hub', 'Low-Cost Carrier', 'Domestic Leader'],
    image: '',
    cardImage: '',
    description:
      "VietJet Air is Vietnam's largest low-cost carrier, operating domestic and regional international routes.",
    fleet: 'Airbus A320, A321, A330',
    region: 'Asia',
  },
  {
    id: 'fly540',
    logo: '/images/airline-logos/africa/kenya/regional-operators/fly540.png',
    heroImage: '/images/airline-logos/africa/kenya/regional-operators/fly540-aircraft.jpg',
    name: 'Fly540',
    location: 'Kenya',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Nairobi Hub', 'Low-Cost Carrier', 'East Africa'],
    image: '',
    cardImage: '',
    description:
      'Fly540 is a Kenyan low-cost carrier operating domestic and regional routes in East Africa.',
    fleet: 'Bombardier CRJ, ATR 72',
    region: 'Africa',
  },
  {
    id: 'flysafair',
    logo: '/images/airline-logos/africa/south-africa/regional-operators/flysafair.png',
    heroImage:
      '/images/airline-logos/africa/south-africa/regional-operators/flysafair-aircraft.jpg',
    name: 'FlySafair',
    location: 'South Africa',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Johannesburg Hub', 'Low-Cost Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'FlySafair is a South African low-cost carrier operating domestic routes with an all-Boeing fleet.',
    fleet: 'Boeing 737-400, 737-800',
    region: 'Africa',
  },
  {
    id: 'jambojet',
    logo: '/images/airline-logos/africa/kenya/regional-operators/jambojet.png',
    heroImage: '/images/airline-logos/africa/kenya/regional-operators/jambojet-aircraft.jpg',
    name: 'Jambojet',
    location: 'Kenya',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Nairobi Hub', 'Kenya Airways Subsidiary', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Jambojet is a low-cost subsidiary of Kenya Airways, operating domestic and regional routes.',
    fleet: 'Boeing 737, De Havilland Q400',
    region: 'Africa',
  },
  {
    id: 'mango',
    logo: '',
    heroImage: '/images/airline-logos/africa/south-africa/regional-operators/mango-aircraft.jpg',
    name: 'Mango Airlines',
    location: 'South Africa',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Johannesburg Hub', 'SAA Subsidiary', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Mango Airlines was a low-cost subsidiary of South African Airways, operating domestic routes.',
    fleet: 'Boeing 737-800',
    region: 'Africa',
  },
  {
    id: 'airmauritius',
    logo: '/images/airline-logos/africa/mauritius/international-operators/air-mauritius.svg',
    heroImage:
      '/images/airline-logos/africa/mauritius/international-operators/air-mauritius-aircraft.jpg',
    name: 'Air Mauritius',
    location: 'Mauritius',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Port Louis Hub', 'Flag Carrier', 'Indian Ocean'],
    image: '',
    cardImage: '',
    description:
      'Air Mauritius is the flag carrier of Mauritius, connecting the Indian Ocean island with Africa, Asia, and Europe.',
    fleet: 'Airbus A350, A330neo, ATR 72',
    region: 'Africa',
  },
  {
    id: 'kenyaairways',
    logo: '/images/airline-logos/africa/kenya/international-operators/kenya-airways.svg',
    name: 'Kenya Airways',
    location: 'Kenya',
    salaryRange: '$40,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Nairobi Hub', 'SkyTeam', 'African Leader'],
    image: '',
    cardImage: '',
    description:
      'Kenya Airways is the flag carrier of Kenya, operating from Nairobi to destinations across Africa, Europe, and Asia.',
    fleet: 'Boeing 787, 737, Embraer E190',
    region: 'Africa',
  },
  {
    id: 'royalairmaroc',
    logo: '/images/airline-logos/africa/morocco/international-operators/royal-air-maroc.svg',
    name: 'Royal Air Maroc',
    location: 'Morocco',
    salaryRange: '$40,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Casablanca Hub', 'Oneworld', 'North African Leader'],
    image: '',
    cardImage: '',
    description:
      'Royal Air Maroc is the flag carrier of Morocco and a Oneworld member, operating from Casablanca.',
    fleet: 'Boeing 787, 737, 747, Airbus A320',
    region: 'Africa',
  },
  {
    id: 'tunisair',
    logo: '/images/airline-logos/africa/tunisia/international-operators/tunisair.svg',
    name: 'Tunisair',
    location: 'Tunisia',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Tunis Hub', 'Flag Carrier', 'North Africa'],
    image: '',
    cardImage: '',
    description:
      'Tunisair is the flag carrier of Tunisia, operating from Tunis to destinations in Europe, Africa, and the Middle East.',
    fleet: 'Airbus A330, A320, Boeing 737',
    region: 'Africa',
  },
  {
    id: 'airalgerie',
    logo: '/images/airline-logos/africa/algeria/international-operators/air-algerie.svg',
    name: 'Air Algérie',
    location: 'Algeria',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Algiers Hub', 'Flag Carrier', 'North Africa'],
    image: '',
    cardImage: '',
    description:
      'Air Algérie is the flag carrier of Algeria, operating domestic and international routes from Algiers.',
    fleet: 'Airbus A330, A320, Boeing 737, 767',
    region: 'Africa',
  },
  {
    id: 'rwandair',
    logo: '/images/airline-logos/africa/rwanda/international-operators/rwandair.svg',
    name: 'RwandAir',
    location: 'Rwanda',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kigali Hub', 'Flag Carrier', 'East Africa'],
    image: '',
    cardImage: '',
    description:
      'RwandAir is the flag carrier of Rwanda, operating from Kigali to destinations across Africa, Europe, and the Middle East.',
    fleet: 'Airbus A330, Boeing 737, CRJ-900',
    region: 'Africa',
  },
  {
    id: 'airseychelles',
    logo: '/images/airline-logos/africa/seychelles/international-operators/air-seychelles.svg',
    name: 'Air Seychelles',
    location: 'Seychelles',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Victoria Hub', 'Flag Carrier', 'Indian Ocean'],
    image: '',
    cardImage: '',
    description:
      'Air Seychelles is the flag carrier of Seychelles, operating domestic inter-island and international routes.',
    fleet: 'Airbus A320, A320neo, De Havilland Canada DHC-6',
    region: 'Africa',
  },
  {
    id: 'aircanadarouge',
    logo: '/images/airline-logos/americas/canada/regional-operators/air-canada-rouge.svg',
    heroImage:
      '/images/airline-logos/americas/canada/regional-operators/air-canada-rouge-aircraft.jpg',
    name: 'Air Canada Rouge',
    location: 'Canada',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Air Canada Subsidiary', 'Leisure Carrier'],
    image: '',
    cardImage: '',
    description:
      'Air Canada Rouge is the leisure subsidiary of Air Canada, operating vacation routes with a mixed fleet.',
    fleet: 'Airbus A319, A320, A321, Boeing 767',
    region: 'Americas',
  },
  {
    id: 'spirit',
    logo: '/images/airline-logos/americas/united-states/regional-operators/spirit.svg',
    heroImage:
      '/images/airline-logos/americas/united-states/regional-operators/spirit-aircraft.jpg',
    name: 'Spirit Airlines',
    location: 'United States',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Fort Lauderdale Hub', 'Ultra-Low-Cost', 'Large Network'],
    image: '',
    cardImage: '',
    description:
      'Spirit Airlines is a major US ultra-low-cost carrier operating an extensive network across the Americas.',
    fleet: 'Airbus A320, A319, A321, A320neo',
    region: 'Americas',
  },
  {
    id: 'frontier',
    logo: '/images/airline-logos/americas/united-states/regional-operators/frontier.svg',
    name: 'Frontier Airlines',
    location: 'United States',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Denver Hub', 'Ultra-Low-Cost', 'Airbus Fleet'],
    image: '',
    cardImage: '',
    description:
      'Frontier Airlines is a US ultra-low-cost carrier operating from Denver with an all-Airbus fleet.',
    fleet: 'Airbus A320, A321, A320neo',
    region: 'Americas',
  },
  {
    id: 'allegiant',
    logo: '/images/airline-logos/americas/united-states/regional-operators/allegiant.svg',
    name: 'Allegiant Air',
    location: 'United States',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Las Vegas Hub', 'Leisure Carrier', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      'Allegiant Air is a US low-cost carrier focused on leisure routes from Las Vegas and other focus cities.',
    fleet: 'Airbus A320, A319',
    region: 'Americas',
  },
  {
    id: 'hawaiian',
    logo: '/images/airline-logos/americas/united-states/regional-operators/hawaiian-airlines.svg',
    name: 'Hawaiian Airlines',
    location: 'United States',
    salaryRange: '$55,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Honolulu Hub', 'Flag Carrier of Hawaii', 'Pacific Network'],
    image: '',
    cardImage: '',
    description:
      'Hawaiian Airlines is the flag carrier of Hawaii, operating inter-island and long-haul Pacific routes.',
    fleet: 'Airbus A330, A321neo, Boeing 787',
    region: 'Americas',
  },
  {
    id: 'airtransat',
    logo: '/images/airline-logos/americas/canada/regional-operators/air-transat.svg',
    name: 'Air Transat',
    location: 'Canada',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Montreal Hub', 'Leisure Carrier', 'International Routes'],
    image: '',
    cardImage: '',
    description:
      'Air Transat is a Canadian leisure carrier operating international vacation routes from Montreal and Toronto.',
    fleet: 'Airbus A330, A321, A321neo',
    region: 'Americas',
  },
  {
    id: 'porter',
    logo: '/images/airline-logos/americas/canada/regional-operators/porter-airlines.svg',
    name: 'Porter Airlines',
    location: 'Canada',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Regional Carrier', 'Premium Service'],
    image: '',
    cardImage: '',
    description:
      'Porter Airlines is a Canadian regional carrier operating from Toronto with premium service.',
    fleet: 'De Havilland Q400, Embraer E195-E2',
    region: 'Americas',
  },
  {
    id: 'azul',
    logo: '/images/airline-logos/americas/brazil/regional-operators/azul.svg',
    name: 'Azul Brazilian Airlines',
    location: 'Brazil',
    salaryRange: '$40,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Sao Paulo Hub', 'Largest Brazilian LCC', 'Domestic Network'],
    image: '',
    cardImage: '',
    description:
      "Azul is Brazil's largest low-cost carrier, operating an extensive domestic and regional network.",
    fleet: 'Embraer E190, E195, Airbus A320, A330, ATR 72',
    region: 'Americas',
  },
  {
    id: 'aerolineas',
    logo: '/images/airline-logos/americas/argentina/international-operators/aerolineas-argentinas.svg',
    name: 'Aerolíneas Argentinas',
    location: 'Argentina',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Buenos Aires Hub', 'Flag Carrier', 'SkyTeam'],
    image: '',
    cardImage: '',
    description:
      'Aerolíneas Argentinas is the flag carrier of Argentina, operating domestic and international routes from Buenos Aires.',
    fleet: 'Airbus A330, A320, Boeing 737',
    region: 'Americas',
  },
  {
    id: 'skyairline',
    logo: '/images/airline-logos/americas/chile/regional-operators/sky-airline.svg',
    name: 'Sky Airline',
    location: 'Chile',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'Low-Cost Carrier', 'South America'],
    image: '',
    cardImage: '',
    description:
      'Sky Airline is a Chilean low-cost carrier operating domestic and regional routes from Santiago.',
    fleet: 'Airbus A320, A320neo',
    region: 'Americas',
  },
  {
    id: 'jetsmart',
    logo: '/images/airline-logos/americas/chile/regional-operators/jetsmart.svg',
    name: 'JetSMART',
    location: 'Chile',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'Ultra-Low-Cost', 'South America'],
    image: '',
    cardImage: '',
    description:
      'JetSMART is a South American ultra-low-cost carrier operating from Santiago, Chile.',
    fleet: 'Airbus A320, A320neo, A321neo',
    region: 'Americas',
  },
  {
    id: 'airmalta',
    logo: '/images/airline-logos/europe/malta/international-operators/air-malta.svg',
    heroImage: '/images/airline-logos/europe/malta/international-operators/air-malta-aircraft.jpg',
    name: 'Air Malta',
    location: 'Malta',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Malta Hub', 'Flag Carrier', 'Mediterranean'],
    image: '',
    cardImage: '',
    description:
      'Air Malta is the flag carrier of Malta, connecting the Mediterranean island with European destinations.',
    fleet: 'Airbus A320, A320neo',
    region: 'Europe',
  },
  {
    id: 'airserbia',
    logo: '/images/airline-logos/europe/serbia/international-operators/air-serbia.svg',
    heroImage:
      '/images/airline-logos/europe/serbia/international-operators/air-serbia-aircraft.jpg',
    name: 'Air Serbia',
    location: 'Serbia',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Belgrade Hub', 'Flag Carrier', 'Balkan Network'],
    image: '',
    cardImage: '',
    description:
      'Air Serbia is the flag carrier of Serbia, operating from Belgrade to European and international destinations.',
    fleet: 'Airbus A330, A320, ATR 72, Boeing 737',
    region: 'Europe',
  },
  {
    id: 'croatiaair',
    logo: '/images/airline-logos/europe/croatia/international-operators/croatia-airlines.svg',
    heroImage:
      '/images/airline-logos/europe/croatia/international-operators/croatia-airlines-aircraft.jpg',
    name: 'Croatia Airlines',
    location: 'Croatia',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Zagreb Hub', 'Flag Carrier', 'Star Alliance'],
    image: '',
    cardImage: '',
    description:
      'Croatia Airlines is the flag carrier of Croatia, operating from Zagreb to European destinations.',
    fleet: 'Airbus A320, A319, De Havilland Q400',
    region: 'Europe',
  },
  {
    id: 'tarom',
    logo: '/images/airline-logos/europe/romania/international-operators/tarom.svg',
    heroImage: '/images/airline-logos/europe/romania/international-operators/tarom-aircraft.jpg',
    name: 'TAROM',
    location: 'Romania',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bucharest Hub', 'Flag Carrier', 'SkyTeam'],
    image: '',
    cardImage: '',
    description:
      'TAROM is the flag carrier of Romania, operating from Bucharest to European and Middle Eastern destinations.',
    fleet: 'Airbus A318, ATR 72, Boeing 737',
    region: 'Europe',
  },
  {
    id: 'uia',
    logo: '/images/airline-logos/europe/ukraine/international-operators/ukraine-international-airlines.svg',
    heroImage:
      '/images/airline-logos/europe/ukraine/international-operators/ukraine-international-airlines-aircraft.jpg',
    name: 'Ukraine International Airlines',
    location: 'Ukraine',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kyiv Hub', 'Flag Carrier', 'European Network'],
    image: '',
    cardImage: '',
    description:
      'UIA is the flag carrier of Ukraine, operating from Kyiv to European and international destinations.',
    fleet: 'Boeing 777, 737, 767, Embraer E190',
    region: 'Europe',
  },
  {
    id: 'ryanair',
    logo: '/images/airline-logos/europe/ireland/international-operators/ryanair.svg',
    name: 'Ryanair',
    location: 'Ireland',
    salaryRange: '$40,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Dublin Hub', "Europe's Largest LCC", 'Boeing Fleet'],
    image: '',
    cardImage: '',
    description:
      "Ryanair is Europe's largest low-cost carrier, operating an extensive network from Dublin and many European bases.",
    fleet: 'Boeing 737-800, 737 MAX',
    region: 'Europe',
  },
  {
    id: 'easyjet',
    logo: '/images/airline-logos/europe/united-kingdom/regional-operators/easyjet.svg',
    name: 'easyJet',
    location: 'United Kingdom',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['London Hub', 'Major LCC', 'Airbus Fleet'],
    image: '',
    cardImage: '',
    description:
      'easyJet is a major European low-cost carrier operating from London and other European bases with an all-Airbus fleet.',
    fleet: 'Airbus A320, A319, A320neo, A321neo',
    region: 'Europe',
  },
  {
    id: 'wizzair',
    logo: '/images/airline-logos/europe/hungary/international-operators/wizz-air.svg',
    name: 'Wizz Air',
    location: 'Hungary',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Budapest Hub', 'Ultra-Low-Cost', 'Eastern Europe'],
    image: '',
    cardImage: '',
    description:
      'Wizz Air is a Hungarian ultra-low-cost carrier focused on Eastern Europe with an all-Airbus fleet.',
    fleet: 'Airbus A320, A321, A321neo',
    region: 'Europe',
  },
  {
    id: 'vueling',
    logo: '/images/airline-logos/europe/spain/regional-operators/vueling.svg',
    name: 'Vueling',
    location: 'Spain',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Barcelona Hub', 'IAG Group', 'Low-Cost Carrier'],
    image: '',
    cardImage: '',
    description:
      'Vueling is a Spanish low-cost carrier in the IAG group, operating from Barcelona across Europe.',
    fleet: 'Airbus A320, A319, A321',
    region: 'Europe',
  },
  {
    id: 'aireuropa',
    logo: '/images/airline-logos/europe/spain/regional-operators/air-europa.svg',
    name: 'Air Europa',
    location: 'Spain',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Madrid Hub', 'SkyTeam', 'Long-Haul Carrier'],
    image: '',
    cardImage: '',
    description:
      'Air Europa is a Spanish airline operating domestic, European, and long-haul routes from Madrid.',
    fleet: 'Boeing 787, 737, Airbus A330, Embraer E195',
    region: 'Europe',
  },
  {
    id: 'jet2',
    logo: '/images/airline-logos/europe/united-kingdom/regional-operators/jet2.svg',
    name: 'Jet2.com',
    location: 'United Kingdom',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Leeds Hub', 'Leisure Carrier', 'European Routes'],
    image: '',
    cardImage: '',
    description:
      'Jet2.com is a British leisure carrier operating holiday routes from multiple UK bases.',
    fleet: 'Boeing 737, 737 MAX, 757, Airbus A321',
    region: 'Europe',
  },
  {
    id: 'tui',
    logo: '/images/airline-logos/europe/united-kingdom/regional-operators/tui-airways.svg',
    name: 'TUI Airways',
    location: 'United Kingdom',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['London Hub', 'Leisure Carrier', 'Holiday Routes'],
    image: '',
    cardImage: '',
    description:
      'TUI Airways is a British leisure carrier operating holiday flights to destinations worldwide.',
    fleet: 'Boeing 787, 737, 767, 757',
    region: 'Europe',
  },
  {
    id: 'aeroflot',
    logo: '/images/airline-logos/europe/russia/international-operators/aeroflot.svg',
    name: 'Aeroflot',
    location: 'Russia',
    salaryRange: '$45,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Moscow Hub', 'Flag Carrier', 'Largest Russian Airline'],
    image: '',
    cardImage: '',
    description:
      'Aeroflot is the flag carrier and largest airline of Russia, operating from Moscow to worldwide destinations.',
    fleet: 'Airbus A350, A330, A320, Boeing 777, 737, Sukhoi Superjet',
    region: 'Europe',
  },
  {
    id: 'airbaltic',
    logo: '/images/airline-logos/europe/latvia/international-operators/airbaltic.svg',
    name: 'airBaltic',
    location: 'Latvia',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Riga Hub', 'Flag Carrier', 'Baltic Region'],
    image: '',
    cardImage: '',
    description:
      'airBaltic is the flag carrier of Latvia, operating from Riga across the Baltic region and Europe.',
    fleet: 'Airbus A220-300',
    region: 'Europe',
  },
  {
    id: 'flydubai',
    logo: '/images/airline-logos/middle-east/united-arab-emirates/regional-operators/flydubai.svg',
    heroImage:
      '/images/airline-logos/middle-east/united-arab-emirates/regional-operators/flydubai-aircraft.jpg',
    name: 'flydubai',
    location: 'United Arab Emirates',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Dubai Hub', 'Low-Cost Carrier', 'Middle East Network'],
    image: '',
    cardImage: '',
    description:
      'flydubai is a low-cost carrier based in Dubai, operating regional and medium-haul routes complementing Emirates.',
    fleet: 'Boeing 737, 737 MAX',
    region: 'Middle East',
  },
  {
    id: 'flynas',
    logo: '/images/airline-logos/middle-east/saudi-arabia/regional-operators/flynas.svg',
    heroImage:
      '/images/airline-logos/middle-east/saudi-arabia/regional-operators/flynas-aircraft.jpg',
    name: 'flynas',
    location: 'Saudi Arabia',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Riyadh Hub', 'Low-Cost Carrier', 'Middle East Network'],
    image: '',
    cardImage: '',
    description:
      'flynas is a Saudi low-cost carrier operating domestic and regional routes from Riyadh.',
    fleet: 'Airbus A320, A320neo, A321neo',
    region: 'Middle East',
  },
  {
    id: 'gulfair',
    logo: '/images/airline-logos/middle-east/bahrain/international-operators/gulf-air.svg',
    name: 'Gulf Air',
    location: 'Bahrain',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Manama Hub', 'Flag Carrier', 'Middle East Network'],
    image: '',
    cardImage: '',
    description:
      'Gulf Air is the flag carrier of Bahrain, operating from Manama to destinations across the Middle East, Asia, and Europe.',
    fleet: 'Boeing 787, 737, Airbus A320, A321neo',
    region: 'Middle East',
  },
  {
    id: 'kuwaitairways',
    logo: '/images/airline-logos/middle-east/kuwait/international-operators/kuwait-airways.svg',
    name: 'Kuwait Airways',
    location: 'Kuwait',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kuwait City Hub', 'Flag Carrier', 'Middle East Network'],
    image: '',
    cardImage: '',
    description:
      'Kuwait Airways is the flag carrier of Kuwait, operating from Kuwait City to destinations in the Middle East, Asia, Europe, and North America.',
    fleet: 'Boeing 777, 787, Airbus A320, A330, A350',
    region: 'Middle East',
  },
  {
    id: 'airarabia',
    logo: '/images/airline-logos/middle-east/united-arab-emirates/regional-operators/air-arabia.svg',
    name: 'Air Arabia',
    location: 'United Arab Emirates',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Sharjah Hub', 'Low-Cost Carrier', 'Middle East Network'],
    image: '',
    cardImage: '',
    description:
      'Air Arabia is the first and largest low-cost carrier in the Middle East, operating from Sharjah across the region.',
    fleet: 'Airbus A320, A320neo, A321',
    region: 'Middle East',
  },
  {
    id: 'airastana',
    logo: '/images/airline-logos/APAC/kazakhstan/international-operators/air-astana.svg',
    name: 'Air Astana',
    location: 'Kazakhstan',
    salaryRange: '$40,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Almaty Hub', 'Flag Carrier', 'Central Asia'],
    image: '',
    cardImage: '',
    description:
      'Air Astana is the flag carrier of Kazakhstan, operating from Almaty and Astana to domestic and international destinations.',
    fleet: 'Airbus A320, A321, A321neo, Boeing 767, 787, Embraer E190',
    region: 'Asia',
  },
  {
    id: 'uzbekistanairways',
    logo: '/images/airline-logos/APAC/uzbekistan/international-operators/uzbekistan-airways-logo.svg',
    name: 'Uzbekistan Airways',
    location: 'Uzbekistan',
    salaryRange: '$35,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Tashkent Hub', 'Flag Carrier', 'Central Asia'],
    image: '',
    cardImage: '',
    description:
      'Uzbekistan Airways is the flag carrier of Uzbekistan, operating from Tashkent to domestic and international destinations.',
    fleet: 'Boeing 787, 767, 757, Airbus A320, Il-114',
    region: 'Asia',
  },
  {
    id: 'azerbaijan',
    logo: '/images/airline-logos/APAC/azerbaijan/international-operators/azerbaijan-airlines.svg',
    name: 'Azerbaijan Airlines',
    location: 'Azerbaijan',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Baku Hub', 'Flag Carrier', 'Caspian Region'],
    image: '',
    cardImage: '',
    description:
      'Azerbaijan Airlines is the flag carrier of Azerbaijan, operating from Baku to domestic and international destinations.',
    fleet: 'Airbus A340, A330, A320, Boeing 787, 767, 757',
    region: 'Asia',
  },
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
  {
    title: 'Screening',
    desc: 'Digital audit of your ATLAS CV and minimum legal credentials.',
    icon: Search,
  },
  {
    title: 'Psychometrics',
    desc: 'Cognitive ability, spatial awareness, and personality fit testing.',
    icon: Target,
  },
  {
    title: 'Technical / HR',
    desc: 'Competency-based interviews and SOP knowledge assessment.',
    icon: Briefcase,
  },
  {
    title: 'Simulator Audit',
    desc: 'Practical EBT/CBTA competency demonstration in multi-crew environment.',
    icon: Zap,
  },
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
  const { userProfile } = useAuth();
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const [activeTab, setActiveTab] = useState('Overview');
  const hasRecognitionAccess = userProfile?.isRecognitionPlusMember ?? false;

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

  const filteredAirlines = AIRLINES.filter((a) => {
    const matchesRegion = regionFilter === 'All' || a.region === regionFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    return matchesRegion && matchesSearch;
  });

  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const card = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="min-h-screen relative text-slate-900 font-sans">
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={['#ffffff', '#f8fbff', '#f0f7ff', '#e8f5ff']}
          speed={1.0}
        />
      </div>
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-0" />

      {/* Top Navigation Bar */}
      <PlatformNavbar
        onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
        currentPage="pathways"
        transparent={false}
      />

      {/* Sidebar Navigation */}
      <PathwaysSidebar
        activeSection="airline-expectations"
        onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
      />

      {/* Main Content with sidebar margin */}
      <div style={{ marginLeft: '280px', paddingTop: '2rem' }}>
        {selectedAirline ? (
          <AirlineShowcaseHero
            airline={selectedAirline}
            hasRecognitionAccess={hasRecognitionAccess}
            onClear={() => setSelectedAirline(null)}
          />
        ) : (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden pt-16 pb-12 px-6 z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-purple-900/20 pointer-events-none" />
              <div className="max-w-4xl mx-auto text-center relative z-10">
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3">
                  <span className="text-black">Discover</span>{' '}
                  <span className="text-red-600">Expectations</span>
                </p>
                <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4">
                  <span className="text-black">Airline </span>
                  <span className="text-red-600">Expectations</span>
                  <span className="text-black"> Search</span>
                </h1>
                <p
                  className="text-lg md:text-xl mb-2 text-red-600"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Requirements · Expectations · Career Pathways
                </p>
                <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-black mt-4">
                  Understanding what airlines really look for—beyond the 1,500-hour requirement. We
                  bridge the gap between "having the hours" and "being the right candidate" through
                  AI-powered pathway matching.
                </p>

                {/* Search + Region Filter */}
                <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${subtext}`}
                    />
                    <input
                      type="text"
                      placeholder="Search airlines, locations, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div className="relative sm:w-44">
                    <select
                      value={regionFilter}
                      onChange={(e) => {
                        setRegionFilter(e.target.value as Region);
                        setSelectedAirline(null);
                      }}
                      className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all bg-white border-slate-300 text-slate-900 cursor-pointer"
                    >
                      {(
                        [
                          'All',
                          'Asia',
                          'Europe',
                          'Americas',
                          'Oceania',
                          'Africa',
                          'Middle East',
                        ] as Region[]
                      ).map((r) => (
                        <option key={r} value={r}>
                          {r === 'All' ? 'All Regions' : r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${subtext}`}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {(
                    [
                      { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                      { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                      { label: 'Pilot Pathways', page: 'pathways-modern' },
                      { label: 'Job Listings', page: 'job-listings' },
                    ] as { label: string; page: string }[]
                  ).map(({ label, page }) => (
                    <button
                      key={page}
                      onClick={() => (onNavigate ? onNavigate(page) : onBack())}
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
          </>
        )}

        {selectedAirline && (
          <div className="max-w-2xl mx-auto px-6 mb-8 relative z-30">
            {/* Search + Region Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${subtext}`}
                />
                <input
                  type="text"
                  placeholder="Search airlines, locations, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="relative sm:w-44">
                <select
                  value={regionFilter}
                  onChange={(e) => {
                    setRegionFilter(e.target.value as Region);
                    setSelectedAirline(null);
                  }}
                  className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all bg-white border-slate-300 text-slate-900 cursor-pointer"
                >
                  {(
                    [
                      'All',
                      'Asia',
                      'Europe',
                      'Americas',
                      'Oceania',
                      'Africa',
                      'Middle East',
                    ] as Region[]
                  ).map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Regions' : r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${subtext}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Airline Carousel */}
        <div className="px-0 mb-12 relative z-30">
          <div className="flex items-center justify-between px-6 mb-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-sm font-bold text-slate-900">Airlines</h3>
              <span className="text-xs font-medium text-slate-500">{AIRLINES.length} total</span>
            </div>
          </div>
          <div
            className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {filteredAirlines.map((airline) => (
              <button
                key={airline.id}
                onClick={() => setSelectedAirline(airline)}
                className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center gap-4 ${
                  selectedAirline?.id === airline.id
                    ? 'ring-2 ring-sky-500 border-sky-500/50 bg-white shadow-2xl shadow-black/30'
                    : 'border-slate-200 bg-white hover:border-sky-400 hover:shadow-lg shadow-black/10'
                }`}
              >
                <div className="w-48 h-36 flex items-center justify-center mx-auto relative z-10 rounded-xl p-2">
                  {airline.logo ? (
                    <img
                      src={airline.logo}
                      alt={airline.name}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-slate-900 font-bold text-center text-lg px-4 leading-tight">
                      {airline.name}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-500 text-center px-2">
                  {airline.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AirlineDescription />

        {selectedAirline && (
          <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
            <div className={`rounded-2xl overflow-hidden border ${card}`}>
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{selectedAirline.flag}</span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
                      Selected Airline
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">
                    {selectedAirline.name}
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-white/80 text-sm">
                      <MapPin className="w-4 h-4" />
                      {selectedAirline.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium relative">
                      <DollarSign className="w-4 h-4" />
                      <span
                        className={`${!hasRecognitionAccess && selectedAirline.salaryRangeDetailed ? 'blur-sm select-none' : ''}`}
                      >
                        {getSalaryRange(selectedAirline)}
                      </span>
                      {!hasRecognitionAccess && selectedAirline.salaryRangeDetailed && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Shield className="w-3.5 h-3.5 text-white/80" />
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                      <Clock className="w-4 h-4" />
                      {selectedAirline.flightHours}
                    </span>
                  </div>
                </div>

                {/* Top center notice */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-center pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 pointer-events-auto">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-white/80 text-xs">
                      Subscribe to{' '}
                      <span className="text-sky-400 font-semibold">PilotRecognition+</span> for
                      detailed insights, profile matching, latest aircraft demands & phasing out
                      aircraft
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Updated Banner */}
              <div
                className={`px-6 md:px-8 py-2.5 ${isDarkMode ? 'bg-slate-800/80 border-b border-slate-700' : 'bg-slate-50/90 border-b border-slate-200'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Bell
                      className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
                    />
                    <p
                      className={`text-xs truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                    >
                      Stay up to date with phasing out aircraft, salary data changes & expectation
                      updates
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${isDarkMode ? 'bg-sky-500/15 text-sky-300 border border-sky-500/20' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}
                  >
                    <Shield className="w-3 h-3" /> PilotRecognition+
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div
                className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} px-6 md:px-8 bg-white dark:bg-slate-900`}
              >
                <div className="flex gap-1 overflow-x-auto">
                  {[
                    'Overview',
                    'Expectations',
                    'Fleet',
                    'Requirements',
                    'Profile',
                    'Recruitment',
                    'Career',
                    'Recognition Plus',
                    'Aptitude Test',
                  ].map((tab) => (
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
                      <p className={`text-sm leading-relaxed mb-6 ${subtext}`}>
                        {selectedAirline.description}
                      </p>

                      {selectedAirline.fleet && (
                        <>
                          <h3 className={`text-lg font-semibold mb-3 ${text}`}>Fleet</h3>
                          <p className={`text-xs ${subtext} mb-3`}>
                            Click on the aircraft to read more and learn more about type ratings
                            from the manufacturer
                          </p>

                          {/* Define helper functions outside the conditional to make them available in both sections */}
                          {(() => {
                            // Determine manufacturer based on aircraft name
                            const getManufacturerId = (aircraftName: string) => {
                              const name = aircraftName.toLowerCase().trim();
                              if (
                                name.includes('airbus') ||
                                name.includes('a3') ||
                                name.includes('a2') ||
                                name.includes('a35') ||
                                name.includes('a38') ||
                                name.includes('a31') ||
                                name.includes('a33') ||
                                name.includes('a34') ||
                                name.includes('acj')
                              )
                                return 'airbus';
                              if (
                                name.includes('boeing') ||
                                name.includes('b7') ||
                                name.includes('b787') ||
                                name.includes('b777') ||
                                name.includes('b767') ||
                                name.includes('b757') ||
                                name.includes('b747') ||
                                name.includes('b737')
                              )
                                return 'boeing';
                              if (
                                name.includes('embraer') ||
                                name.includes('e1') ||
                                name.includes('e19') ||
                                name.includes('e17') ||
                                name.includes('e14')
                              )
                                return 'embraer';
                              if (
                                name.includes('bombardier') ||
                                name.includes('crj') ||
                                name.includes('c series') ||
                                name.includes('challenger') ||
                                name.includes('global')
                              )
                                return 'bombardier';
                              if (name.includes('atr')) return 'atr';
                              if (name.includes('gulfstream') || name.includes('g'))
                                return 'gulfstream';
                              if (name.includes('cessna') || name.includes('citation'))
                                return 'cessna';
                              if (name.includes('dassault') || name.includes('falcon'))
                                return 'dassault-falcon';
                              if (name.includes('pilatus')) return 'pilatus';
                              if (
                                name.includes('beechcraft') ||
                                name.includes('bonanza') ||
                                name.includes('king air')
                              )
                                return 'beechcraft';
                              if (name.includes('sikorsky')) return 'sikorsky';
                              if (
                                name.includes('leonardo') ||
                                name.includes('aw') ||
                                name.includes('agusta')
                              )
                                return 'leonardo';
                              if (name.includes('de havilland') || name.includes('dhc'))
                                return 'de-havilland';
                              if (name.includes('mitsubishi') || name.includes('mrj'))
                                return 'mitsubishi-mrj';
                              if (name.includes('comac')) return 'comac-c919';
                              if (name.includes('tecnam')) return 'tecnam';
                              if (name.includes('piper')) return 'piper';
                              if (name.includes('cirrus')) return 'cirrus';
                              if (name.includes('let')) return 'let';
                              if (name.includes('aeroprakt')) return 'aeroprakt';
                              return null;
                            };

                            // Get aircraft ID based on aircraft name - simplified to match actual data
                            const getAircraftId = (
                              aircraftName: string,
                              manufacturerId: string
                            ) => {
                              // Remove extra text in parentheses and trim
                              const name = aircraftName
                                .toLowerCase()
                                .trim()
                                .replace(/\s*\(.*?\)\s*/g, '')
                                .replace(/\s*\[.*?\]\s*/g, '')
                                .trim();

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

                          {selectedAirline.id === 'qatar' &&
                          selectedAirline.fleetWithEndOfService ? (
                            <>
                              <div
                                className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} mb-4`}
                              >
                                <h4 className={`text-sm font-semibold mb-3 ${text}`}>
                                  Current Fleet
                                </h4>
                                <div className="space-y-2">
                                  {selectedAirline.fleetWithEndOfService.map((item, idx) => {
                                    const manufacturerId = (window as any).getManufacturerId(
                                      item.aircraft
                                    );
                                    const aircraftId = (window as any).getAircraftId(
                                      item.aircraft,
                                      manufacturerId
                                    );
                                    const isPhasing = item.endOfService
                                      .toLowerCase()
                                      .includes('phasing');

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
                                            safeRedirect(
                                              `/type-rating-search?${params.toString()}`
                                            );
                                          }
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                                          isDarkMode
                                            ? 'bg-slate-700/50 text-sky-300 hover:bg-slate-700'
                                            : 'bg-white text-sky-700 hover:bg-sky-50 border border-slate-200'
                                        } ${!manufacturerId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={!manufacturerId || isPhasing}
                                      >
                                        <div
                                          className={`flex items-center justify-between w-full ${isPhasing ? 'blur-sm select-none' : ''}`}
                                        >
                                          <span className="text-xs">{item.aircraft}</span>
                                          <span
                                            className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                                              item.endOfService === 'Ongoing'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : item.endOfService === '2032'
                                                  ? 'bg-amber-500/20 text-amber-400'
                                                  : 'bg-rose-500/20 text-rose-400'
                                            }`}
                                          >
                                            {item.endOfService}
                                          </span>
                                          {manufacturerId && <ChevronRight className="w-4 h-4" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* PilotRecognition+ banner for phasing out aircraft */}
                                {selectedAirline.fleetWithEndOfService.some((item: any) =>
                                  item.endOfService.toLowerCase().includes('phasing')
                                ) && (
                                  <div
                                    className={`mt-4 p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}
                                  >
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 bg-rose-500/90 text-white shadow-sm">
                                      <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                                    </div>
                                    <p
                                      className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                    >
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

                              <div
                                className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} relative`}
                              >
                                <h4 className={`text-sm font-semibold mb-3 ${text}`}>
                                  Future Demand
                                </h4>
                                <div className="space-y-2 blur-sm select-none">
                                  {selectedAirline.futureDemand &&
                                    selectedAirline.futureDemand.split(',').map((aircraft, idx) => (
                                      <div
                                        key={idx}
                                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                                          isDarkMode
                                            ? 'bg-slate-700/50 text-sky-300'
                                            : 'bg-white text-sky-700 border border-slate-200'
                                        }`}
                                      >
                                        <span className="text-xs">{aircraft.trim()}</span>
                                        <ChevronRight className="w-4 h-4" />
                                      </div>
                                    ))}
                                </div>
                                <div
                                  className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-sm rounded-xl z-10`}
                                >
                                  <div className="text-center">
                                    <div
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}
                                    >
                                      <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                                    </div>
                                    <p
                                      className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                                    >
                                      Subscribe to view future demand
                                    </p>
                                    <button
                                      className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                                    >
                                      Unlock Access
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div
                              className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                            >
                              <div className="space-y-2">
                                {selectedAirline.fleet.split(',').map((aircraft, idx) => {
                                  const manufacturerId = (window as any).getManufacturerId(
                                    aircraft
                                  );
                                  const aircraftId = (window as any).getAircraftId(
                                    aircraft,
                                    manufacturerId
                                  );

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
                                          safeRedirect(`/type-rating-search?${params.toString()}`);
                                        }
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                                        isDarkMode
                                          ? 'bg-slate-700/50 text-sky-300 hover:bg-slate-700'
                                          : 'bg-white text-sky-700 hover:bg-sky-50 border border-slate-200'
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
                            <CheckCircle2
                              className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                            />
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
                      <div
                        className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-sky-900/50 to-blue-900/50 border border-sky-500/30' : 'bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <Brain className="w-6 h-6 text-sky-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm mb-2 ${text}`}>
                              Test Your Skills Against {selectedAirline.name} Expectations
                            </h4>
                            <p className={`text-xs ${subtext} mb-3`}>
                              Take our pilot aptitude test to see if your skills match with this
                              airline's expectations and requirements.
                            </p>
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
                    <h3 className={`text-3xl font-serif font-normal ${text} mb-3`}>
                      What {selectedAirline.name} Really Looks For
                    </h3>
                    <p className={`text-sm ${subtext} max-w-2xl mx-auto`}>
                      Understanding the key expectations and requirements that airlines evaluate
                      when selecting pilots. These competencies are assessed through our EBT
                      CBTA-aligned framework.
                    </p>
                  </div>

                  {/* Context banner */}
                  <div
                    className={`relative overflow-hidden rounded-xl p-5 ${isDarkMode ? 'bg-slate-800/60 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm mb-1 ${text}`}>
                          These competencies are what {selectedAirline.name} evaluates in the
                          Pulling System
                        </h4>
                        <p className={`text-xs ${subtext} leading-relaxed`}>
                          Your Recognition Score measures how you stack up against each of these
                          pillars. Pilots with higher scores get priority access when{' '}
                          {selectedAirline.name} pulls from our live database. This is not a job
                          board — it is your currency for pathway access.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {(selectedAirline.expectations || CORE_EXPECTATIONS).map((exp, idx) => {
                      const Icon = exp.icon;
                      const num = String(idx + 1).padStart(2, '0');
                      return (
                        <div
                          key={idx}
                          className={`group rounded-xl border p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-sm' : 'bg-white/60 border-slate-200/60 backdrop-blur-sm'}`}
                        >
                          <div
                            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${exp.color || 'from-slate-500 to-slate-600'} opacity-[0.07] group-hover:opacity-[0.12] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-300`}
                          />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              {Icon && (
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color || 'from-slate-500 to-slate-600'} flex items-center justify-center shadow-sm`}
                                >
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <span
                                className={`text-2xl font-bold opacity-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                              >
                                {num}
                              </span>
                            </div>
                            <h4 className={`font-semibold text-lg mb-2 ${text}`}>{exp.title}</h4>
                            <p className={`text-sm leading-relaxed mb-4 ${subtext}`}>{exp.desc}</p>
                            <div className="flex flex-wrap gap-2">
                              {exp.bullets &&
                                exp.bullets.map((b) => (
                                  <span
                                    key={b}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-700/60 text-slate-300 group-hover:bg-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:bg-slate-200/60'}`}
                                  >
                                    {b}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Your Gap Analysis Teaser */}
                  <div
                    className={`relative overflow-hidden rounded-xl ${isDarkMode ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/60 border border-slate-200/60'}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-semibold text-lg ${text}`}>Your Gap Analysis</h4>
                          <p className={`text-xs ${subtext}`}>
                            See where you stand against {selectedAirline.name} expectations
                          </p>
                        </div>
                      </div>

                      {!hasRecognitionAccess ? (
                        <div className="relative">
                          <div className="blur-sm select-none space-y-3">
                            <div
                              className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>
                                  Technical Excellence
                                </span>
                                <span className="text-xs text-amber-400 font-semibold">
                                  Gap: 2 competencies
                                </span>
                              </div>
                              <div
                                className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                              >
                                <div className="h-2 rounded-full bg-amber-400 w-[60%]" />
                              </div>
                            </div>
                            <div
                              className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>
                                  5-Star Service Standards
                                </span>
                                <span className="text-xs text-emerald-400 font-semibold">
                                  Aligned
                                </span>
                              </div>
                              <div
                                className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                              >
                                <div className="h-2 rounded-full bg-emerald-400 w-[85%]" />
                              </div>
                            </div>
                            <div
                              className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${text}`}>
                                  Team Leadership
                                </span>
                                <span className="text-xs text-amber-400 font-semibold">
                                  Gap: 1 competency
                                </span>
                              </div>
                              <div
                                className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                              >
                                <div className="h-2 rounded-full bg-amber-400 w-[70%]" />
                              </div>
                            </div>
                          </div>
                          <div
                            className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/70'} backdrop-blur-sm rounded-xl`}
                          >
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-3 bg-slate-500/90 text-white shadow-sm">
                              <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                            </div>
                            <p
                              className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                            >
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
                          <div
                            className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>
                                Technical Excellence
                              </span>
                              <span className="text-xs text-amber-400 font-semibold">
                                Gap: 2 competencies
                              </span>
                            </div>
                            <div
                              className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                            >
                              <div className="h-2 rounded-full bg-amber-400 w-[60%]" />
                            </div>
                            <p className={`text-xs mt-2 ${subtext}`}>
                              Strengthen SOP Compliance and Automation Mastery via our Transition
                              Program
                            </p>
                          </div>
                          <div
                            className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>
                                5-Star Service Standards
                              </span>
                              <span className="text-xs text-emerald-400 font-semibold">
                                Aligned
                              </span>
                            </div>
                            <div
                              className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                            >
                              <div className="h-2 rounded-full bg-emerald-400 w-[85%]" />
                            </div>
                          </div>
                          <div
                            className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${text}`}>Team Leadership</span>
                              <span className="text-xs text-amber-400 font-semibold">
                                Gap: 1 competency
                              </span>
                            </div>
                            <div
                              className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                            >
                              <div className="h-2 rounded-full bg-amber-400 w-[70%]" />
                            </div>
                            <p className={`text-xs mt-2 ${subtext}`}>
                              Book verified mentorship to close CRM Excellence gap
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* How We Assess — gated */}
                  <div
                    className={`relative overflow-hidden rounded-xl ${isDarkMode ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white/60 border border-slate-200/60'}`}
                  >
                    <div className="p-6">
                      <h4 className={`font-semibold text-lg mb-5 ${text}`}>
                        How We Assess These Expectations
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div
                            className={`w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto mb-2`}
                          >
                            <Target
                              className={`w-5 h-5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
                            />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>EBT CBTA Framework</h5>
                          <p className={`text-xs ${subtext}`}>
                            Evidence-based training aligned with manufacturer standards
                          </p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2`}
                          >
                            <Shield
                              className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
                            />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>
                            Verified Mentorship
                          </h5>
                          <p className={`text-xs ${subtext}`}>
                            50+ hours of practical validation with industry mentors
                          </p>
                        </div>
                        <div className="text-center">
                          <div
                            className={`w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2`}
                          >
                            <TrendingUp
                              className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                            />
                          </div>
                          <h5 className={`font-medium text-sm mb-1 ${text}`}>
                            Recognition Profile
                          </h5>
                          <p className={`text-xs ${subtext}`}>
                            Comprehensive scoring system for career advancement
                          </p>
                        </div>
                      </div>
                    </div>
                    {!hasRecognitionAccess && (
                      <div
                        className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-900/70' : 'bg-white/80'} backdrop-blur-sm rounded-xl z-10`}
                      >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-3 bg-slate-500/90 text-white shadow-sm">
                          <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                        </div>
                        <p
                          className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                        >
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
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Pilot Requirements</h3>
                      <p className={`text-sm ${subtext} mb-4`}>
                        Detailed requirements and qualifications needed
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>Flight Hours</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={subtext}>Minimum</span>
                              <span className={`font-semibold ${text}`}>
                                {selectedAirline.pilotRequirements.minHours.toLocaleString()} hrs
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className={subtext}>Preferred</span>
                              <span className={`font-semibold ${text}`}>
                                {selectedAirline.pilotRequirements.preferredHours.toLocaleString()}{' '}
                                hrs
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                            Type Ratings Required
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.typeRatingRequired.map((rating) => (
                              <button
                                key={rating}
                                onClick={() => safeRedirect('/type-ratings')}
                                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                  isDarkMode
                                    ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
                                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
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
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                            Additional Certifications
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.additionalCertifications.map(
                              (cert) => (
                                <span
                                  key={cert}
                                  className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-50 text-teal-700'}`}
                                >
                                  {cert}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                            Language Requirements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAirline.pilotRequirements.languageRequirements.map((lang) => (
                              <span
                                key={lang}
                                className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-50 text-rose-700'}`}
                              >
                                {lang}
                              </span>
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
                        <div
                          className={`rounded-xl p-8 text-center ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                        >
                          <Shield
                            className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}
                          />
                          <h4 className={`text-lg font-semibold mb-2 ${text}`}>
                            Recognition Plus Required
                          </h4>
                          <p className={`text-sm ${subtext} mb-4`}>
                            Detailed entry requirements, assessment processes, and compensation
                            information require PilotRecognition+ membership for access.
                          </p>
                          <div
                            className={`inline-block px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium`}
                          >
                            Upgrade to PilotRecognition+ for detailed insights
                          </div>
                        </div>
                      ) : (
                        <>
                          {selectedAirline.detailedInfo.entryRequirements && (
                            <div
                              className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className={`text-lg font-semibold ${text}`}>
                                  Entry Requirements (2026)
                                </h4>
                                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                                  Recognition Plus
                                </span>
                              </div>
                              <div className="space-y-3">
                                {selectedAirline.detailedInfo.entryRequirements.captains && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Captain Requirements
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.entryRequirements.captains
                                        .split('\n')
                                        .map((req, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-sky-500">•</span>
                                            <span>{req.trim()}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.entryRequirements.firstOfficers && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      First Officer Requirements
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.entryRequirements.firstOfficers
                                        .split('\n')
                                        .map((req, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-sky-500">•</span>
                                            <span>{req.trim()}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.entryRequirements.licensesMedical && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Licenses & Certifications
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.entryRequirements.licensesMedical
                                        .split('\n')
                                        .map((req, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-sky-500">•</span>
                                            <span>{req.trim()}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.entryRequirements.recency && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Recency Requirements
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.entryRequirements.recency}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedAirline.detailedInfo.assessmentProcess && (
                            <div
                              className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                            >
                              <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                                Assessment Process (2026)
                              </h4>
                              <div className="space-y-3">
                                {selectedAirline.detailedInfo.assessmentProcess.day1 && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Day 1: Digital Screening
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.assessmentProcess.day1
                                        .split('\n')
                                        .map((req, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-sky-500">•</span>
                                            <span>{req.trim()}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.assessmentProcess.day2 && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Day 2: Technical & HR Assessment
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.assessmentProcess.day2
                                        .split('\n')
                                        .map((req, idx) => (
                                          <li key={idx} className="flex items-start gap-2">
                                            <span className="text-sky-500">•</span>
                                            <span>{req.trim()}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.assessmentProcess.day3 && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Day 3: Simulator Check
                                    </p>
                                    <ul className={`space-y-1 text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.assessmentProcess.day3
                                        .split('\n')
                                        .map((req, idx) => (
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
                            <div
                              className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                            >
                              <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                                Working Conditions & Lifestyle
                              </h4>
                              <div className="space-y-3">
                                {selectedAirline.detailedInfo.workingConditions.roster && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Rostering Pattern
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.workingConditions.roster}
                                    </p>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.workingConditions.culture && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>Culture</p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.workingConditions.culture}
                                    </p>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.workingConditions.training && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Training & Bonds
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.workingConditions.training}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedAirline.detailedInfo.compensationBenefits && (
                            <div
                              className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className={`text-lg font-semibold ${text}`}>
                                  Compensation & Benefits
                                </h4>
                                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                                  Recognition Plus
                                </span>
                              </div>
                              <div className="space-y-3">
                                {selectedAirline.detailedInfo.compensationBenefits.salary && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Salary Structure
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.compensationBenefits.salary}
                                    </p>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.compensationBenefits
                                  .livingSupport && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Living Support
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {
                                        selectedAirline.detailedInfo.compensationBenefits
                                          .livingSupport
                                      }
                                    </p>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.compensationBenefits.travelPerks && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Travel Perks
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {
                                        selectedAirline.detailedInfo.compensationBenefits
                                          .travelPerks
                                      }
                                    </p>
                                  </div>
                                )}
                                {selectedAirline.detailedInfo.compensationBenefits.insurance && (
                                  <div
                                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                                  >
                                    <p className={`font-semibold text-sm mb-2 ${text}`}>
                                      Insurance
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.compensationBenefits.insurance}
                                    </p>
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
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                        Profile Alignment Tips
                      </h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.profileAlignment.technicalMastery && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>
                                Technical Mastery
                              </p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.profileAlignment.technicalMastery}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.crmManualFlying && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>
                                CRM & Manual Flying
                              </p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.profileAlignment.crmManualFlying}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.professionalism && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Professionalism</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.profileAlignment.professionalism}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.profileAlignment.culturalAdaptability && (
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`} />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>
                                Cultural Adaptability
                              </p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.profileAlignment.culturalAdaptability}
                              </p>
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
                  <h3 className={`text-2xl font-serif font-normal ${text} mb-2`}>
                    Profile Alignment Tips
                  </h3>
                  <p className={`text-sm ${subtext} mb-6`}>
                    Core competencies and interview guidance for recognition plus members
                  </p>

                  {!userProfile?.isRecognitionPlusMember ? (
                    <div className="relative">
                      <div className="blur-sm select-none">
                        {selectedAirline.detailedInfo?.coreCompetencies ? (
                          <div
                            className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                          >
                            <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                              Core Competency Alignment (2026 Standards)
                            </h4>
                            <p className={`text-xs ${subtext} mb-4`}>
                              {selectedAirline.name} evaluates candidates against five primary core
                              values during the HR panel, which overlap with the 9 industry-standard
                              pilot competencies.
                            </p>
                            <div className="space-y-3">
                              {selectedAirline.detailedInfo.coreCompetencies.oneTeam && (
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                  />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>
                                      One Team (Leadership & Teamwork)
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.coreCompetencies.oneTeam}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.drivingExcellence && (
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                  />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>
                                      Driving Excellence (Application of Knowledge & Procedures)
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {
                                        selectedAirline.detailedInfo.coreCompetencies
                                          .drivingExcellence
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.customerFirst && (
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                  />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>
                                      Customer First (Professionalism)
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {selectedAirline.detailedInfo.coreCompetencies.customerFirst}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies.safetySituational && (
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                  />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>
                                      Safety & Situational Awareness
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {
                                        selectedAirline.detailedInfo.coreCompetencies
                                          .safetySituational
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                              {selectedAirline.detailedInfo.coreCompetencies
                                .futureFleetInsights && (
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                  />
                                  <div>
                                    <p className={`font-medium text-sm ${text}`}>
                                      Future Fleet & Strategic Insights
                                    </p>
                                    <p className={`text-xs ${subtext}`}>
                                      {
                                        selectedAirline.detailedInfo.coreCompetencies
                                          .futureFleetInsights
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                          >
                            <p className={`text-sm ${subtext}`}>
                              Core competency alignment information is not yet available for{' '}
                              {selectedAirline.name}.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
                        <div className="text-center">
                          <span className="font-bold text-xl tracking-wider brand-font mb-2 block">
                            <span className="text-black">PILOT</span>{' '}
                            <span className="text-red-500">RECOGNITION+</span>
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
                        <div
                          className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                        >
                          <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                            Core Competency Alignment (2026 Standards)
                          </h4>
                          <p className={`text-xs ${subtext} mb-4`}>
                            {selectedAirline.name} evaluates candidates against five primary core
                            values during the HR panel, which overlap with the 9 industry-standard
                            pilot competencies.
                          </p>
                          <div className="space-y-3">
                            {selectedAirline.detailedInfo.coreCompetencies.oneTeam && (
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>
                                    One Team (Leadership & Teamwork)
                                  </p>
                                  <p className={`text-xs ${subtext}`}>
                                    {selectedAirline.detailedInfo.coreCompetencies.oneTeam}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.drivingExcellence && (
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>
                                    Driving Excellence (Application of Knowledge & Procedures)
                                  </p>
                                  <p className={`text-xs ${subtext}`}>
                                    {
                                      selectedAirline.detailedInfo.coreCompetencies
                                        .drivingExcellence
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.customerFirst && (
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>
                                    Customer First (Professionalism)
                                  </p>
                                  <p className={`text-xs ${subtext}`}>
                                    {selectedAirline.detailedInfo.coreCompetencies.customerFirst}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.safetySituational && (
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>
                                    Safety & Situational Awareness
                                  </p>
                                  <p className={`text-xs ${subtext}`}>
                                    {
                                      selectedAirline.detailedInfo.coreCompetencies
                                        .safetySituational
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedAirline.detailedInfo.coreCompetencies.futureFleetInsights && (
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0`}
                                />
                                <div>
                                  <p className={`font-medium text-sm ${text}`}>
                                    Future Fleet & Strategic Insights
                                  </p>
                                  <p className={`text-xs ${subtext}`}>
                                    {
                                      selectedAirline.detailedInfo.coreCompetencies
                                        .futureFleetInsights
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                        >
                          <p className={`text-sm ${subtext}`}>
                            Core competency alignment information is not yet available for{' '}
                            {selectedAirline.name}.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Recruitment' && selectedAirline.detailedInfo && (
                <div className="space-y-6">
                  {selectedAirline.detailedInfo.latestUpdates && (
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>
                        Latest Fleet & Recruitment News
                      </h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.latestUpdates.fleetNews && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Fleet News</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.latestUpdates.fleetNews}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.futureOrders && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Future Orders</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.latestUpdates.futureOrders}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.a380Status && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>A380 Status</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.latestUpdates.a380Status}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.latestUpdates.openings && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text} mb-1`}>Current Openings</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.latestUpdates.openings}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedAirline.detailedInfo.recruitmentStatus && (
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <h4 className={`text-lg font-semibold mb-4 ${text}`}>Recruitment Status</h4>
                      <div className="space-y-3">
                        {selectedAirline.detailedInfo.recruitmentStatus.typeRatedPositions && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>
                                Type-Rated First Officers & Captains
                              </p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.recruitmentStatus.typeRatedPositions}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.directEntryCaptains && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Direct Entry Captains</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.recruitmentStatus.directEntryCaptains}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.applicationMethod && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Application Method</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.recruitmentStatus.applicationMethod}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedAirline.detailedInfo.recruitmentStatus.assessmentProcess && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0`}
                            />
                            <div>
                              <p className={`font-medium text-sm ${text}`}>Assessment Process</p>
                              <p className={`text-xs ${subtext}`}>
                                {selectedAirline.detailedInfo.recruitmentStatus.assessmentProcess}
                              </p>
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
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4`}
                    >
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Current Fleet</h3>
                      <p className={`text-sm ${subtext} mb-4`}>
                        Active aircraft in Qatar Airways fleet
                      </p>
                      <div className="space-y-2">
                        {selectedAirline.fleetWithEndOfService.map((item, idx) => {
                          const isPhasing = item.endOfService.toLowerCase().includes('phasing');
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-white border border-slate-200'}`}
                            >
                              <div
                                className={`flex items-center justify-between ${isPhasing ? 'blur-sm select-none' : ''}`}
                              >
                                <span className={`font-medium text-sm ${text}`}>
                                  {item.aircraft}
                                </span>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    item.endOfService === 'Ongoing'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : item.endOfService === '2032'
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-rose-500/20 text-rose-400'
                                  }`}
                                >
                                  {item.endOfService}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* PilotRecognition+ banner for phasing out aircraft */}
                      {selectedAirline.fleetWithEndOfService.some((item: any) =>
                        item.endOfService.toLowerCase().includes('phasing')
                      ) && (
                        <div
                          className={`mt-4 p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}
                        >
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 bg-rose-500/90 text-white shadow-sm">
                            <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                          </div>
                          <p
                            className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                          >
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
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} mb-4 relative`}
                    >
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>Future Fleet Plans</h3>
                      <p className={`text-sm ${subtext} mb-4`}>
                        Upcoming fleet changes and expansion strategy
                      </p>

                      <div className="relative">
                        <div className="blur-sm select-none">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className={`font-semibold mb-2 ${text} text-sm`}>New Aircraft</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAirline.futureFleetPlans.newAircraft.map((aircraft) => (
                                  <button
                                    key={aircraft}
                                    onClick={() => safeRedirect('/type-ratings')}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                      isDarkMode
                                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    }`}
                                  >
                                    {aircraft}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                                Retiring Aircraft
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedAirline.futureFleetPlans.retiringAircraft.map(
                                  (aircraft) => (
                                    <button
                                      key={aircraft}
                                      onClick={() => safeRedirect('/type-ratings')}
                                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                        isDarkMode
                                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                      }`}
                                    >
                                      {aircraft}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <p className={`text-xs ${subtext}`}>
                            {selectedAirline.futureFleetPlans.expansionPlans}
                          </p>
                        </div>

                        <div
                          className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white/60'} backdrop-blur-sm rounded-xl z-10`}
                        >
                          <div className="text-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs mb-2 ${isDarkMode ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 text-slate-800 border border-slate-300'}`}
                            >
                              <Shield className="w-3.5 h-3.5" /> PilotRecognition+
                            </div>
                            <p
                              className={`text-xs mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
                            >
                              Subscribe to view future fleet plans
                            </p>
                            <button
                              className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-900 bg-white hover:bg-white/90' : 'text-white bg-slate-900 hover:bg-slate-800'}`}
                            >
                              Unlock Access
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAirline.aircraftDemand && (
                    <div
                      className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'} relative ${selectedAirline.id === 'qatar' ? '' : ''}`}
                    >
                      <h3 className={`text-xl font-semibold mb-4 ${text}`}>
                        Aircraft Demand Analysis
                      </h3>
                      <p className={`text-sm ${subtext} mb-4`}>
                        Fleet composition and manufacturer preferences
                      </p>

                      {selectedAirline.id === 'qatar' ? (
                        <div className="relative">
                          <div className="blur-sm select-none">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                                  Manufacturer Preference
                                </h4>
                                <div className="flex gap-2 mb-2">
                                  <div className="flex-1">
                                    <div className="text-xs mb-1 text-slate-400">Airbus</div>
                                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                      <div
                                        className="h-full bg-sky-500"
                                        style={{
                                          width: `${selectedAirline.aircraftDemand.airbusPreference}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="text-xs mt-1 font-semibold text-sky-400">
                                      {selectedAirline.aircraftDemand.airbusPreference}%
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs mb-1 text-slate-400">Boeing</div>
                                    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500"
                                        style={{
                                          width: `${selectedAirline.aircraftDemand.boeingPreference}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="text-xs mt-1 font-semibold text-indigo-400">
                                      {selectedAirline.aircraftDemand.boeingPreference}%
                                    </div>
                                  </div>
                                </div>
                                <div className={`text-xs font-semibold ${text}`}>
                                  Primary: {selectedAirline.aircraftDemand.primaryManufacturer}
                                </div>
                              </div>
                              <div>
                                <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                                  Trending Aircraft
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedAirline.aircraftDemand.trendingAircraft.map(
                                    (aircraft) => (
                                      <button
                                        key={aircraft}
                                        onClick={() => safeRedirect('/type-ratings')}
                                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                          isDarkMode
                                            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                        }`}
                                      >
                                        {aircraft}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
                            <div className="text-center">
                              <span className="font-bold text-xl tracking-wider brand-font mb-2 block">
                                <span className="text-black">PILOT</span>{' '}
                                <span className="text-red-500">RECOGNITION+</span>
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
                            <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                              Manufacturer Preference
                            </h4>
                            <div className="flex gap-2 mb-2">
                              <div className="flex-1">
                                <div className="text-xs mb-1 text-slate-400">Airbus</div>
                                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                  <div
                                    className="h-full bg-sky-500"
                                    style={{
                                      width: `${selectedAirline.aircraftDemand.airbusPreference}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-xs mt-1 font-semibold text-sky-400">
                                  {selectedAirline.aircraftDemand.airbusPreference}%
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs mb-1 text-slate-400">Boeing</div>
                                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500"
                                    style={{
                                      width: `${selectedAirline.aircraftDemand.boeingPreference}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-xs mt-1 font-semibold text-indigo-400">
                                  {selectedAirline.aircraftDemand.boeingPreference}%
                                </div>
                              </div>
                            </div>
                            <div className={`text-xs font-semibold ${text}`}>
                              Primary: {selectedAirline.aircraftDemand.primaryManufacturer}
                            </div>
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-2 ${text} text-sm`}>
                              Trending Aircraft
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedAirline.aircraftDemand.trendingAircraft.map((aircraft) => (
                                <button
                                  key={aircraft}
                                  onClick={() => safeRedirect('/type-ratings')}
                                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                    isDarkMode
                                      ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
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
                  <h3 className={`text-2xl font-serif font-normal ${text} mb-2`}>
                    The Assessment Pipeline
                  </h3>
                  <p className={`text-sm ${subtext} mb-6`}>
                    From application to final offer — know every stage
                  </p>
                  <div className="grid md:grid-cols-4 gap-4">
                    {ASSESSMENT_PIPELINE.map((stage, i) => {
                      const Icon = stage.icon;
                      return (
                        <div
                          key={stage.title}
                          className={`rounded-xl border p-5 relative ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                        >
                          <div
                            className={`absolute top-4 right-4 text-2xl font-serif font-bold ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                          >
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
            <div
              className={`px-6 md:px-8 pb-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-5`}
            >
              <div className="flex flex-wrap gap-2">
                {selectedAirline.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDarkMode ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Data Disclaimer */}
            <div
              className={`px-6 md:px-8 pb-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} pt-5`}
            >
              <div className={`p-3 rounded-lg bg-slate-100 border border-slate-300`}>
                <div className="flex items-start gap-2">
                  <Shield className={`w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className={`text-xs font-semibold text-slate-900 mb-1`}>Data Disclaimer</p>
                    <p className={`text-xs text-slate-800 leading-relaxed`}>
                      PilotRecognition.com is operated by a university research pilot group for the
                      benefit of helping pilots to be aware and connect more to the industry. This
                      platform matches pilots with current industry information publicly available
                      and sourced across the internet through various credible sources to help
                      pilots align their profiles. All information presented is compiled from
                      publicly available sources for informational purposes only. This platform is
                      not currently affiliated with, endorsed by, or sponsored by any airline,
                      though we plan to establish partnerships in the future. Airline logos,
                      trademarks, and branding are used under fair use principles solely for
                      identification and informational purposes to help pilots understand industry
                      requirements. No airline has verified, endorsed, or approved any information
                      on this platform. All salary ranges, requirements, and assessment processes
                      are estimates based on available public data and may not reflect current
                      airline policies. Airbus aircraft specifications and fleet information are
                      sourced from public Airbus announcements, aviation industry reports, and
                      publicly available delivery data for pilot awareness purposes only—not for
                      competitive intelligence. We welcome data sharing agreements with Airbus to
                      ensure accuracy and offer to remove or correct inaccurate data per Airbus
                      request. PilotRecognition+ membership provides AI-powered data comparison
                      tools to help pilots align their profiles with airline expectations. This
                      platform serves as a pilot recognition channel for Airbus and other
                      manufacturers to address pilots with recognition profiles. Any fees charged
                      are solely for platform development and AI optimization services, not for
                      access to airline data. Users should conduct their own due diligence and
                      verify all information directly with official airline sources before making
                      career decisions. This platform provides general guidance only and does not
                      constitute professional career, legal, or financial advice. We assume no
                      liability for decisions made based on information provided herein.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Close main content wrapper */}
    </div>
  );
};

export default PortalAirlineExpectationsPage;
