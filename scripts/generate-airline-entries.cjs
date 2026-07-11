#!/usr/bin/env node
/**
 * Generates TypeScript entries for all missing airlines and outputs them
 * organized by region, ready to paste into the AIRLINES array.
 *
 * Also identifies which airlines need logos downloaded.
 */

const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');

// Helper to check if a file exists
function exists(relPath) {
  return fs.existsSync(path.join(LOGOS_DIR, relPath));
}

// All new airlines to add, organized by region
// Each entry: { id, name, location, region, logo?, heroImage?, salaryRange, flightHours, tags, description, fleet }
const NEW_AIRLINES = [
  // ===== APAC - Australia =====
  { id: 'rex', name: 'Rex Airlines', location: 'Australia', region: 'Oceania',
    logo: 'APAC/australia/regional-operators/rex-airlines.svg',
    salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Regional Carrier', 'Sydney Hub', 'Domestic Network'],
    description: 'Rex Airlines is a major Australian regional carrier operating domestic and regional routes across Australia.',
    fleet: 'Saab 340, Boeing 737-800' },

  // ===== APAC - Brunei =====
  { id: 'royalbrunei', name: 'Royal Brunei Airlines', location: 'Brunei', region: 'Asia',
    logo: 'APAC/brunei/international-operators/royal-brunei-airlines.svg',
    heroImage: 'APAC/brunei/international-operators/royal-brunei-airlines-aircraft.jpg',
    salaryRange: '$70,000 - $140,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Bandar Seri Begawan Hub', 'Flag Carrier', 'Southeast Asia'],
    description: 'Royal Brunei Airlines is the flag carrier of Brunei, operating regional and long-haul routes from Bandar Seri Begawan.',
    fleet: 'Boeing 787, Airbus A320neo' },

  // ===== APAC - China =====
  { id: 'hainan', name: 'Hainan Airlines', location: 'China', region: 'Asia',
    logo: 'APAC/china/international-operators/hainan-airlines.svg',
    salaryRange: '$60,000 - $130,000/year', flightHours: '1,500+ hrs TT',
    tags: ['5-Star Airline', 'Haikou Hub', 'Skytrax Award Winner'],
    description: 'Hainan Airlines is a 5-star Skytrax rated carrier and one of China\'s largest airlines, operating domestic and international routes.',
    fleet: 'Boeing 787, 737, Airbus A330' },
  { id: 'xiamen', name: 'Xiamen Airlines', location: 'China', region: 'Asia',
    logo: 'APAC/china/international-operators/xiamen-airlines.jpg',
    salaryRange: '$55,000 - $110,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Xiamen Hub', 'Boeing Fleet', 'SkyTeam'],
    description: 'Xiamen Airlines is a major Chinese carrier operating an all-Boeing fleet from its Xiamen hub.',
    fleet: 'Boeing 737, 787, 757' },
  { id: 'shanghai', name: 'Shanghai Airlines', location: 'China', region: 'Asia',
    logo: 'APAC/china/regional-operators/shanghai-airlines.svg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Shanghai Hub', 'SkyTeam', 'Domestic Focus'],
    description: 'Shanghai Airlines operates domestic and regional international routes from Shanghai Pudong and Hongqiao.',
    fleet: 'Boeing 737, 787' },
  { id: 'shenzhen', name: 'Shenzhen Airlines', location: 'China', region: 'Asia',
    logo: 'APAC/china/regional-operators/shenzhen-airlines.svg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Shenzhen Hub', 'Star Alliance', 'Domestic Network'],
    description: 'Shenzhen Airlines is a major Chinese carrier based in Shenzhen, operating domestic and regional routes.',
    fleet: 'Airbus A320, A319, Boeing 737' },
  { id: 'sichuan', name: 'Sichuan Airlines', location: 'China', region: 'Asia',
    logo: 'APAC/china/regional-operators/sichuan-airlines.svg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Chengdu Hub', 'Airbus Fleet', 'Domestic Network'],
    description: 'Sichuan Airlines operates from Chengdu with an all-Airbus fleet, serving domestic and international routes.',
    fleet: 'Airbus A320, A321, A330' },

  // ===== APAC - Fiji =====
  { id: 'fiji', name: 'Fiji Airways', location: 'Fiji', region: 'Oceania',
    logo: 'APAC/fiji/international-operators/fiji-airways.svg',
    salaryRange: '$55,000 - $110,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Nadi Hub', 'Flag Carrier', 'South Pacific'],
    description: 'Fiji Airways is the flag carrier of Fiji, connecting the South Pacific with Asia, North America, and Australia.',
    fleet: 'Airbus A350, A330, Boeing 737' },

  // ===== APAC - French Polynesia =====
  { id: 'airtahitinui', name: 'Air Tahiti Nui', location: 'French Polynesia', region: 'Oceania',
    heroImage: 'APAC/french-polynesia/international-operators/air-tahiti-nui-aircraft.jpg',
    salaryRange: '$55,000 - $110,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Papeete Hub', 'Flag Carrier', 'South Pacific'],
    description: 'Air Tahiti Nui connects French Polynesia with the world, operating long-haul routes from Papeete.',
    fleet: 'Boeing 787-9' },

  // ===== APAC - Hong Kong =====
  { id: 'hongkongairlines', name: 'Hong Kong Airlines', location: 'Hong Kong', region: 'Asia',
    logo: 'APAC/hong-kong/international-operators/hong-kong-airlines.svg',
    salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Hong Kong Hub', 'Regional Carrier', 'Asia Network'],
    description: 'Hong Kong Airlines operates regional and long-haul routes from Hong Kong International Airport.',
    fleet: 'Airbus A330, A350' },

  // ===== APAC - India =====
  { id: 'akasa', name: 'Akasa Air', location: 'India', region: 'Asia',
    logo: 'APAC/india/regional-operators/akasa-air.svg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Mumbai Hub', 'Low-Cost Carrier', 'New Airline'],
    description: 'Akasa Air is a new Indian low-cost carrier operating a modern Boeing 737 MAX fleet.',
    fleet: 'Boeing 737 MAX' },

  // ===== APAC - Indonesia =====
  { id: 'batik', name: 'Batik Air', location: 'Indonesia', region: 'Asia',
    logo: 'APAC/indonesia/regional-operators/batik-air.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Lion Air Group', 'Full Service'],
    description: 'Batik Air is a full-service carrier under the Lion Air Group, operating domestic and regional routes in Indonesia.',
    fleet: 'Airbus A320, Boeing 737' },
  { id: 'citilink', name: 'Citilink', location: 'Indonesia', region: 'Asia',
    logo: 'APAC/indonesia/regional-operators/citilink.svg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Garuda Subsidiary', 'Low-Cost Carrier'],
    description: 'Citilink is the low-cost subsidiary of Garuda Indonesia, operating domestic and regional routes.',
    fleet: 'Airbus A320' },
  { id: 'lionair', name: 'Lion Air', location: 'Indonesia', region: 'Asia',
    logo: 'APAC/indonesia/regional-operators/lion-air.svg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Jakarta Hub', 'Largest LCC', 'Domestic Network'],
    description: 'Lion Air is Indonesia\'s largest low-cost carrier, operating an extensive domestic and regional network.',
    fleet: 'Boeing 737, 737 MAX, Airbus A330' },

  // ===== APAC - Japan =====
  { id: 'zipair', name: 'Zipair Tokyo', location: 'Japan', region: 'Asia',
    logo: 'APAC/japan/international-operators/zipair.svg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Tokyo Hub', 'JAL Subsidiary', 'Long-Haul LCC'],
    description: 'Zipair Tokyo is a long-haul low-cost carrier and subsidiary of Japan Airlines, operating from Narita.',
    fleet: 'Boeing 787-8' },
  { id: 'skymark', name: 'Skymark Airlines', location: 'Japan', region: 'Asia',
    logo: 'APAC/japan/regional-operators/skymark-airlines.svg',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Tokyo Hub', 'Domestic LCC', 'Boeing Fleet'],
    description: 'Skymark Airlines is a Japanese low-cost carrier operating domestic routes from Tokyo Haneda.',
    fleet: 'Boeing 737' },
  { id: 'solaseed', name: 'Solaseed Air', location: 'Japan', region: 'Asia',
    logo: 'APAC/japan/regional-operators/solaseed-air.svg',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Miyazaki Hub', 'Regional Carrier', 'Domestic Network'],
    description: 'Solaseed Air is a Japanese regional carrier operating domestic routes, primarily from Miyazaki and Naha.',
    fleet: 'Boeing 737' },
  { id: 'starflyer', name: 'Star Flyer', location: 'Japan', region: 'Asia',
    logo: 'APAC/japan/regional-operators/star-flyer.svg',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Kitakyushu Hub', 'Premium LCC', 'Domestic Network'],
    description: 'Star Flyer is a Japanese premium low-cost carrier operating from Kitakyushu with domestic routes.',
    fleet: 'Airbus A320' },

  // ===== APAC - Kiribati =====
  { id: 'airkiribati', name: 'Air Kiribati', location: 'Kiribati', region: 'Oceania',
    heroImage: 'APAC/kiribati/international-operators/air-kiribati-aircraft.jpg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Tarawa Hub', 'Flag Carrier', 'Pacific Islands'],
    description: 'Air Kiribati is the flag carrier of Kiribati, operating inter-island services across the Pacific archipelago.',
    fleet: 'De Havilland Canada DHC-6, Harbin Y-12' },

  // ===== APAC - Laos =====
  { id: 'laoairlines', name: 'Lao Airlines', location: 'Laos', region: 'Asia',
    logo: 'APAC/laos/international-operators/laos-airlines.png',
    heroImage: 'APAC/laos/international-operators/lao-airlines-aircraft.jpg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Vientiane Hub', 'Flag Carrier', 'Mekong Region'],
    description: 'Lao Airlines is the flag carrier of Laos, operating domestic and regional routes from Vientiane.',
    fleet: 'Airbus A320, ATR 72' },

  // ===== APAC - Malaysia =====
  { id: 'airasia', name: 'AirAsia', location: 'Malaysia', region: 'Asia',
    logo: 'APAC/malaysia/international-operators/airasia.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Kuala Lumpur Hub', 'World\'s Best LCC', 'Pan-Asian Network'],
    description: 'AirAsia is one of the largest low-cost carriers in Asia, operating an extensive network from Kuala Lumpur.',
    fleet: 'Airbus A320, A321, A330' },
  { id: 'airasiax', name: 'AirAsia X', location: 'Malaysia', region: 'Asia',
    logo: 'APAC/malaysia/international-operators/airasia.svg',
    heroImage: 'APAC/malaysia/international-operators/airasia-x-aircraft.jpg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Kuala Lumpur Hub', 'Long-Haul LCC', 'Wide-Body Fleet'],
    description: 'AirAsia X is the long-haul arm of AirAsia, operating wide-body aircraft on medium and long-haul routes.',
    fleet: 'Airbus A330, A321XLR' },

  // ===== APAC - Maldives =====
  { id: 'maldivian', name: 'Maldivian', location: 'Maldives', region: 'Asia',
    logo: 'APAC/maldives/regional-operators/maldivian.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Male Hub', 'Flag Carrier', 'Island Network'],
    description: 'Maldivian is the flag carrier of the Maldives, operating inter-island and regional routes.',
    fleet: 'Airbus A320, ATR 42, DHC-6' },

  // ===== APAC - Myanmar =====
  { id: 'myanmarairways', name: 'Myanmar Airways', location: 'Myanmar', region: 'Asia',
    heroImage: 'APAC/myanmar/international-operators/myanmar-airways-aircraft.jpg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Yangon Hub', 'Flag Carrier', 'Domestic Network'],
    description: 'Myanmar Airways is the flag carrier of Myanmar, operating domestic and regional routes from Yangon.',
    fleet: 'Embraer E190, ATR 72' },

  // ===== APAC - New Caledonia =====
  { id: 'aircalin', name: 'Air Calédonie', location: 'New Caledonia', region: 'Oceania',
    logo: 'APAC/new-caledonia/international-operators/air-calin.svg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Noumea Hub', 'Flag Carrier', 'South Pacific'],
    description: 'Air Calédonie (AirCalin) is the flag carrier of New Caledonia, connecting Noumea with the Pacific and Asia.',
    fleet: 'Airbus A330, A320' },

  // ===== APAC - New Zealand =====
  { id: 'airnz', name: 'Air New Zealand', location: 'New Zealand', region: 'Oceania',
    logo: 'APAC/new-zealand/international-operators/air-new-zealand.svg',
    salaryRange: '$70,000 - $150,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Auckland Hub', 'Star Alliance', '5-Star Safety'],
    description: 'Air New Zealand is the flag carrier of New Zealand, known for innovative service and an extensive domestic and international network.',
    fleet: 'Boeing 787, 777, Airbus A320, A321neo, ATR 72' },

  // ===== APAC - Pakistan =====
  { id: 'sereneair', name: 'SereneAir', location: 'Pakistan', region: 'Asia',
    heroImage: 'APAC/pakistan/international-operators/serene-air-aircraft.jpg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Karachi Hub', 'Private Carrier', 'Domestic Network'],
    description: 'SereneAir is a Pakistani private airline operating domestic routes from Karachi and Islamabad.',
    fleet: 'Boeing 737-800' },
  { id: 'pia', name: 'Pakistan International Airlines', location: 'Pakistan', region: 'Asia',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Karachi Hub', 'Flag Carrier', 'Domestic & International'],
    description: 'PIA is the flag carrier of Pakistan, operating domestic and international routes from Karachi.',
    fleet: 'Boeing 777, 737, Airbus A320' },
  { id: 'airblue', name: 'Airblue', location: 'Pakistan', region: 'Asia',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Islamabad Hub', 'Private Carrier', 'Domestic Network'],
    description: 'Airblue is a Pakistani private airline operating domestic and regional routes.',
    fleet: 'Airbus A320, A321' },

  // ===== APAC - Papua New Guinea =====
  { id: 'airniugini', name: 'Air Niugini', location: 'Papua New Guinea', region: 'Oceania',
    logo: 'APAC/papua-new-guinea/international-operators/air-niugini.svg',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Port Moresby Hub', 'Flag Carrier', 'Pacific Network'],
    description: 'Air Niugini is the flag carrier of Papua New Guinea, operating domestic and regional international routes.',
    fleet: 'Boeing 737, 767, Fokker 70, Fokker 100' },

  // ===== APAC - Philippines =====
  { id: 'airjuan', name: 'Air Juan', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/air-juan.png',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Regional Carrier', 'Island Routes', 'Charter Services'],
    description: 'Air Juan is a Philippine regional carrier operating inter-island flights and charter services.',
    fleet: 'ATR 72, DHC-6' },
  { id: 'cebgo', name: 'Cebgo', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/cebgo.png',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Cebu Hub', 'Cebu Pacific Subsidiary', 'Regional Carrier'],
    description: 'Cebgo is the regional subsidiary of Cebu Pacific, operating inter-island routes in the Philippines.',
    fleet: 'ATR 72' },
  { id: 'palexpress', name: 'PAL Express', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/pal-express.svg',
    salaryRange: '$25,000 - $55,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'PAL Subsidiary', 'Regional Carrier'],
    description: 'PAL Express is the regional subsidiary of Philippine Airlines, operating domestic routes.',
    fleet: 'Airbus A320, ATR 72, De Havilland Q400' },
  { id: 'philairasia', name: 'Philippines AirAsia', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/philippines-airasia.svg',
    salaryRange: '$25,000 - $55,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'AirAsia Group', 'Low-Cost Carrier'],
    description: 'Philippines AirAsia is the Philippine affiliate of the AirAsia group, operating domestic and regional routes.',
    fleet: 'Airbus A320' },
  { id: 'royalair', name: 'Royal Air Philippines', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/royal-air-philippines.png',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Charter Carrier', 'Domestic Routes'],
    description: 'Royal Air Philippines is a charter and domestic carrier operating from Manila.',
    fleet: 'Airbus A320' },
  { id: 'skypasada', name: 'Sky Pasada', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/sky-pasada.png',
    salaryRange: '$20,000 - $40,000/year', flightHours: '500+ hrs TT',
    tags: ['Regional Carrier', 'Mountain Routes', 'Inter-Island'],
    description: 'Sky Pasada is a Philippine regional carrier specializing in inter-island and mountain routes.',
    fleet: 'DHC-6 Twin Otter' },
  { id: 'skyjet', name: 'SkyJet Airlines', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/skyjet-airlines.png',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Manila Hub', 'Premium Service', 'Domestic Routes'],
    description: 'SkyJet Airlines is a Philippine premium carrier operating domestic routes to popular tourist destinations.',
    fleet: 'British Aerospace 146 (BAe 146)' },
  { id: 'sunlightair', name: 'Sunlight Air', location: 'Philippines', region: 'Asia',
    logo: 'APAC/philippines/regional-operators/sunlight-air.png',
    salaryRange: '$20,000 - $45,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Regional Carrier', 'Inter-Island', 'Tourism Focus'],
    description: 'Sunlight Air is a Philippine regional carrier operating inter-island flights to tourist destinations.',
    fleet: 'ATR 72' },

  // ===== APAC - Samoa =====
  { id: 'samoaairways', name: 'Samoa Airways', location: 'Samoa', region: 'Oceania',
    heroImage: 'APAC/samoa/international-operators/samoa-airways-aircraft.jpg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Apia Hub', 'Flag Carrier', 'South Pacific'],
    description: 'Samoa Airways is the flag carrier of Samoa, operating inter-island and regional routes from Apia.',
    fleet: 'De Havilland Canada DHC-6, Saab 340' },

  // ===== APAC - Solomon Islands =====
  { id: 'solomonairlines', name: 'Solomon Airlines', location: 'Solomon Islands', region: 'Oceania',
    heroImage: 'APAC/solomon-islands/international-operators/solomon-airlines-aircraft.jpg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Honiara Hub', 'Flag Carrier', 'Pacific Islands'],
    description: 'Solomon Airlines is the flag carrier of the Solomon Islands, operating domestic and regional international routes.',
    fleet: 'Airbus A320, De Havilland Canada DHC-6, DHC-3' },

  // ===== APAC - South Korea =====
  { id: 'airbusan', name: 'Air Busan', location: 'South Korea', region: 'Asia',
    logo: 'APAC/south-korea/regional-operators/air-busan.svg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Busan Hub', 'Asiana Subsidiary', 'Regional Carrier'],
    description: 'Air Busan is a regional carrier and subsidiary of Asiana Airlines, operating from Busan.',
    fleet: 'Airbus A320, A321' },
  { id: 'airseoul', name: 'Air Seoul', location: 'South Korea', region: 'Asia',
    logo: 'APAC/south-korea/regional-operators/air-seoul.svg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Asiana Subsidiary', 'Low-Cost Carrier'],
    description: 'Air Seoul is a low-cost carrier and subsidiary of Asiana Airlines, operating from Incheon.',
    fleet: 'Airbus A320, A321' },
  { id: 'eastarjet', name: 'Eastar Jet', location: 'South Korea', region: 'Asia',
    logo: 'APAC/south-korea/regional-operators/eastar-jet.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Low-Cost Carrier', 'Regional Network'],
    description: 'Eastar Jet is a South Korean low-cost carrier operating domestic and regional international routes.',
    fleet: 'Boeing 737' },
  { id: 'jejuair', name: 'Jeju Air', location: 'South Korea', region: 'Asia',
    logo: 'APAC/south-korea/regional-operators/jeju-air.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Jeju Hub', 'Largest Korean LCC', 'Asia Network'],
    description: 'Jeju Air is South Korea\'s largest low-cost carrier, operating domestic and international routes.',
    fleet: 'Boeing 737-800' },
  { id: 'twayair', name: 'T\'way Air', location: 'South Korea', region: 'Asia',
    logo: 'APAC/south-korea/regional-operators/tway-air.svg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Seoul Hub', 'Low-Cost Carrier', 'Asia Network'],
    description: 'T\'way Air is a South Korean low-cost carrier operating domestic and regional international routes.',
    fleet: 'Boeing 737' },

  // ===== APAC - Taiwan =====
  { id: 'chinaairlines', name: 'China Airlines', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/international-operators/china-airlines.png',
    salaryRange: '$60,000 - $130,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', 'SkyTeam', 'Flag Carrier'],
    description: 'China Airlines is the flag carrier of Taiwan, operating an extensive international network from Taipei.',
    fleet: 'Boeing 777, 747, 787, Airbus A350, A330, A321neo' },
  { id: 'evaair', name: 'EVA Air', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/international-operators/eva-air.svg',
    salaryRange: '$60,000 - $130,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', '5-Star Airline', 'Star Alliance'],
    description: 'EVA Air is a 5-star Taiwanese airline operating from Taipei with an extensive global network.',
    fleet: 'Boeing 777, 787, Airbus A330, A321' },
  { id: 'starlux', name: 'Starlux Airlines', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/international-operators/starlux-airlines.svg',
    salaryRange: '$55,000 - $110,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Taipei Hub', 'Premium Carrier', 'New Airline'],
    description: 'Starlux Airlines is a premium Taiwanese carrier launched in 2020, operating from Taipei with a modern fleet.',
    fleet: 'Airbus A321neo, A330neo, A350' },
  { id: 'mandarin', name: 'Mandarin Airlines', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/regional-operators/mandarin-airlines.svg',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'China Airlines Subsidiary', 'Regional Carrier'],
    description: 'Mandarin Airlines is a regional subsidiary of China Airlines, operating domestic and regional routes.',
    fleet: 'ATR 72, Airbus A321' },
  { id: 'tigerairtw', name: 'Tigerair Taiwan', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/regional-operators/tigerair-taiwan.svg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'Low-Cost Carrier', 'Domestic & Regional'],
    description: 'Tigerair Taiwan is a low-cost carrier operating domestic and regional routes from Taipei.',
    fleet: 'Airbus A320' },
  { id: 'uniair', name: 'UNI Air', location: 'Taiwan', region: 'Asia',
    logo: 'APAC/taiwan/regional-operators/uni-air.png',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Taipei Hub', 'EVA Air Subsidiary', 'Regional Carrier'],
    description: 'UNI Air is a regional subsidiary of EVA Air, operating domestic and regional routes in Taiwan.',
    fleet: 'ATR 72, Airbus A321' },

  // ===== APAC - Thailand =====
  { id: 'bangkokair', name: 'Bangkok Airways', location: 'Thailand', region: 'Asia',
    logo: 'APAC/thailand/regional-operators/bangkok-airways.svg',
    heroImage: 'APAC/thailand/regional-operators/bangkok-airways-aircraft.jpg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Premium Regional', 'Asia Network'],
    description: 'Bangkok Airways is a regional carrier operating from Bangkok with premium service to destinations across Asia.',
    fleet: 'Airbus A319, A320, ATR 72' },
  { id: 'nokair', name: 'Nok Air', location: 'Thailand', region: 'Asia',
    logo: 'APAC/thailand/regional-operators/nok-air.jpg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Low-Cost Carrier', 'Domestic Network'],
    description: 'Nok Air is a Thai low-cost carrier operating domestic and regional routes from Bangkok.',
    fleet: 'Boeing 737, 737 MAX, De Havilland Q400' },
  { id: 'thaiairasia', name: 'Thai AirAsia', location: 'Thailand', region: 'Asia',
    logo: 'APAC/thailand/regional-operators/thai-airasia.png',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'AirAsia Group', 'Low-Cost Carrier'],
    description: 'Thai AirAsia is the Thai affiliate of AirAsia, operating domestic and regional international routes.',
    fleet: 'Airbus A320' },
  { id: 'thailionair', name: 'Thai Lion Air', location: 'Thailand', region: 'Asia',
    logo: 'APAC/thailand/regional-operators/thai-lion-air.svg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Bangkok Hub', 'Lion Air Group', 'Low-Cost Carrier'],
    description: 'Thai Lion Air is the Thai affiliate of the Lion Air Group, operating domestic and regional routes.',
    fleet: 'Boeing 737, 737 MAX' },

  // ===== APAC - Vanuatu =====
  { id: 'airvanuatu', name: 'Air Vanuatu', location: 'Vanuatu', region: 'Oceania',
    heroImage: 'APAC/vanuatu/international-operators/air-vanuatu-aircraft.jpg',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Port Vila Hub', 'Flag Carrier', 'South Pacific'],
    description: 'Air Vanuatu is the flag carrier of Vanuatu, operating domestic and regional international routes from Port Vila.',
    fleet: 'ATR 72, De Havilland Canada DHC-6, Boeing 737' },

  // ===== APAC - Vietnam =====
  { id: 'bambooairways', name: 'Bamboo Airways', location: 'Vietnam', region: 'Asia',
    logo: 'APAC/vietnam/regional-operators/bamboo-airways.svg',
    heroImage: 'APAC/vietnam/regional-operators/bamboo-airways-aircraft.jpg',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Hanoi Hub', 'Hybrid Carrier', 'Domestic & International'],
    description: 'Bamboo Airways is a Vietnamese carrier offering both domestic and international service with a modern fleet.',
    fleet: 'Boeing 787, 777, Airbus A320, A321' },
  { id: 'vietjet', name: 'VietJet Air', location: 'Vietnam', region: 'Asia',
    logo: 'APAC/vietnam/regional-operators/vietjet-air.svg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Ho Chi Minh Hub', 'Low-Cost Carrier', 'Domestic Leader'],
    description: 'VietJet Air is Vietnam\'s largest low-cost carrier, operating domestic and regional international routes.',
    fleet: 'Airbus A320, A321, A330' },

  // ===== Africa =====
  { id: 'fly540', name: 'Fly540', location: 'Kenya', region: 'Africa',
    heroImage: 'africa/fly540-aircraft.jpg',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Nairobi Hub', 'Low-Cost Carrier', 'East Africa'],
    description: 'Fly540 is a Kenyan low-cost carrier operating domestic and regional routes in East Africa.',
    fleet: 'Bombardier CRJ, ATR 72' },
  { id: 'flysafair', name: 'FlySafair', location: 'South Africa', region: 'Africa',
    heroImage: 'africa/flysafair-aircraft.jpg',
    salaryRange: '$30,000 - $60,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Johannesburg Hub', 'Low-Cost Carrier', 'Domestic Network'],
    description: 'FlySafair is a South African low-cost carrier operating domestic routes with an all-Boeing fleet.',
    fleet: 'Boeing 737-400, 737-800' },
  { id: 'jambojet', name: 'Jambojet', location: 'Kenya', region: 'Africa',
    heroImage: 'africa/jambojet-aircraft.jpg',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Nairobi Hub', 'Kenya Airways Subsidiary', 'Low-Cost Carrier'],
    description: 'Jambojet is a low-cost subsidiary of Kenya Airways, operating domestic and regional routes.',
    fleet: 'Boeing 737, De Havilland Q400' },
  { id: 'mango', name: 'Mango Airlines', location: 'South Africa', region: 'Africa',
    heroImage: 'africa/mango-aircraft.jpg',
    salaryRange: '$25,000 - $50,000/year', flightHours: '1,000+ hrs TT',
    tags: ['Johannesburg Hub', 'SAA Subsidiary', 'Low-Cost Carrier'],
    description: 'Mango Airlines was a low-cost subsidiary of South African Airways, operating domestic routes.',
    fleet: 'Boeing 737-800' },
  { id: 'airmauritius', name: 'Air Mauritius', location: 'Mauritius', region: 'Africa',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Port Louis Hub', 'Flag Carrier', 'Indian Ocean'],
    description: 'Air Mauritius is the flag carrier of Mauritius, connecting the Indian Ocean island with Africa, Asia, and Europe.',
    fleet: 'Airbus A350, A330neo, ATR 72' },
  { id: 'kenyaairways', name: 'Kenya Airways', location: 'Kenya', region: 'Africa',
    salaryRange: '$40,000 - $85,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Nairobi Hub', 'SkyTeam', 'African Leader'],
    description: 'Kenya Airways is the flag carrier of Kenya, operating from Nairobi to destinations across Africa, Europe, and Asia.',
    fleet: 'Boeing 787, 737, Embraer E190' },
  { id: 'royalairmaroc', name: 'Royal Air Maroc', location: 'Morocco', region: 'Africa',
    salaryRange: '$40,000 - $85,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Casablanca Hub', 'Oneworld', 'North African Leader'],
    description: 'Royal Air Maroc is the flag carrier of Morocco and a Oneworld member, operating from Casablanca.',
    fleet: 'Boeing 787, 737, 747, Airbus A320' },
  { id: 'tunisair', name: 'Tunisair', location: 'Tunisia', region: 'Africa',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Tunis Hub', 'Flag Carrier', 'North Africa'],
    description: 'Tunisair is the flag carrier of Tunisia, operating from Tunis to destinations in Europe, Africa, and the Middle East.',
    fleet: 'Airbus A330, A320, Boeing 737' },
  { id: 'airalgerie', name: 'Air Algérie', location: 'Algeria', region: 'Africa',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Algiers Hub', 'Flag Carrier', 'North Africa'],
    description: 'Air Algérie is the flag carrier of Algeria, operating domestic and international routes from Algiers.',
    fleet: 'Airbus A330, A320, Boeing 737, 767' },
  { id: 'rwandair', name: 'RwandAir', location: 'Rwanda', region: 'Africa',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Kigali Hub', 'Flag Carrier', 'East Africa'],
    description: 'RwandAir is the flag carrier of Rwanda, operating from Kigali to destinations across Africa, Europe, and the Middle East.',
    fleet: 'Airbus A330, Boeing 737, CRJ-900' },
  { id: 'airseychelles', name: 'Air Seychelles', location: 'Seychelles', region: 'Africa',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Victoria Hub', 'Flag Carrier', 'Indian Ocean'],
    description: 'Air Seychelles is the flag carrier of Seychelles, operating domestic inter-island and international routes.',
    fleet: 'Airbus A320, A320neo, De Havilland Canada DHC-6' },

  // ===== Americas =====
  { id: 'aircanadarouge', name: 'Air Canada Rouge', location: 'Canada', region: 'Americas',
    heroImage: 'americas/air-canada-rouge-aircraft.jpg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Air Canada Subsidiary', 'Leisure Carrier'],
    description: 'Air Canada Rouge is the leisure subsidiary of Air Canada, operating vacation routes with a mixed fleet.',
    fleet: 'Airbus A319, A320, A321, Boeing 767' },
  { id: 'spirit', name: 'Spirit Airlines', location: 'United States', region: 'Americas',
    heroImage: 'americas/spirit-aircraft.jpg',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Fort Lauderdale Hub', 'Ultra-Low-Cost', 'Large Network'],
    description: 'Spirit Airlines is a major US ultra-low-cost carrier operating an extensive network across the Americas.',
    fleet: 'Airbus A320, A319, A321, A320neo' },
  { id: 'frontier', name: 'Frontier Airlines', location: 'United States', region: 'Americas',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Denver Hub', 'Ultra-Low-Cost', 'Airbus Fleet'],
    description: 'Frontier Airlines is a US ultra-low-cost carrier operating from Denver with an all-Airbus fleet.',
    fleet: 'Airbus A320, A321, A320neo' },
  { id: 'allegiant', name: 'Allegiant Air', location: 'United States', region: 'Americas',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Las Vegas Hub', 'Leisure Carrier', 'Domestic Network'],
    description: 'Allegiant Air is a US low-cost carrier focused on leisure routes from Las Vegas and other focus cities.',
    fleet: 'Airbus A320, A319' },
  { id: 'hawaiian', name: 'Hawaiian Airlines', location: 'United States', region: 'Americas',
    salaryRange: '$55,000 - $120,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Honolulu Hub', 'Flag Carrier of Hawaii', 'Pacific Network'],
    description: 'Hawaiian Airlines is the flag carrier of Hawaii, operating inter-island and long-haul Pacific routes.',
    fleet: 'Airbus A330, A321neo, Boeing 787' },
  { id: 'airtransat', name: 'Air Transat', location: 'Canada', region: 'Americas',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Montreal Hub', 'Leisure Carrier', 'International Routes'],
    description: 'Air Transat is a Canadian leisure carrier operating international vacation routes from Montreal and Toronto.',
    fleet: 'Airbus A330, A321, A321neo' },
  { id: 'porter', name: 'Porter Airlines', location: 'Canada', region: 'Americas',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Toronto Hub', 'Regional Carrier', 'Premium Service'],
    description: 'Porter Airlines is a Canadian regional carrier operating from Toronto with premium service.',
    fleet: 'De Havilland Q400, Embraer E195-E2' },
  { id: 'azul', name: 'Azul Brazilian Airlines', location: 'Brazil', region: 'Americas',
    salaryRange: '$40,000 - $85,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Sao Paulo Hub', 'Largest Brazilian LCC', 'Domestic Network'],
    description: 'Azul is Brazil\'s largest low-cost carrier, operating an extensive domestic and regional network.',
    fleet: 'Embraer E190, E195, Airbus A320, A330, ATR 72' },
  { id: 'aerolineas', name: 'Aerolíneas Argentinas', location: 'Argentina', region: 'Americas',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Buenos Aires Hub', 'Flag Carrier', 'SkyTeam'],
    description: 'Aerolíneas Argentinas is the flag carrier of Argentina, operating domestic and international routes from Buenos Aires.',
    fleet: 'Airbus A330, A320, Boeing 737' },
  { id: 'skyairline', name: 'Sky Airline', location: 'Chile', region: 'Americas',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'Low-Cost Carrier', 'South America'],
    description: 'Sky Airline is a Chilean low-cost carrier operating domestic and regional routes from Santiago.',
    fleet: 'Airbus A320, A320neo' },
  { id: 'jetsmart', name: 'JetSMART', location: 'Chile', region: 'Americas',
    salaryRange: '$35,000 - $70,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Santiago Hub', 'Ultra-Low-Cost', 'South America'],
    description: 'JetSMART is a South American ultra-low-cost carrier operating from Santiago, Chile.',
    fleet: 'Airbus A320, A320neo, A321neo' },

  // ===== Europe =====
  { id: 'airmalta', name: 'Air Malta', location: 'Malta', region: 'Europe',
    heroImage: 'europe/air-malta-aircraft.jpg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Malta Hub', 'Flag Carrier', 'Mediterranean'],
    description: 'Air Malta is the flag carrier of Malta, connecting the Mediterranean island with European destinations.',
    fleet: 'Airbus A320, A320neo' },
  { id: 'airserbia', name: 'Air Serbia', location: 'Serbia', region: 'Europe',
    heroImage: 'europe/air-serbia-aircraft.jpg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Belgrade Hub', 'Flag Carrier', 'Balkan Network'],
    description: 'Air Serbia is the flag carrier of Serbia, operating from Belgrade to European and international destinations.',
    fleet: 'Airbus A330, A320, ATR 72, Boeing 737' },
  { id: 'croatiaair', name: 'Croatia Airlines', location: 'Croatia', region: 'Europe',
    heroImage: 'europe/croatia-airlines-aircraft.jpg',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Zagreb Hub', 'Flag Carrier', 'Star Alliance'],
    description: 'Croatia Airlines is the flag carrier of Croatia, operating from Zagreb to European destinations.',
    fleet: 'Airbus A320, A319, De Havilland Q400' },
  { id: 'tarom', name: 'TAROM', location: 'Romania', region: 'Europe',
    heroImage: 'europe/tarom-aircraft.jpg',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Bucharest Hub', 'Flag Carrier', 'SkyTeam'],
    description: 'TAROM is the flag carrier of Romania, operating from Bucharest to European and Middle Eastern destinations.',
    fleet: 'Airbus A318, ATR 72, Boeing 737' },
  { id: 'uia', name: 'Ukraine International Airlines', location: 'Ukraine', region: 'Europe',
    heroImage: 'europe/ukraine-international-airlines-aircraft.jpg',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Kyiv Hub', 'Flag Carrier', 'European Network'],
    description: 'UIA is the flag carrier of Ukraine, operating from Kyiv to European and international destinations.',
    fleet: 'Boeing 777, 737, 767, Embraer E190' },
  { id: 'ryanair', name: 'Ryanair', location: 'Ireland', region: 'Europe',
    salaryRange: '$40,000 - $85,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Dublin Hub', 'Europe\'s Largest LCC', 'Boeing Fleet'],
    description: 'Ryanair is Europe\'s largest low-cost carrier, operating an extensive network from Dublin and many European bases.',
    fleet: 'Boeing 737-800, 737 MAX' },
  { id: 'easyjet', name: 'easyJet', location: 'United Kingdom', region: 'Europe',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['London Hub', 'Major LCC', 'Airbus Fleet'],
    description: 'easyJet is a major European low-cost carrier operating from London and other European bases with an all-Airbus fleet.',
    fleet: 'Airbus A320, A319, A320neo, A321neo' },
  { id: 'wizzair', name: 'Wizz Air', location: 'Hungary', region: 'Europe',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Budapest Hub', 'Ultra-Low-Cost', 'Eastern Europe'],
    description: 'Wizz Air is a Hungarian ultra-low-cost carrier focused on Eastern Europe with an all-Airbus fleet.',
    fleet: 'Airbus A320, A321, A321neo' },
  { id: 'vueling', name: 'Vueling', location: 'Spain', region: 'Europe',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Barcelona Hub', 'IAG Group', 'Low-Cost Carrier'],
    description: 'Vueling is a Spanish low-cost carrier in the IAG group, operating from Barcelona across Europe.',
    fleet: 'Airbus A320, A319, A321' },
  { id: 'aireuropa', name: 'Air Europa', location: 'Spain', region: 'Europe',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Madrid Hub', 'SkyTeam', 'Long-Haul Carrier'],
    description: 'Air Europa is a Spanish airline operating domestic, European, and long-haul routes from Madrid.',
    fleet: 'Boeing 787, 737, Airbus A330, Embraer E195' },
  { id: 'jet2', name: 'Jet2.com', location: 'United Kingdom', region: 'Europe',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Leeds Hub', 'Leisure Carrier', 'European Routes'],
    description: 'Jet2.com is a British leisure carrier operating holiday routes from multiple UK bases.',
    fleet: 'Boeing 737, 737 MAX, 757, Airbus A321' },
  { id: 'tui', name: 'TUI Airways', location: 'United Kingdom', region: 'Europe',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['London Hub', 'Leisure Carrier', 'Holiday Routes'],
    description: 'TUI Airways is a British leisure carrier operating holiday flights to destinations worldwide.',
    fleet: 'Boeing 787, 737, 767, 757' },
  { id: 'aeroflot', name: 'Aeroflot', location: 'Russia', region: 'Europe',
    salaryRange: '$45,000 - $95,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Moscow Hub', 'Flag Carrier', 'Largest Russian Airline'],
    description: 'Aeroflot is the flag carrier and largest airline of Russia, operating from Moscow to worldwide destinations.',
    fleet: 'Airbus A350, A330, A320, Boeing 777, 737, Sukhoi Superjet' },
  { id: 'airbaltic', name: 'airBaltic', location: 'Latvia', region: 'Europe',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Riga Hub', 'Flag Carrier', 'Baltic Region'],
    description: 'airBaltic is the flag carrier of Latvia, operating from Riga across the Baltic region and Europe.',
    fleet: 'Airbus A220-300' },

  // ===== Middle East =====
  { id: 'flydubai', name: 'flydubai', location: 'United Arab Emirates', region: 'Middle East',
    heroImage: 'middle-east/flydubai-aircraft.jpg',
    salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Dubai Hub', 'Low-Cost Carrier', 'Middle East Network'],
    description: 'flydubai is a low-cost carrier based in Dubai, operating regional and medium-haul routes complementing Emirates.',
    fleet: 'Boeing 737, 737 MAX' },
  { id: 'flynas', name: 'flynas', location: 'Saudi Arabia', region: 'Middle East',
    heroImage: 'middle-east/flynas-aircraft.jpg',
    salaryRange: '$50,000 - $100,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Riyadh Hub', 'Low-Cost Carrier', 'Middle East Network'],
    description: 'flynas is a Saudi low-cost carrier operating domestic and regional routes from Riyadh.',
    fleet: 'Airbus A320, A320neo, A321neo' },
  { id: 'gulfair', name: 'Gulf Air', location: 'Bahrain', region: 'Middle East',
    salaryRange: '$60,000 - $120,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Manama Hub', 'Flag Carrier', 'Middle East Network'],
    description: 'Gulf Air is the flag carrier of Bahrain, operating from Manama to destinations across the Middle East, Asia, and Europe.',
    fleet: 'Boeing 787, 737, Airbus A320, A321neo' },
  { id: 'kuwaitairways', name: 'Kuwait Airways', location: 'Kuwait', region: 'Middle East',
    salaryRange: '$55,000 - $110,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Kuwait City Hub', 'Flag Carrier', 'Middle East Network'],
    description: 'Kuwait Airways is the flag carrier of Kuwait, operating from Kuwait City to destinations in the Middle East, Asia, Europe, and North America.',
    fleet: 'Boeing 777, 787, Airbus A320, A330, A350' },
  { id: 'airarabia', name: 'Air Arabia', location: 'United Arab Emirates', region: 'Middle East',
    salaryRange: '$45,000 - $90,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Sharjah Hub', 'Low-Cost Carrier', 'Middle East Network'],
    description: 'Air Arabia is the first and largest low-cost carrier in the Middle East, operating from Sharjah across the region.',
    fleet: 'Airbus A320, A320neo, A321' },

  // ===== Central Asia =====
  { id: 'airastana', name: 'Air Astana', location: 'Kazakhstan', region: 'Asia',
    salaryRange: '$40,000 - $85,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Almaty Hub', 'Flag Carrier', 'Central Asia'],
    description: 'Air Astana is the flag carrier of Kazakhstan, operating from Almaty and Astana to domestic and international destinations.',
    fleet: 'Airbus A320, A321, A321neo, Boeing 767, 787, Embraer E190' },
  { id: 'uzbekistanairways', name: 'Uzbekistan Airways', location: 'Uzbekistan', region: 'Asia',
    salaryRange: '$35,000 - $75,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Tashkent Hub', 'Flag Carrier', 'Central Asia'],
    description: 'Uzbekistan Airways is the flag carrier of Uzbekistan, operating from Tashkent to domestic and international destinations.',
    fleet: 'Boeing 787, 767, 757, Airbus A320, Il-114' },
  { id: 'azerbaijan', name: 'Azerbaijan Airlines', location: 'Azerbaijan', region: 'Asia',
    salaryRange: '$40,000 - $80,000/year', flightHours: '1,500+ hrs TT',
    tags: ['Baku Hub', 'Flag Carrier', 'Caspian Region'],
    description: 'Azerbaijan Airlines is the flag carrier of Azerbaijan, operating from Baku to domestic and international destinations.',
    fleet: 'Airbus A340, A330, A320, Boeing 787, 767, 757' },
];

// Generate TypeScript entries
function generateEntries() {
  const lines = [];
  const missingLogos = [];
  const missingAircraft = [];

  for (const a of NEW_AIRLINES) {
    const logoPath = a.logo ? `/images/airline-logos/${a.logo}` : undefined;
    const heroPath = a.heroImage ? `/images/airline-logos/${a.heroImage}` : undefined;

    if (a.logo && !exists(a.logo)) {
      missingLogos.push({ id: a.id, name: a.name, path: a.logo });
    }
    if (a.heroImage && !exists(a.heroImage)) {
      missingAircraft.push({ id: a.id, name: a.name, path: a.heroImage });
    }
    if (!a.logo && !a.heroImage) {
      missingLogos.push({ id: a.id, name: a.name, path: '(no logo or aircraft image)' });
    }

    lines.push('  {');
    lines.push(`    id: '${a.id}',`);
    if (logoPath) lines.push(`    logo: '${logoPath}',`);
    if (heroPath) lines.push(`    heroImage: '${heroPath}',`);
    lines.push(`    name: '${a.name}',`);
    lines.push(`    location: '${a.location}',`);
    lines.push(`    salaryRange: '${a.salaryRange}',`);
    lines.push(`    flightHours: '${a.flightHours}',`);
    lines.push(`    tags: [${a.tags.map((t) => `'${t.replace(/'/g, "\\'")}'`).join(', ')}],`);
    lines.push(`    image: '',`);
    lines.push(`    cardImage: '',`);
    lines.push(`    description: '${a.description.replace(/'/g, "\\'")}',`);
    if (a.fleet) lines.push(`    fleet: '${a.fleet}',`);
    lines.push(`    region: '${a.region}',`);
    lines.push('  },');
  }

  return { entries: lines.join('\n'), missingLogos, missingAircraft };
}

const { entries, missingLogos, missingAircraft } = generateEntries();

// Write entries to a temp file
const outPath = path.join(__dirname, 'generated-airline-entries.txt');
fs.writeFileSync(outPath, entries);
console.log(`Generated ${NEW_AIRLINES.length} airline entries -> ${outPath}`);

if (missingLogos.length > 0) {
  console.log(`\n=== MISSING LOGOS (${missingLogos.length}) ===`);
  missingLogos.forEach((m) => console.log(`  ${m.name} (${m.id}): ${m.path}`));
}

if (missingAircraft.length > 0) {
  console.log(`\n=== MISSING AIRCRAFT IMAGES (${missingAircraft.length}) ===`);
  missingAircraft.forEach((m) => console.log(`  ${m.name} (${m.id}): ${m.path}`));
}

console.log(`\nTotal new airlines: ${NEW_AIRLINES.length}`);
console.log(`Airlines with logos: ${NEW_AIRLINES.filter((a) => a.logo && exists(a.logo)).length}`);
console.log(`Airlines with aircraft images: ${NEW_AIRLINES.filter((a) => a.heroImage && exists(a.heroImage)).length}`);
console.log(`Airlines needing logo download: ${missingLogos.length}`);
