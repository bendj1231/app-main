export type Region = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa' | 'Middle East';

export interface FlightSchool {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  image: string;
  region: Region;
  claimed?: boolean;
  fleet?: string[];
  offerings?: string[];
  pilotsTrained?: number;
  established?: number;
  website?: string;
  pathwayScore?: number;
}

// Dummy flight school cards - CAAP Approved Philippine Schools
export const DUMMY_FLIGHT_SCHOOLS: FlightSchool[] = [
  {
    id: 'wingmentor-intro',
    name: 'PilotRecognition',
    description: 'Welcome to PilotRecognition Flight Schools. Navigate through our carousel to discover CAAP-approved Philippine flight schools. Click on any card to learn more about their programs.',
    location: 'Philippines',
    rating: 5.0,
    price: 'N/A',
    image: '',
    region: 'All' as Region
  },
  // Clark & Pampanga Hub
  {
    id: 'flight-school-1',
    name: 'Alpha Aviation Group (AAG)',
    description: 'One of the largest independent MPL training providers in the region. CAAP-certified ATO and TRTO, EASA-accredited for specific simulator levels. Airline-ready CBTA philosophy with high placement rates into Cebu Pacific, Philippine Airlines, and AirAsia. APP graduates since 2011: 1,800+.',
    location: 'Jose Abad Santos Avenue, Clark Freeport Zone, Pampanga, Philippines',
    rating: 4.9,
    price: '~$60,000–$62,000 (Full CPL/APP) / $25,000–$35,000 (A320 Type Rating/FOT)',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404520/flight-schools/aag.jpg',
    region: 'Asia' as Region,
    fleet: [
      'Cessna 172 (G1000 equipped) — up to 32 aircraft region-wide',
      'Piper PA-44 Seminole',
      'Airbus A320 Full Flight Simulator (Level D) ×2',
      'Airbus A330/A340 Full Flight Simulator (Level D) ×1',
      'MPS A320 Fixed Base Simulator',
      'Alsim FNPT II',
    ],
    offerings: [
      'Airline Pilot Program (APP) — 18-month ab-initio to FO',
      'First Officer Transition (FOT) — A320 Type Rating',
      'Multi-Crew Pilot License (MPL)',
      'CPL (Single & Multi-Engine)',
      'Instrument Rating (IR)',
      'CBTA / Competency-Based Training',
      'Recurrent Training',
    ],
    pilotsTrained: 1800,
    established: 1999,
    website: 'https://aag.aero',
    pathwayScore: 94,
  },
  {
    id: 'flight-school-2',
    name: 'Omni Aviation Corporation',
    description: 'The only IATA-authorized training center in the Philippines. CAAP-certified ATO operating a 32-hectare complex with a private 640-meter asphalt runway at Clark. Four specialized schools: Pilot Training, Cabin Crew, Maintenance, and Airline Services. Founded 1993 by Capt. Ben Hur Gomez. Hosts CAAP Off-site Examinations.',
    location: 'Manuel A. Roxas Highway, Clark Freeport Zone, Pampanga, Philippines',
    rating: 4.8,
    price: '~$8,000–$10,000 (PPL) / $48,000–$52,000 (ACTP 200-hr incl. JOC & IR)',
    image: 'https://omni-aviation.digiteer.dev/bg-about.jpg',
    region: 'Asia' as Region,
    fleet: [
      'Cessna 152 (primary trainer) ×15+',
      'Cessna 172 (incl. G1000 equipped)',
      'Piper Seneca PA-34-200 (multi-engine)',
      'Flight Training Devices (FTD) — instrument & procedural',
    ],
    offerings: [
      'PPL (Private Pilot License)',
      'CPL (Commercial Pilot License)',
      'Instrument Rating (IR)',
      'Multi-Engine Rating (MER)',
      'Jet Orientation Course (JOC)',
      'Airline Cabin Crew Training (DPR partnership)',
      'Aircraft Maintenance Technology (CAAP TLP)',
      'Dangerous Goods Regulations (IATA DGR)',
      'Airline Services / Ground Crew Training',
    ],
    pilotsTrained: 2400,
    established: 1993,
    website: 'https://omniaviation.com',
    pathwayScore: 89,
  },
  {
    id: 'flight-school-3',
    name: 'CAE Philippines (PAAT)',
    description: 'Joint venture between CAE and Cebu Pacific Air. Premier Level D simulator center in the Philippines, offering A320 and ATR 72-600 type ratings. Official training partner for Cebu Pacific Air and AirAsia Philippines. CAAP-approved ATO.',
    location: 'Clark Freeport Zone, Philippines',
    rating: 4.9,
    price: '$24,000 – $40,000 (Type Rating) / ~$77,000 (Full Cadet Programme)',
    image: 'https://aviationnewsphilippines.wordpress.com/wp-content/uploads/2014/01/paat.jpg',
    region: 'Asia' as Region,
    fleet: ['Airbus A320 Full Flight Simulator (Level D) ×3', 'ATR 72-600 Full Flight Simulator (Level D) ×1'],
    offerings: ['A320 Type Rating', 'ATR 72-600 Type Rating', 'Cebu Pacific Cadet Pilot Programme', 'AirAsia Philippines Cadet Programme', 'ATPL Ground School', 'Recurrent Training'],
    pilotsTrained: 1200,
    established: 2013,
    website: 'https://www.cae.com/civil-aviation/locations/asia-pacific/cae-philippines/',
    pathwayScore: 97,
  },
  {
    id: 'flight-school-4',
    name: 'Delta Air International Aviation Academy (DAIAA)',
    description: 'CAAP-approved ATO (licensed through March 2027), subsidiary of the AMA Education System. Full-suite pilot and maintenance training from PPL through FIL. Operates a private 525 m² hangar at Plaridel Airport. Blended learning via AMAES.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.6,
    price: '~$8,000–$10,000 (PPL) / $53,000–$57,000 (Full CPL/IR International)',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404520/flight-schools/aag.jpg',
    region: 'Asia' as Region,
    fleet: ['Cessna 152 ×5', 'Cessna 172 ×2', 'Piper Seneca PA-34-200 ×2', 'Redbird MCX Full Motion Simulator'],
    offerings: ['PPL (Single & Multi-Engine Land)', 'CPL (Single & Multi-Engine Land)', 'Instrument Rating (IR)', 'Flight Instructor License (FIL)', 'Crew Resource Management (CRM)', 'Aircraft Maintenance Technology', 'Aviation Electronics Technology'],
    website: 'https://daiaa.com.ph',
    pathwayScore: 72,
  },
  {
    id: 'flight-school-5',
    name: 'APG International Aviation Academy',
    description: 'Long-standing school based in Mabalacat City with comprehensive training programs.',
    location: 'Mabalacat City, Pampanga, Philippines',
    rating: 4.7,
    price: '$14,000 - $21,000',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-6',
    name: 'FDSA Aviation College',
    description: 'CAAP ATOC renewed December 2024 (5-year term). Comprehensive aviation college offering both flight training and degree programs. Located beside St. Raphael Hospital, Mabalacat City, with access to Clark International Airport for flight phases. Active participant in the CAAP ATO Summit.',
    location: 'BKN Bldg., McArthur Hi-way, Dau, Mabalacat City, Pampanga, Philippines',
    rating: 4.5,
    price: '~$45,000–$55,000 (Full CPL/IR — approx. ₱2.5M–₱3M)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/06/FDSA航空科学技術大学.jpg',
    region: 'Asia' as Region,
    fleet: [
      'Cessna 152 (multiple units)',
      'Cessna 172 (multiple units)',
      'Piper Seneca PA-34 (multi-engine)',
    ],
    offerings: [
      'PPL (Private Pilot License)',
      'CPL (Commercial Pilot License)',
      'Instrument Rating (IR)',
      'Multi-Engine Rating (MER)',
      'BS Aeronautical Engineering',
      'BS Aircraft Maintenance Technology',
      'BS Aviation Electronics Technology',
    ],
    website: 'https://fdsaaviation.com',
    pathwayScore: 82,
  },
  // Subic & Zambales Hub
  {
    id: 'flight-school-7',
    name: 'All Asia Aviation Academy (AAA)',
    description: 'The only Philippine flight school following Japanese management and safety standards. Operates its own Aircraft Maintenance Organization (AMO) ensuring all trainers are maintained on-site. Based at Iba Airport — uncontrolled airspace enabling high-frequency training without commercial traffic delays. CAAP ATOC valid through Aug 16, 2026.',
    location: 'Iba Airport, Iba, Zambales, Philippines',
    rating: 4.5,
    price: '~$48,000–$58,000 (Full CPL/IR/ME "zero-to-hero" — approx. ₱2.7M–₱3.2M)',
    image: 'https://aaa-central.com/wp-content/uploads/2022/04/Aerial172_trainingfleets.jpg',
    region: 'Asia' as Region,
    fleet: [
      'Cessna 152 ×13 (primary trainer)',
      'Cessna 172 ×3 (incl. G1000 equipped — RP-C 1767)',
      'Tecnam P2006T (multi-engine)',
      'Piper Seneca PA-34-200 (multi-engine)',
      'Redbird MCX Full Motion Simulator',
    ],
    offerings: [
      'Airline Assessment Qualification (AAQ) — flagship airline-readiness programme',
      'PPL (Private Pilot License)',
      'CPL (Commercial Pilot License)',
      'Instrument Rating (IR)',
      'Multi-Engine Rating (MER)',
      'Flight Instructor (FI) Course',
      'In-house Aircraft Maintenance (AMO)',
    ],
    website: 'https://aaa-central.com',
    pathwayScore: 88,
  },
  {
    id: 'flight-school-8',
    name: 'Leading Edge International Aviation Academy (LEIAAI)',
    description: 'CAAP ATOC active for pilot and maintenance training. Unique "Summer Pilot Pass" programme and integrated AMT school. Main base at San Fernando Airport (Poro Point), La Union — low commercial traffic for high training efficiency. Satellite offices in Cebu and Taguig. 650+ pilots trained.',
    location: 'San Fernando Airport (Poro Point), La Union, Philippines (+ Cebu & Taguig satellites)',
    rating: 4.9,
    price: '~$38,000–$48,000 (Full PPL-CPL-IR — approx. ₱2.2M–₱2.8M)',
    image: 'https://cdn.flightsim.to/images/26/tecnam-p2006t---leading-edge-international-aviation-academy-321711-1695483794-YDehO.jpg',
    region: 'Asia' as Region,
    fleet: [
      'Cessna 172 ×23 (core fleet)',
      'Cessna 152 (aerobatic/upset recovery)',
      'Tecnam P2006T (multi-engine)',
      'Redbird Flight Simulators',
      'Computer-Based Training (CBT) systems',
    ],
    offerings: [
      'PPL (Private Pilot License)',
      'CPL (Commercial Pilot License)',
      'Instrument Rating (IR)',
      'Multi-Engine Rating (MER)',
      'Flight Instructor (FI) Course',
      'ATPL Ground School',
      'Aircraft Maintenance Technician (AMT) — 2-year diploma',
      'Summer Pilot Pass Programme',
    ],
    pilotsTrained: 650,
    established: 2008,
    website: 'https://leadingedge.com.ph',
    pathwayScore: 91,
  },
  {
    id: 'flight-school-9',
    name: 'Laminar Aviation',
    description: 'Based at Subic International Airport, popular for its modern fleet and IR training.',
    location: 'Subic Bay Freeport Zone, Zambales, Philippines',
    rating: 4.9,
    price: '$15,000 - $22,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404524/flight-schools/laminar.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-10',
    name: 'AERO Equipt Aviation Inc.',
    description: 'A well-established training center within the Subic Bay Freeport Zone.',
    location: 'Olongapo City, Zambales, Philippines',
    rating: 4.7,
    price: '$12,500 - $18,500',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404525/flight-schools/aero-equipt.jpg',
    region: 'Asia' as Region
  },
  // Bulacan (Plaridel) Hub
  {
    id: 'flight-school-11',
    name: 'Masters Flying School',
    description: 'One of the oldest schools in Plaridel, offering PPL, CPL, and IR courses. Historic aviation hub near Manila.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.6,
    price: '$11,000 - $17,000',
    image: 'https://www.mastersflyingschool.com/files/photo_gallery/13-156.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-12',
    name: 'Strike Wing Aviation',
    description: 'Known for technical and flight training with a focus on safety and discipline.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.7,
    price: '$12,000 - $18,000',
    image: 'https://strikewingph.com/wp-content/uploads/2025/09/Slideshow2.webp',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-13',
    name: 'Precision Flight Controls',
    description: 'Specializes in pilot training and simulation services.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.5,
    price: '$13,000 - $19,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404534/flight-schools/precision-flight.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-14',
    name: 'Fliteline Aviation School',
    description: 'Provides comprehensive ground and flight training for aspiring commercial pilots.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.4,
    price: '$11,500 - $17,500',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-15',
    name: 'Aviation Masters Academy',
    description: 'Offers specialized courses in flight and ground schooling.',
    location: 'Plaridel, Bulacan, Philippines',
    rating: 4.5,
    price: '$12,000 - $18,000',
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    region: 'Asia' as Region
  },
  // Cebu & Visayas Hub
  {
    id: 'flight-school-16',
    name: 'Airworks Aviation Academy',
    description: 'The largest school in the Visayas; key partner for airline cadetship programs. Main training hub for central and southern Philippines.',
    location: 'Cebu City, Philippines',
    rating: 4.8,
    price: '$14,000 - $20,000',
    image: 'https://insiderph.com/uploads/articles/thumb_cebu-pacific-airworks-open-program-for-4th-batch-of-aspiring-cadet-pilots-3-1280x960.webp',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-17',
    name: 'Contrails International Aviation Academy',
    description: 'Operates from Mactan-Cebu International Airport with comprehensive training programs.',
    location: 'Cebu City, Philippines',
    rating: 4.7,
    price: '$15,000 - $22,000',
    image: 'https://cdn.jetphotos.com/full/6/1652396_1711448287.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-18',
    name: 'Cebu Aeronautical Technical School (CATS)',
    description: 'One of the oldest aeronautical schools in the country with established training programs.',
    location: 'Cebu City, Philippines',
    rating: 4.6,
    price: '$13,000 - $19,000',
    image: 'https://www.cats.edu.ph/images/catsfsuits.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-19',
    name: 'Indiana Aerospace University',
    description: 'Offers degree programs integrated with flight training in Lapu-Lapu City.',
    location: 'Lapu-Lapu City, Philippines',
    rating: 4.7,
    price: '$20,000 - $35,000',
    image: 'https://iau.com.ph/dev/wp-content/uploads/2022/05/277174556_5012682215445256_6046942567345249772_n.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-20',
    name: 'Aeronavigation Academy International',
    description: 'Based in Negros Occidental at Bacolod-Silay Airport.',
    location: 'Bacolod City, Philippines',
    rating: 4.5,
    price: '$13,500 - $19,500',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404527/flight-schools/aeronavigation.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-21',
    name: 'Continental Aero Flying School',
    description: 'Long-running school serving the Visayas region.',
    location: 'Cebu City, Philippines',
    rating: 4.4,
    price: '$12,000 - $18,000',
    image: 'https://www.continentalaero.com/wp-content/uploads/2023/11/210-CENTURION-Banner.jpg',
    region: 'Asia' as Region
  },
  // Manila & Southern Luzon Hub
  {
    id: 'flight-school-22',
    name: 'Philippine Airlines (PAL) Aviation School',
    description: 'The premier training arm of the national flag carrier with world-class facilities.',
    location: 'Manila, Philippines',
    rating: 4.9,
    price: '$18,000 - $26,000',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLBLsxaLunaswh_0K_GW62zR2EEKnKH9aZyPnUVcBzSN9hNoIl1_XBMQamO-LJSWhMGBAvRHuHaDMqZGI-YXbU3RJPibAk8EkRX2l4yNOy9z_wJt6XHQJuWXiL2tri2u9fjhyphenhyphenjLWUxPPg/s1600/Clark+Facade.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-23',
    name: 'Air Link International Aviation College',
    description: 'Offers a wide array of aviation-related bachelor\'s degrees and pilot licenses in Pasay.',
    location: 'Pasay City, Philippines',
    rating: 4.7,
    price: '$25,000 - $40,000',
    image: 'https://cdn.manilastandard.net/wp-content/uploads/2020/11/c9cfb_airlink.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-24',
    name: 'PATTS College of Aeronautics',
    description: 'A massive institution in Parañaque known for aeronautical engineering and flight training.',
    location: 'Parañaque City, Philippines',
    rating: 4.6,
    price: '$30,000 - $50,000',
    image: 'https://static.where-e.com/Philippines/Metro_Manila/Patts-College-Of-Aeronautics_bd0ec344fde40318d224d68875629b71.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-25',
    name: 'Sapphire International Aviation Academy',
    description: 'Has training bases in both Calapan (Mindoro) and Puerto Princesa (Palawan).',
    location: 'Calapan, Philippines',
    rating: 4.5,
    price: '$13,000 - $19,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404543/flight-schools/sapphire.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-26',
    name: 'WCC Aviation Company',
    description: 'Features a massive training campus in Binalonan, Pangasinan with its own airfield.',
    location: 'Binalonan, Pangasinan, Philippines',
    rating: 4.7,
    price: '$14,000 - $21,000',
    image: 'https://www.wccaviation.com/frontend/images/ss_thumbnail.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-27',
    name: 'Eagle Air Academy',
    description: 'Operates from Gasan Airport in Marinduque.',
    location: 'Gasan, Marinduque, Philippines',
    rating: 4.4,
    price: '$11,500 - $17,500',
    image: 'https://eagleair.academy/wp-content/uploads/2021/06/EA-Hangar.webp',
    region: 'Asia' as Region
  },
  // Mindanao & Other Regional Hubs
  {
    id: 'flight-school-28',
    name: 'St. Alexius College Flying School',
    description: 'A leading school in Davao City, offering PPL, CPL, IR, and FI programs.',
    location: 'Davao City, Philippines',
    rating: 4.6,
    price: '$13,000 - $19,000',
    image: 'https://i.ytimg.com/vi/PLHqN9Q0mJY/maxresdefault.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-29',
    name: 'MATS College of Technology',
    description: 'A staple institution in Davao City for aviation technical and pilot courses.',
    location: 'Davao City, Philippines',
    rating: 4.5,
    price: '$12,500 - $18,500',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404528/flight-schools/mats.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-30',
    name: 'Topflite Academy of Aviation',
    description: 'Recently expanded operations at Bicol International Airport.',
    location: 'Albay, Philippines',
    rating: 4.4,
    price: '$12,000 - $18,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404529/flight-schools/topflite.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-31',
    name: 'Cyclone Flying School',
    description: 'Based at Cauayan Airport in Isabela.',
    location: 'Cauayan, Isabela, Philippines',
    rating: 4.5,
    price: '$11,500 - $17,500',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-32',
    name: 'Echo Air International',
    description: 'Operates from Tuguegarao Airport in Cagayan Valley.',
    location: 'Tuguegarao, Philippines',
    rating: 4.4,
    price: '$11,000 - $17,000',
    image: 'https://echoairaviationacademy.com/assets/img/echo-air-aviation.webp',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-33',
    name: 'Camiguin Aviation Holdings',
    description: 'A boutique training center located in Camiguin.',
    location: 'Camiguin, Philippines',
    rating: 4.6,
    price: '$13,000 - $19,000',
    image: 'https://www.camiguinaviation.com/images/our-aircraft-compressed.png',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-34',
    name: 'Orient Aviation Corporation',
    description: 'Another training facility based in Tuguegarao.',
    location: 'Tuguegarao, Philippines',
    rating: 4.5,
    price: '$12,000 - $18,000',
    image: 'https://orientflights.com/wp-content/uploads/2025/07/OFAA-Gallery6-1200x900.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-35',
    name: 'Fast Aviation Academy',
    description: 'Formerly known as Flight & Simulator Training (FAST), based in Pasay.',
    location: 'Pasay City, Philippines',
    rating: 4.4,
    price: '$12,500 - $18,500',
    image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=506,fit=crop/NdZJ0ctrIN4Cw5Yv/476022351_1011412874346989_4391702872587576357_n-KgDNcw0fRk62TxMw.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-36',
    name: 'Adventure Flight Education',
    description: 'Operates training bases in Cebu and Davao.',
    location: 'Davao City, Philippines',
    rating: 4.5,
    price: '$13,000 - $19,000',
    image: 'https://www.adventureflight.ph/wp-content/uploads/2021/09/20210513_144610-1024x576.jpg',
    region: 'Asia' as Region
  },
  // Specialized & Academic Institutions
  {
    id: 'flight-school-37',
    name: 'Echo Air International',
    description: 'Operates from Tuguegarao Airport in Cagayan Valley.',
    location: 'Tuguegarao, Philippines',
    rating: 4.4,
    price: '$11,000 - $17,000',
    image: 'https://echoairaviationacademy.com/assets/img/echo-air-aviation.webp',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-38',
    name: 'National Aviation Academy (PhilSCA)',
    description: 'The primary public aviation college in the Philippines.',
    location: 'Manila, Philippines',
    rating: 4.7,
    price: '$25,000 - $40,000',
    image: 'https://media.assettype.com/tribune/2025-09-13/ezzapxei/viberimage2025-09-1318-57-43-277.png?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-39',
    name: 'Feati University',
    description: 'Offers ground schooling and aeronautical engineering programs in Manila.',
    location: 'Manila, Philippines',
    rating: 4.5,
    price: '$20,000 - $35,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404531/flight-schools/feati.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-40',
    name: 'Holy Angel University',
    description: 'Provides aviation management and degree-related training in Pampanga.',
    location: 'Angeles City, Pampanga, Philippines',
    rating: 4.6,
    price: '$22,000 - $38,000',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404532/flight-schools/holy-angel.jpg',
    region: 'Asia' as Region
  },
  // International schools for other regions
  {
    id: 'flight-school-42',
    name: 'Helicopter Flight School',
    description: 'Specialized helicopter pilot training',
    location: 'Colorado, USA',
    rating: 4.5,
    price: '$30,000 - $45,000',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    region: 'Americas' as Region
  },
  {
    id: 'flight-school-43',
    name: 'European Flight Academy',
    description: 'Leading European flight training center',
    location: 'Berlin, Germany',
    rating: 4.8,
    price: '$35,000 - $55,000',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    region: 'Europe' as Region
  },
  {
    id: 'flight-school-44',
    name: 'Asia Pacific Aviation',
    description: 'Regional training provider',
    location: 'Singapore',
    rating: 4.6,
    price: '$28,000 - $42,000',
    image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-45',
    name: 'Australian Pilot Academy',
    description: 'Australia-based flight school',
    location: 'Sydney, Australia',
    rating: 4.7,
    price: '$32,000 - $48,000',
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    region: 'Oceania' as Region
  },
  {
    id: 'flight-school-46',
    name: 'Middle East Flight Training',
    description: 'Aviation academy in the Middle East',
    location: 'Dubai, UAE',
    rating: 4.5,
    price: '$30,000 - $45,000',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    region: 'Middle East' as Region
  },
  {
    id: 'flight-school-47',
    name: 'African Aviation School',
    description: 'Flight training in Africa',
    location: 'Johannesburg, South Africa',
    rating: 4.4,
    price: '$25,000 - $38,000',
    image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80',
    region: 'Africa' as Region
  }
];

// Helper function to get count of Philippine CAAP-approved flight schools
export const getPhilippianFlightSchoolCount = (): number => {
  return DUMMY_FLIGHT_SCHOOLS.filter(school => 
    school.id !== 'wingmentor-intro' && 
    school.region === 'Asia' && 
    school.location.includes('Philippines')
  ).length;
};
