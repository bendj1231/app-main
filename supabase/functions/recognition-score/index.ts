/**
 * Recognition Score Edge Function
 * 
 * Handles score calculation and updates for pilot recognition system
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    const url = new URL(req.url);
    const path = url.pathname;

    // GET /recognition-score - Get user's recognition score
    if (req.method === 'GET' && path.includes('recognition-score')) {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseClient
        .from('recognition_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /recognition-score/calculate - Calculate and update score
    if (req.method === 'POST' && path.includes('calculate')) {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      
      // Fetch user data from various tables
      const [pilotData, profileData] = await Promise.all([
        supabaseClient
          .from('pilot_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
      ]);

      // Calculate score using the algorithm
      const scoreInput = {
        stats: {
          totalHours: pilotData.data?.total_hours || 0,
          picHours: pilotData.data?.pic_hours || 0,
          ifrHours: pilotData.data?.ifr_hours || 0,
          nightHours: pilotData.data?.night_hours || 0,
        },
        experience: {
          years: pilotData.data?.experience_years || 0,
          achievements: pilotData.data?.achievements_count || 0,
          licenses: pilotData.data?.licenses_count || 0,
        },
        assessments: {
          programCompletion: pilotData.data?.program_completion || 0,
          performanceScore: pilotData.data?.performance_score || 0,
        },
        mentorship: {
          hours: pilotData.data?.mentorship_hours || 0,
          observations: pilotData.data?.mentorship_observations || 0,
          cases: pilotData.data?.mentorship_cases || 0,
        },
      };

      // Import and use the score calculation logic
      // For now, we'll do a simple calculation
      const hoursScore = Math.min((scoreInput.stats.totalHours / 1000) * 350, 350);
      const experienceScore = Math.min((scoreInput.experience.years / 10) * 250, 250);
      const assessmentScore = (scoreInput.assessments.programCompletion / 100) * 125 + 
                              (scoreInput.assessments.performanceScore / 100) * 125;
      const mentorshipScore = Math.min((scoreInput.mentorship.hours / 100) * 150, 150);
      
      const totalScore = Math.round(hoursScore + experienceScore + assessmentScore + mentorshipScore);
      
      // Determine tier
      let scoreTier = 'Iron';
      if (totalScore >= 900) scoreTier = 'Platinum';
      else if (totalScore >= 800) scoreTier = 'Gold';
      else if (totalScore >= 700) scoreTier = 'Silver';
      else if (totalScore >= 600) scoreTier = 'Bronze';
      else if (totalScore >= 500) scoreTier = 'Copper';
      else if (totalScore >= 400) scoreTier = 'Steel';

      const scoreData = {
        user_id: user.id,
        total_score: totalScore,
        hours_score: Math.round(hoursScore),
        experience_score: Math.round(experienceScore),
        assessment_score: Math.round(assessmentScore),
        mentorship_score: Math.round(mentorshipScore),
        score_tier: scoreTier,
        breakdown: scoreInput,
        recommendations: [],
        first_name: profileData.data?.first_name || null,
        last_name: profileData.data?.last_name || null,
        profile_image_url: profileData.data?.profile_image_url || null,
      };

      // Upsert the score
      const { data, error } = await supabaseClient
        .from('recognition_scores')
        .upsert(scoreData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Log to score history
      await supabaseClient
        .from('score_history')
        .insert({
          user_id: user.id,
          score_type: 'recognition',
          score_value: totalScore,
          calculated_at: new Date().toISOString(),
        });

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /leaderboard - Get leaderboard
    if (req.method === 'GET' && path.includes('leaderboard')) {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const tierFilter = url.searchParams.get('tier');

      let query = supabaseClient
        .from('recognition_scores')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (tierFilter) {
        query = query.eq('score_tier', tierFilter);
      }

      const { data, error } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
