// BetterJobs API Sync - Pulls job posts and normalizes them
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface BetterJobsJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  posted_date: string;
  url: string;
  salary?: string;
}

// Parse hours from requirements text
function extractMinHours(text: string): number | null {
  const patterns = [
    /(\d{3,4})\s*hours?/i,
    /minimum\s+(\d{3,4})\s*hrs?/i,
    /(\d{3,4})\s*total\s*time/i,
    /(\d{3,4})\s*flight\s*hours?/i
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
    { pattern: /CPL|Commercial Pilot License/i, rating: 'CPL' },
    { pattern: /PPL|Private Pilot License/i, rating: 'PPL' },
    { pattern: /ATPL|Airline Transport Pilot/i, rating: 'ATPL' },
    { pattern: /Multi.{0,10}Engine|ME/i, rating: 'Multi-Engine' },
    { pattern: /Instrument Rating|IR/i, rating: 'Instrument' },
    { pattern: /CFI|Flight Instructor/i, rating: 'CFI' },
    { pattern: /CFII|Instrument Instructor/i, rating: 'CFII' }
  ];
  
  for (const { pattern, rating } of ratingPatterns) {
    if (pattern.test(text)) ratings.push(rating);
  }
  
  return ratings;
}

// Extract type ratings
function extractTypeRatings(text: string): string[] {
  const typeRatings: string[] = [];
  const aircraftTypes = [
    'A320', 'A321', 'A330', 'A350', 'A380',
    'B737', 'B747', 'B757', 'B767', 'B777', 'B787',
    'CRJ', 'ERJ', 'Q400', 'ATR'
  ];
  
  for (const type of aircraftTypes) {
    if (text.includes(type)) typeRatings.push(type);
  }
  
  return typeRatings;
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  try {
    // Fetch from BetterJobs API
    // NOTE: Replace with actual BetterJobs API endpoint
    const betterJobsUrl = Deno.env.get('BETTERJOBS_API_URL') || 
      'https://api.betterjobs.com/v1/jobs?category=aviation&limit=100';
    
    const apiKey = Deno.env.get('BETTERJOBS_API_KEY');
    
    const response = await fetch(betterJobsUrl, {
      headers: {
        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`BetterJobs API error: ${response.status}`);
    }
    
    const jobs: BetterJobsJob[] = await response.json();
    
    // Normalize and upsert
    const normalizedJobs = jobs.map(job => {
      const requirementsText = job.requirements || job.description || '';
      
      return {
        source: 'betterjobs',
        external_id: job.id,
        title: job.title,
        airline_name: job.company,
        location: job.location,
        description: job.description,
        requirements_text: requirementsText,
        
        // Extracted requirements
        min_hours: extractMinHours(requirementsText),
        required_ratings: extractRatings(requirementsText),
        required_type_ratings: extractTypeRatings(requirementsText),
        
        // Metadata
        external_url: job.url,
        posted_at: job.posted_date,
        salary_range: job.salary,
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
        synced: normalizedJobs.length,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (err) {
    console.error('BetterJobs sync error:', err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
