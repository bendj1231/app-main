import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, MapPin, Globe, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { PathwaysHeader } from '../components/website/components/PathwaysHeader';

interface RatingCenter {
  id: string;
  name: string;
  shortName: string;
  location: string;
  flag: string;
  logo: string;
  heroImg: string;
  website: string;
  description: string;
  typesOffered: string[];
  highlights: string[];
  approvals: string[];
  contact: { phone?: string; email?: string };
}

const CENTERS: RatingCenter[] = [
  {
    id: 'cae-clark',
    name: 'CAE Clark Philippines',
    shortName: 'CAE',
    location: 'Clark, Philippines',
    flag: '🇵🇭',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/CAE_Inc._logo.svg/1200px-CAE_Inc._logo.svg.png',
    heroImg: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp',
    website: 'https://www.cae.com',
    description: "CAE Clark is the Philippines' premier CAAP-approved type rating training center, offering full-flight simulator training for the Airbus A320 family and ATR 72-600. Located within Clark International Airport, it serves pilots from across Asia-Pacific.",
    typesOffered: ['Airbus A320 Family', 'ATR 72-600', 'Boeing 737 NG'],
    highlights: [
      'Level D Full Flight Simulators (FFS)',
      'CAAP & EASA approved training organization',
      'MCC / JOC programs available',
      'Integrated airline cadet pipeline partnerships',
      'EBT / CBTA compliant curriculum',
    ],
    approvals: ['CAAP', 'CAAC', 'EASA', 'GCAA'],
    contact: { email: 'civilaviation@cae.com', phone: '+63 45 499 2100' },
  },
  {
    id: 'airbus-toulouse',
    name: 'Airbus Training Centre',
    shortName: 'Airbus Training',
    location: 'Toulouse, France',
    flag: '🇫🇷',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Airbus_Logo_2017.svg/1200px-Airbus_Logo_2017.svg.png',
    heroImg: 'https://i.ytimg.com/vi/kreOPxL7b9w/sddefault.jpg',
    website: 'https://www.airbus.com/en/products-services/commercial-aircraft/the-airbus-difference/airbus-services/airbus-training',
    description: "The Airbus Training Centre in Toulouse is the OEM-authorised centre of excellence for all Airbus type ratings. With the world's largest fleet of Airbus simulators, it offers the most comprehensive and authoritative type rating programs directly from the manufacturer.",
    typesOffered: ['Airbus A220', 'Airbus A320 Family', 'Airbus A330', 'Airbus A350', 'Airbus A380'],
    highlights: [
      'OEM-direct training — highest authority for Airbus types',
      'Largest Airbus simulator fleet in the world',
      'All variants of A320neo family (A318/A319/A320/A321)',
      'A350 XWB and A380 programs',
      'Type rating + recurrency + instructor courses',
    ],
    approvals: ['EASA', 'FAA', 'CAAC', 'Multiple NAAs'],
    contact: { email: 'training@airbus.com' },
  },
  {
    id: 'flightsafety-atlanta',
    name: 'FlightSafety International',
    shortName: 'FlightSafety',
    location: 'Atlanta, USA',
    flag: '🇺🇸',
    logo: 'https://i.ytimg.com/vi/0CAFr1Rojhw/maxresdefault.jpg',
    heroImg: 'https://i.ytimg.com/vi/0CAFr1Rojhw/maxresdefault.jpg',
    website: 'https://www.flightsafety.com',
    description: "FlightSafety International is one of the world's largest aviation training organisations with 30+ locations globally. Their Atlanta Learning Center specialises in Airbus type ratings for the US market with FAA Part 142 approval.",
    typesOffered: ['Airbus A320 Type Rating', 'Boeing 737', 'Boeing 747', 'Cessna Citation', 'Bombardier Challenger'],
    highlights: [
      'FAA Part 142 approved training center',
      'Full-motion Level D simulators for all types',
      'Airline partner programs (Delta, United, American)',
      'Initial, upgrade, and recurrency training',
      'Instructor qualification courses (TRI/SFI)',
    ],
    approvals: ['FAA Part 142', 'EASA', 'Transport Canada'],
    contact: { email: 'info@flightsafety.com', phone: '+1 918 259 4000' },
  },
  {
    id: 'boeing-miami',
    name: 'Boeing Flight Services',
    shortName: 'Boeing',
    location: 'Miami, USA',
    flag: '🇺🇸',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Boeing_full_logo.svg/1200px-Boeing_full_logo.svg.png',
    heroImg: 'https://services.boeing.com/bgsmedias/sys_master/migrated_images2/Migrated_images2/h8b/hed/8943855108126/8943855108126.jpg',
    website: 'https://www.boeing.com/commercial/services/flight-services',
    description: "Boeing Flight Services operates the world's largest OEM-direct type rating network for Boeing aircraft. The Miami location is the primary hub for B737 NG and MAX training, serving Latin American and North American operators.",
    typesOffered: ['Boeing 737 NG', 'Boeing 737 MAX', 'Boeing 777', 'Boeing 787 Dreamliner'],
    highlights: [
      'OEM-direct Boeing type rating authority',
      'B737 MAX difference training (post-AD)',
      'ETOPS, RNP AR and special operations training',
      'Integrated airline training contracts',
      'EASA and FAA dual approval',
    ],
    approvals: ['FAA Part 142', 'EASA', 'CAAC', 'GCAA'],
    contact: { email: 'flightservices@boeing.com' },
  },
  {
    id: 'atr-toulouse',
    name: 'ATR Training Centre',
    shortName: 'ATR Training',
    location: 'Toulouse, France',
    flag: '🇫🇷',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/ATR_Aircraft_logo.svg/1200px-ATR_Aircraft_logo.svg.png',
    heroImg: 'https://www.atr-aircraft.com/wp-content/uploads/2020/06/ATR-71691MD-1024x682.jpg',
    website: 'https://www.atr-aircraft.com/services/training',
    description: "The ATR Training Centre is the OEM-authorised training organisation for all ATR turboprop type ratings. Located at Toulouse-Blagnac Airport, it provides the most authoritative ATR 42 and ATR 72 initial type rating and recurrency training worldwide.",
    typesOffered: ['ATR 42-500', 'ATR 42-600', 'ATR 72-500', 'ATR 72-600'],
    highlights: [
      'OEM-direct ATR type rating authority',
      'Primus Epic avionics deep-dive module',
      'ATR-specific icing awareness training',
      'PW127 engine management focus',
      'Dedicated cadet pathway integration',
    ],
    approvals: ['EASA', 'DGAC', 'Multiple NAAs'],
    contact: { email: 'training@atr-aircraft.com' },
  },
  {
    id: 'gta-manila',
    name: 'Global Training Aviation',
    shortName: 'GTA',
    location: 'Manila, Philippines',
    flag: '🇵🇭',
    logo: 'https://globaltrainingaviation.com/wp-content/uploads/2024/09/DSC_7096-15.png',
    heroImg: 'https://globaltrainingaviation.com/wp-content/uploads/2024/09/DSC_7096-15.png',
    website: 'https://globaltrainingaviation.com',
    description: 'Global Training Aviation (GTA) Philippines is a Manila-based EASA-certified training organisation providing Airbus A320 type ratings for both local and international airline candidates. With EASA-certified instructors and a curriculum aligned to international standards, GTA bridges Filipino pilot talent with global airline requirements.',
    typesOffered: ['Airbus A320 Type Rating', 'MCC / JOC', 'Multi-crew Cooperation'],
    highlights: [
      'EASA-certified flight instructors',
      'Airbus A320 family type rating program',
      'Catering to local and international airline standards',
      'Manila-based — ideal for Filipino and Asian pilot candidates',
      'CAAP-aligned training curriculum',
    ],
    approvals: ['EASA', 'CAAP'],
    contact: { email: 'info@globaltrainingaviation.com' },
  },
  {
    id: 'ryanair-trto',
    name: 'Ryanair TRTO / AFTA',
    shortName: 'Ryanair TRTO',
    location: 'Dublin, Ireland',
    flag: '🇮🇪',
    logo: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png',
    heroImg: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png',
    website: 'https://careers.ryanair.com',
    description: "Ryanair operates its own EASA-approved TRTO in partnership with Atlantic Flight Training Academy (AFTA), offering B737 NG and MAX type ratings tailored for direct-entry and cadet pilots joining Ryanair's fleet with direct line training on actual routes.",
    typesOffered: ['Boeing 737 NG', 'Boeing 737 MAX'],
    highlights: [
      'Direct pathway to Ryanair First Officer seat',
      'Ryanair Future Flyer cadet program integration',
      'B737 MAX specific training post-AD',
      'Line training on actual Ryanair routes',
      'EASA-approved structured programme',
    ],
    approvals: ['EASA', 'IAA'],
    contact: { email: 'pilotrecruitment@ryanair.com' },
  },
];

interface Props {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export default function TypeRatingCentersPage({ onBack, onNavigate }: Props) {
  const [selected, setSelected] = useState<RatingCenter | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [selected]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PathwaysHeader onBack={onBack} onNavigate={onNavigate} />

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-500 mb-3">Global Training Network</p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 text-slate-900">
            Type Rating <span style={{ color: '#DAA520' }}>Centers</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Approved training organisations offering type rating programs across the globe. Select a center to explore aircraft types, approvals, and contact details.
          </p>
        </div>
      </div>

      {/* Centers grid */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CENTERS.map(center => (
            <div
              key={center.id}
              onClick={() => setSelected(prev => prev?.id === center.id ? null : center)}
              className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 bg-white group ${
                selected?.id === center.id
                  ? 'ring-2 ring-sky-500 border-sky-400 shadow-lg'
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={center.heroImg}
                  alt={center.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-white font-serif text-base leading-tight">{center.shortName}</p>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{center.location}
                    </p>
                  </div>
                  <span className="text-2xl">{center.flag}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3 h-7">
                  <img
                    src={center.logo}
                    alt={center.name}
                    className="h-6 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {center.typesOffered.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">{t}</span>
                  ))}
                  {center.typesOffered.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">+{center.typesOffered.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-16">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

            {/* Hero */}
            <div className="relative h-64 md:h-72">
              <img
                src={selected.heroImg}
                alt={selected.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selected.logo}
                    alt={selected.name}
                    className="h-8 object-contain bg-white/20 backdrop-blur px-2 py-0.5 rounded"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-2xl">{selected.flag}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-1">{selected.name}</h2>
                <p className="text-sky-300 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />{selected.location}
                </p>
              </div>
            </div>

            {/* Info bar */}
            <div className="px-6 md:px-8 py-4 flex flex-wrap gap-5 border-b border-slate-100 items-center">
              <a href={selected.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium">
                <Globe className="w-4 h-4" /> Visit Website
              </a>
              {selected.contact.phone && (
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />{selected.contact.phone}
                </span>
              )}
              {selected.contact.email && (
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />{selected.contact.email}
                </span>
              )}
              <div className="ml-auto flex flex-wrap gap-1.5">
                {selected.approvals.map(a => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">{a}</span>
                ))}
              </div>
            </div>

            {/* Description + details */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">About</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{selected.description}</p>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Aircraft Types Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.typesOffered.map(t => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full font-medium bg-sky-50 text-sky-700 border border-sky-200">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Program Highlights</h3>
                <ul className="space-y-2.5 mb-6">
                  {selected.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{h}
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mb-3 text-slate-900">Regulatory Approvals</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.approvals.map(a => (
                    <span key={a} className="text-xs px-3 py-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 md:px-8 py-5 flex items-center gap-4">
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply / Enquire →
              </a>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('type-rating-search')}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Browse Aircraft Type Ratings
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
