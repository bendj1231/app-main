const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm9zcnpoYWxuamhlcmZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNDE5MSwiZXhwIjoyMDg5MTEwMTkxfQ.V4bQeDT98UmwXJ9gWJVHRJCgNpw0npMx-BnabMgEnbM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample airline data (first few airlines for testing)
const AIRLINES_SAMPLE = [
  { id: 'qatar', name: 'Qatar Airways', location: 'Qatar', salary_range: '$100,000 – $265,000 USD/Year (Total Package)', flight_hours: '1,000 hrs (FO) / 6,000 hrs (DEC)', tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg', card_image: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Qatar_Airways_Logo.png', description: 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations. With competitive tax-free salary packages, modern aircraft fleet, and rapid career progression opportunities.', fleet: 'Boeing 777, 787, Airbus A350, A380 (active until 2032), A320, A321neo (2026 deliveries), B777-9 (2027 deliveries)', region: 'Middle East', expectations: [
    { title: '5-Star Service Standards', desc: 'Qatar Airways expects pilots to maintain the highest service standards. Excellence in passenger interaction and cultural sensitivity is essential.', bullets: ['Premium Service', 'Cultural Awareness', 'Communication Skills'] }
  ], future_fleet_plans: {
    new_aircraft: ['Boeing 787-9', 'Airbus A350-1000', 'Boeing 777-9'],
    retiring_aircraft: ['Airbus A330-200', 'Airbus A340-600'],
    expansion_plans: 'Expanding to 250+ destinations by 2030 with focus on Asia-Pacific and North America routes'
  }, aircraft_demand: {
    airbus_preference: 55,
    boeing_preference: 45,
    primary_manufacturer: 'Mixed',
    trending_aircraft: ['Airbus A350', 'Boeing 787', 'Boeing 777X']
  }, pilot_requirements: {
    min_hours: 1000,
    preferred_hours: 7000,
    type_rating_required: ['B777', 'B787', 'A350', 'A321neo', 'B777X']
  } },
  { id: 'emirates', name: 'Emirates', location: 'UAE', salary_range: '$130,000 - $280,000/year', flight_hours: '4,000+ hrs TT', tags: ['5-Star Airline', 'Global Network', 'Tax-Free'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png', card_image: 'https://download.logo.wine/logo/Emirates_(airline)/Emirates_(airline)-Logo.wine.png', description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets, offering unmatched global connectivity. The airline provides exceptional training facilities and career advancement opportunities.', fleet: 'Airbus A380, Boeing 777', region: 'Middle East', expectations: [
    { title: 'Wide-Body Proficiency', desc: 'Emirates operates exclusively wide-body aircraft. Pilots must demonstrate expertise in long-haul operations and large aircraft management.', bullets: ['A380 Operations', '777 Expertise', 'Long-Haul Experience'] }
  ], future_fleet_plans: {
    new_aircraft: ['Boeing 777-9', 'Boeing 787-9', 'Airbus A350'],
    retiring_aircraft: ['Airbus A380 (phasing out 2025-2030)'],
    expansion_plans: 'Modernizing fleet with Boeing 777X and 787 Dreamliner, expanding African and South American routes'
  }, aircraft_demand: {
    airbus_preference: 30,
    boeing_preference: 70,
    primary_manufacturer: 'Boeing',
    trending_aircraft: ['Boeing 777X', 'Boeing 787', 'Airbus A350']
  }, pilot_requirements: {
    min_hours: 4000,
    preferred_hours: 7000,
    type_rating_required: ['B777', 'A380']
  } },
  { id: 'singapore', name: 'Singapore Airlines', location: 'Singapore', salary_range: '$120,000 - $180,000/year', flight_hours: '3,000+ hrs TT', tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg', card_image: 'https://static.vecteezy.com/system/resources/previews/055/210/889/non_2x/singapore-airlines-logo-free-download-singapore-airlines-logo-free-png.png', description: 'Singapore Airlines maintains one of the highest service standards globally, offering comprehensive benefits and a strategic Asian hub location.', fleet: 'Airbus A350, A380, Boeing 777, 787', region: 'Asia', expectations: [
    { title: 'Singapore Girl Service', desc: 'World-renowned service standards. Pilots must exemplify the Singapore Girl tradition of excellence in passenger service.', bullets: ['Service Excellence', 'Hospitality', 'Professionalism'] }
  ], future_fleet_plans: {
    new_aircraft: ['Boeing 777-9', 'Airbus A350-1000'],
    retiring_aircraft: ['Boeing 777-200ER', 'Airbus A330-300'],
    expansion_plans: 'Focusing on long-haul expansion to Europe and North America with new A350 and 777X aircraft'
  }, aircraft_demand: {
    airbus_preference: 60,
    boeing_preference: 40,
    primary_manufacturer: 'Airbus',
    trending_aircraft: ['Airbus A350', 'Boeing 777X', 'Airbus A380']
  }, pilot_requirements: {
    min_hours: 3000,
    preferred_hours: 5000,
    type_rating_required: ['B777', 'A350', 'A330', 'A380']
  } },
  { id: 'delta', name: 'Delta Air Lines', location: 'United States', salary_range: '$110,000 - $250,000/year', flight_hours: '1,500+ hrs TT', tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg', card_image: 'https://logodix.com/logo/2219337.png', description: 'Delta is the world\'s largest airline by revenue and fleet size. It offers pilots industry-leading compensation, excellent benefits, and a vast domestic and international network.', fleet: 'Airbus A220, A320, A330, A350, Boeing 737, 757, 767, 777', region: 'Americas' },
  { id: 'lufthansa', name: 'Lufthansa', location: 'Germany', salary_range: '$90,000 - $160,000/year', flight_hours: '1,500+ hrs TT', tags: ['European Leader', 'Star Alliance', 'Career Stability'], image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg', card_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/1280px-Lufthansa_Logo_2018.svg.png', description: 'Lufthansa is Europe\'s largest airline and a founding member of Star Alliance. It offers excellent career stability, comprehensive benefits, and opportunities to fly to over 200 destinations worldwide.', fleet: 'Airbus A350, A330, Boeing 747-8, 777', region: 'Europe' }
];

async function migrateAirlines() {
  console.log('Starting airline migration...');
  
  for (const airline of AIRLINES_SAMPLE) {
    try {
      const { data, error } = await supabase
        .from('airlines')
        .upsert({
          id: airline.id,
          name: airline.name,
          location: airline.location,
          salary_range: airline.salary_range,
          flight_hours: airline.flight_hours,
          tags: airline.tags,
          image: airline.image,
          card_image: airline.card_image,
          description: airline.description,
          fleet: airline.fleet,
          region: airline.region,
          expectations: airline.expectations,
          future_fleet_plans: airline.future_fleet_plans,
          aircraft_demand: airline.aircraft_demand,
          pilot_requirements: airline.pilot_requirements,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error migrating ${airline.name}:`, error);
      } else {
        console.log(`✓ Migrated: ${airline.name}`);
      }
    } catch (err) {
      console.error(`Error processing ${airline.name}:`, err);
    }
  }
  
  console.log('Migration complete!');
}

migrateAirlines().catch(console.error);
