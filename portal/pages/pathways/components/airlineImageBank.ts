/**
 * Airline Image Bank — extracted from PathwaysPageModern
 * Image URLs and helper functions for airline/aircraft imagery
 */

// Confirmed working Cloudinary images from AirlineExpectationsCarousel
export const CLOUDINARY_AIRLINES: Record<string, string> = {
  'qatar': 'https://airlinegeeks.com/wp-content/uploads/2018/10/IMG_3495-e1540774160956.jpg',
  'singapore': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg',
  'cathay': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
  'emirates': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
  'etihad': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
  'lufthansa': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
  'british': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
  'airfrance': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg',
  'klm': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg',
  'swiss': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg',
  'turkish': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg',
  'ana': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg',
  'jal': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg',
};

// Reliable fallback images by category (Unsplash)
export const FALLBACK_IMAGES: Record<string, string> = {
  'cadet-programme': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'cargo': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  'private': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'flight-schools': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'military': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'privateSector': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'airtaxi-drones': 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
};

// Aircraft-specific images
export const AIRCRAFT_IMAGES: Record<string, string> = {
  // Airbus
  'A320': 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/global/products/our-fleet/A320-NEO.png?imwidth=480&imdensity=2.625',
  'A320NEO': 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/global/products/our-fleet/A320-NEO.png?imwidth=480&imdensity=2.625',
  'A318': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A319': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A321': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A330': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A350': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A380': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A220': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  // Boeing
  'B737': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  '737': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  'B747': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '747': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B777': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '777': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B787': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '787': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B757': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '757': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B767': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '767': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  // Regional
  'ERJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E170': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E175': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E190': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E195': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ700': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ900': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  // Business Jets
  'Citation': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation I': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation ISP': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation III': 'https://askjet.ru/wp-content/uploads/2025/08/cb2b78fb-994f-446f-9605-b24948035ea9.png',
  'Citation Sovereign': 'https://w7.pngwing.com/pngs/86/879/png-transparent-aircraft-cessna-citation-sovereign-cessna-citation-x-cessna-citation-longitude-cessna-citationjet-m2-private-jet-mode-of-transport-flight-airplane.png',
  'Citation M2': 'https://tadistributors.com/wp-content/uploads/2017/12/M2-Cutout-1.png',
  'Citation CJ4': 'https://www.jetfinder.com/wp-content/uploads/2024/01/citation_cj4_exterior.png',
  'CJ4': 'https://www.jetfinder.com/wp-content/uploads/2024/01/citation_cj4_exterior.png',
  'M2': 'https://tadistributors.com/wp-content/uploads/2017/12/M2-Cutout-1.png',
  'Sovereign': 'https://w7.pngwing.com/pngs/86/879/png-transparent-aircraft-cessna-citation-sovereign-cessna-citation-x-cessna-citation-longitude-cessna-citationjet-m2-private-jet-mode-of-transport-flight-airplane.png',
  'Gulfstream': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Challenger': 'https://res.cloudinary.com/flyblackbird/image/upload/c_scale,q_auto:eco,w_600/v1/aircraft/bombardier-challenger-300',
  'CL-30': 'https://res.cloudinary.com/flyblackbird/image/upload/c_scale,q_auto:eco,w_600/v1/aircraft/bombardier-challenger-300',
  'Global': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Learjet': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Falcon': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  // Turboprops
  'King Air': 'https://www.callandfly.pl/wp-content/uploads/Zrzut_ekranu_2024-07-29_o_13.07.24-removebg-preview.png',
  'Caravan': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Pilatus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PC-24': 'https://www.oriensaviation.com/wp-content/uploads/2025/02/PC-24.png',
  'Pilatus PC-24': 'https://www.oriensaviation.com/wp-content/uploads/2025/02/PC-24.png',
  'TBM': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PA-31': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/N146J-exterior.jpg',
  'Navajo': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/N146J-exterior.jpg',
};

// Airline logos
export const AIRLINE_LOGOS: Record<string, string> = {
  'etihad': 'https://logos-world.net/wp-content/uploads/2023/01/Etihad-Airways-Logo.png',
  'ejm': 'https://www.jsfirm.com/assets/logos/EJM_logo-2023.jpg',
  'emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png',
  'qatar': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Qatar_Airways_logo.svg/1200px-Qatar_Airways_logo.svg.png',
  'singapore': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/2b/Singapore_Airlines_logo.svg/1200px-Singapore_Airlines_logo.svg.png',
  'cathay': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Cathay_Pacific_logo.svg/1200px-Cathay_Pacific_logo.svg.png',
  'lufthansa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/1200px-Lufthansa_Logo_2018.svg.png',
  'british airways': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/49/British_Airways_1997.svg/1200px-British_Airways_1997.svg.png',
  'air france': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Air_France-Logo.svg/1200px-Air_France-Logo.svg.png',
  'klm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/KLM_Logo.svg/1200px-KLM_Logo.svg.png',
  'turkish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Turkish_Airlines_logo_2019.svg/1200px-Turkish_Airlines_logo_2019.svg.png',
  'ana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/All_Nippon_Airways_Logo.svg/1200px-All_Nippon_Airways_Logo.svg.png',
  'jal': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Japan_Airlines_logo.svg/1200px-Japan_Airlines_logo.svg.png',
  'delta': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780355/airline-logos/airline-logos/delta.svg',
  'american': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780357/airline-logos/airline-logos/american.svg',
  'united': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780360/airline-logos/airline-logos/united.svg',
  'jetblue': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/JetBlue_Airways_Logo.svg/1200px-JetBlue_Airways_Logo.svg.png',
  'southwest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Southwest_Airlines_logo_2014.svg/1200px-Southwest_Airlines_logo_2014.svg.png',
  'alaska': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Alaska_Airlines_logo_2014.svg/1200px-Alaska_Airlines_logo_2014.svg.png',
};

export function getAircraftImage(aircraftType: string): string {
  const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (AIRCRAFT_IMAGES[typeKey]) {
    return AIRCRAFT_IMAGES[typeKey];
  }

  for (const [key, url] of Object.entries(AIRCRAFT_IMAGES)) {
    if (typeKey.includes(String(key).toUpperCase()) || String(key).toUpperCase().includes(typeKey)) {
      return url;
    }
  }

  if (String(aircraftType || '').toUpperCase().includes('KING AIR')) {
    return AIRCRAFT_IMAGES['King Air'];
  }

  return FALLBACK_IMAGES['cadet-programme'];
}

export function getAirlineLogo(airline: string): string | null {
  if (!airline) return null;
  const airlineLower = airline.toLowerCase();

  for (const [key, url] of Object.entries(AIRLINE_LOGOS)) {
    if (airlineLower.includes(key) || key.includes(airlineLower)) {
      return url;
    }
  }

  return null;
}

export function extractAircraftFromTitle(title: string): string | null {
  const aircraftPatterns = [
    /B737|Boeing 737|737/i,
    /B747|Boeing 747|747/i,
    /B777|Boeing 777|777/i,
    /B787|Boeing 787|787|Dreamliner/i,
    /B757|Boeing 757|757/i,
    /B767|Boeing 767|767/i,
    /A320|Airbus 320/i,
    /A330|Airbus 330/i,
    /A350|Airbus 350/i,
    /A380|Airbus 380/i,
    /A319|Airbus 319/i,
    /A321|Airbus 321/i,
    /A318|Airbus 318/i,
    /Challenger|CL-30|CL-60|CL-350|CL-650/i,
    /Global|Global 5000|Global 6000|Global 7500|Global 8000/i,
    /Gulfstream|G-IV|G-V|G450|G550|G650|G700|GVII|G500|G600/i,
    /Citation|CJ[0-9]+|CJ series|CJ2|CJ3|CJ4|Ultra|Latitude|Longitude|XLS| Sovereign/i,
    /Learjet|LR-[0-9]+|LRJET|Lear/i,
    /Falcon|F900|F2000|F7X|F8X|F6X|10X/i,
    /ERJ|EMB-[0-9]+|E-Jet|E170|E175|E190|E195/i,
    /CRJ|Canadair|Regional Jet/i,
    /King Air|KingAir|B200|B350/i,
    /Caravan|C208|208/i,
    /Pilatus|PC-12|PC12/i,
    /TBM/i,
    /Navajo|PA-31/i,
    / Phenom|Embraer Phenom|300|100/i,
    /Praetor|500|600/i,
    /Legacy|450|500|600|650/i,
  ];

  for (const pattern of aircraftPatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
}

export function getAirlineImage(company: string, category: string): string {
  if (!company) return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['cadet-programme'];
  const companyLower = company.toLowerCase();

  for (const [key, image] of Object.entries(CLOUDINARY_AIRLINES)) {
    if (companyLower.includes(key)) {
      return image;
    }
  }

  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['cadet-programme'];
}
