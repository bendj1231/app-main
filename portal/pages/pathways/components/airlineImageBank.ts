/**
 * Airline Image Bank — Copyright-Compliant Version
 * All images sourced from Unsplash (Unsplash License — free for commercial use)
 * See /public/IMAGE_LICENSES.md for full attribution
 */

// Generic aviation imagery by airline keyword (no logos, no hotlinks)
export const CLOUDINARY_AIRLINES: Record<string, string> = {
  'qatar': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'singapore': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'cathay': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'emirates': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'etihad': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'lufthansa': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'british': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'airfrance': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'klm': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'swiss': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'turkish': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'ana': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'jal': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
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

// Aircraft-specific images (Unsplash only — no airline liveries or trademarked designs)
export const AIRCRAFT_IMAGES: Record<string, string> = {
  // Airbus family
  'A320': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  'A320NEO': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  'A318': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A319': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A321': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A330': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A350': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A380': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A220': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  // Boeing family
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
  // Regional jets
  'ERJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E170': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E175': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E190': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E195': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ700': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ900': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  // Business Jets (generic, no branded imagery)
  'Citation': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation I': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation ISP': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation III': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation Sovereign': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation M2': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Citation CJ4': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'CJ4': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'M2': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Sovereign': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Gulfstream': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Challenger': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'CL-30': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Global': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Learjet': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Falcon': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  // Turboprops
  'King Air': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Caravan': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Pilatus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PC-24': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Pilatus PC-24': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'TBM': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PA-31': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Navajo': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
};

// Airline logos — REMOVED due to trademark restrictions
// Platform now displays airline names as text only.
// To restore logos, written trademark licenses must be obtained from each airline.
export const AIRLINE_LOGOS: Record<string, string> = {};

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
