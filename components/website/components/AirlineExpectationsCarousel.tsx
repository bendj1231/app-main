"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMAGES } from '../../../src/lib/website-constants';
import { useAuth } from '../../../src/contexts/AuthContext';

interface AirlineExpectationsCarouselProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
}

const fadeInStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;

interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
  locationFlag?: string;
  fleet?: string;
}

const airlines: Airline[] = [
  {
    id: 'qatar',
    name: 'Qatar Airways',
    location: 'Qatar',
    salaryRange: '$120,000 - $250,000/year',
    flightHours: '4,000+ hrs TT',
    tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
    image: '/images/airline-expectations/qatar-airways.jpg',
    description: 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. With competitive tax-free salary packages, modern aircraft fleet, and rapid career progression opportunities.',
    fleet: 'Boeing 777, 787, Airbus A350, A380 - One of the youngest fleets globally with an average age of just 5 years'
  },
  {
    id: 'singapore',
    name: 'Singapore Airlines',
    location: 'Singapore',
    salaryRange: '$120,000 - $180,000/year',
    flightHours: '3,000+ hrs TT',
    tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'],
    image: '/images/airline-expectations/singapore-airlines.jpg',
    description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location. The airline provides excellent training and career development opportunities.',
    fleet: 'Airbus A350, A380, Boeing 777, 787 - Operating one of the worlds most modern fleets with cutting-edge cabin technology'
  },
  {
    id: 'cathay',
    name: 'Cathay Pacific',
    location: 'Hong Kong',
    salaryRange: '$110,000 - $160,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['5-Star Airline', 'Asian Network', 'Career Growth'],
    image: '/images/airline-expectations/cathay-pacific.jpg',
    description: 'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage and strong career progression pathways. The airline is known for its professional development programs.',
    fleet: 'Airbus A350, A330, Boeing 777 - Modern wide-body fleet focused on long-haul Asian and trans-Pacific routes'
  },
  {
    id: 'emirates',
    name: 'Emirates',
    location: 'UAE',
    salaryRange: '$130,000 - $280,000/year',
    flightHours: '4,000+ hrs TT',
    tags: ['5-Star Airline', 'Global Network', 'Tax-Free'],
    image: '/images/airline-expectations/emirates.png',
    description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.',
    fleet: 'Airbus A380, Boeing 777 - Worlds largest operator of both A380 and 777 aircraft with 250+ wide-bodies'
  },
  {
    id: 'etihad',
    name: 'Etihad Airways',
    location: 'UAE',
    salaryRange: '$115,000 - $200,000/year',
    flightHours: '2,500+ hrs TT',
    image: '/images/airline-expectations/etihad-airways-new.jpg',
    tags: ['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'],
    description: 'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.',
    fleet: 'Boeing 787, 777, Airbus A350, A380 - Modern fuel-efficient fleet with state-of-the-art cabins and sustainable aviation focus'
  },
  {
    id: 'lufthansa',
    name: 'Lufthansa',
    location: 'Germany',
    salaryRange: '$90,000 - $160,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['European Leader', 'Star Alliance', 'Career Stability'],
    image: '/images/airline-expectations/lufthansa.jpg',
    description: 'Lufthansa is Europes largest airline and a founding member of Star Alliance. It offers excellent career stability, comprehensive benefits, and opportunities to fly to over 200 destinations worldwide.',
    fleet: 'Airbus A350, A330, Boeing 747-8, 777 - Mixed fleet with both modern twins and iconic 747 operations'
  },
  {
    id: 'british',
    name: 'British Airways',
    location: 'United Kingdom',
    salaryRange: '$85,000 - $150,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Legacy Carrier', 'Heathrow Hub', 'Global Network'],
    image: '/images/airline-expectations/british-airways.jpg',
    description: 'British Airways operates from its hub at London Heathrow, offering pilots access to a vast global network. The airline provides competitive European salaries and excellent training programs.',
    fleet: 'Boeing 777, 787, Airbus A350, A380 - Flag carrier with diverse long-haul fleet and A380 operations'
  },
  {
    id: 'airfrance',
    name: 'Air France',
    location: 'France',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['French Flagship', 'CDG Hub', 'European Routes'],
    image: '/images/airline-expectations/air-france.jpg',
    description: 'Air France is the French flag carrier with a rich history dating back to 1933. Pilots enjoy working in a multicultural environment with excellent French employment benefits and protections.',
    fleet: 'Boeing 777, 787, Airbus A350, A330 - Modern wide-body fleet serving global destinations from Paris'
  },
  {
    id: 'klm',
    name: 'KLM',
    location: 'Netherlands',
    salaryRange: '$75,000 - $135,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Dutch Legacy', 'Amsterdam Hub', 'Efficient Operations'],
    image: '/images/airline-expectations/klm.jpg',
    description: 'KLM Royal Dutch Airlines is the oldest airline still operating under its original name. Known for efficient operations and excellent pilot relations, it offers a stable European career path.',
    fleet: 'Boeing 777, 787, Airbus A330 - Efficient mixed fleet with strong focus on sustainability and biofuel initiatives'
  },
  {
    id: 'swiss',
    name: 'Swiss International',
    location: 'Switzerland',
    salaryRange: '$95,000 - $155,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Premium Service', 'Swiss Quality', 'Zurich Hub'],
    image: '/images/airline-expectations/swiss.jpg',
    description: 'Swiss International Air Lines combines traditional Swiss quality with modern aviation standards. Pilots benefit from excellent working conditions and the prestigious Swiss aviation heritage.',
    fleet: 'Airbus A320 family, A330, A340 - Premium narrow and wide-body fleet serving European and intercontinental routes'
  },
  {
    id: 'turkish',
    name: 'Turkish Airlines',
    location: 'Turkey',
    salaryRange: '$70,000 - $130,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Fast Growing', 'Istanbul Hub', '120+ Countries'],
    image: '/images/airline-expectations/turkish-airlines.jpg',
    description: 'Turkish Airlines flies to more countries than any other airline. With its modern Istanbul Airport hub, it offers pilots exposure to diverse international routes and rapid fleet expansion.',
    fleet: 'Boeing 737, 777, 787, Airbus A320, A330, A350 - One of the largest fleets globally with 400+ aircraft serving 120+ countries'
  },
  {
    id: 'ana',
    name: 'ANA All Nippon',
    location: 'Japan',
    salaryRange: '$100,000 - $170,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['5-Star Airline', 'Tokyo Hub', 'Japanese Quality'],
    image: '/images/airline-expectations/ana.jpg',
    description: 'ANA is Japans largest airline and a 5-star carrier renowned for exceptional service. Pilots benefit from Japanese precision, excellent training, and access to key Asian markets.',
    fleet: 'Boeing 777, 787, Airbus A380, A320 - Japans largest fleet with extensive Dreamliner operations and unique A380 configurations'
  },
  {
    id: 'jal',
    name: 'Japan Airlines',
    location: 'Japan',
    salaryRange: '$95,000 - $165,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Premium Service', 'Tokyo Hub', 'Domestic + International'],
    image: '/images/airline-expectations/japan-airlines.jpg',
    description: 'Japan Airlines represents the finest in Japanese hospitality combined with aviation excellence. The airline offers pilots diverse flying between extensive domestic and international networks.',
    fleet: 'Boeing 737, 767, 777, 787, Airbus A350 - Diverse fleet offering pilots experience across multiple aircraft types'
  },
  {
    id: 'korean',
    name: 'Korean Air',
    location: 'South Korea',
    salaryRange: '$85,000 - $150,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Seoul Hub', 'North American Routes', 'Growing Fleet'],
    image: '/images/airline-expectations/korean-air.jpg',
    description: 'Korean Air is South Koreas flagship carrier with a strong presence on trans-Pacific routes. Pilots enjoy competitive Asian compensation and a modern, expanding aircraft fleet.'
  },
  {
    id: 'asiana',
    name: 'Asiana Airlines',
    location: 'South Korea',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Star Alliance', 'Incheon Hub', 'Service Excellence'],
    image: '/images/airline-expectations/asiana-airlines.webp',
    description: 'Asiana Airlines is known for outstanding service quality and safety standards. The airline provides pilots with excellent training and opportunities on both regional and long-haul routes.'
  },
  {
    id: 'thai',
    name: 'Thai Airways',
    location: 'Thailand',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bangkok Hub', 'Southeast Asian Network', 'Royal Service'],
    image: '/images/airline-expectations/thai-airways.jpg',
    description: 'Thai Airways offers a unique blend of Thai hospitality and international aviation standards. Pilots enjoy living in Thailand while flying to destinations across Asia and beyond.'
  },
  {
    id: 'malaysia',
    name: 'Malaysia Airlines',
    location: 'Malaysia',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['KL Hub', 'Southeast Asia', 'OneWorld Member'],
    image: '/images/airline-expectations/malaysia-airlines.jpg',
    description: 'Malaysia Airlines connects Southeast Asia with the world from its Kuala Lumpur hub. The airline offers pilots competitive compensation and exposure to diverse Asian markets.'
  },
  {
    id: 'garuda',
    name: 'Garuda Indonesia',
    location: 'Indonesia',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Jakarta Hub', 'Archipelago Network', 'Growing Market'],
    image: '/images/airline-expectations/garuda-indonesia.jpg',
    description: 'Garuda Indonesia serves the worlds largest archipelago nation. Pilots benefit from rapid fleet modernization and the opportunity to fly across one of Earths most diverse geographic areas.'
  },
  {
    id: 'philippine',
    name: 'Philippine Airlines',
    location: 'Philippines',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Manila Hub', 'Pacific Routes', 'Historic Carrier'],
    image: '/images/airline-expectations/philippine-airlines.webp',
    description: 'Philippine Airlines is Asias oldest commercial airline. It offers pilots a unique base in the Philippines with growing international connections to North America and Asia.'
  },
  {
    id: 'vietnam',
    name: 'Vietnam Airlines',
    location: 'Vietnam',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Hanoi Hub', 'Growing Economy', 'Modern Fleet'],
    image: '/images/airline-expectations/vietnam-airlines.jpg',
    description: 'Vietnam Airlines represents one of Asias fastest-growing economies. The airline is rapidly modernizing its fleet and expanding international routes, offering pilots excellent growth opportunities.'
  },
  {
    id: 'china',
    name: 'Air China',
    location: 'China',
    salaryRange: '$70,000 - $120,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Beijing Hub', 'Largest Market', 'Star Alliance'],
    image: '/images/airline-expectations/air-china.jpg',
    description: 'Air China is the flag carrier of the Peoples Republic of China and the worlds largest aviation market. Pilots have access to an unmatched domestic network and growing international presence.'
  },
  {
    id: 'chinaeastern',
    name: 'China Eastern',
    location: 'China',
    salaryRange: '$65,000 - $115,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Shanghai Hub', 'Skyteam Member', 'Major Player'],
    image: '/images/airline-expectations/china-eastern.jpg',
    description: 'China Eastern Airlines operates from Shanghai, connecting China with the world. The airline offers pilots opportunities in one of the fastest-growing aviation markets globally.'
  },
  {
    id: 'chinasouthern',
    name: 'China Southern',
    location: 'China',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Guangzhou Hub', 'Largest Fleet', 'Asia Focus'],
    image: '/images/airline-expectations/china-southern.jpg',
    description: 'China Southern operates Chinas largest fleet with extensive Asian coverage. Pilots benefit from modern aircraft and the opportunity to fly within the dynamic Chinese aviation sector.'
  },
  {
    id: 'delta',
    name: 'Delta Air Lines',
    location: 'United States',
    salaryRange: '$110,000 - $250,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'],
    image: '/images/airline-expectations/delta.jpg',
    description: 'Delta is the worlds largest airline by revenue and fleet size. It offers pilots industry-leading compensation, excellent benefits, and a vast domestic and international network from its Atlanta hub.',
    fleet: 'Airbus A220, A320, A330, A350, Boeing 737, 757, 767, 777 - Industry-leading fleet diversity with modern Airbus A350 operations'
  },
  {
    id: 'american',
    name: 'American Airlines',
    location: 'United States',
    salaryRange: '$100,000 - $230,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Worlds Largest', 'Dallas Hub', 'Oneworld Leader'],
    image: '/images/airline-expectations/american-airlines.jpg',
    description: 'American Airlines is the worlds largest airline by fleet size and passengers carried. Pilots enjoy extensive route options and competitive US major airline compensation packages.',
    fleet: 'Airbus A320, A321, Boeing 737, 777, 787 - Largest fleet in the world with 900+ aircraft including flagship 787 Dreamliners'
  },
  {
    id: 'united',
    name: 'United Airlines',
    location: 'United States',
    salaryRange: '$105,000 - $240,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Global Network', 'Chicago Hub', 'Star Alliance'],
    image: '/images/airline-expectations/united.jpg',
    description: 'United Airlines offers one of the most comprehensive global networks. With hubs across the US and Star Alliance membership, pilots have unmatched international flying opportunities.',
    fleet: 'Airbus A319, A320, Boeing 737, 757, 767, 777, 787 - Global network carrier with extensive wide-body fleet for international routes'
  },
  {
    id: 'southwest',
    name: 'Southwest Airlines',
    location: 'United States',
    salaryRange: '$95,000 - $200,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost Leader', 'Domestic Focus', 'Great Culture'],
    image: '/images/airline-expectations/southwest.jpg',
    description: 'Southwest Airlines is the worlds largest low-cost carrier. Known for excellent pilot relations and unique company culture, it offers pilots stable domestic routes and profit-sharing benefits.'
  },
  {
    id: 'alaska',
    name: 'Alaska Airlines',
    location: 'United States',
    salaryRange: '$90,000 - $180,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['West Coast', 'Seattle Hub', 'Award Winning'],
    image: '/images/airline-expectations/alaska-airlines.jpg',
    description: 'Alaska Airlines is consistently rated among the best US airlines. With its Seattle hub and West Coast focus, it offers pilots a unique blend of domestic and Pacific Northwest flying.'
  },
  {
    id: 'jetblue',
    name: 'JetBlue Airways',
    location: 'United States',
    salaryRange: '$85,000 - $170,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['New York Hub', 'Transcontinental', 'Modern Experience'],
    image: '/images/airline-expectations/jetblue.jpg',
    description: 'JetBlue Airways revolutionized US domestic travel with its premium economy approach. Based in New York, it offers pilots modern aircraft and transcontinental premium routes.'
  },
  {
    id: 'aircanada',
    name: 'Air Canada',
    location: 'Canada',
    salaryRange: '$80,000 - $160,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Star Alliance', 'Transatlantic'],
    image: '/images/airline-expectations/air-canada.jpg',
    description: 'Air Canada is Canadas flag carrier and largest airline. Pilots enjoy flying to over 200 destinations worldwide and excellent Canadian employment benefits and protections.'
  },
  {
    id: 'westjet',
    name: 'WestJet',
    location: 'Canada',
    salaryRange: '$70,000 - $140,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Calgary Hub', 'Canadian Leader', 'Growing International'],
    image: '/images/airline-expectations/westjet.jpg',
    description: 'WestJet is Canadas second-largest airline and growing internationally. It offers pilots a more relaxed Canadian work environment with expanding long-haul opportunities.'
  },
  {
    id: 'qantas',
    name: 'Qantas',
    location: 'Australia',
    salaryRange: '$95,000 - $180,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Sydney Hub', 'Oneworld', 'Safest Airline'],
    image: '/images/airline-expectations/qantas.jpg',
    description: 'Qantas is Australias flag carrier and one of the worlds safest airlines. Known for its Sydney-London Kangaroo Route, it offers pilots iconic long-haul flying and excellent safety culture.'
  },
  {
    id: 'virginaustralia',
    name: 'Virgin Australia',
    location: 'Australia',
    salaryRange: '$75,000 - $145,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brisbane Hub', 'Competitive Service', 'Domestic Network'],
    image: '/images/airline-expectations/virgin-australia.png',
    description: 'Virgin Australia brings competitive service to the Australian market. Pilots enjoy modern aircraft and a focus on customer experience within the vast Australian domestic network.'
  },
  {
    id: 'latam',
    name: 'LATAM Airlines',
    location: 'Chile',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'South America', 'Largest Regional'],
    image: '/images/airline-expectations/latam.jpg',
    description: 'LATAM is Latin Americas largest airline group. From Santiago, pilots access an unmatched South American network combined with growing long-haul international routes.'
  },
  {
    id: 'avianca',
    name: 'Avianca',
    location: 'Colombia',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Bogota Hub', 'Star Alliance', 'Historic Airline'],
    image: '/images/airline-expectations/avianca.jpg',
    description: 'Avianca is one of the worlds oldest continuously operating airlines. Its Bogota hub provides pilots access to diverse South American and growing North American destinations.'
  },
  {
    id: 'aeromexico',
    name: 'Aeromexico',
    location: 'Mexico',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mexico City Hub', 'Skyteam', 'Regional Leader'],
    image: '/images/airline-expectations/aeromexico.jpg',
    description: 'Aeromexico connects Latin America with the world from Mexico City. As a Skyteam member, it offers pilots codeshare opportunities and exposure to the dynamic Mexican market.'
  },
  {
    id: 'copaair',
    name: 'Copa Airlines',
    location: 'Panama',
    salaryRange: '$65,000 - $125,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Panama Hub', 'Hub Americas', 'Star Alliance'],
    image: '/images/airline-expectations/copa-airlines.jpg',
    description: 'Copa Airlines operates the Hub of the Americas in Panama. Pilots benefit from the strategic location connecting North and South America with efficient narrowbody operations.'
  },
  {
    id: 'gol',
    name: 'GOL Linhas',
    location: 'Brazil',
    salaryRange: '$55,000 - $105,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Sao Paulo Hub', 'Low Cost Brazil', 'Domestic Leader'],
    image: '/images/airline-expectations/gol.jpg',
    description: 'GOL is Brazils largest domestic airline. It offers pilots the opportunity to fly within one of the worlds most geographically diverse countries with excellent South American connections.'
  },
  {
    id: 'elal',
    name: 'El Al Israel',
    location: 'Israel',
    salaryRange: '$70,000 - $130,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Tel Aviv Hub', 'Middle East', 'Security Expert'],
    image: '/images/airline-expectations/el-al.jpg',
    description: 'El Al is Israels flag carrier known for exceptional security standards. Pilots benefit from unique Middle Eastern operations and diverse international routes from Tel Aviv.'
  },
  {
    id: 'royaljordanian',
    name: 'Royal Jordanian',
    location: 'Jordan',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Amman Hub', 'Oneworld', 'Middle East Gateway'],
    image: '/images/airline-expectations/royal-jordanian.jpg',
    description: 'Royal Jordanian serves as a bridge between East and West from Amman. The airline offers pilots unique Middle Eastern operations with Oneworld alliance benefits.'
  },
  {
    id: 'saudia',
    name: 'Saudia',
    location: 'Saudi Arabia',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Jeddah Hub', 'Skyteam', 'Growing Network'],
    image: '/images/airline-expectations/saudia.jpg',
    description: 'Saudia is Saudi Arabias flag carrier undergoing rapid transformation. Pilots have opportunities in a rapidly modernizing fleet with growing international destinations.'
  },
  {
    id: 'egyptair',
    name: 'EgyptAir',
    location: 'Egypt',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Cairo Hub', 'Star Alliance', 'African Network'],
    image: '/images/airline-expectations/egyptair.jpg',
    description: 'EgyptAir connects Africa with the world from historic Cairo. Pilots benefit from unique African operations and ancient history while flying modern aircraft across diverse international routes.'
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian Airlines',
    location: 'Ethiopia',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Addis Ababa Hub', 'Star Alliance', 'African Leader'],
    image: '/images/airline-expectations/ethiopian-airlines.jpg',
    description: 'Ethiopian Airlines is Africas largest and most successful airline. From Addis Ababa, pilots access the continents most extensive network with modern Boeing and Airbus aircraft.'
  },
  {
    id: 'southafrican',
    name: 'South African Airways',
    location: 'South Africa',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Johannesburg Hub', 'Star Alliance', 'Southern Africa'],
    image: '/images/airline-expectations/south-african-airways.jpg',
    description: 'South African Airways connects the African continent from Johannesburg. Pilots enjoy diverse flying opportunities across Africa and international routes with Star Alliance benefits.'
  },
  // Additional European Airlines
  {
    id: 'iberia',
    name: 'Iberia',
    location: 'Spain',
    salaryRange: '$65,000 - $115,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Madrid Hub', 'Oneworld', 'Latin America Routes'],
    image: '/images/airline-expectations/iberia.jpg',
    description: 'Iberia is Spains flagship carrier with strong connections to Latin America. Pilots benefit from excellent Spanish employment benefits and extensive transatlantic operations.'
  },
  {
    id: 'alitalia',
    name: 'ITA Airways',
    location: 'Italy',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Rome Hub', 'Skyteam', 'Mediterranean Network'],
    image: '/images/airline-expectations/ita-airways.jpg',
    description: 'ITA Airways represents the rebirth of Italian aviation. Operating from Rome with modern Airbus fleet, offering pilots Mediterranean and intercontinental routes.'
  },
  {
    id: 'austrian',
    name: 'Austrian Airlines',
    location: 'Austria',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Vienna Hub', 'Star Alliance', 'Eastern Europe'],
    image: '/images/airline-expectations/austrian-airlines.jpg',
    description: 'Austrian Airlines serves as the gateway to Eastern Europe from Vienna. Part of Lufthansa Group with excellent European career development opportunities.'
  },
  {
    id: 'brussels',
    name: 'Brussels Airlines',
    location: 'Belgium',
    salaryRange: '$58,000 - $105,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brussels Hub', 'Star Alliance', 'Africa Routes'],
    image: '/images/airline-expectations/brussels-airlines.jpg',
    description: 'Brussels Airlines is Belgiums flagship carrier with extensive African network. Part of Lufthansa Group offering pilots unique African and European routes.'
  },
  {
    id: 'sas',
    name: 'SAS Scandinavian',
    location: 'Denmark/Norway/Sweden',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Copenhagen Hub', 'Star Alliance', 'Nordic Network'],
    image: '/images/airline-expectations/sas.jpg',
    description: 'SAS serves Scandinavia with Copenhagen, Oslo and Stockholm hubs. Known for excellent pilot work-life balance and strong Nordic labor protections.'
  },
  {
    id: 'finnair',
    name: 'Finnair',
    location: 'Finland',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Helsinki Hub', 'Oneworld', 'Asia Routes'],
    image: '/images/airline-expectations/finnair.jpg',
    description: 'Finnair offers the shortest route between Europe and Asia via Helsinki. Modern Airbus A350 fleet with excellent focus on Asian markets.'
  },
  {
    id: 'tap',
    name: 'TAP Portugal',
    location: 'Portugal',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Lisbon Hub', 'Star Alliance', 'Brazil Routes'],
    image: '/images/airline-expectations/tap-portugal.jpg',
    description: 'TAP Portugal connects Europe to Brazil and Africa from Lisbon. Known for warm Portuguese culture and growing international network.'
  },
  {
    id: 'aegean',
    name: 'Aegean Airlines',
    location: 'Greece',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Athens Hub', 'Star Alliance', 'Island Network'],
    image: '/images/airline-expectations/aegean.jpg',
    description: 'Aegean Airlines is Greeces largest carrier with extensive island network. Star Alliance member offering pilots unique Mediterranean flying.'
  },
  {
    id: 'lot',
    name: 'LOT Polish',
    location: 'Poland',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Warsaw Hub', 'Star Alliance', 'Eastern Europe'],
    image: '/images/airline-expectations/lot-polish.jpg',
    description: 'LOT Polish Airlines is Eastern Europes leading carrier. Growing long-haul network with Boeing 787 Dreamliners from Warsaw Chopin Airport.'
  },
  {
    id: 'czech',
    name: 'Czech Airlines',
    location: 'Czech Republic',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Prague Hub', 'Skyteam', 'Central Europe'],
    image: '/images/airline-expectations/czech-airlines.jpg',
    description: 'Czech Airlines serves Central Europe from historic Prague. One of the worlds oldest airlines with growing European network.'
  },
  {
    id: 'norwegian',
    name: 'Norwegian',
    location: 'Norway',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Low Cost', 'Oslo Hub', 'Transatlantic'],
    image: '/images/airline-expectations/norwegian.jpg',
    description: 'Norwegian revolutionized low-cost transatlantic travel. Rebuilt fleet offering pilots extensive European and long-haul operations.'
  },
  {
    id: 'icelandair',
    name: 'Icelandair',
    location: 'Iceland',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Reykjavik Hub', 'Iceland', 'North Atlantic'],
    image: '/images/airline-expectations/icelandair.jpg',
    description: 'Icelandair offers unique North Atlantic operations via Reykjavik. Pilots experience challenging weather operations and stunning scenery.'
  },
  // Additional Asian Airlines
  {
    id: 'cathaydragon',
    name: 'Cathay Dragon',
    location: 'Hong Kong',
    salaryRange: '$70,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Regional', 'Hong Kong Hub', 'Asia Network'],
    image: '/images/airline-expectations/cathay-dragon.webp',
    description: 'Cathay Dragon served regional Asian destinations from Hong Kong. Now integrated into Cathay Pacific with excellent regional opportunities.'
  },
  {
    id: 'hkexpress',
    name: 'HK Express',
    location: 'Hong Kong',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Hong Kong Hub', 'Asia Routes'],
    image: '/images/airline-expectations/hk-express.jpg',
    description: 'HK Express is Hong Kongs low-cost carrier. Part of Cathay Pacific group offering pilots dynamic short-haul Asian operations.'
  },
  {
    id: 'scoot',
    name: 'Scoot',
    location: 'Singapore',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Long Haul LCC'],
    image: '/images/airline-expectations/scoot.webp',
    description: 'Scoot is Singapore Airlines low-cost subsidiary. Operates Boeing 787 long-haul low-cost routes across Asia and beyond.'
  },
  {
    id: 'jetstar',
    name: 'Jetstar Asia',
    location: 'Singapore',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Regional'],
    image: '/images/airline-expectations/jetstar-asia.jpg',
    description: 'Jetstar Asia serves regional Southeast Asian markets. Part of Qantas Group offering pilots diverse Asian low-cost operations.'
  },
  {
    id: 'peach',
    name: 'Peach Aviation',
    location: 'Japan',
    salaryRange: '$40,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Osaka Hub', 'Domestic Japan'],
    image: '/images/airline-expectations/peach-aviation.jpg',
    description: 'Peach Aviation is Japans leading low-cost carrier. Based in Osaka with extensive domestic and regional Asian network.'
  },
  {
    id: 'spring',
    name: 'Spring Airlines',
    location: 'China',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Shanghai Hub', 'Largest LCC'],
    image: '/images/airline-expectations/spring-airlines.jpg',
    description: 'Spring Airlines is Chinas largest low-cost carrier. Based in Shanghai with extensive domestic Chinese network.'
  },
  {
    id: 'indigo',
    name: 'IndiGo',
    location: 'India',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', 'Indias Largest'],
    image: '/images/airline-expectations/indigo.jpg',
    description: 'IndiGo is Indias largest airline by passengers. Fast-growing low-cost carrier with extensive domestic and international network.'
  },
  {
    id: 'airindia',
    name: 'Air India',
    location: 'India',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mumbai Hub', 'Star Alliance', 'Historic Carrier'],
    image: '/images/airline-expectations/air-india.png',
    description: 'Air India is Indias flag carrier now part of Tata Group. Star Alliance member with extensive international network from Mumbai and Delhi.'
  },
  {
    id: 'spicejet',
    name: 'SpiceJet',
    location: 'India',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', 'Budget Carrier'],
    image: '/images/airline-expectations/spicejet.jpg',
    description: 'SpiceJet is one of Indias leading low-cost carriers. Operating Boeing 737s across extensive Indian domestic network.'
  },
  {
    id: 'aigle',
    name: 'Air India Express',
    location: 'India',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Kochi Hub', 'Gulf Routes'],
    image: '/images/airline-expectations/air-india-express.jpg',
    description: 'Air India Express serves Gulf routes from Kerala. Low-cost subsidiary connecting Indian workers to Middle East destinations.'
  },
  {
    id: 'cebupacific',
    name: 'Cebu Pacific',
    location: 'Philippines',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Low Cost', 'Largest Philippine LCC'],
    image: '/images/airline-expectations/cebu-pacific.jpg',
    description: 'Cebu Pacific is the Philippines largest low-cost carrier. Operating from Manila with extensive domestic and growing international network across Asia.'
  },
  {
    id: 'airasia',
    name: 'AirAsia',
    location: 'Malaysia',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Kuala Lumpur Hub', 'Largest LCC Asia', 'Award Winning'],
    image: '/images/airline-expectations/airasia-x.jpg',
    description: 'AirAsia is Asias largest low-cost carrier by passengers. Based in Kuala Lumpur with extensive Southeast Asian network and multiple subsidiary airlines.'
  },
  {
    id: 'pakistan',
    name: 'PIA Pakistan',
    location: 'Pakistan',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Karachi Hub', 'Historic', 'Asia Routes'],
    image: '/images/airline-expectations/pia.jpg',
    description: 'PIA is Pakistans flag carrier with historic significance. Operating from Karachi with focus on Middle East and Asian routes.'
  },
  {
    id: 'srilankan',
    name: 'SriLankan Airlines',
    location: 'Sri Lanka',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Colombo Hub', 'Oneworld', 'Indian Ocean'],
    image: '/images/airline-expectations/srilankan.jpg',
    description: 'SriLankan Airlines serves as the Indian Ocean hub from Colombo. Oneworld member with excellent Asian and Middle East connections.'
  },
  {
    id: 'biman',
    name: 'Biman Bangladesh',
    location: 'Bangladesh',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Dhaka Hub', 'National Carrier', 'Gulf Routes'],
    image: '/images/airline-expectations/biman-bangladesh.jpg',
    description: 'Biman Bangladesh is the national carrier of Bangladesh. Operating from Dhaka with focus on Middle East and Asian routes.'
  },
  {
    id: 'nepal',
    name: 'Nepal Airlines',
    location: 'Nepal',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Kathmandu Hub', 'Mountain Flying', 'Regional'],
    image: '/images/airline-expectations/nepal.jpg',
    description: 'Nepal Airlines operates in challenging Himalayan terrain. Unique mountain flying experience from Kathmandu to regional destinations.'
  },
  // Additional Middle East Airlines
  {
    id: 'flynas',
    name: 'Flynas',
    location: 'Saudi Arabia',
    salaryRange: '$40,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Riyadh Hub', 'Domestic Saudi'],
    image: '/images/airline-expectations/flynas.jpg',
    description: 'Flynas is Saudi Arabias leading low-cost carrier. Operating domestic and regional routes with growing international presence.'
  },
  {
    id: 'flydubai',
    name: 'FlyDubai',
    location: 'UAE',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Low Cost', 'Dubai Hub', 'Regional Network'],
    image: '/images/airline-expectations/flydubai.jpg',
    description: 'FlyDubai is Dubais low-cost carrier complementing Emirates. Extensive regional network across Middle East, Africa and Asia.'
  },
  {
    id: 'airarabia',
    name: 'Air Arabia',
    location: 'UAE',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Sharjah Hub', 'Regional LCC'],
    image: '/images/airline-expectations/air-arabia.jpg',
    description: 'Air Arabia is the Middle Easts largest low-cost carrier. Based in Sharjah with extensive regional and international network.'
  },
  {
    id: 'oman',
    name: 'Oman Air',
    location: 'Oman',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Muscat Hub', 'Premium Service', 'Growing Network'],
    image: '/images/airline-expectations/oman-air.jpg',
    description: 'Oman Air offers premium service from Muscat. Growing international network with focus on European and Asian destinations.'
  },
  {
    id: 'kuwait',
    name: 'Kuwait Airways',
    location: 'Kuwait',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kuwait Hub', 'National Carrier', 'Regional'],
    image: '/images/airline-expectations/kuwait-airways.jpg',
    description: 'Kuwait Airways is the national carrier of Kuwait. Operating from Kuwait City with regional and international network.'
  },
  {
    id: 'gulf',
    name: 'Gulf Air',
    location: 'Bahrain',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bahrain Hub', 'Historic', 'Middle East'],
    image: '/images/airline-expectations/gulf-air.jpg',
    description: 'Gulf Air is Bahrainis national carrier. One of the regions oldest airlines with strong European and Asian connections.'
  },
  // Additional American Airlines
  {
    id: 'frontier',
    name: 'Frontier Airlines',
    location: 'United States',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Denver Hub', 'Domestic US'],
    image: '/images/airline-expectations/frontier.jpg',
    description: 'Frontier is an ultra low-cost carrier based in Denver. Extensive domestic US network with Airbus A320 family aircraft.'
  },
  {
    id: 'spirit',
    name: 'Spirit Airlines',
    location: 'United States',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Fort Lauderdale', 'Domestic US'],
    image: '/images/airline-expectations/spirit.jpg',
    description: 'Spirit is the largest ultra low-cost carrier in the US. Based in Fort Lauderdale with extensive domestic and Latin American network.'
  },
  {
    id: 'allegiant',
    name: 'Allegiant Air',
    location: 'United States',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Las Vegas', 'Leisure Focus'],
    image: '/images/airline-expectations/allegiant.jpg',
    description: 'Allegiant specializes in leisure travel from underserved cities. Unique business model connecting small cities to vacation destinations.'
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian Airlines',
    location: 'United States',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Honolulu Hub', 'Pacific Network', 'Island Flying'],
    image: '/images/airline-expectations/hawaiian.jpg',
    description: 'Hawaiian Airlines is Hawaiis flagship carrier. Unique island-hopping operations combined with long-haul Pacific and US mainland routes.'
  },
  {
    id: 'sun',
    name: 'Sun Country',
    location: 'United States',
    salaryRange: '$35,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Minneapolis', 'Seasonal'],
    image: '/images/airline-expectations/sun.jpg',
    description: 'Sun Country operates from Minneapolis with seasonal focus. Low-cost leisure carrier serving vacation destinations across Americas.'
  },
  {
    id: 'silver',
    name: 'Silver Airways',
    location: 'United States',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Regional', 'Florida', 'Caribbean Routes'],
    image: '/images/airline-expectations/silver.jpg',
    description: 'Silver Airways connects Florida to Caribbean and Bahamas. Regional turboprop operations with ATR aircraft.'
  },
  {
    id: 'cape',
    name: 'Cape Air',
    location: 'United States',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '500+ hrs TT',
    tags: ['Regional', 'New England', 'Island Routes'],
    image: '/images/airline-expectations/cape.jpg',
    description: 'Cape Air serves New England islands and regional routes. Turboprop and small aircraft operations with unique coastal flying.'
  },
  {
    id: 'porter',
    name: 'Porter Airlines',
    location: 'Canada',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Regional', 'Toronto Island', 'Premium Service'],
    image: '/images/airline-expectations/porter.jpg',
    description: 'Porter operates from Toronto Island Airport with premium service. Growing jet fleet serving Canadian and US destinations.'
  },
  {
    id: 'flair',
    name: 'Flair Airlines',
    location: 'Canada',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Edmonton', 'Domestic Canada'],
    image: '/images/airline-expectations/flair.jpg',
    description: 'Flair is Canadas ultra low-cost carrier. Growing domestic Canadian network with competitive pricing and expanding fleet.'
  },
  {
    id: 'swoop',
    name: 'Swoop',
    location: 'Canada',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Hamilton', 'WestJet Subsidiary'],
    image: '/images/airline-expectations/swoop.jpg',
    description: 'Swoop is WestJets ultra low-cost subsidiary. Operating from Hamilton with domestic Canadian and US sun destinations.'
  },
  // Additional Latin American Airlines
  {
    id: 'azul',
    name: 'Azul Brazilian',
    location: 'Brazil',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Campinas Hub', 'Domestic Brazil'],
    image: '/images/airline-expectations/azul.jpg',
    description: 'Azul is Brazils largest airline by destinations. Low-cost model with extensive domestic network from Campinas Viracopos.'
  },
  {
    id: 'interjet',
    name: 'Interjet',
    location: 'Mexico',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Mexico City', 'Sukhoi Fleet'],
    image: '/images/airline-expectations/interjet.jpg',
    description: 'Interjet was Mexicos low-cost carrier with Russian Sukhoi fleet. Currently restructuring with plans for future growth.'
  },
  {
    id: 'volaris',
    name: 'Volaris',
    location: 'Mexico',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Guadalajara', 'Domestic Mexico'],
    image: '/images/airline-expectations/volaris.jpg',
    description: 'Volaris is Mexicos largest ultra low-cost carrier. Extensive domestic Mexican network with growing US operations.'
  },
  {
    id: 'vivaaerobus',
    name: 'VivaAerobus',
    location: 'Mexico',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Monterrey', 'Domestic Mexico'],
    image: '/images/airline-expectations/vivaaerobus.jpg',
    description: 'VivaAerobus operates from Monterrey with ultra low-cost model. Growing domestic Mexican and US border city network.'
  },
  {
    id: 'jetsmart',
    name: 'JetSMART',
    location: 'Chile',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Santiago', 'South America'],
    image: '/images/airline-expectations/jetsmart.jpg',
    description: 'JetSMART is Chiles ultra low-cost carrier. Indigo Partners backed airline with growing South American network.'
  },
  {
    id: 'sky',
    name: 'Sky Airline',
    location: 'Chile',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Santiago', 'Regional Chile'],
    image: '/images/airline-expectations/sky.jpg',
    description: 'Sky Airline is Chiles second largest low-cost carrier. Operating Airbus A320neo aircraft across Chile and neighboring countries.'
  },
  {
    id: 'boacolombia',
    name: 'Viva Air Colombia',
    location: 'Colombia',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Ultra Low Cost', 'Medellin', 'Domestic Colombia'],
    image: '/images/airline-expectations/boacolombia.jpg',
    description: 'Viva Air Colombia operates ultra low-cost model from Medellin. Domestic Colombian network with competitive pricing.'
  },
  {
    id: 'easyfly',
    name: 'EasyFly',
    location: 'Colombia',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '500+ hrs TT',
    tags: ['Regional', 'Bogota', 'Turboprop'],
    image: '/images/airline-expectations/easyfly.jpg',
    description: 'EasyFly serves regional Colombian routes with turboprops. Connecting smaller cities to major hubs across Colombia.'
  },
  {
    id: 'satena',
    name: 'Satena',
    location: 'Colombia',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Regional', 'Bogota', 'Government Owned'],
    image: '/images/airline-expectations/satena.jpg',
    description: 'Satena is Colombias government regional airline. Serving remote and underserved areas with essential air connectivity.'
  },
  // Additional African Airlines
  {
    id: 'kenya',
    name: 'Kenya Airways',
    location: 'Kenya',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Nairobi Hub', 'Skyteam', 'East Africa'],
    image: '/images/airline-expectations/kenya.jpg',
    description: 'Kenya Airways is East Africas leading carrier. Skyteam member with hub in Nairobi connecting Africa to the world.'
  },
  {
    id: 'rwandair',
    name: 'RwandAir',
    location: 'Rwanda',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Kigali Hub', 'Growing', 'East Africa'],
    image: '/images/airline-expectations/rwandair.jpg',
    description: 'RwandAir is one of Africas fastest-growing airlines. Modern fleet with expanding African and international network from Kigali.'
  },
  {
    id: 'airmauritius',
    name: 'Air Mauritius',
    location: 'Mauritius',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mauritius Hub', 'Island Paradise', 'Indian Ocean'],
    image: '/images/airline-expectations/airmauritius.jpg',
    description: 'Air Mauritius serves the island paradise of Mauritius. Connecting Indian Ocean gem to Europe, Asia and Africa.'
  },
  {
    id: 'airseychelles',
    name: 'Air Seychelles',
    location: 'Seychelles',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Seychelles Hub', 'Island Carrier', 'Indian Ocean'],
    image: '/images/airline-expectations/airseychelles.jpg',
    description: 'Air Seychelles operates from the stunning Seychelles islands. Connecting this tropical paradise to international destinations.'
  },
  {
    id: 'lam',
    name: 'LAM Mozambique',
    location: 'Mozambique',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Maputo Hub', 'National Carrier', 'Southern Africa'],
    image: '/images/airline-expectations/lam.jpg',
    description: 'LAM is Mozambiques national carrier. Operating from Maputo with regional African routes and domestic network.'
  },
  {
    id: 'airnamibia',
    name: 'Air Namibia',
    location: 'Namibia',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Windhoek Hub', 'National Carrier', 'Southwest Africa'],
    image: '/images/airline-expectations/airnamibia.jpg',
    description: 'Air Namibia connects the vast landscapes of Namibia. Operating from Windhoek with European and African routes.'
  },
  {
    id: 'botswana',
    name: 'Air Botswana',
    location: 'Botswana',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Gaborone Hub', 'National Carrier', 'Botswana'],
    image: '/images/airline-expectations/botswana.jpg',
    description: 'Air Botswana is the national carrier of Botswana. Operating from Gaborone with regional African routes.'
  },
  {
    id: 'zambia',
    name: 'Zambia Airways',
    location: 'Zambia',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Lusaka Hub', 'National Carrier', 'Zambia'],
    image: '/images/airline-expectations/zambia.jpg',
    description: 'Zambia Airways is the revitalized national carrier of Zambia. Operating from Lusaka with regional and international ambitions.'
  },
  {
    id: 'airtanzania',
    name: 'Air Tanzania',
    location: 'Tanzania',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Dar es Salaam', 'National Carrier', 'East Africa'],
    image: '/images/airline-expectations/airtanzania.jpg',
    description: 'Air Tanzania is the national carrier of Tanzania. Operating from Dar es Salaam with growing African network.'
  },
  {
    id: 'ulend',
    name: 'Uganda Airlines',
    location: 'Uganda',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Entebbe Hub', 'National Carrier', 'East Africa'],
    image: '/images/airline-expectations/ulend.jpg',
    description: 'Uganda Airlines is the revived national carrier of Uganda. Operating from Entebbe with modern Airbus fleet and regional network.'
  },
  {
    id: 'malawian',
    name: 'Malawi Airlines',
    location: 'Malawi',
    salaryRange: '$15,000 - $30,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Lilongwe Hub', 'Regional', 'East Africa'],
    image: '/images/airline-expectations/malawian.jpg',
    description: 'Malawi Airlines serves the warm heart of Africa. Operating from Lilongwe with regional East African routes.'
  },
  // Additional Oceanian Airlines
  {
    id: 'airnz',
    name: 'Air New Zealand',
    location: 'New Zealand',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Auckland Hub', 'Star Alliance', 'Pacific Network'],
    image: '/images/airline-expectations/airnz.jpg',
    description: 'Air New Zealand is consistently rated worlds best airline. Operating from Auckland with extensive Pacific and long-haul network.'
  },
  {
    id: 'fiji',
    name: 'Fiji Airways',
    location: 'Fiji',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Nadi Hub', 'Oneworld Connect', 'South Pacific'],
    image: '/images/airline-expectations/fiji.jpg',
    description: 'Fiji Airways serves as the gateway to the South Pacific. Oneworld Connect partner with modern Airbus A350 fleet.'
  },
  {
    id: 'aircalin',
    name: 'Aircalin',
    location: 'New Caledonia',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Noumea Hub', 'French Pacific', 'Regional'],
    image: '/images/airline-expectations/aircalin.jpg',
    description: 'Aircalin is New Caledonias international airline. Connecting French Pacific territory to Australia, New Zealand and Asia.'
  },
  {
    id: 'polynesian',
    name: 'Air Tahiti',
    location: 'French Polynesia',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Papeete Hub', 'Island Network', 'French Polynesia'],
    image: '/images/airline-expectations/polynesian.jpg',
    description: 'Air Tahiti operates the stunning inter-island network of French Polynesia. Turboprop operations connecting paradise islands.'
  },
  {
    id: 'tahitinui',
    name: 'Air Tahiti Nui',
    location: 'French Polynesia',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Papeete Hub', 'Long Haul', 'Boeing 787'],
    image: '/images/airline-expectations/air-tahiti-nui.jpg',
    description: 'Air Tahiti Nui connects Tahiti to the world. Operating Boeing 787 Dreamliners on long-haul routes to Paris, Tokyo and Los Angeles.'
  },
  {
    id: 'samoa',
    name: 'Samoa Airways',
    location: 'Samoa',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Apia Hub', 'South Pacific', 'Regional'],
    image: '/images/airline-expectations/samoa-airways.jpg',
    description: 'Samoa Airways serves the Polynesian nation of Samoa. Operating from Apia with connections to New Zealand and Australia.'
  },
  {
    id: 'tonga',
    name: 'Real Tonga',
    location: 'Tonga',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '500+ hrs TT',
    tags: ['Nuku alofa', 'Domestic', 'Tonga'],
    image: '/images/airline-expectations/real-tonga.jpg',
    description: 'Real Tonga operates domestic services in the Kingdom of Tonga. Connecting Tongatapu to outer islands across the archipelago.'
  },
  {
    id: 'vanuatu',
    name: 'Air Vanuatu',
    location: 'Vanuatu',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Port Vila', 'Vanuatu', 'South Pacific'],
    image: '/images/airline-expectations/air-vanuatu.jpg',
    description: 'Air Vanuatu serves the island nation of Vanuatu. Operating from Port Vila with international and domestic network.'
  },
  {
    id: 'solomons',
    name: 'Solomon Airlines',
    location: 'Solomon Islands',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Honiara Hub', 'Solomon Islands', 'Regional'],
    image: '/images/airline-expectations/solomon-airlines.jpg',
    description: 'Solomon Airlines connects the Solomon Islands. Operating from Honiara with regional Pacific routes.'
  },
  {
    id: 'png',
    name: 'Air Niugini',
    location: 'Papua New Guinea',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Port Moresby', 'PNG', 'Pacific Network'],
    image: '/images/airline-expectations/air-niugini.jpg',
    description: 'Air Niugini is Papua New Guineas national carrier. Operating from Port Moresby with challenging terrain operations.'
  },
  {
    id: 'nauru',
    name: 'Nauru Airlines',
    location: 'Nauru',
    salaryRange: '$20,000 - $35,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Yaren Hub', 'Pacific Island', 'Regional'],
    image: '/images/airline-expectations/nauru-airlines.jpg',
    description: 'Nauru Airlines serves the worlds smallest island nation. Connecting Nauru to Australia and Pacific islands.'
  },
  {
    id: 'kiribati',
    name: 'Air Kiribati',
    location: 'Kiribati',
    salaryRange: '$15,000 - $30,000/year',
    flightHours: '500+ hrs TT',
    tags: ['Tarawa Hub', 'Pacific Island', 'Domestic'],
    image: '/images/airline-expectations/air-kiribati.jpg',
    description: 'Air Kiribati serves the scattered islands of Kiribati. Essential air service connecting atolls across the equatorial Pacific.'
  }
];

export const AirlineExpectationsCarousel: React.FC<AirlineExpectationsCarouselProps> = ({ onNavigate, onLogin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('Asia');
  const [isFading, setIsFading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useAuth();

  // Calculate dynamic match score based on airline
  const getMatchScore = (airline: Airline) => {
    const scoreMap: { [key: string]: number } = {
      'qatar': 87,
      'singapore': 92,
      'cathay': 85,
      'emirates': 89,
      'etihad': 84,
      'lufthansa': 88,
      'british': 86,
      'airfrance': 83,
      'klm': 81,
      'qantas': 90,
      'ana': 91,
      'delta': 82,
      'united': 80,
      'american': 79,
      'fiji': 75,
      'airnz': 93,
      'real-tonga': 70,
      'vanuatu': 72,
      'solomons': 68,
      'air-niugini': 74,
      'nauru': 71
    };
    return scoreMap[airline.id] || 85;
  };

  // Fade effect when currentIndex changes
  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => {
      setIsFading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Filter airlines based on selected region
  const filteredAirlines = useMemo(() => {
    if (selectedRegion === 'All') return airlines;
    return airlines.filter(airline => {
      const location = airline.location.toLowerCase();
      switch (selectedRegion) {
        case 'Asia':
          return ['hong kong', 'singapore', 'japan', 'china', 'india', 'thailand', 'malaysia', 'indonesia', 'philippines', 'vietnam', 'south korea', 'taiwan', 'nepal', 'bangladesh', 'sri lanka', 'pakistan'].some(country => location.includes(country));
        case 'Europe':
          return ['spain', 'italy', 'austria', 'belgium', 'denmark', 'norway', 'sweden', 'finland', 'portugal', 'greece', 'poland', 'czech', 'germany', 'france', 'netherlands', 'switzerland', 'turkey', 'iceland', 'ireland', 'uk'].some(country => location.includes(country));
        case 'Americas':
          return ['united states', 'canada', 'mexico', 'brazil', 'chile', 'colombia', 'argentina', 'peru'].some(country => location.includes(country));
        case 'Oceania':
          return ['australia', 'new zealand', 'fiji', 'new caledonia', 'tahiti', 'samoa', 'tonga', 'vanuatu', 'solomon', 'papua', 'nauru', 'kiribati'].some(country => location.includes(country));
        case 'Africa':
          return ['egypt', 'ethiopia', 'south africa', 'kenya', 'rwanda', 'mauritius', 'seychelles', 'mozambique', 'namibia', 'botswana', 'zambia', 'tanzania', 'uganda', 'malawi', 'morocco', 'tunisia'].some(country => location.includes(country));
        case 'Middle East':
          return ['qatar', 'emirates', 'etihad', 'saudi', 'bahrain', 'kuwait', 'oman', 'jordan', 'israel', 'uae', 'dubai'].some(country => location.includes(country));
        default:
          return true;
      }
    });
  }, [selectedRegion]);

  // Scroll to left on mount and when filtered airlines change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [filteredAirlines]);

  const goToPrev = () => {
    setIsAutoScrolling(false); // Stop auto-scroll on button click
    setContentVisible(false); // Fade out content quickly

    // Wait for fade out, then change and scroll
    setTimeout(() => {
      // Prev moves left (decrements index) - go to previous card, don't wrap
      const newIndex = Math.max(currentIndex - 1, 0);
      setCurrentIndex(newIndex);

      // Scroll to the card
      const container = scrollContainerRef.current;
      if (container) {
        const card = container.querySelector(`[data-airline-index="${newIndex}"]`) as HTMLElement;
        if (card) {
          const cardLeft = card.offsetLeft;
          const containerWidth = container.offsetWidth;
          const cardWidth = card.offsetWidth;
          const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
          container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      }

      // Wait for smooth scroll to complete (400ms) then fade in
      setTimeout(() => setContentVisible(true), 400);
    }, 150);

    // Resume auto-scroll after 10 seconds
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  const goToNext = () => {
    setIsAutoScrolling(false); // Stop auto-scroll on button click
    setContentVisible(false); // Fade out content quickly

    // Wait for fade out, then change and scroll
    setTimeout(() => {
      // Next moves right (increments index) - go to next card, don't wrap
      const newIndex = Math.min(currentIndex + 1, filteredAirlines.length - 1);
      setCurrentIndex(newIndex);

      // Scroll to the card
      const container = scrollContainerRef.current;
      if (container) {
        const card = container.querySelector(`[data-airline-index="${newIndex}"]`) as HTMLElement;
        if (card) {
          const cardLeft = card.offsetLeft;
          const containerWidth = container.offsetWidth;
          const cardWidth = card.offsetWidth;
          const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
          container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      }

      // Wait for smooth scroll to complete (400ms) then fade in
      setTimeout(() => setContentVisible(true), 400);
    }, 150);

    // Resume auto-scroll after 10 seconds
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  const currentAirline = filteredAirlines[currentIndex] || filteredAirlines[0];

  // Auto-scroll functionality - moves right to left (decrementing index)
  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          // Move right to left: go to previous index, wrap around to end if at start
          const nextIndex = prev === 0 ? filteredAirlines.length - 1 : prev - 1;
          // Scroll to the card
          const container = scrollContainerRef.current;
          if (container) {
            const card = container.querySelector(`[data-airline-index="${nextIndex}"]`) as HTMLElement;
            if (card) {
              const cardLeft = card.offsetLeft;
              const containerWidth = container.offsetWidth;
              const cardWidth = card.offsetWidth;
              const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
              container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            }
          }
          return nextIndex;
        });
      }, 12000); // Slow ambient scroll - 12 seconds per card for wallpaper effect
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    if (isAutoScrolling) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => {
      stopAutoScroll();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isAutoScrolling]);

  // Start auto-scroll when component mounts and section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAutoScrolling(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('airline-expectations');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Pause auto-scroll on manual scroll, resume after pause
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleManualScroll = () => {
      // Don't stop auto-scroll on manual scroll, let it continue
      // Just track that user is interacting
    };

    container.addEventListener('scroll', handleManualScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleManualScroll);
    };
  }, []);

  // Track which card is centered using Intersection Observer
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('[data-airline-index]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most centered card
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });
        
        if (bestEntry && bestEntry.intersectionRatio > 0.6) {
          const index = parseInt(bestEntry.target.getAttribute('data-airline-index') || '0');
          setCurrentIndex(index);
        }
      },
      {
        root: container,
        threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '0px'
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Navigation handlers
  const goToCard = (index: number) => {
    setIsAutoScrolling(false); // Stop auto-scroll on click
    setCurrentIndex(index);
    // Scroll to the selected card
    const container = scrollContainerRef.current;
    if (container) {
      const card = container.querySelector(`[data-airline-index="${index}"]`) as HTMLElement;
      if (card) {
        const cardLeft = card.offsetLeft;
        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
    // Resume auto-scroll after 10 seconds
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 10000);
  };

  return (
    <>
      <style>{fadeInStyles}</style>
      <div className="relative w-full bg-white py-12 overflow-hidden">
      {/* Header - Centered */}
      <div className="w-full px-8 mb-8 text-center">
        {/* WingMentor Logo */}
        <img
          src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
          alt="WingMentor Logo"
          className="mx-auto w-56 h-auto object-contain mb-4"
        />
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-slate-900 mb-3">
          Airline Expectations.
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            AIRLINE EXPECTATIONS UPDATE
          </span>
          <span className="text-[10px] text-slate-400">
            Latest opportunities and industry news
          </span>
        </div>
      </div>

      {/* Regional Selector and Description */}
      <div className="w-full px-8 py-4">
        <p className="text-center text-slate-600 text-base mb-2 max-w-3xl mx-auto">
          Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. Each airline profile provides insights into salary ranges, required flight hours, type ratings, and unique benefits to help you make informed career decisions.
        </p>
        <p className="text-center text-slate-400 text-sm mb-4 max-w-3xl mx-auto">
          Swipe through to discover airline-specific requirements and compare opportunities across global carriers.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'].map((region) => (
            <button
              key={region}
              onClick={() => {
                setIsFading(true);
                setSelectedRegion(region);
                setCurrentIndex(0);
                setIsAutoScrolling(false);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
                }
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                resumeTimeoutRef.current = setTimeout(() => {
                  setIsAutoScrolling(true);
                }, 10000);
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === region
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area - Full Width Marquee Carousel */}
      <div className="w-full overflow-hidden animate-fadeIn py-8">
        {/* Percentage Match Notice */}
        <div className="px-8 mb-4 flex justify-end">
          <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600">
              <span className="font-semibold">Note:</span> Percentage match is based on your Pilot Recognition Profile
            </p>
          </div>
        </div>

        {/* Scroll Carousel - Full Width with Snap Points */}
        <div className="relative w-full overflow-hidden">
          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-[calc(50vw-260px)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {filteredAirlines.map((airline, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={airline.id}
                  data-airline-index={index}
                  className={`flex-shrink-0 w-[520px] h-[300px] rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-500 snap-center ${
                    isActive ? 'ring-4 ring-blue-400 ring-offset-2 scale-100' : 'scale-95 opacity-80'
                  }`}
                  onClick={() => goToCard(index)}
                >
                    {/* Card Image */}
                    <div className="relative w-full h-full">
                      <img
                        src={airline.image}
                        alt={airline.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                      {/* Card Content */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        {/* Top Label */}
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-300">
                            AIRLINE — MAJOR AIRLINE
                          </span>
                          {/* Percentage Match Badge */}
                          <div className={`bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-50'
                          }`}>
                            {getMatchScore(airline)}%
                          </div>
                        </div>

                        {/* Middle Content */}
                        <div>
                          <h3 className="text-2xl font-serif text-white mb-1">
                            {airline.name}
                          </h3>
                          <p className="text-sm text-white/60 mb-2">
                            {airline.name} Airways
                          </p>

                          {/* Description for pilots */}
                          <p className="text-[11px] text-white/70 leading-relaxed mb-3 line-clamp-2">
                            {airline.description}
                          </p>

                          {/* Info Row */}
                          <div className="flex items-center gap-4 mb-4 text-[12px] text-white/80">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {airline.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-white/60">$</span>
                              {airline.salaryRange}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row - Button and Tags */}
                        <div className="flex items-center justify-between gap-3">
                          <button 
                            onClick={() => goToCard(index)}
                            className="px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-[11px] font-semibold rounded-full transition-all duration-300 flex items-center gap-2 group"
                          >
                            Discover Expectations
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </button>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 justify-end">
                            {airline.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-emerald-300 bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-400/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Ambient Scroll Hint */}
          <p className="text-center text-[11px] text-slate-400 italic mt-4">
            Auto-scrolling • Click any card to pause
          </p>
        </div>
      </div>

      {/* Gold Header Below Carousel - Shows Current Airline */}
      <div className="flex items-center justify-center gap-4 mt-8 mb-4">
        <button
          onClick={goToPrev}
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          aria-label="Previous airline"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3
          className="text-2xl md:text-3xl font-serif transition-opacity duration-300"
          style={{ color: '#DAA520', opacity: contentVisible ? 1 : 0 }}
        >
          {currentAirline?.name || 'Explore Career Opportunities'}
        </h3>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          aria-label="Next airline"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dynamic Airline Info */}
      {currentAirline && (
        <div
          className="max-w-3xl mx-auto px-6 text-center mb-8 transition-opacity duration-300"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <p className="text-slate-700 text-base leading-[1.8] mb-4 font-medium">
            {currentAirline.description}
          </p>
          {/* Fleet Info */}
          {currentAirline.fleet && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 py-2 px-4 rounded-lg inline-block">
              <span className="font-semibold text-slate-800">Fleet:</span> {currentAirline.fleet}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm mb-6">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {currentAirline.location}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              {currentAirline.tags.slice(0, 3).join(' • ')}
            </span>
          </div>

          {/* Discover Pathways Button */}
          <button
            onClick={() => {
              if (currentUser) {
                // Pass the current airline data to the page
                onNavigate?.('airline-expectations', currentAirline);
              } else {
                setShowModal(true);
              }
            }}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-800 font-semibold rounded-full shadow-sm hover:bg-slate-50 hover:shadow-md transition-all duration-300 flex items-center gap-2 mx-auto group"
          >
            Discover Airline Expectations
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      )}

      {/* Bottom Description */}
      <div className="max-w-4xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100">
        <p className="text-sm text-slate-600 leading-relaxed text-center mb-3">
          Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. Each airline profile provides insights into salary ranges, required flight hours, type ratings, and unique benefits to help you make informed career decisions.
        </p>
        <p className="text-xs text-slate-400 text-center">
          Swipe through to discover airline-specific requirements and compare opportunities across global carriers.
        </p>
      </div>
    </div>

    {/* Newsletter Modal for Non-Logged In Users */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-50">
              <img
                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                alt="WingMentor Logo"
                className="w-16 h-16 object-contain"
              />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">
              ATC calling : pilot ident required!
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              join today for free and unlock detailed insights into carrier requirements, salary ranges, and career progression opportunities.
            </p>

            <button
              onClick={() => {
                setShowModal(false);
                onLogin?.();
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all mb-3"
            >
              Become a Member
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
