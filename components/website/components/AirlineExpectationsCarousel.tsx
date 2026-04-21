"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { IMAGES } from '../../../src/lib/website-constants';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../shared/lib/supabase';
import { AirlineDetailModal } from './AirlineDetailModal';
import { usePathwaysIntelligence } from '../../../portal/hooks/usePathwaysIntelligence';
import { AirlineReadinessBanner } from '../../../portal/components/PathwaysIntelligenceWidgets';

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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
    description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.',
    fleet: 'Airbus A380, Boeing 777 - Worlds largest operator of both A380 and 777 aircraft with 250+ wide-bodies'
  },
  {
    id: 'etihad',
    name: 'Etihad Airways',
    location: 'UAE',
    salaryRange: '$115,000 - $200,000/year',
    flightHours: '2,500+ hrs TT',
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/korean-air.jpg',
    description: 'Korean Air is South Koreas flagship carrier with a strong presence on trans-Pacific routes. Pilots enjoy competitive Asian compensation and a modern, expanding aircraft fleet.'
  },
  {
    id: 'asiana',
    name: 'Asiana Airlines',
    location: 'South Korea',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Star Alliance', 'Incheon Hub', 'Service Excellence'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/asiana-airlines.webp',
    description: 'Asiana Airlines is known for outstanding service quality and safety standards. The airline provides pilots with excellent training and opportunities on both regional and long-haul routes.'
  },
  {
    id: 'thai',
    name: 'Thai Airways',
    location: 'Thailand',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Bangkok Hub', 'Southeast Asian Network', 'Royal Service'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/thai-airways.jpg',
    description: 'Thai Airways offers a unique blend of Thai hospitality and international aviation standards. Pilots enjoy living in Thailand while flying to destinations across Asia and beyond.'
  },
  {
    id: 'malaysia',
    name: 'Malaysia Airlines',
    location: 'Malaysia',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['KL Hub', 'Southeast Asia', 'OneWorld Member'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/malaysia-airlines.jpg',
    description: 'Malaysia Airlines connects Southeast Asia with the world from its Kuala Lumpur hub. The airline offers pilots competitive compensation and exposure to diverse Asian markets.'
  },
  {
    id: 'garuda',
    name: 'Garuda Indonesia',
    location: 'Indonesia',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Jakarta Hub', 'Archipelago Network', 'Growing Market'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/garuda-indonesia.jpg',
    description: 'Garuda Indonesia serves the worlds largest archipelago nation. Pilots benefit from rapid fleet modernization and the opportunity to fly across one of Earths most diverse geographic areas.'
  },
  {
    id: 'philippine',
    name: 'Philippine Airlines',
    location: 'Philippines',
    salaryRange: '$45,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Manila Hub', 'Pacific Routes', 'Historic Carrier'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/philippine-airlines.webp',
    description: 'Philippine Airlines is Asias oldest commercial airline. It offers pilots a unique base in the Philippines with growing international connections to North America and Asia.'
  },
  {
    id: 'vietnam',
    name: 'Vietnam Airlines',
    location: 'Vietnam',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Hanoi Hub', 'Growing Economy', 'Modern Fleet'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/vietnam-airlines.jpg',
    description: 'Vietnam Airlines represents one of Asias fastest-growing economies. The airline is rapidly modernizing its fleet and expanding international routes, offering pilots excellent growth opportunities.'
  },
  {
    id: 'china',
    name: 'Air China',
    location: 'China',
    salaryRange: '$70,000 - $120,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Beijing Hub', 'Largest Market', 'Star Alliance'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-china.jpg',
    description: 'Air China is the flag carrier of the Peoples Republic of China and the worlds largest aviation market. Pilots have access to an unmatched domestic network and growing international presence.'
  },
  {
    id: 'chinaeastern',
    name: 'China Eastern',
    location: 'China',
    salaryRange: '$65,000 - $115,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Shanghai Hub', 'Skyteam Member', 'Major Player'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-eastern.jpg',
    description: 'China Eastern Airlines operates from Shanghai, connecting China with the world. The airline offers pilots opportunities in one of the fastest-growing aviation markets globally.'
  },
  {
    id: 'chinasouthern',
    name: 'China Southern',
    location: 'China',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,800+ hrs TT',
    tags: ['Guangzhou Hub', 'Largest Fleet', 'Asia Focus'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-southern.jpg',
    description: 'China Southern operates Chinas largest fleet with extensive Asian coverage. Pilots benefit from modern aircraft and the opportunity to fly within the dynamic Chinese aviation sector.'
  },
  {
    id: 'delta',
    name: 'Delta Air Lines',
    location: 'United States',
    salaryRange: '$110,000 - $250,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/american-airlines.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/united.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/southwest.jpg',
    description: 'Southwest Airlines is the worlds largest low-cost carrier. Known for excellent pilot relations and unique company culture, it offers pilots stable domestic routes and profit-sharing benefits.'
  },
  {
    id: 'alaska',
    name: 'Alaska Airlines',
    location: 'United States',
    salaryRange: '$90,000 - $180,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['West Coast', 'Seattle Hub', 'Award Winning'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/alaska-airlines.jpg',
    description: 'Alaska Airlines is consistently rated among the best US airlines. With its Seattle hub and West Coast focus, it offers pilots a unique blend of domestic and Pacific Northwest flying.'
  },
  {
    id: 'jetblue',
    name: 'JetBlue Airways',
    location: 'United States',
    salaryRange: '$85,000 - $170,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['New York Hub', 'Transcontinental', 'Modern Experience'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetblue.jpg',
    description: 'JetBlue Airways revolutionized US domestic travel with its premium economy approach. Based in New York, it offers pilots modern aircraft and transcontinental premium routes.'
  },
  {
    id: 'aircanada',
    name: 'Air Canada',
    location: 'Canada',
    salaryRange: '$80,000 - $160,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Star Alliance', 'Transatlantic'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-canada.jpg',
    description: 'Air Canada is Canadas flag carrier and largest airline. Pilots enjoy flying to over 200 destinations worldwide and excellent Canadian employment benefits and protections.'
  },
  {
    id: 'westjet',
    name: 'WestJet',
    location: 'Canada',
    salaryRange: '$70,000 - $140,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Calgary Hub', 'Canadian Leader', 'Growing International'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/westjet.jpg',
    description: 'WestJet is Canadas second-largest airline and growing internationally. It offers pilots a more relaxed Canadian work environment with expanding long-haul opportunities.'
  },
  {
    id: 'qantas',
    name: 'Qantas',
    location: 'Australia',
    salaryRange: '$95,000 - $180,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Sydney Hub', 'Oneworld', 'Safest Airline'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qantas.jpg',
    description: 'Qantas is Australias flag carrier and one of the worlds safest airlines. Known for its Sydney-London Kangaroo Route, it offers pilots iconic long-haul flying and excellent safety culture.'
  },
  {
    id: 'virginaustralia',
    name: 'Virgin Australia',
    location: 'Australia',
    salaryRange: '$75,000 - $145,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brisbane Hub', 'Competitive Service', 'Domestic Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-australia.png',
    description: 'Virgin Australia brings competitive service to the Australian market. Pilots enjoy modern aircraft and a focus on customer experience within the vast Australian domestic network.'
  },
  {
    id: 'latam',
    name: 'LATAM Airlines',
    location: 'Chile',
    salaryRange: '$60,000 - $120,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'South America', 'Largest Regional'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/latam.jpg',
    description: 'LATAM is Latin Americas largest airline group. From Santiago, pilots access an unmatched South American network combined with growing long-haul international routes.'
  },
  {
    id: 'avianca',
    name: 'Avianca',
    location: 'Colombia',
    salaryRange: '$55,000 - $110,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Bogota Hub', 'Star Alliance', 'Historic Airline'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/avianca.jpg',
    description: 'Avianca is one of the worlds oldest continuously operating airlines. Its Bogota hub provides pilots access to diverse South American and growing North American destinations.'
  },
  {
    id: 'aeromexico',
    name: 'Aeromexico',
    location: 'Mexico',
    salaryRange: '$50,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mexico City Hub', 'Skyteam', 'Regional Leader'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aeromexico.jpg',
    description: 'Aeromexico connects Latin America with the world from Mexico City. As a Skyteam member, it offers pilots codeshare opportunities and exposure to the dynamic Mexican market.'
  },
  {
    id: 'copaair',
    name: 'Copa Airlines',
    location: 'Panama',
    salaryRange: '$65,000 - $125,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Panama Hub', 'Hub Americas', 'Star Alliance'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/copa-airlines.jpg',
    description: 'Copa Airlines operates the Hub of the Americas in Panama. Pilots benefit from the strategic location connecting North and South America with efficient narrowbody operations.'
  },
  {
    id: 'gol',
    name: 'GOL Linhas',
    location: 'Brazil',
    salaryRange: '$55,000 - $105,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Sao Paulo Hub', 'Low Cost Brazil', 'Domestic Leader'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/gol.jpg',
    description: 'GOL is Brazils largest domestic airline. It offers pilots the opportunity to fly within one of the worlds most geographically diverse countries with excellent South American connections.'
  },
  {
    id: 'elal',
    name: 'El Al Israel',
    location: 'Israel',
    salaryRange: '$70,000 - $130,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Tel Aviv Hub', 'Middle East', 'Security Expert'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/el-al.jpg',
    description: 'El Al is Israels flag carrier known for exceptional security standards. Pilots benefit from unique Middle Eastern operations and diverse international routes from Tel Aviv.'
  },
  {
    id: 'royaljordanian',
    name: 'Royal Jordanian',
    location: 'Jordan',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Amman Hub', 'Oneworld', 'Middle East Gateway'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/royal-jordanian.jpg',
    description: 'Royal Jordanian serves as a bridge between East and West from Amman. The airline offers pilots unique Middle Eastern operations with Oneworld alliance benefits.'
  },
  {
    id: 'saudia',
    name: 'Saudia',
    location: 'Saudi Arabia',
    salaryRange: '$80,000 - $140,000/year',
    flightHours: '2,500+ hrs TT',
    tags: ['Jeddah Hub', 'Skyteam', 'Growing Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/saudia.jpg',
    description: 'Saudia is Saudi Arabias flag carrier undergoing rapid transformation. Pilots have opportunities in a rapidly modernizing fleet with growing international destinations.'
  },
  {
    id: 'omanair',
    name: 'Oman Air',
    location: 'Oman',
    salaryRange: '$65,000 - $120,000/year',
    flightHours: '2,000+ hrs TT',
    tags: ['Muscat Hub', 'Oneworld', 'Growing Fleet'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687736/airline-expectations/oman-air.webp',
    description: 'Oman Air is the national carrier of Oman. Operating from Muscat with a growing Boeing 787 Dreamliner fleet, offering pilots opportunities in the dynamic Middle East market.',
    fleet: 'Boeing 787 Dreamliner, 737 - Modern fleet with excellent career progression in the Gulf region'
  },
  {
    id: 'egyptair',
    name: 'EgyptAir',
    location: 'Egypt',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Cairo Hub', 'Star Alliance', 'African Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687052/airline-expectations/egypt-air.jpg',
    description: 'EgyptAir connects Africa with the world from historic Cairo. Pilots benefit from unique African operations and ancient history while flying modern aircraft across diverse international routes.'
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian Airlines',
    location: 'Ethiopia',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Addis Ababa Hub', 'Star Alliance', 'African Leader'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ethiopian-airlines.jpg',
    description: 'Ethiopian Airlines is Africas largest and most successful airline. From Addis Ababa, pilots access the continents most extensive network with modern Boeing and Airbus aircraft.'
  },
  {
    id: 'southafrican',
    name: 'South African Airways',
    location: 'South Africa',
    salaryRange: '$40,000 - $80,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Johannesburg Hub', 'Star Alliance', 'Southern Africa'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/south-african-airways.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/iberia.jpg',
    description: 'Iberia is Spains flagship carrier with strong connections to Latin America. Pilots benefit from excellent Spanish employment benefits and extensive transatlantic operations.'
  },
  {
    id: 'alitalia',
    name: 'ITA Airways',
    location: 'Italy',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Rome Hub', 'Skyteam', 'Mediterranean Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ita-airways.jpg',
    description: 'ITA Airways represents the rebirth of Italian aviation. Operating from Rome with modern Airbus fleet, offering pilots Mediterranean and intercontinental routes.'
  },
  {
    id: 'austrian',
    name: 'Austrian Airlines',
    location: 'Austria',
    salaryRange: '$60,000 - $110,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Vienna Hub', 'Star Alliance', 'Eastern Europe'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/austrian-airlines.jpg',
    description: 'Austrian Airlines serves as the gateway to Eastern Europe from Vienna. Part of Lufthansa Group with excellent European career development opportunities.'
  },
  {
    id: 'brussels',
    name: 'Brussels Airlines',
    location: 'Belgium',
    salaryRange: '$58,000 - $105,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Brussels Hub', 'Star Alliance', 'Africa Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/brussels-airlines.jpg',
    description: 'Brussels Airlines is Belgiums flagship carrier with extensive African network. Part of Lufthansa Group offering pilots unique African and European routes.'
  },
  {
    id: 'sas',
    name: 'SAS Scandinavian',
    location: 'Denmark/Norway/Sweden',
    salaryRange: '$55,000 - $100,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Copenhagen Hub', 'Star Alliance', 'Nordic Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/sas.jpg',
    description: 'SAS serves Scandinavia with Copenhagen, Oslo and Stockholm hubs. Known for excellent pilot work-life balance and strong Nordic labor protections.'
  },
  {
    id: 'finnair',
    name: 'Finnair',
    location: 'Finland',
    salaryRange: '$50,000 - $95,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Helsinki Hub', 'Oneworld', 'Asia Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/finnair.jpg',
    description: 'Finnair offers the shortest route between Europe and Asia via Helsinki. Modern Airbus A350 fleet with excellent focus on Asian markets.'
  },
  {
    id: 'tap',
    name: 'TAP Portugal',
    location: 'Portugal',
    salaryRange: '$45,000 - $85,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Lisbon Hub', 'Star Alliance', 'Brazil Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/tap-portugal.jpg',
    description: 'TAP Portugal connects Europe to Brazil and Africa from Lisbon. Known for warm Portuguese culture and growing international network.'
  },
  {
    id: 'aegean',
    name: 'Aegean Airlines',
    location: 'Greece',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Athens Hub', 'Star Alliance', 'Island Network'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aegean.jpg',
    description: 'Aegean Airlines is Greeces largest carrier with extensive island network. Star Alliance member offering pilots unique Mediterranean flying.'
  },
  {
    id: 'lot',
    name: 'LOT Polish',
    location: 'Poland',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Warsaw Hub', 'Star Alliance', 'Eastern Europe'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lot-polish.jpg',
    description: 'LOT Polish Airlines is Eastern Europes leading carrier. Growing long-haul network with Boeing 787 Dreamliners from Warsaw Chopin Airport.'
  },
  {
    id: 'czech',
    name: 'Czech Airlines',
    location: 'Czech Republic',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Prague Hub', 'Skyteam', 'Central Europe'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/czech-airlines.jpg',
    description: 'Czech Airlines serves Central Europe from historic Prague. One of the worlds oldest airlines with growing European network.'
  },
  {
    id: 'norwegian',
    name: 'Norwegian',
    location: 'Norway',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Low Cost', 'Oslo Hub', 'Transatlantic'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/norwegian.jpg',
    description: 'Norwegian revolutionized low-cost transatlantic travel. Rebuilt fleet offering pilots extensive European and long-haul operations.'
  },
  {
    id: 'icelandair',
    name: 'Icelandair',
    location: 'Iceland',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Reykjavik Hub', 'Iceland', 'North Atlantic'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/icelandair.jpg',
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
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-dragon.webp',
    description: 'Cathay Dragon served regional Asian destinations from Hong Kong. Now integrated into Cathay Pacific with excellent regional opportunities.'
  },
  {
    id: 'hkexpress',
    name: 'HK Express',
    location: 'Hong Kong',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Hong Kong Hub', 'Asia Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/hk-express.jpg',
    description: 'HK Express is Hong Kongs low-cost carrier. Part of Cathay Pacific group offering pilots dynamic short-haul Asian operations.'
  },
  {
    id: 'scoot',
    name: 'Scoot',
    location: 'Singapore',
    salaryRange: '$50,000 - $90,000/year',
    flightHours: '1,200+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Long Haul LCC'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/scoot.webp',
    description: 'Scoot is Singapore Airlines low-cost subsidiary. Operates Boeing 787 long-haul low-cost routes across Asia and beyond.'
  },
  {
    id: 'jetstar',
    name: 'Jetstar Asia',
    location: 'Singapore',
    salaryRange: '$45,000 - $80,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Singapore Hub', 'Regional'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetstar-asia.jpg',
    description: 'Jetstar Asia serves regional Southeast Asian markets. Part of Qantas Group offering pilots diverse Asian low-cost operations.'
  },
  {
    id: 'peach',
    name: 'Peach Aviation',
    location: 'Japan',
    salaryRange: '$40,000 - $70,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Osaka Hub', 'Domestic Japan'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/peach-aviation.jpg',
    description: 'Peach Aviation is Japans leading low-cost carrier. Based in Osaka with extensive domestic and regional Asian network.'
  },
  {
    id: 'spring',
    name: 'Spring Airlines',
    location: 'China',
    salaryRange: '$35,000 - $65,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Shanghai Hub', 'Largest LCC'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spring-airlines.jpg',
    description: 'Spring Airlines is Chinas largest low-cost carrier. Based in Shanghai with extensive domestic Chinese network.'
  },
  {
    id: 'indigo',
    name: 'IndiGo',
    location: 'India',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', 'Indias Largest'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/indigo.jpg',
    description: 'IndiGo is Indias largest airline by passengers. Fast-growing low-cost carrier with extensive domestic and international network.'
  },
  {
    id: 'airindia',
    name: 'Air India',
    location: 'India',
    salaryRange: '$40,000 - $75,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Mumbai Hub', 'Star Alliance', 'Historic Carrier'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776689695/airline-expectations/air-india-new.jpg',
    description: 'Air India is Indias flag carrier now part of Tata Group. Star Alliance member with extensive international network from Mumbai and Delhi.'
  },
  {
    id: 'spicejet',
    name: 'SpiceJet',
    location: 'India',
    salaryRange: '$25,000 - $50,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Delhi Hub', 'Budget Carrier'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spicejet.jpg',
    description: 'SpiceJet is one of Indias leading low-cost carriers. Operating Boeing 737s across extensive Indian domestic network.'
  },
  {
    id: 'aigle',
    name: 'Air India Express',
    location: 'India',
    salaryRange: '$30,000 - $55,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Low Cost', 'Kochi Hub', 'Gulf Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-india-express.jpg',
    description: 'Air India Express serves Gulf routes from Kerala. Low-cost subsidiary connecting Indian workers to Middle East destinations.'
  },
  {
    id: 'cebupacific',
    name: 'Cebu Pacific',
    location: 'Philippines',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Low Cost', 'Largest Philippine LCC'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cebu-pacific.jpg',
    description: 'Cebu Pacific is the Philippines largest low-cost carrier. Operating from Manila with extensive domestic and growing international network across Asia.'
  },
  {
    id: 'srilankan',
    name: 'SriLankan Airlines',
    location: 'Sri Lanka',
    salaryRange: '$30,000 - $60,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Colombo Hub', 'Oneworld', 'Indian Ocean'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/srilankan-airlines.jpg',
    description: 'SriLankan Airlines serves as the Indian Ocean hub from Colombo. Oneworld member with excellent Asian and Middle East connections.'
  },
  {
    id: 'nepal',
    name: 'Nepal Airlines',
    location: 'Nepal',
    salaryRange: '$20,000 - $40,000/year',
    flightHours: '1,000+ hrs TT',
    tags: ['Kathmandu Hub', 'Mountain Flying', 'Regional'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/nepal-airlines.jpg',
    description: 'Nepal Airlines operates in challenging Himalayan terrain. Unique mountain flying experience from Kathmandu to regional destinations.'
  },
  {
    id: 'biman',
    name: 'Biman Bangladesh',
    location: 'Bangladesh',
    salaryRange: '$25,000 - $45,000/year',
    flightHours: '1,500+ hrs TT',
    tags: ['Dhaka Hub', 'National Carrier', 'Gulf Routes'],
    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/bangladesh-biman.jpg',
    description: 'Biman Bangladesh is the national carrier of Bangladesh. Operating from Dhaka with focus on Middle East and Asian routes.'
  }
];

export const AirlineExpectationsCarousel: React.FC<AirlineExpectationsCarouselProps> = ({
  onNavigate,
  onLogin,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('Asia');
  const [isFading, setIsFading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAirlineModal, setSelectedAirlineModal] = useState<Airline | null>(null);
  const [matchScores, setMatchScores] = useState<{ [key: string]: { matchPercentage: number; prScore: number } }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useAuth();

  // Firebase R-formula powered airline intelligence
  const airlineIntelligence = usePathwaysIntelligence(currentUser?.id || undefined);

  // Fetch match scores from Supabase
  useEffect(() => {
    const fetchMatchScores = async () => {
      try {
        // Get the current Supabase session to get the user ID
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          setMatchScores({});
          return;
        }

        const { data, error } = await supabase.rpc('calculate_airline_match_score', {
          p_user_id: session.user.id,
          p_airline_id: null
        });

        if (error) {
          console.error('Error fetching match scores:', error);
          // Fallback: use Firebase intelligence if available
          if (airlineIntelligence.airlineMatches?.airlineMatches) {
            const scoresMap: { [key: string]: { matchPercentage: number; prScore: number } } = {};
            airlineIntelligence.airlineMatches.airlineMatches.forEach((match: any) => {
              const airlineId = mapAirlineNameToId(match.name);
              if (airlineId) {
                scoresMap[airlineId] = {
                  matchPercentage: match.matchPct,
                  prScore: 0
                };
              }
            });
            setMatchScores(scoresMap);
          }
          return;
        }

        if (data) {
          const scoresMap: { [key: string]: { matchPercentage: number; prScore: number } } = {};
          data.forEach((item: any) => {
            // Map airline name to airline ID
            const airlineId = mapAirlineNameToId(item.airline_name);
            if (airlineId) {
              scoresMap[airlineId] = {
                matchPercentage: item.match_percentage,
                prScore: item.pr_score
              };
            }
          });
          setMatchScores(scoresMap);
        }
      } catch (error) {
        console.error('Error fetching match scores:', error);
        // Fallback to Firebase intelligence
        if (airlineIntelligence.airlineMatches?.airlineMatches) {
          const scoresMap: { [key: string]: { matchPercentage: number; prScore: number } } = {};
          airlineIntelligence.airlineMatches.airlineMatches.forEach((match: any) => {
            const airlineId = mapAirlineNameToId(match.name);
            if (airlineId) {
              scoresMap[airlineId] = {
                matchPercentage: match.matchPct,
                prScore: 0
              };
            }
          });
          setMatchScores(scoresMap);
        }
      }
    };

    fetchMatchScores();
  }, [airlineIntelligence.airlineMatches]);

  // Map airline name to airline ID
  const mapAirlineNameToId = (airlineName: string): string | null => {
    const nameToIdMap: { [key: string]: string } = {
      'Qatar Airways': 'qatar',
      'Singapore Airlines': 'singapore',
      'Cathay Pacific': 'cathay',
      'Emirates': 'emirates',
      'Etihad Airways': 'etihad',
      'Lufthansa': 'lufthansa',
      'British Airways': 'british',
      'Air France': 'airfrance',
      'KLM': 'klm',
      'Qantas': 'qantas',
      'ANA All Nippon': 'ana',
      'Japan Airlines': 'jal',
      'Korean Air': 'korean',
      'Asiana Airlines': 'asiana',
      'Thai Airways': 'thai',
      'Malaysia Airlines': 'malaysia',
      'Garuda Indonesia': 'garuda',
      'Philippine Airlines': 'philippine',
      'Vietnam Airlines': 'vietnam',
      'Air China': 'china',
      'China Eastern': 'chinaeastern',
      'China Southern': 'chinasouthern',
      'Delta Air Lines': 'delta',
      'American Airlines': 'american',
      'United Airlines': 'united',
      'Southwest Airlines': 'southwest',
      'Alaska Airlines': 'alaska',
      'JetBlue Airways': 'jetblue',
      'Air Canada': 'aircanada',
      'WestJet': 'westjet',
      'Virgin Australia': 'virginaustralia',
      'LATAM Airlines': 'latam',
      'Avianca': 'avianca',
      'Aeromexico': 'aeromexico',
      'Copa Airlines': 'copaair',
      'GOL Linhas': 'gol',
      'El Al Israel': 'elal',
      'Royal Jordanian': 'royaljordanian',
      'Saudia': 'saudia',
      'EgyptAir': 'egyptair',
      'Ethiopian Airlines': 'ethiopian',
      'South African Airways': 'southafrican',
      'Iberia': 'iberia',
      'ITA Airways': 'alitalia',
      'Austrian Airlines': 'austrian',
      'Brussels Airlines': 'brussels',
      'SAS Scandinavian': 'sas',
      'Finnair': 'finnair',
      'TAP Portugal': 'tap',
      'Aegean Airlines': 'aegean',
      'LOT Polish': 'lot',
      'Czech Airlines': 'czech',
      'Norwegian': 'norwegian',
      'Icelandair': 'icelandair',
      'Cathay Dragon': 'cathaydragon',
      'HK Express': 'hkexpress',
      'Scoot': 'scoot',
      'Jetstar Asia': 'jetstar',
      'Peach Aviation': 'peach',
      'Spring Airlines': 'spring',
      'IndiGo': 'indigo',
      'Air India': 'airindia',
      'SpiceJet': 'spicejet',
      'Air India Express': 'aigle'
    };
    return nameToIdMap[airlineName] || null;
  };

  // Get match score — prefer Firebase R-formula over Supabase RPC
  const getMatchScore = (airline: Airline) => {
    const fbMatch = airlineIntelligence.airlineMatches?.airlineMatches?.find(a => a.id === airline.id);
    if (fbMatch) return fbMatch.matchPct;
    if (!matchScores[airline.id]) return 0;
    return matchScores[airline.id].matchPercentage;
  };

  const getReadinessLabel = (airline: Airline) => {
    const fbMatch = airlineIntelligence.airlineMatches?.airlineMatches?.find(a => a.id === airline.id);
    return fbMatch?.readinessLabel || null;
  };

  // Get PR score from Supabase data
  const getPRScore = (airline: Airline) => {
    if (!matchScores[airline.id]) {
      return 1;
    }
    return matchScores[airline.id].prScore;
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
        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
          Strategic Career Intelligence
        </p>
        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
          Airline Expectations
        </h2>
        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
          Requirements | Expectations | Career Pathways
        </span>
      </div>

      {/* Regional Selector and Description */}
      <div className="w-full px-8 py-4">
        <p className="text-center text-slate-700 text-base md:text-lg mb-4 max-w-3xl mx-auto leading-relaxed">
          Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. Each airline profile provides comprehensive insights into <strong>salary ranges</strong>, <strong>required flight hours</strong>, <strong>type ratings</strong>, and <strong>unique benefits</strong> to help you make informed career decisions. Our <strong>AI-powered pathway matching</strong> system analyzes your verified PilotRecognition profile against airline requirements to identify optimal career opportunities.
        </p>
        <p className="text-center text-slate-600 text-sm mb-4 max-w-3xl mx-auto leading-relaxed">
          Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that the airline expectations we provide align with the exacting standards required by leading manufacturers and operators. Our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> presents your credentials in the standardized format preferred by major airlines worldwide.
        </p>
      </div>

      {/* Airline Readiness Intelligence Banner */}
      {(airlineIntelligence.airlineMatches || airlineIntelligence.loadingAirlines) && (
        <div className="w-full px-8 mb-4">
          <AirlineReadinessBanner
            readyNow={airlineIntelligence.airlineMatches?.readyNow || 0}
            closeReach={airlineIntelligence.airlineMatches?.closeReach || 0}
            longTerm={airlineIntelligence.airlineMatches?.longTerm || 0}
            percentileLabel={airlineIntelligence.airlineMatches?.percentileLabel || ''}
            globalPercentile={airlineIntelligence.airlineMatches?.globalPercentile || 0}
            loading={airlineIntelligence.loadingAirlines}
            isDarkMode={false}
          />
        </div>
      )}

      {/* Regional Selector */}
      <div className="w-full px-8 py-4">
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
              Pilot-Recognition Engine Powered By WingMentor
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
                          {/* Percentage Match Badge with PR Score */}
                          <div className="flex items-center gap-2">
                            <div className="relative group">
                              <div className={`bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all duration-300 cursor-help ${
                                isActive ? 'opacity-100' : 'opacity-50'
                              }`}>
                                PR: {getPRScore(airline)}/10
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <p className="font-semibold mb-1">Pilot Recognition Score</p>
                                <p>Profile match on 1-10 scale based on your qualifications vs airline requirements</p>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                            <div className="relative group">
                              {(() => {
                                const matchPct = getMatchScore(airline);
                                const readiness = getReadinessLabel(airline);
                                const bgColor = matchPct >= 75 ? 'bg-emerald-500' : matchPct >= 50 ? 'bg-amber-500' : 'bg-red-600';
                                return (
                                  <div className={`flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className={`${bgColor} text-white px-3 py-1.5 rounded-lg text-sm font-bold cursor-help`}>
                                      {matchPct}%
                                    </div>
                                    {readiness && isActive && (
                                      <span className={`text-[9px] font-semibold mt-0.5 px-1.5 py-0.5 rounded-full ${
                                        matchPct >= 75 ? 'bg-emerald-500/30 text-emerald-300' : matchPct >= 50 ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-700 text-slate-300'
                                      }`}>{readiness}</span>
                                    )}
                                  </div>
                                );
                              })()}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <p className="font-semibold mb-1">R-Formula Match Score</p>
                                <p>Calculated using WingMentor's 5-factor formula: Programs × Experience × Behavioral × Language × Skills</p>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
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
                            onClick={() => {
                              setIsAutoScrolling(false);
                              setSelectedAirlineModal(airline);
                            }}
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
              setIsAutoScrolling(false);
              setSelectedAirlineModal(currentAirline);
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
        <p className="text-base md:text-lg text-slate-700 leading-relaxed text-center mb-4">
          Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. Each airline profile provides comprehensive insights into <strong>salary ranges</strong>, <strong>required flight hours</strong>, <strong>type ratings</strong>, and <strong>unique benefits</strong> to help you make informed career decisions. Our <strong>AI-powered pathway matching</strong> system analyzes your verified PilotRecognition profile against airline requirements to identify optimal career opportunities.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed text-center mb-3">
          Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that the airline expectations we provide align with the exacting standards required by leading manufacturers and operators. Our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> presents your credentials in the standardized format preferred by major airlines worldwide, while our <strong>blockchain-verifiable certifications</strong> provide operators with confidence in your verified competencies.
        </p>
        <p className="text-xs text-slate-400 text-center">
          Swipe through to discover airline-specific requirements and compare opportunities across global carriers. Our platform connects you directly to 5000+ pilots and operators through our <strong>Pilot Terminal</strong> social network and <strong>enterprise integration</strong>, creating a transparent and efficient recruitment marketplace.
        </p>
      </div>

      {/* Airline Detail Modal */}
      {selectedAirlineModal && (
        <AirlineDetailModal
          airline={selectedAirlineModal}
          matchScore={getMatchScore(selectedAirlineModal)}
          prScore={getPRScore(selectedAirlineModal)}
          onClose={() => {
            setSelectedAirlineModal(null);
            setIsAutoScrolling(true);
          }}
        />
      )}
    </div>
    </>
  );
};
