import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, LayoutGrid, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick } from 'lucide-react';
import { aircraftModels, AircraftModel } from '../data/aircraft-models';

// ── Per-aircraft enrichment data ────────────────────────────────────────────
interface AircraftInfo {
  manufacturerLogo: string;
  manufacturerName: string;
  firstFlight: number;
  avgRatingCostUSD: string;
  pohUrl: string;
  pohDocs?: { label: string; embed: string; url: string; author: string }[];
  airlinesUsingFleet: { name: string; logo: string }[];
  specs: { label: string; value: string }[];
  typicalNeedToKnow: string[];
  atoCarousel: { name: string; location: string; offers: string[]; img: string }[];
}

const AIRCRAFT_INFO: Record<string, AircraftInfo> = {
  default: {
    manufacturerLogo: '/logo.png',
    manufacturerName: 'Various Manufacturers',
    firstFlight: 1980,
    avgRatingCostUSD: '$15,000–$40,000',
    pohUrl: 'https://www.faa.gov/aircraft',
    airlinesUsingFleet: [],
    specs: [
      { label: 'MTOW', value: 'Varies by variant' },
      { label: 'V1 (Typical)', value: 'Varies' },
      { label: 'Vr', value: 'Varies' },
      { label: 'V2', value: 'Varies' },
      { label: 'Vne', value: 'Varies' },
    ],
    typicalNeedToKnow: [
      'Normal, abnormal and emergency procedures',
      'Systems knowledge — hydraulics, pneumatics, electrics, avionics',
      'Performance calculations — V-speeds, takeoff/landing data',
      'Limitations — structural, engine, speed',
      'Weight & balance calculations',
    ],
    atoCarousel: [
      { name: 'CAE', location: 'Clark, Philippines', offers: ['A320', 'ATR 72-600', 'B737 NG'], img: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp' },
      { name: 'FlightSafety International', location: 'Worldwide', offers: ['B737', 'B747', 'Citation'], img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80' },
    ],
  },
  'airbus-a320': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Airbus_Logo_2017.svg/1200px-Airbus_Logo_2017.svg.png',
    manufacturerName: 'Airbus',
    firstFlight: 1987,
    avgRatingCostUSD: '$30,000–$55,000',
    pohUrl: 'https://www.airbusatc.com/courses/a320',
    airlinesUsingFleet: [
      { name: 'Philippine Airlines', logo: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg' },
      { name: 'Cebu Pacific', logo: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg' },
      { name: 'IndiGo', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
      { name: 'easyJet', logo: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp' },
    ],
    specs: [
      { label: 'MTOW', value: '77,000 kg (A320-200)' },
      { label: 'V1 (typical)', value: '~134 kt' },
      { label: 'Vr', value: '~143 kt' },
      { label: 'V2', value: '~147 kt' },
      { label: 'Vmo', value: '350 kt / M0.82' },
      { label: 'Vfe (full flap)', value: '177 kt' },
      { label: 'Vs1g (clean)', value: '~122 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~1,800 m' },
    ],
    typicalNeedToKnow: [
      'Fly-by-wire flight control laws (Normal, Alternate, Direct)',
      'FADEC engine control and thrust rating logic',
      'ECAM/EFIS system architecture and failure analysis',
      'FMGC/MCDU operation and flight plan management',
      'Alpha protection and high-AoA envelope',
      'MEL category A/B/C/D implications',
    ],
    atoCarousel: [
      { name: 'CAE', location: 'Clark, Philippines', offers: ['A320 Family', 'ATR 72-600'], img: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp' },
      { name: 'Airbus Training Centre', location: 'Toulouse, France', offers: ['A320', 'A330', 'A350'], img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg' },
      { name: 'FlightSafety International', location: 'Atlanta, USA', offers: ['A320 Type Rating'], img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80' },
    ],
  },
  'boeing-737': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Boeing_full_logo.svg/1200px-Boeing_full_logo.svg.png',
    manufacturerName: 'Boeing',
    firstFlight: 1967,
    avgRatingCostUSD: '$25,000–$50,000',
    pohUrl: 'https://www.boeing.com/commercial/737ng',
    airlinesUsingFleet: [
      { name: 'Southwest Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Southwest_Airlines_logo_2014.svg/1200px-Southwest_Airlines_logo_2014.svg.png' },
      { name: 'Ryanair', logo: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png' },
      { name: 'SkyWest', logo: 'https://www.thrustflight.com/wp-content/uploads/2022/11/skywest-airlines-2-768x512.jpg' },
    ],
    specs: [
      { label: 'MTOW (737-800)', value: '79,016 kg' },
      { label: 'V1 (typical)', value: '~138 kt' },
      { label: 'Vr', value: '~145 kt' },
      { label: 'V2', value: '~152 kt' },
      { label: 'Vmo', value: '340 kt / M0.82' },
      { label: 'Vfe (flaps 40)', value: '162 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~2,000 m' },
    ],
    typicalNeedToKnow: [
      'Conventional hydraulic flight controls and feel system',
      'CFM56 engine operations and FADEC differences by variant',
      'Boeing EFIS (PFD/ND) and FMC operation',
      'TCAS II and EGPWS response procedures',
      'Tailstrike awareness and rotation technique',
      '737 MAX MCAS awareness (post-AD training)',
    ],
    atoCarousel: [
      { name: 'CAE', location: 'Clark, Philippines', offers: ['B737 NG', 'B737 MAX'], img: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp' },
      { name: 'Boeing Flight Services', location: 'Miami, USA', offers: ['B737 Type Rating'], img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80' },
      { name: 'Ryanair TRTO', location: 'Dublin, Ireland', offers: ['B737 NG / MAX'], img: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png' },
    ],
  },
  'tecnam-p2002': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Tecnam_logo.svg/1200px-Tecnam_logo.svg.png',
    manufacturerName: 'Tecnam',
    firstFlight: 2001,
    avgRatingCostUSD: '$6,000–$12,000',
    pohUrl: 'https://www.scribd.com/document/262325387/Tecnam-P2002-JF-Flight-Manual',
    pohDocs: [
      {
        label: 'P2002-JF Flight Manual',
        embed: 'https://www.scribd.com/embeds/262325387/content?start_page=1&view_mode=scroll&access_key=key-fB8TgcEpBnM8VEzO0dIy',
        url: 'https://www.scribd.com/document/262325387/Tecnam-P2002-JF-Flight-Manual#from_embed',
        author: 'John',
      },
    ],
    airlinesUsingFleet: [
      { name: 'Flight Training Schools', logo: '/logo.png' },
    ],
    specs: [
      { label: 'MTOW', value: '600 kg' },
      { label: 'Vso', value: '42 kt' },
      { label: 'Vs1', value: '47 kt' },
      { label: 'Vr', value: '55 kt' },
      { label: 'Vx', value: '60 kt' },
      { label: 'Vy', value: '70 kt' },
      { label: 'Vno', value: '114 kt' },
      { label: 'Vne', value: '140 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~200 m' },
    ],
    typicalNeedToKnow: [
      'Rotax 912 ULS engine management — carburettor heat and warm-up procedures',
      'Light sport aircraft (LSA) limitations and operating category',
      'Weight & balance — two-seat max, sensitive to fuel and pax loading',
      'Low-wing handling characteristics vs high-wing trainers',
      'Flap schedule and short/soft field operations',
      'EASA Light Aircraft Pilot Licence (LAPL) typical training aircraft',
    ],
    atoCarousel: [
      { name: 'Local Flying Schools', location: 'Worldwide', offers: ['PPL', 'LAPL', 'Hour Building'], img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
    ],
  },
  'cessna-172': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Cessna_logo.svg/1200px-Cessna_logo.svg.png',
    manufacturerName: 'Cessna Aircraft Company',
    firstFlight: 1955,
    avgRatingCostUSD: '$8,000–$15,000',
    pohUrl: 'https://www.scribd.com/document/406390315/C-172-Skyhawk-Checklist',
    pohDocs: [
      {
        label: 'Pilot Operating Handbook',
        embed: 'https://www.scribd.com/embeds/724960749/content?start_page=1&view_mode=scroll&access_key=key-1fFlWIWCuVjNXW8xoKux',
        url: 'https://www.scribd.com/document/724960749/Cessna-172-POH#from_embed',
        author: 'arnavpilot',
      },
      {
        label: 'C-172 Skyhawk Checklist',
        embed: 'https://www.scribd.com/embeds/406390315/content?start_page=1&view_mode=scroll&access_key=key-9cAryVSRyoKdDVMRzsqH',
        url: 'https://www.scribd.com/document/406390315/C-172-Skyhawk-Checklist#from_embed',
        author: 'Alejo Bautista',
      },
    ],
    airlinesUsingFleet: [
      { name: 'Flight Schools Worldwide', logo: '/logo.png' },
    ],
    specs: [
      { label: 'MTOW', value: '1,111 kg' },
      { label: 'Vso', value: '44 kt' },
      { label: 'Vs1', value: '48 kt' },
      { label: 'Vr', value: '55 kt' },
      { label: 'Vx', value: '62 kt' },
      { label: 'Vy', value: '76 kt' },
      { label: 'Vno', value: '129 kt' },
      { label: 'Vne', value: '163 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~274 m' },
    ],
    typicalNeedToKnow: [
      'Lycoming IO-360 engine management, fuel injection system and priming',
      'Weight & balance — four-seat configuration, fuel/pax loading discipline',
      'Cross-country navigation using VOR, GPS and pilotage',
      'Soft and short field takeoff and landing techniques',
      'Instrument scan basics — widely used for IMC/IFR initial training',
      'Spin awareness and recovery — approved for intentional spins (early models)',
    ],
    atoCarousel: [
      { name: 'Local Flying Schools', location: 'Worldwide', offers: ['PPL', 'CPL Hour Building', 'IFR Rating'], img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
    ],
  },
  'cessna-152': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Cessna_logo.svg/1200px-Cessna_logo.svg.png',
    manufacturerName: 'Cessna Aircraft Company',
    firstFlight: 1958,
    avgRatingCostUSD: '$5,000–$10,000',
    pohUrl: 'https://www.scribd.com/document/512711472/Cessna-152-1978-POH',
    pohDocs: [
      {
        label: 'Pilot Operating Handbook (1978)',
        embed: 'https://www.scribd.com/embeds/512711472/content?start_page=1&view_mode=scroll&access_key=key-lE9xOGos5ZcBTgtTIGku',
        url: 'https://www.scribd.com/document/512711472/Cessna-152-1978-POH#from_embed',
        author: 'vic',
      },
    ],
    airlinesUsingFleet: [
      { name: 'Flight Schools Worldwide', logo: '/logo.png' },
    ],
    specs: [
      { label: 'MTOW', value: '757 kg' },
      { label: 'Vso', value: '40 kt' },
      { label: 'Vs1', value: '43 kt' },
      { label: 'Vr', value: '54 kt' },
      { label: 'Vx', value: '55 kt' },
      { label: 'Vy', value: '67 kt' },
      { label: 'Vno', value: '107 kt' },
      { label: 'Vne', value: '149 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~185 m' },
    ],
    typicalNeedToKnow: [
      'Lycoming O-235 engine management and carburettor icing awareness',
      'Weight & balance — two-seat limit, fuel/passenger loading discipline',
      'VFR airspace rules and cross-country navigation fundamentals',
      'Emergency procedures — forced landings and engine-out glide ratio',
      'Stall awareness and spin recovery — docile but requires correct technique',
      'Radio telephony basics and controlled airspace communications',
    ],
    atoCarousel: [
      { name: 'Local Flying Schools', location: 'Worldwide', offers: ['PPL', 'Hour Building', 'Night Rating'], img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
    ],
  },
  'airbus-a350': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Airbus_Logo_2017.svg/1200px-Airbus_Logo_2017.svg.png',
    manufacturerName: 'Airbus',
    firstFlight: 2013,
    avgRatingCostUSD: '$40,000–$65,000',
    pohUrl: 'https://www.scribd.com/document/576313013/A350-1000-FCOM',
    pohDocs: [
      {
        label: 'Flight Crew Operating Manual (FCOM)',
        embed: 'https://www.scribd.com/embeds/576313013/content?start_page=1&view_mode=scroll&access_key=key-flSpS0tiu25M1AOYIumc',
        url: 'https://www.scribd.com/document/576313013/A350-1000-FCOM#from_embed',
        author: 'Peter J Begley',
      },
    ],
    airlinesUsingFleet: [
      { name: 'Qatar Airways', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
      { name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
      { name: 'Cathay Pacific', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
      { name: 'Finnair', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
    ],
    specs: [
      { label: 'MTOW (A350-900)', value: '280,000 kg' },
      { label: 'V1 (typical)', value: '~145 kt' },
      { label: 'Vr', value: '~155 kt' },
      { label: 'V2', value: '~160 kt' },
      { label: 'Vmo', value: '350 kt / M0.89' },
      { label: 'Vfe (Config 1)', value: '230 kt' },
      { label: 'Vfe (Full)', value: '185 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~2,600 m' },
      { label: 'Service Ceiling', value: '43,100 ft' },
    ],
    typicalNeedToKnow: [
      'Fly-by-wire 3rd generation — enhanced Normal Law with load alleviation',
      'Rolls-Royce Trent XWB engine management and FADEC',
      'Advanced avionics — OIS, MFD, FMS with FANS-C/ATN',
      'ETOPS 370 minute approval procedures',
      'Composite airframe awareness and inspection limitations',
      'A350 specific weight & balance — 369 PAX (3-class) configuration',
    ],
    atoCarousel: [
      { name: 'Airbus Training Centre', location: 'Toulouse, France', offers: ['A350-900', 'A350-1000'], img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg' },
      { name: 'FlightSafety International', location: 'Worldwide', offers: ['A350 Type Rating'], img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80' },
    ],
  },
  'airbus-a380': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Airbus_Logo_2017.svg/1200px-Airbus_Logo_2017.svg.png',
    manufacturerName: 'Airbus',
    firstFlight: 2005,
    avgRatingCostUSD: '$45,000–$75,000',
    pohUrl: 'https://www.scribd.com/document/254362201/Airbus-A380-Manual',
    pohDocs: [
      {
        label: 'Pilot Operating Handbook',
        embed: 'https://www.scribd.com/embeds/254362201/content?start_page=1&view_mode=scroll&access_key=key-dlI4DDFm4MiWtnkN3xdU',
        url: 'https://www.scribd.com/document/254362201/Airbus-A380-Manual#from_embed',
        author: 'NikolaMilović',
      },
      {
        label: 'Flight Crew Operating Manual (FCOM)',
        embed: 'https://www.scribd.com/embeds/455323866/content?start_page=1&view_mode=scroll&access_key=key-ivcVD6uOFhfDhPZpih1V',
        url: 'https://www.scribd.com/document/455323866/Airbus-a380-Fcom#from_embed',
        author: 'Iceman 29',
      },
    ],
    airlinesUsingFleet: [
      { name: 'Emirates', logo: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/emirates.jpg' },
      { name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
      { name: 'Qantas', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
      { name: 'British Airways', logo: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/british-airways.jpg' },
    ],
    specs: [
      { label: 'MTOW', value: '575,000 kg' },
      { label: 'V1 (typical)', value: '~150 kt' },
      { label: 'Vr', value: '~160 kt' },
      { label: 'V2', value: '~165 kt' },
      { label: 'Vmo', value: '340 kt / M0.89' },
      { label: 'Vfe (Config 1)', value: '230 kt' },
      { label: 'Vfe (Full)', value: '177 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~3,100 m' },
      { label: 'Service Ceiling', value: '43,000 ft' },
    ],
    typicalNeedToKnow: [
      'Fly-by-wire flight control laws — same philosophy as A320 but 4-engine logic',
      'Engine Alliance GP7200 / Rolls-Royce Trent 970 management',
      'Dual-deck cabin pressurisation and emergency evacuation',
      'ECAM multi-system monitoring across 4 engines',
      'Long-range ETOPS and oceanic track procedures',
      'A380 specific weight & balance — 853 PAX max configuration',
    ],
    atoCarousel: [
      { name: 'Airbus Training Centre', location: 'Toulouse, France', offers: ['A380 Type Rating', 'A380 Recurrency'], img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg' },
      { name: 'Emirates Flight Training Academy', location: 'Dubai, UAE', offers: ['A380 Type Rating'], img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
    ],
  },
  'atr-72': {
    manufacturerLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/ATR_Aircraft_logo.svg/1200px-ATR_Aircraft_logo.svg.png',
    manufacturerName: 'ATR',
    firstFlight: 1988,
    avgRatingCostUSD: '$20,000–$35,000',
    pohUrl: 'https://www.atr-aircraft.com/services/training',
    airlinesUsingFleet: [
      { name: 'Cebu Pacific', logo: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg' },
      { name: 'Philippine Airlines', logo: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg' },
    ],
    specs: [
      { label: 'MTOW (ATR 72-600)', value: '23,000 kg' },
      { label: 'Vr', value: '~105 kt' },
      { label: 'V2', value: '~115 kt' },
      { label: 'Vmo', value: '250 kt' },
      { label: 'Vfe (15°)', value: '185 kt' },
      { label: 'Takeoff Roll (SL/ISA)', value: '~1,250 m' },
    ],
    typicalNeedToKnow: [
      'PW127 turboprop engine management and NTS system',
      'Propeller autofeather and manual feather procedures',
      'Digital avionics suite — PFD/MFD/MCDU (Primus Epic)',
      'Icing and de-icing procedures (ATR is prone to ice-related incidents)',
      'Pressurization system and pressurization failure drills',
    ],
    atoCarousel: [
      { name: 'CAE', location: 'Clark, Philippines', offers: ['ATR 72-600'], img: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp' },
      { name: 'ATR Training Centre', location: 'Toulouse, France', offers: ['ATR 42', 'ATR 72'], img: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg' },
    ],
  },
};

function getAircraftInfo(aircraft: AircraftModel): AircraftInfo {
  if (aircraft.id.includes('tecnam-p2002'))
    return AIRCRAFT_INFO['tecnam-p2002'];
  if (aircraft.id === 'cessna-172' || aircraft.id === 'cessna-172-alt' || aircraft.id === 'cessna-172-cockpit')
    return AIRCRAFT_INFO['cessna-172'];
  if (aircraft.id === 'cessna-152')
    return AIRCRAFT_INFO['cessna-152'];
  if (aircraft.id === 'airbus-a380' || aircraft.id === 'airbus-a380-alt')
    return AIRCRAFT_INFO['airbus-a380'];
  if (aircraft.id.includes('a350'))
    return AIRCRAFT_INFO['airbus-a350'];
  if (aircraft.id.includes('a320') || aircraft.id.includes('a318') || aircraft.id.includes('a319') || aircraft.id.includes('a321'))
    return AIRCRAFT_INFO['airbus-a320'];
  if (aircraft.id.includes('737'))
    return AIRCRAFT_INFO['boeing-737'];
  if (aircraft.id.includes('atr'))
    return AIRCRAFT_INFO['atr-72'];
  return AIRCRAFT_INFO['default'];
}

// Age helper
function getAge(firstFlight: number) {
  return new Date().getFullYear() - firstFlight;
}

// Cache for fetched thumbnail URLs
const thumbnailCache: Record<string, string> = {};

function SketchfabThumbnail({
  sketchfabId,
  alt,
  className,
  onError,
}: {
  sketchfabId: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [src, setSrc] = useState<string | null>(thumbnailCache[sketchfabId] || null);
  const [loading, setLoading] = useState(!thumbnailCache[sketchfabId]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (thumbnailCache[sketchfabId]) {
      setSrc(thumbnailCache[sketchfabId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    let cancelled = false;
    fetch(`https://api.sketchfab.com/v3/models/${sketchfabId}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const images: any[] = data?.thumbnails?.images || [];
        const best = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];
        if (best?.url) {
          thumbnailCache[sketchfabId] = best.url;
          setSrc(best.url);
          setLoading(false);
        } else {
          setFailed(true);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [sketchfabId]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-200 animate-pulse`}>
        <Plane className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  if (failed || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100`}>
        <Plane className="w-10 h-10 text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
    />
  );
}

type Category = 'all' | 'commercial' | 'regional' | 'business-jet' | 'single-engine' | 'multi-engine' | 'turboprop' | 'jet' | 'cockpit' | 'amphibious' | 'vintage';

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'commercial': 'Commercial',
  'regional': 'Regional',
  'business-jet': 'Business Jets',
  'single-engine': 'Single Engine',
  'multi-engine': 'Multi Engine',
  'turboprop': 'Turboprop',
  'jet': 'Jet',
  'cockpit': 'Cockpits',
  'amphibious': 'Amphibious',
  'vintage': 'Vintage',
};

const CATEGORY_COLORS: Record<string, string> = {
  'commercial': 'bg-blue-500',
  'regional': 'bg-emerald-500',
  'business-jet': 'bg-purple-500',
  'single-engine': 'bg-sky-500',
  'multi-engine': 'bg-indigo-500',
  'turboprop': 'bg-teal-500',
  'jet': 'bg-rose-500',
  'cockpit': 'bg-amber-500',
  'amphibious': 'bg-cyan-500',
  'vintage': 'bg-orange-500',
};

const getCockpitUrl = (id: string): string | null => {
  if (id.includes('a320') || id.includes('a318') || id.includes('a319') || id.includes('a321'))
    return 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1';
  if (id.includes('737'))
    return 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark';
  if (id.includes('747'))
    return 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark';
  return null;
};

interface Props {
  onNavigate?: (page: string) => void;
}

export default function TypeRatingSearchPage({ onNavigate }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftModel | null>(null);
  const [showCockpit, setShowCockpit] = useState(false);
  const [viewerActivated, setViewerActivated] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const pohRef = useRef<HTMLDivElement>(null);
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  const filteredAircraft = aircraftModels.filter(a => {
    const matchesCat = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const el = carouselRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 288, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [filteredAircraft]);

  const scroll = (dir: 'left' | 'right') =>
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -288 : 288, behavior: 'smooth' });

  const handleSelect = (aircraft: AircraftModel) => {
    setSelectedAircraft(aircraft);
    setShowCockpit(false);
    setActiveDocIndex(0);
    setViewerActivated(false);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* Header Nav */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => onNavigate ? onNavigate('pathways-modern') : window.history.back()}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="WingMentor" className="h-8 w-auto object-contain" />
          <span className="text-sm font-semibold text-slate-900">Aircraft Type-Ratings</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-500 mb-3">3D Models & Type Rating Info</p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 text-slate-900">
            Aircraft <span style={{ color: '#DAA520' }}>Type Ratings</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 text-slate-500">
            Explore · 3D Models · Cockpits · Requirements
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search aircraft, type ratings, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all"
            />
          </div>

          {/* Category filter chips — directly below search */}
          <div className="mt-4 flex gap-1.5 flex-wrap justify-center">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedAircraft(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? `${CATEGORY_COLORS[cat] || 'bg-sky-500'} text-white shadow-sm`
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="px-0 mb-12">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Aircraft</h2>
            <p className="text-sm text-slate-500">{filteredAircraft.length} aircraft available</p>
          </div>
          {/* Scroll arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Edge-to-edge carousel */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {filteredAircraft.map(aircraft => (
            <div
              key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
              className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                selectedAircraft?.id === aircraft.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50'
                  : 'border-slate-200 hover:border-slate-400'
              } bg-white group`}
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <SketchfabThumbnail
                  sketchfabId={aircraft.sketchfabId}
                  alt={aircraft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-serif text-base leading-tight">{aircraft.name}</span>
                  <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                    <Plane className="w-3 h-3" />
                    {CATEGORY_LABELS[aircraft.category]}
                  </div>
                </div>
              </div>
              {/* Card body */}
              <div className="p-4">
                <div className="flex flex-wrap gap-1">
                  {aircraft.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state — no aircraft selected */}
      {!selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-16">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 md:p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center">
                <MousePointerClick className="w-10 h-10 text-sky-400" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-normal text-slate-800 mb-3">Select an Aircraft to Explore</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Choose any aircraft from the carousel above to view its interactive 3D model, cockpit, type rating requirements, training costs, manufacturer details, V-speed specs, POH access, and which airlines operate it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <Plane className="w-5 h-5 text-sky-500" />, label: '3D Model & Cockpit' },
                { icon: <DollarSign className="w-5 h-5 text-emerald-500" />, label: 'Avg. Rating Cost' },
                { icon: <Building2 className="w-5 h-5 text-purple-500" />, label: 'Airlines in Fleet' },
                { icon: <Gauge className="w-5 h-5 text-rose-500" />, label: 'V-Speeds & Specs' },
                { icon: <Calendar className="w-5 h-5 text-amber-500" />, label: 'Aircraft Age & History' },
                { icon: <FileText className="w-5 h-5 text-indigo-500" />, label: 'POH / Manual Access' },
                { icon: <BookOpen className="w-5 h-5 text-teal-500" />, label: 'Need-to-Know' },
                { icon: <Star className="w-5 h-5 text-yellow-500" />, label: 'Type Rating Centers' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                  <span className="text-xs font-medium text-slate-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Aircraft Detail Panel */}
      {selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

            {/* Hero image with overlay */}
            <div className="relative h-64 md:h-80">
              <SketchfabThumbnail
                sketchfabId={selectedAircraft.sketchfabId}
                alt={selectedAircraft.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}>
                    {CATEGORY_LABELS[selectedAircraft.category]}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAircraft.name}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src="/logo.png" alt="WingMentor" className="h-4 w-auto object-contain opacity-80" />
                    Model by {selectedAircraft.author}
                  </span>
                </div>
              </div>
            </div>

            {/* Info bar — manufacturer + cost + age */}
            {(() => {
              const info = getAircraftInfo(selectedAircraft);
              return (
                <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={info.manufacturerLogo} alt={info.manufacturerName} className="h-8 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400">Manufacturer</p>
                      <p className="text-sm font-semibold text-slate-800">{info.manufacturerName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Avg. Type Rating Cost</p>
                    <p className="text-sm font-semibold text-emerald-600">{info.avgRatingCostUSD}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">First Flight</p>
                    <p className="text-sm font-semibold text-slate-800">{info.firstFlight} <span className="text-xs text-slate-400 font-normal">({getAge(info.firstFlight)} yrs old)</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">POH / Manual</p>
                    {info.pohDocs?.length ? (
                      <button
                        onClick={() => pohRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Read Manual ↓
                      </button>
                    ) : (
                      <a href={info.pohUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Access PDF →
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Airlines in fleet */}
            {(() => {
              const info = getAircraftInfo(selectedAircraft);
              if (!info.airlinesUsingFleet.length) return null;
              return (
                <div className="px-6 md:px-8 py-5 border-b border-slate-100">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Airlines Operating This Type</p>
                  <div className="flex flex-wrap gap-3">
                    {info.airlinesUsingFleet.map(a => (
                      <div key={a.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                        <img src={a.logo} alt={a.name} className="h-6 w-10 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                        <span className="text-xs font-medium text-slate-700">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Description Section — requirements + specs */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Type Rating Requirements</h3>
                <ul className="space-y-2.5 mb-6">
                  {[
                    'Valid ATPL or frozen ATPL',
                    'Multi-Engine Instrument Rating (ME/IR)',
                    'Class 1 Medical Certificate',
                    'MCC course completion',
                    'ICAO English Level 4+',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Need to Know</h3>
                <ul className="space-y-2.5">
                  {getAircraftInfo(selectedAircraft).typicalNeedToKnow.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <BookOpen className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Performance Standards & V-Speeds</h3>
                <div className="space-y-2 mb-6">
                  {getAircraftInfo(selectedAircraft).specs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</span>
                      <span className="text-sm font-medium text-slate-800">{s.value}</span>
                    </div>
                  ))}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Recommended</h3>
                <ul className="space-y-2.5">
                  {[
                    'Prior experience on similar aircraft type',
                    'Simulator training at approved ATO',
                    'EBT / CBTA certification',
                    'Recent line experience (last 12 months)',
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Type Rating Centers carousel */}
            {(() => {
              const info = getAircraftInfo(selectedAircraft);
              return (
                <div className="px-6 md:px-8 py-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Recommended Type Rating Centers</h3>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('type-rating-centers')}
                        className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View All Centers →
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' } as React.CSSProperties}>
                    {info.atoCarousel.map((ato, i) => (
                      <div key={i} className="flex-shrink-0 w-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <div className="h-36 overflow-hidden">
                          <img src={ato.img} alt={ato.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm text-slate-900">{ato.name}</p>
                          <p className="text-xs text-slate-400 mb-2">{ato.location}</p>
                          <div className="flex flex-wrap gap-1">
                            {ato.offers.map(o => (
                              <span key={o} className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">{o}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* POH / Documents — tab selector + embedded reader */}
            {(() => {
              const info = getAircraftInfo(selectedAircraft);
              if (!info.pohDocs?.length) return null;
              const activeDoc = info.pohDocs[activeDocIndex] ?? info.pohDocs[0];
              return (
                <div ref={pohRef} className="px-6 md:px-8 py-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900">Aircraft Manuals</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium">Official Documents</span>
                  </div>
                  {/* Document tab selector */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {info.pohDocs.map((doc, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDocIndex(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                          activeDocIndex === i
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {doc.label}
                      </button>
                    ))}
                  </div>
                  {/* Embedded reader */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <iframe
                      key={activeDocIndex}
                      src={activeDoc.embed}
                      title={activeDoc.label}
                      width="100%"
                      height="700"
                      frameBorder="0"
                      scrolling="no"
                      allowFullScreen
                      className="w-full block"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    <a href={activeDoc.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{activeDoc.label}</a> via Scribd · by {activeDoc.author}
                  </p>
                </div>
              );
            })()}

            {/* 3D Viewer Section — tab switch above, full-width viewer below */}
            <div className="p-6 md:p-8">
              {/* Tab toggle */}
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => { setShowCockpit(false); setViewerActivated(false); }}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!showCockpit ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Aircraft Full View 3D
                </button>
                {selectedAircraft.category !== 'cockpit' && (
                  <button
                    onClick={() => { setShowCockpit(true); setViewerActivated(false); }}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showCockpit ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Cockpit View
                  </button>
                )}
              </div>

              {/* Full-width viewer with tint overlay — iframe lazy-loaded on click */}
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative group">
                {viewerActivated && (
                  !showCockpit ? (
                    <iframe
                      key={selectedAircraft.id + '-full'}
                      src={selectedAircraft.embedUrl.includes('autostart') ? selectedAircraft.embedUrl : selectedAircraft.embedUrl + '&autostart=1'}
                      className="w-full h-full"
                      title={selectedAircraft.title}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                    />
                  ) : getCockpitUrl(selectedAircraft.id) ? (
                    <iframe
                      key={selectedAircraft.id + '-cockpit'}
                      src={getCockpitUrl(selectedAircraft.id)! + (getCockpitUrl(selectedAircraft.id)!.includes('autostart') ? '' : '&autostart=1')}
                      className="w-full h-full"
                      title={`${selectedAircraft.name} Cockpit`}
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      Cockpit view not available for this aircraft
                    </div>
                  )
                )}
                {/* WingMentor overlay — click to activate + lazy-load iframe */}
                {!viewerActivated && (
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300"
                    onClick={() => setViewerActivated(true)}
                  >
                    <div className="text-center select-none">
                      <img src="/logo.png" alt="WingMentor" className="w-40 h-40 object-contain mx-auto mb-2" />
                      <p className="text-white font-semibold text-lg mb-1">Click to Interact</p>
                      <p className="text-white/70 text-sm">Enable 3D aircraft controls</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags & link */}
            <div className="px-6 md:px-8 pb-6 border-t border-slate-100 pt-5">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedAircraft.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={selectedAircraft.modelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                View on Sketchfab →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
