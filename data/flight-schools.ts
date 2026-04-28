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
    description: 'Specializes in "Airline-Ready" cadet programs with advanced A320 simulators. Premier center for airline-affiliated and advanced glass-cockpit training.',
    location: 'Clark Freeport Zone, Philippines',
    rating: 4.9,
    price: '$16,000 - $25,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv7LKWKHRjos2ghlBs8xA1mJ_t_JwFpD_7fg&s',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-2',
    name: 'Omni Aviation Corporation',
    description: 'A major IATA-authorized center offering a full range of pilot and cabin crew courses. Leading aviation school in Clark.',
    location: 'Clark Freeport Zone, Philippines',
    rating: 4.8,
    price: '$15,000 - $22,000',
    image: 'https://omni-aviation.digiteer.dev/bg-about.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-3',
    name: 'Philippine Academy for Aviation Training (PAAT)',
    description: 'A joint venture between CAE and Cebu Pacific, focusing on type rating and cadet pilot training.',
    location: 'Clark Freeport Zone, Philippines',
    rating: 4.9,
    price: '$18,000 - $28,000',
    image: 'https://aviationnewsphilippines.wordpress.com/wp-content/uploads/2014/01/paat.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-4',
    name: 'Delta Air International Aviation Academy',
    description: 'Operates from Clark and Bulacan, offering flexible commercial pilot programs.',
    location: 'Clark Freeport Zone / Plaridel, Bulacan, Philippines',
    rating: 4.6,
    price: '$13,000 - $20,000',
    image: 'https://scontent.fcrk2-4.fna.fbcdn.net/v/t39.30808-6/496131912_1080891020736183_5817780301479090649_n.jpg?stp=cp6_dst-jpg_p960x960_tt6&_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeGyFOEA0UP2_NP5Yoy9BSfsssh424-CkZ-yyHjbj4KRn6MHSIIjVz4HIwAM6mVtWgu7eXZvpDDihmzpo1iXmOdY&_nc_ohc=Bc5pj7GdgWUQ7kNvwFvrEW5&_nc_oc=AdrChyg4KLKKyPLNYENCzCORMu4A2mSAzWHqDNz2YTiOL8dbPF8dgp2YTBAnQqAn6F0&_nc_zt=23&_nc_ht=scontent.fcrk2-4.fna&_nc_gid=aQnuEgQCBCdk6n0eXxUryA&_nc_ss=7b2a8&oh=00_Af2ZqB0vlZsLQmpanEbePAN0Ie7-LhWuRdimJYghJOsZpA&oe=69F52744',
    region: 'Asia' as Region
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
    description: 'Formerly Flight Dynamics School, based in Mabalacat with modern training facilities.',
    location: 'Mabalacat City, Pampanga, Philippines',
    rating: 4.5,
    price: '$12,000 - $18,000',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/06/FDSA航空科学技術大学.jpg',
    region: 'Asia' as Region
  },
  // Subic & Zambales Hub
  {
    id: 'flight-school-7',
    name: 'All Asia Aviation Academy',
    description: 'Follows Japanese management standards; offers a popular First Officer Airline program. Ideal for uncongested airspace training.',
    location: 'Iba, Zambales, Philippines',
    rating: 4.5,
    price: '$13,500 - $19,500',
    image: 'https://aaa-central.com/wp-content/uploads/2022/04/Aerial172_trainingfleets.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-8',
    name: 'Leading Edge International Aviation Academy',
    description: 'Known for high-quality instruction and airline-standard curricula in Subic Bay Freeport Zone.',
    location: 'Subic Bay Freeport Zone, Zambales, Philippines',
    rating: 4.9,
    price: '$14,000 - $20,000',
    image: 'https://cdn.flightsim.to/images/26/tecnam-p2006t---leading-edge-international-aviation-academy-321711-1695483794-YDehO.jpg',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-9',
    name: 'Laminar Aviation',
    description: 'Based at Subic International Airport, popular for its modern fleet and IR training.',
    location: 'Subic Bay Freeport Zone, Zambales, Philippines',
    rating: 4.9,
    price: '$15,000 - $22,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmaP25JHAtQK4DWTSRBSiMkCnpUlhEIcUqgw&s',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-10',
    name: 'AERO Equipt Aviation Inc.',
    description: 'A well-established training center within the Subic Bay Freeport Zone.',
    location: 'Olongapo City, Zambales, Philippines',
    rating: 4.7,
    price: '$12,500 - $18,500',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBSDGuQtiAdIZcgc4DXTZPaUYeQu_Pv5rwoA&s',
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
    image: 'https://lh5.googleusercontent.com/proxy/k1zgkepKBAvOEp_pBC0VzSo-7edGvQ2j4aJDa6RgktVM7fo8Lb4oSuFW3klotriJMqVDYFGoZWMhgCNq4fzx3teFhnkClfdDRjSgiBN43w3nxxF8u89vK2rFpeYpXPdpytyqONVyHkAhnFE5',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-RRN2DRaEJ1NrlUypB7fczYeJy7sCXqur0w&s',
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
    image: 'https://media.licdn.com/dms/image/v2/C511BAQFOrsd3ai-Z1Q/company-background_10000/company-background_10000/0/1584483184299/sapphire_international_aviation_academy_cover?e=2147483647&v=beta&t=Aqf-KitwRAivzSjBllie107hKT1n237HlDFiBcwDRjU',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIckZgmh25I9UrgEfsMv5-GLLHPD2IxHxlzA&s',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-30',
    name: 'Topflite Academy of Aviation',
    description: 'Recently expanded operations at Bicol International Airport.',
    location: 'Albay, Philippines',
    rating: 4.4,
    price: '$12,000 - $18,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiOFBxq_3MhWv4qJzcOE_QWQPMoikg1SZrcg&s',
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
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoeyZuLb_aVS9GeKlORPolYhyhm420V0-7Dg&s',
    region: 'Asia' as Region
  },
  {
    id: 'flight-school-40',
    name: 'Holy Angel University',
    description: 'Provides aviation management and degree-related training in Pampanga.',
    location: 'Angeles City, Pampanga, Philippines',
    rating: 4.6,
    price: '$22,000 - $38,000',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBsVrTdC2aMqjJIBSvyPxEdSX7jDOm3Ya2MA&s',
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
