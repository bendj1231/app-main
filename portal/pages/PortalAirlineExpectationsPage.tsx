import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, Plane, Users, Brain, Shield, Cpu, Search, Target, Briefcase, Zap, CheckCircle2, Star, Globe } from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';

type Region = 'All' | 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa' | 'Middle East';

interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
  fleet?: string;
  flag?: string;
  region: Region;
}

const AIRLINES: Airline[] = [
  // Middle East
  { id: 'qatar', name: 'Qatar Airways', location: 'Qatar', salaryRange: '$120,000 - $250,000/year', flightHours: '4,000+ hrs TT', tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg', description: 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. With competitive tax-free salary packages, modern aircraft fleet, and rapid career progression opportunities.', fleet: 'Boeing 777, 787, Airbus A350, A380', region: 'Middle East' },
  { id: 'emirates', name: 'Emirates', location: 'UAE', salaryRange: '$130,000 - $280,000/year', flightHours: '4,000+ hrs TT', tags: ['5-Star Airline', 'Global Network', 'Tax-Free'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png', description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.', fleet: 'Airbus A380, Boeing 777', region: 'Middle East' },
  { id: 'etihad', name: 'Etihad Airways', location: 'UAE', salaryRange: '$115,000 - $200,000/year', flightHours: '2,500+ hrs TT', tags: ['Premium Airline', 'Abu Dhabi Hub', 'Modern Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg', description: 'Etihad Airways provides competitive tax-free packages from its Abu Dhabi base. The airline features a modern fleet and growing global network with focus on premium service standards.', fleet: 'Boeing 787, 777, Airbus A350, A380', region: 'Middle East' },
  { id: 'elal', name: 'El Al Israel', location: 'Israel', salaryRange: '$70,000 - $130,000/year', flightHours: '2,000+ hrs TT', tags: ['Tel Aviv Hub', 'Middle East', 'Security Expert'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/el-al.jpg', description: 'El Al is Israel\'s flag carrier known for exceptional security standards. Pilots benefit from unique Middle Eastern operations and diverse international routes from Tel Aviv.', region: 'Middle East' },
  { id: 'royaljordanian', name: 'Royal Jordanian', location: 'Jordan', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Amman Hub', 'Oneworld', 'Middle East Gateway'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/royal-jordanian.jpg', description: 'Royal Jordanian serves as a bridge between East and West from Amman. The airline offers pilots unique Middle Eastern operations with Oneworld alliance benefits.', region: 'Middle East' },
  { id: 'saudia', name: 'Saudia', location: 'Saudi Arabia', salaryRange: '$80,000 - $140,000/year', flightHours: '2,500+ hrs TT', tags: ['Jeddah Hub', 'Skyteam', 'Growing Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/saudia.jpg', description: 'Saudia is Saudi Arabia\'s flag carrier undergoing rapid transformation. Pilots have opportunities in a rapidly modernizing fleet with growing international destinations.', region: 'Middle East' },
  { id: 'omanair', name: 'Oman Air', location: 'Oman', salaryRange: '$65,000 - $120,000/year', flightHours: '2,000+ hrs TT', tags: ['Muscat Hub', 'Oneworld', 'Growing Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687736/airline-expectations/oman-air.webp', description: 'Oman Air is the national carrier of Oman. Operating from Muscat with a growing Boeing 787 Dreamliner fleet, offering pilots opportunities in the dynamic Middle East market.', fleet: 'Boeing 787 Dreamliner, 737', region: 'Middle East' },
  // Asia
  { id: 'singapore', name: 'Singapore Airlines', location: 'Singapore', salaryRange: '$120,000 - $180,000/year', flightHours: '3,000+ hrs TT', tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg', description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location.', fleet: 'Airbus A350, A380, Boeing 777, 787', region: 'Asia' },
  { id: 'cathay', name: 'Cathay Pacific', location: 'Hong Kong', salaryRange: '$110,000 - $160,000/year', flightHours: '2,500+ hrs TT', tags: ['5-Star Airline', 'Asian Network', 'Career Growth'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg', description: 'Cathay Pacific offers a dynamic work environment with extensive Asian network coverage and strong career progression pathways.', fleet: 'Airbus A350, A330, Boeing 777', region: 'Asia' },
  { id: 'ana', name: 'ANA All Nippon', location: 'Japan', salaryRange: '$100,000 - $170,000/year', flightHours: '1,500+ hrs TT', tags: ['5-Star Airline', 'Tokyo Hub', 'Japanese Quality'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg', description: 'ANA is Japan\'s largest airline and a 5-star carrier renowned for exceptional service. Pilots benefit from Japanese precision, excellent training, and access to key Asian markets.', fleet: 'Boeing 777, 787, Airbus A380, A320', region: 'Asia' },
  { id: 'jal', name: 'Japan Airlines', location: 'Japan', salaryRange: '$95,000 - $165,000/year', flightHours: '1,500+ hrs TT', tags: ['Premium Service', 'Tokyo Hub', 'Domestic + International'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg', description: 'Japan Airlines represents the finest in Japanese hospitality combined with aviation excellence.', fleet: 'Boeing 737, 767, 777, 787, Airbus A350', region: 'Asia' },
  { id: 'korean', name: 'Korean Air', location: 'South Korea', salaryRange: '$85,000 - $150,000/year', flightHours: '2,000+ hrs TT', tags: ['Seoul Hub', 'North American Routes', 'Growing Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/korean-air.jpg', description: 'Korean Air is South Korea\'s flagship carrier with a strong presence on trans-Pacific routes. Pilots enjoy competitive Asian compensation and a modern, expanding aircraft fleet.', region: 'Asia' },
  { id: 'asiana', name: 'Asiana Airlines', location: 'South Korea', salaryRange: '$80,000 - $140,000/year', flightHours: '1,800+ hrs TT', tags: ['Star Alliance', 'Incheon Hub', 'Service Excellence'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/asiana-airlines.webp', description: 'Asiana Airlines is known for outstanding service quality and safety standards. The airline provides pilots with excellent training and opportunities on both regional and long-haul routes.', region: 'Asia' },
  { id: 'thai', name: 'Thai Airways', location: 'Thailand', salaryRange: '$60,000 - $110,000/year', flightHours: '1,500+ hrs TT', tags: ['Bangkok Hub', 'Southeast Asian Network', 'Royal Service'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/thai-airways.jpg', description: 'Thai Airways offers a unique blend of Thai hospitality and international aviation standards. Pilots enjoy living in Thailand while flying to destinations across Asia and beyond.', region: 'Asia' },
  { id: 'malaysia', name: 'Malaysia Airlines', location: 'Malaysia', salaryRange: '$55,000 - $100,000/year', flightHours: '1,200+ hrs TT', tags: ['KL Hub', 'Southeast Asia', 'OneWorld Member'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/malaysia-airlines.jpg', description: 'Malaysia Airlines connects Southeast Asia with the world from its Kuala Lumpur hub. The airline offers pilots competitive compensation and exposure to diverse Asian markets.', region: 'Asia' },
  { id: 'garuda', name: 'Garuda Indonesia', location: 'Indonesia', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Jakarta Hub', 'Archipelago Network', 'Growing Market'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/garuda-indonesia.jpg', description: 'Garuda Indonesia serves the world\'s largest archipelago nation. Pilots benefit from rapid fleet modernization and the opportunity to fly across one of Earth\'s most diverse geographic areas.', region: 'Asia' },
  { id: 'philippine', name: 'Philippine Airlines', location: 'Philippines', salaryRange: '$45,000 - $90,000/year', flightHours: '1,200+ hrs TT', tags: ['Manila Hub', 'Pacific Routes', 'Historic Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/philippine-airlines.webp', description: 'Philippine Airlines is Asia\'s oldest commercial airline. It offers pilots a unique base in the Philippines with growing international connections to North America and Asia.', region: 'Asia' },
  { id: 'vietnam', name: 'Vietnam Airlines', location: 'Vietnam', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Hanoi Hub', 'Growing Economy', 'Modern Fleet'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/vietnam-airlines.jpg', description: 'Vietnam Airlines represents one of Asia\'s fastest-growing economies. The airline is rapidly modernizing its fleet and expanding international routes.', region: 'Asia' },
  { id: 'china', name: 'Air China', location: 'China', salaryRange: '$70,000 - $120,000/year', flightHours: '2,000+ hrs TT', tags: ['Beijing Hub', 'Largest Market', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-china.jpg', description: 'Air China is the flag carrier of the People\'s Republic of China and the world\'s largest aviation market.', region: 'Asia' },
  { id: 'chinaeastern', name: 'China Eastern', location: 'China', salaryRange: '$65,000 - $115,000/year', flightHours: '1,800+ hrs TT', tags: ['Shanghai Hub', 'Skyteam Member', 'Major Player'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-eastern.jpg', description: 'China Eastern Airlines operates from Shanghai, connecting China with the world.', region: 'Asia' },
  { id: 'chinasouthern', name: 'China Southern', location: 'China', salaryRange: '$60,000 - $110,000/year', flightHours: '1,800+ hrs TT', tags: ['Guangzhou Hub', 'Largest Fleet', 'Asia Focus'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/china-southern.jpg', description: 'China Southern operates China\'s largest fleet with extensive Asian coverage.', region: 'Asia' },
  { id: 'cathaydragon', name: 'Cathay Dragon', location: 'Hong Kong', salaryRange: '$70,000 - $120,000/year', flightHours: '1,500+ hrs TT', tags: ['Regional', 'Hong Kong Hub', 'Asia Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-dragon.webp', description: 'Cathay Dragon served regional Asian destinations from Hong Kong. Now integrated into Cathay Pacific with excellent regional opportunities.', region: 'Asia' },
  { id: 'hkexpress', name: 'HK Express', location: 'Hong Kong', salaryRange: '$45,000 - $80,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Hong Kong Hub', 'Asia Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/hk-express.jpg', description: 'HK Express is Hong Kong\'s low-cost carrier. Part of Cathay Pacific group offering pilots dynamic short-haul Asian operations.', region: 'Asia' },
  { id: 'scoot', name: 'Scoot', location: 'Singapore', salaryRange: '$50,000 - $90,000/year', flightHours: '1,200+ hrs TT', tags: ['Low Cost', 'Singapore Hub', 'Long Haul LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/scoot.webp', description: 'Scoot is Singapore Airlines\' low-cost subsidiary. Operates Boeing 787 long-haul low-cost routes across Asia and beyond.', region: 'Asia' },
  { id: 'jetstar', name: 'Jetstar Asia', location: 'Singapore', salaryRange: '$45,000 - $80,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Singapore Hub', 'Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetstar-asia.jpg', description: 'Jetstar Asia serves regional Southeast Asian markets. Part of Qantas Group offering pilots diverse Asian low-cost operations.', region: 'Asia' },
  { id: 'peach', name: 'Peach Aviation', location: 'Japan', salaryRange: '$40,000 - $70,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Osaka Hub', 'Domestic Japan'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/peach-aviation.jpg', description: 'Peach Aviation is Japan\'s leading low-cost carrier. Based in Osaka with extensive domestic and regional Asian network.', region: 'Asia' },
  { id: 'spring', name: 'Spring Airlines', location: 'China', salaryRange: '$35,000 - $65,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Shanghai Hub', 'Largest LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spring-airlines.jpg', description: 'Spring Airlines is China\'s largest low-cost carrier. Based in Shanghai with extensive domestic Chinese network.', region: 'Asia' },
  { id: 'indigo', name: 'IndiGo', location: 'India', salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Delhi Hub', 'India\'s Largest'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/indigo.jpg', description: 'IndiGo is India\'s largest airline by passengers. Fast-growing low-cost carrier with extensive domestic and international network.', region: 'Asia' },
  { id: 'airindia', name: 'Air India', location: 'India', salaryRange: '$40,000 - $75,000/year', flightHours: '1,500+ hrs TT', tags: ['Mumbai Hub', 'Star Alliance', 'Historic Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776689695/airline-expectations/air-india-new.jpg', description: 'Air India is India\'s flag carrier now part of Tata Group. Star Alliance member with extensive international network.', region: 'Asia' },
  { id: 'spicejet', name: 'SpiceJet', location: 'India', salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Delhi Hub', 'Budget Carrier'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/spicejet.jpg', description: 'SpiceJet is one of India\'s leading low-cost carriers. Operating Boeing 737s across extensive Indian domestic network.', region: 'Asia' },
  { id: 'aigle', name: 'Air India Express', location: 'India', salaryRange: '$30,000 - $55,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost', 'Kochi Hub', 'Gulf Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-india-express.jpg', description: 'Air India Express serves Gulf routes from Kerala. Low-cost subsidiary connecting Indian workers to Middle East destinations.', region: 'Asia' },
  { id: 'cebupacific', name: 'Cebu Pacific', location: 'Philippines', salaryRange: '$20,000 - $40,000/year', flightHours: '1,000+ hrs TT', tags: ['Manila Hub', 'Low Cost', 'Largest Philippine LCC'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cebu-pacific.jpg', description: 'Cebu Pacific is the Philippines\' largest low-cost carrier. Operating from Manila with extensive domestic and growing international network.', region: 'Asia' },
  { id: 'srilankan', name: 'SriLankan Airlines', location: 'Sri Lanka', salaryRange: '$30,000 - $60,000/year', flightHours: '1,500+ hrs TT', tags: ['Colombo Hub', 'Oneworld', 'Indian Ocean'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/srilankan-airlines.jpg', description: 'SriLankan Airlines serves as the Indian Ocean hub from Colombo. Oneworld member with excellent Asian and Middle East connections.', region: 'Asia' },
  { id: 'nepal', name: 'Nepal Airlines', location: 'Nepal', salaryRange: '$20,000 - $40,000/year', flightHours: '1,000+ hrs TT', tags: ['Kathmandu Hub', 'Mountain Flying', 'Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/nepal-airlines.jpg', description: 'Nepal Airlines operates in challenging Himalayan terrain. Unique mountain flying experience from Kathmandu to regional destinations.', region: 'Asia' },
  { id: 'biman', name: 'Biman Bangladesh', location: 'Bangladesh', salaryRange: '$25,000 - $45,000/year', flightHours: '1,500+ hrs TT', tags: ['Dhaka Hub', 'National Carrier', 'Gulf Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/bangladesh-biman.jpg', description: 'Biman Bangladesh is the national carrier of Bangladesh. Operating from Dhaka with focus on Middle East and Asian routes.', region: 'Asia' },
  // Europe
  { id: 'lufthansa', name: 'Lufthansa', location: 'Germany', salaryRange: '$90,000 - $160,000/year', flightHours: '1,500+ hrs TT', tags: ['European Leader', 'Star Alliance', 'Career Stability'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg', description: 'Lufthansa is Europe\'s largest airline and a founding member of Star Alliance. It offers excellent career stability, comprehensive benefits, and opportunities to fly to over 200 destinations worldwide.', fleet: 'Airbus A350, A330, Boeing 747-8, 777', region: 'Europe' },
  { id: 'british', name: 'British Airways', location: 'United Kingdom', salaryRange: '$85,000 - $150,000/year', flightHours: '1,500+ hrs TT', tags: ['Legacy Carrier', 'Heathrow Hub', 'Global Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg', description: 'British Airways operates from its hub at London Heathrow, offering pilots access to a vast global network.', fleet: 'Boeing 777, 787, Airbus A350, A380', region: 'Europe' },
  { id: 'airfrance', name: 'Air France', location: 'France', salaryRange: '$80,000 - $140,000/year', flightHours: '1,500+ hrs TT', tags: ['French Flagship', 'CDG Hub', 'European Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg', description: 'Air France is the French flag carrier with a rich history dating back to 1933. Pilots enjoy working in a multicultural environment with excellent French employment benefits.', fleet: 'Boeing 777, 787, Airbus A350, A330', region: 'Europe' },
  { id: 'klm', name: 'KLM', location: 'Netherlands', salaryRange: '$75,000 - $135,000/year', flightHours: '1,200+ hrs TT', tags: ['Dutch Legacy', 'Amsterdam Hub', 'Efficient Operations'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg', description: 'KLM Royal Dutch Airlines is the oldest airline still operating under its original name. Known for efficient operations and excellent pilot relations.', fleet: 'Boeing 777, 787, Airbus A330', region: 'Europe' },
  { id: 'swiss', name: 'Swiss International', location: 'Switzerland', salaryRange: '$95,000 - $155,000/year', flightHours: '1,500+ hrs TT', tags: ['Premium Service', 'Swiss Quality', 'Zurich Hub'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg', description: 'Swiss International Air Lines combines traditional Swiss quality with modern aviation standards.', fleet: 'Airbus A320 family, A330, A340', region: 'Europe' },
  { id: 'turkish', name: 'Turkish Airlines', location: 'Turkey', salaryRange: '$70,000 - $130,000/year', flightHours: '2,000+ hrs TT', tags: ['Fast Growing', 'Istanbul Hub', '120+ Countries'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg', description: 'Turkish Airlines flies to more countries than any other airline. With its modern Istanbul Airport hub, it offers pilots exposure to diverse international routes.', fleet: 'Boeing 737, 777, 787, Airbus A320, A330, A350', region: 'Europe' },
  { id: 'iberia', name: 'Iberia', location: 'Spain', salaryRange: '$65,000 - $115,000/year', flightHours: '1,500+ hrs TT', tags: ['Madrid Hub', 'Oneworld', 'Latin America Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/iberia.jpg', description: 'Iberia is Spain\'s flagship carrier with strong connections to Latin America. Pilots benefit from excellent Spanish employment benefits and extensive transatlantic operations.', region: 'Europe' },
  { id: 'alitalia', name: 'ITA Airways', location: 'Italy', salaryRange: '$55,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Rome Hub', 'Skyteam', 'Mediterranean Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ita-airways.jpg', description: 'ITA Airways represents the rebirth of Italian aviation. Operating from Rome with modern Airbus fleet.', region: 'Europe' },
  { id: 'austrian', name: 'Austrian Airlines', location: 'Austria', salaryRange: '$60,000 - $110,000/year', flightHours: '1,500+ hrs TT', tags: ['Vienna Hub', 'Star Alliance', 'Eastern Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/austrian-airlines.jpg', description: 'Austrian Airlines serves as the gateway to Eastern Europe from Vienna. Part of Lufthansa Group.', region: 'Europe' },
  { id: 'brussels', name: 'Brussels Airlines', location: 'Belgium', salaryRange: '$58,000 - $105,000/year', flightHours: '1,500+ hrs TT', tags: ['Brussels Hub', 'Star Alliance', 'Africa Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/brussels-airlines.jpg', description: 'Brussels Airlines is Belgium\'s flagship carrier with extensive African network. Part of Lufthansa Group.', region: 'Europe' },
  { id: 'sas', name: 'SAS Scandinavian', location: 'Denmark/Norway/Sweden', salaryRange: '$55,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Copenhagen Hub', 'Star Alliance', 'Nordic Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/sas.jpg', description: 'SAS serves Scandinavia with Copenhagen, Oslo and Stockholm hubs. Known for excellent pilot work-life balance and strong Nordic labor protections.', region: 'Europe' },
  { id: 'finnair', name: 'Finnair', location: 'Finland', salaryRange: '$50,000 - $95,000/year', flightHours: '1,500+ hrs TT', tags: ['Helsinki Hub', 'Oneworld', 'Asia Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/finnair.jpg', description: 'Finnair offers the shortest route between Europe and Asia via Helsinki. Modern Airbus A350 fleet.', region: 'Europe' },
  { id: 'tap', name: 'TAP Portugal', location: 'Portugal', salaryRange: '$45,000 - $85,000/year', flightHours: '1,500+ hrs TT', tags: ['Lisbon Hub', 'Star Alliance', 'Brazil Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/tap-portugal.jpg', description: 'TAP Portugal connects Europe to Brazil and Africa from Lisbon. Known for warm Portuguese culture and growing international network.', region: 'Europe' },
  { id: 'aegean', name: 'Aegean Airlines', location: 'Greece', salaryRange: '$40,000 - $75,000/year', flightHours: '1,200+ hrs TT', tags: ['Athens Hub', 'Star Alliance', 'Island Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aegean.jpg', description: 'Aegean Airlines is Greece\'s largest carrier with extensive island network.', region: 'Europe' },
  { id: 'lot', name: 'LOT Polish', location: 'Poland', salaryRange: '$40,000 - $75,000/year', flightHours: '1,500+ hrs TT', tags: ['Warsaw Hub', 'Star Alliance', 'Eastern Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lot-polish.jpg', description: 'LOT Polish Airlines is Eastern Europe\'s leading carrier. Growing long-haul network with Boeing 787 Dreamliners.', region: 'Europe' },
  { id: 'czech', name: 'Czech Airlines', location: 'Czech Republic', salaryRange: '$35,000 - $65,000/year', flightHours: '1,200+ hrs TT', tags: ['Prague Hub', 'Skyteam', 'Central Europe'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/czech-airlines.jpg', description: 'Czech Airlines serves Central Europe from historic Prague. One of the world\'s oldest airlines.', region: 'Europe' },
  { id: 'norwegian', name: 'Norwegian', location: 'Norway', salaryRange: '$45,000 - $80,000/year', flightHours: '1,500+ hrs TT', tags: ['Low Cost', 'Oslo Hub', 'Transatlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/norwegian.jpg', description: 'Norwegian revolutionized low-cost transatlantic travel. Rebuilt fleet offering pilots extensive European and long-haul operations.', region: 'Europe' },
  { id: 'icelandair', name: 'Icelandair', location: 'Iceland', salaryRange: '$50,000 - $90,000/year', flightHours: '1,500+ hrs TT', tags: ['Reykjavik Hub', 'Iceland', 'North Atlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/icelandair.jpg', description: 'Icelandair offers unique North Atlantic operations via Reykjavik. Pilots experience challenging weather operations and stunning scenery.', region: 'Europe' },
  // Americas
  { id: 'delta', name: 'Delta Air Lines', location: 'United States', salaryRange: '$110,000 - $250,000/year', flightHours: '1,500+ hrs TT', tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg', description: 'Delta is the world\'s largest airline by revenue and fleet size. It offers pilots industry-leading compensation, excellent benefits, and a vast domestic and international network.', fleet: 'Airbus A220, A320, A330, A350, Boeing 737, 757, 767, 777', region: 'Americas' },
  { id: 'american', name: 'American Airlines', location: 'United States', salaryRange: '$100,000 - $230,000/year', flightHours: '1,500+ hrs TT', tags: ['World\'s Largest', 'Dallas Hub', 'Oneworld Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/american-airlines.jpg', description: 'American Airlines is the world\'s largest airline by fleet size and passengers carried.', fleet: 'Airbus A320, A321, Boeing 737, 777, 787', region: 'Americas' },
  { id: 'united', name: 'United Airlines', location: 'United States', salaryRange: '$105,000 - $240,000/year', flightHours: '1,500+ hrs TT', tags: ['Global Network', 'Chicago Hub', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/united.jpg', description: 'United Airlines offers one of the most comprehensive global networks. With hubs across the US and Star Alliance membership.', fleet: 'Airbus A319, A320, Boeing 737, 757, 767, 777, 787', region: 'Americas' },
  { id: 'southwest', name: 'Southwest Airlines', location: 'United States', salaryRange: '$95,000 - $200,000/year', flightHours: '1,000+ hrs TT', tags: ['Low Cost Leader', 'Domestic Focus', 'Great Culture'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/southwest.jpg', description: 'Southwest Airlines is the world\'s largest low-cost carrier. Known for excellent pilot relations and unique company culture.', region: 'Americas' },
  { id: 'alaska', name: 'Alaska Airlines', location: 'United States', salaryRange: '$90,000 - $180,000/year', flightHours: '1,200+ hrs TT', tags: ['West Coast', 'Seattle Hub', 'Award Winning'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/alaska-airlines.jpg', description: 'Alaska Airlines is consistently rated among the best US airlines. With its Seattle hub and West Coast focus.', region: 'Americas' },
  { id: 'jetblue', name: 'JetBlue Airways', location: 'United States', salaryRange: '$85,000 - $170,000/year', flightHours: '1,500+ hrs TT', tags: ['New York Hub', 'Transcontinental', 'Modern Experience'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/jetblue.jpg', description: 'JetBlue Airways revolutionized US domestic travel with its premium economy approach. Based in New York.', region: 'Americas' },
  { id: 'aircanada', name: 'Air Canada', location: 'Canada', salaryRange: '$80,000 - $160,000/year', flightHours: '1,500+ hrs TT', tags: ['Toronto Hub', 'Star Alliance', 'Transatlantic'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/air-canada.jpg', description: 'Air Canada is Canada\'s flag carrier and largest airline. Pilots enjoy flying to over 200 destinations worldwide.', region: 'Americas' },
  { id: 'westjet', name: 'WestJet', location: 'Canada', salaryRange: '$70,000 - $140,000/year', flightHours: '1,200+ hrs TT', tags: ['Calgary Hub', 'Canadian Leader', 'Growing International'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/westjet.jpg', description: 'WestJet is Canada\'s second-largest airline and growing internationally.', region: 'Americas' },
  { id: 'latam', name: 'LATAM Airlines', location: 'Chile', salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT', tags: ['Santiago Hub', 'South America', 'Largest Regional'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/latam.jpg', description: 'LATAM is Latin America\'s largest airline group. From Santiago, pilots access an unmatched South American network.', region: 'Americas' },
  { id: 'avianca', name: 'Avianca', location: 'Colombia', salaryRange: '$55,000 - $110,000/year', flightHours: '1,200+ hrs TT', tags: ['Bogota Hub', 'Star Alliance', 'Historic Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/avianca.jpg', description: 'Avianca is one of the world\'s oldest continuously operating airlines. Its Bogota hub provides pilots access to diverse South American destinations.', region: 'Americas' },
  { id: 'aeromexico', name: 'Aeromexico', location: 'Mexico', salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT', tags: ['Mexico City Hub', 'Skyteam', 'Regional Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/aeromexico.jpg', description: 'Aeromexico connects Latin America with the world from Mexico City.', region: 'Americas' },
  { id: 'copaair', name: 'Copa Airlines', location: 'Panama', salaryRange: '$65,000 - $125,000/year', flightHours: '1,500+ hrs TT', tags: ['Panama Hub', 'Hub Americas', 'Star Alliance'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/copa-airlines.jpg', description: 'Copa Airlines operates the Hub of the Americas in Panama. Pilots benefit from the strategic location connecting North and South America.', region: 'Americas' },
  { id: 'gol', name: 'GOL Linhas', location: 'Brazil', salaryRange: '$55,000 - $105,000/year', flightHours: '1,200+ hrs TT', tags: ['Sao Paulo Hub', 'Low Cost Brazil', 'Domestic Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/gol.jpg', description: 'GOL is Brazil\'s largest domestic airline. Pilots fly within one of the world\'s most geographically diverse countries.', region: 'Americas' },
  // Oceania
  { id: 'qantas', name: 'Qantas', location: 'Australia', salaryRange: '$95,000 - $180,000/year', flightHours: '2,000+ hrs TT', tags: ['Sydney Hub', 'Oneworld', 'Safest Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qantas.jpg', description: 'Qantas is Australia\'s flag carrier and one of the world\'s safest airlines. Known for its Sydney-London Kangaroo Route.', region: 'Oceania' },
  { id: 'virginaustralia', name: 'Virgin Australia', location: 'Australia', salaryRange: '$75,000 - $145,000/year', flightHours: '1,500+ hrs TT', tags: ['Brisbane Hub', 'Competitive Service', 'Domestic Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/virgin-australia.png', description: 'Virgin Australia brings competitive service to the Australian market. Pilots enjoy modern aircraft and a focus on customer experience.', region: 'Oceania' },
  // Africa
  { id: 'egyptair', name: 'EgyptAir', location: 'Egypt', salaryRange: '$45,000 - $85,000/year', flightHours: '1,500+ hrs TT', tags: ['Cairo Hub', 'Star Alliance', 'African Network'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776687052/airline-expectations/egypt-air.jpg', description: 'EgyptAir connects Africa with the world from historic Cairo. Pilots benefit from unique African operations.', region: 'Africa' },
  { id: 'ethiopian', name: 'Ethiopian Airlines', location: 'Ethiopia', salaryRange: '$50,000 - $90,000/year', flightHours: '1,500+ hrs TT', tags: ['Addis Ababa Hub', 'Star Alliance', 'African Leader'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ethiopian-airlines.jpg', description: 'Ethiopian Airlines is Africa\'s largest and most successful airline. From Addis Ababa, pilots access the continent\'s most extensive network.', region: 'Africa' },
  { id: 'southafrican', name: 'South African Airways', location: 'South Africa', salaryRange: '$40,000 - $80,000/year', flightHours: '1,200+ hrs TT', tags: ['Johannesburg Hub', 'Star Alliance', 'Southern Africa'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/south-african-airways.jpg', description: 'South African Airways connects the African continent from Johannesburg. Pilots enjoy diverse flying opportunities across Africa.', region: 'Africa' },
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
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const carouselRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuth();

  const filteredAirlines = AIRLINES.filter(a => {
    const matchesRegion = regionFilter === 'All' || a.region === regionFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q));
    return matchesRegion && matchesSearch;
  });

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const container = carouselRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const bg = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const card = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const text = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtext = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400';

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans`}>
      {/* Top Nav */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pathways
          </button>
          <div className="h-5 w-px bg-slate-700 mx-1" />
          <img src="/logo.png" alt="WingMentor" className="h-8 w-auto object-contain" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Airline Expectations</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-purple-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-3">Strategic Career Guidance</p>
          <h1 className={`text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 ${text}`}>
            Airline Expectations Search
          </h1>
          <p className="text-lg md:text-xl mb-2" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
            Requirements · Expectations · Career Pathways
          </p>
          <p className={`max-w-2xl mx-auto text-sm md:text-base leading-relaxed ${subtext} mt-4`}>
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
              className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all ${inputBg}`}
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
      <div className="px-0 mb-12">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-serif font-normal ${text}`}>Browse Airlines</h2>
            <p className={`text-sm ${subtext}`}>{filteredAirlines.length} airlines available</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['All', 'Asia', 'Europe', 'Americas', 'Oceania', 'Africa', 'Middle East'] as Region[]).map(r => (
              <button
                key={r}
                onClick={() => { setRegionFilter(r); setSelectedAirline(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  regionFilter === r
                    ? 'bg-sky-500 text-white'
                    : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {filteredAirlines.map(airline => (
            <div
              key={airline.id}
              onClick={() => setSelectedAirline(airline)}
              className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                selectedAirline?.id === airline.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50'
                  : isDarkMode ? 'border-slate-800 hover:border-slate-600' : 'border-slate-200 hover:border-slate-400'
              } ${isDarkMode ? 'bg-slate-900' : 'bg-white'} group`}
            >
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={airline.image}
                  alt={airline.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-lg">{airline.flag}</span>
                    <span className="text-white font-serif text-base leading-tight">{airline.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <MapPin className="w-3 h-3" />
                    {airline.location}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <DollarSign className="w-3 h-3" />
                    <span className="font-medium">{airline.salaryRange}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  <Clock className="w-3 h-3" />
                  {airline.flightHours}
                </div>
                <div className="flex flex-wrap gap-1">
                  {airline.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Airline Detail */}
      {selectedAirline && (
        <div className="max-w-7xl mx-auto px-6 mb-12">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
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
                  <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium"><DollarSign className="w-4 h-4" />{selectedAirline.salaryRange}</span>
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm"><Clock className="w-4 h-4" />{selectedAirline.flightHours}</span>
                </div>
              </div>
            </div>

            {/* Detail Content */}
            <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
              {/* Left */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${text}`}>About</h3>
                <p className={`text-sm leading-relaxed mb-6 ${subtext}`}>{selectedAirline.description}</p>

                {selectedAirline.fleet && (
                  <>
                    <h3 className={`text-lg font-semibold mb-3 ${text}`}>Fleet</h3>
                    <div className={`flex items-start gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <Plane className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                      <p className={`text-sm ${subtext}`}>{selectedAirline.fleet}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Right - Requirements */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${text}`}>Minimum Requirements</h3>
                <ul className="space-y-2.5">
                  {[
                    `${selectedAirline.flightHours} Total Flight Time`,
                    'Valid ATPL or CPL',
                    'ICAO English Level 4+',
                    'Class 1 Medical Certificate',
                    'Multi-Engine Instrument Rating',
                  ].map((req, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${subtext}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>

                <h3 className={`text-lg font-semibold mt-6 mb-3 ${text}`}>Preferred</h3>
                <ul className="space-y-2.5">
                  {[
                    `Type Rating on ${selectedAirline.name} fleet aircraft`,
                    'Previous airline / commercial experience',
                    'EBT / CBTA certification',
                    'MCC course completion',
                    'Recent line experience (last 12 months)',
                  ].map((req, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm ${subtext}`}>
                      <Star className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
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
          </div>
        </div>
      )}

      {/* Core Expectations */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-serif font-normal ${text} mb-2`}>What Airlines Really Look For</h2>
          <p className={`text-sm ${subtext}`}>The four pillars assessed during every airline selection process</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_EXPECTATIONS.map(exp => {
            const Icon = exp.icon;
            return (
              <div key={exp.title} className={`rounded-2xl border p-6 ${card}`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`font-semibold mb-2 ${text}`}>{exp.title}</h3>
                <p className={`text-xs leading-relaxed mb-4 ${subtext}`}>{exp.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {exp.bullets.map(b => (
                    <span key={b} className={`text-[10px] px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>{b}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Pipeline */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-serif font-normal ${text} mb-2`}>The Assessment Pipeline</h2>
          <p className={`text-sm ${subtext}`}>From application to final offer — know every stage</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {ASSESSMENT_PIPELINE.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={stage.title} className={`rounded-2xl border p-6 relative ${card}`}>
                <div className={`absolute top-4 right-4 text-2xl font-serif font-bold ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <Icon className="w-5 h-5 text-sky-400" />
                </div>
                <h3 className={`font-semibold mb-2 ${text}`}>{stage.title}</h3>
                <p className={`text-xs leading-relaxed ${subtext}`}>{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Profile Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 border border-sky-800/50 p-8 text-center">
          <Globe className="w-10 h-10 text-sky-400 mx-auto mb-4" />
          <h3 className="text-2xl font-serif text-black mb-2">Check Your Airline Match Score</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6">
            Your WingMentor PilotRecognition profile is automatically matched against each airline's verified requirements. Build your profile to unlock personalised match scores.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full border border-slate-200">
              <span className="text-black text-sm font-medium">Profile Score</span>
              <span className="text-sky-600 font-bold text-lg">{userProfile ? '82%' : '--'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full border border-slate-200">
              <span className="text-black text-sm font-medium">Airlines Matched</span>
              <span className="text-emerald-600 font-bold text-lg">{userProfile ? AIRLINES.length : '0'}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PortalAirlineExpectationsPage;
