// BetterAviationJobs API Sync - Aviation-specific job board
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface BetterAviationJob {
  id: string;
  position: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  min_hours?: number;
  aircraft_type?: string;
  rating_requirements?: string[];
  date_posted: string;
  url: string;
  salary?: string;
  job_category: 'pilot' | 'cabin-crew' | 'maintenance' | 'operations';
}

// Parse hours from requirements (BetterAviation specific patterns)
function extractMinHours(text: string): number | null {
  const patterns = [
    /(\d{3,4})\s*hours?/i,
    /minimum\s+of\s+(\d{3,4})\s*hrs?/i,
    /(\d{3,4})\s*total\s*time/i,
    /(\d{3,4})\s*flight\s*hours?/i,
    /(\d{3,4})\s*TT/i,
    /(\d{3,4})\s*pic/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const hours = parseInt(match[1], 10);
      if (hours >= 200 && hours <= 20000) return hours;
    }
  }
  return null;
}

// Extract ratings from text
function extractRatings(text: string): string[] {
  const ratings: string[] = [];
  const ratingPatterns = [
    { pattern: /CPL|Commercial Pilot (License|Certificate)/i, rating: 'CPL' },
    { pattern: /PPL|Private Pilot (License|Certificate)/i, rating: 'PPL' },
    { pattern: /ATPL|Airline Transport Pilot/i, rating: 'ATPL' },
    { pattern: /Multi.{0,10}Engine|ME Rating/i, rating: 'Multi-Engine' },
    { pattern: /Instrument Rating|IR/i, rating: 'Instrument' },
    { pattern: /CFI.{0,5}Certified Flight Instructor/i, rating: 'CFI' },
    { pattern: /CFII|Instrument Instructor/i, rating: 'CFII' },
    { pattern: /MEI|Multi.{0,5}Engine Instructor/i, rating: 'MEI' }
  ];
  
  for (const { pattern, rating } of ratingPatterns) {
    if (pattern.test(text)) ratings.push(rating);
  }
  
  return [...new Set(ratings)]; // Deduplicate
}

// Extract type ratings from aircraft type field
function extractTypeRatings(aircraftType?: string): string[] {
  if (!aircraftType) return [];
  
  const typeRatings: string[] = [];
  const aircraftTypes = [
    'A320', 'A321', 'A330', 'A340', 'A350', 'A380',
    'B737', 'B747', 'B757', 'B767', 'B777', 'B787', 'MD11',
    'CRJ200', 'CRJ700', 'CRJ900', 'CRJ1000',
    'ERJ135', 'ERJ145', 'ERJ170', 'ERJ175', 'ERJ190', 'ERJ195',
    'Q400', 'ATR42', 'ATR72',
    'C172', 'C152', 'C182', 'PA28', 'PA34'
  ];
  
  for (const type of aircraftTypes) {
    if (aircraftType.toUpperCase().includes(type)) typeRatings.push(type);
  }
  
  return typeRatings;
}

// Extract medical class
function extractMedicalClass(text: string): string | null {
  if (/class\s*1\s*medical/i.test(text) || /first.{0,5}class.{0,5}medical/i.test(text)) {
    return 'Class 1';
  }
  if (/class\s*2\s*medical/i.test(text) || /second.{0,5}class.{0,5}medical/i.test(text)) {
    return 'Class 2';
  }
  return null;
}

// Parse English level
function extractEnglishLevel(text: string): number | null {
  const match = text.match(/ICAO\s*Level\s*(\d)/i);
  if (match) {
    const level = parseInt(match[1], 10);
    if (level >= 4 && level <= 6) return level;
  }
  return null;
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  try {
    // BetterAviationJobs API endpoint
    const apiUrl = Deno.env.get('BETTERAVIATIONJOBS_API_URL') || 
      'https://api.betteraviationjobs.com/v1/jobs?category=pilot&limit=100';
    
    const apiKey = Deno.env.get('BETTERAVIATIONJOBS_API_KEY');
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
        'Accept': 'application/json',
        'User-Agent': 'PilotRecognition-Bot/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`BetterAviationJobs API error: ${response.status}`);
    }
    
    const data = await response.json();
    const jobs: BetterAviationJob[] = data.jobs || data;
    
    // Normalize and upsert
    const normalizedJobs = jobs.map(job => {
      const requirementsText = job.requirements || job.description || '';
      
      return {
        source: 'betteraviationjobs',
        external_id: job.id,
        title: job.position,
        airline_name: job.company,
        location: job.location,
        description: job.description,
        requirements_text: requirementsText,
        
        // Extracted requirements
        min_hours: job.min_hours || extractMinHours(requirementsText),
        required_ratings: job.rating_requirements || extractRatings(requirementsText),
        required_type_ratings: extractTypeRatings(job.aircraft_type),
        required_medical_class: extractMedicalClass(requirementsText),
        required_english_level: extractEnglishLevel(requirementsText),
        
        // Metadata
        external_url: job.url,
        posted_at: job.date_posted,
        salary_range: job.salary,
        job_type: 'full-time', // Default, can be extracted from text
        last_synced_at: new Date().toISOString()
      };
    });
    
    // Upsert to database
    const { error } = await supabase
      .from('external_jobs')
      .upsert(normalizedJobs, { 
        onConflict: 'source,external_id',
        ignoreDuplicates: false 
      });
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        source: 'betteraviationjobs',
        synced: normalizedJobs.length,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (err) {
    console.error('BetterAviationJobs sync error:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        source: 'betteraviationjobs',
        error: err.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
