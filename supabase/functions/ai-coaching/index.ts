import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// Hard limits — adjust as needed
const LIMITS = {
  free: { perUser: 5, perDay: 500 },    // free tier pilots: 5 requests/day
  premium: { perUser: 20, perDay: 500 }, // Recognition+ pilots: 20 requests/day
};

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth check
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const callerClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user }, error: authError } = await callerClient.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const groqKey = Deno.env.get('GROQ_API_KEY');
  if (!groqKey) {
    return new Response(JSON.stringify({ error: 'Groq not configured' }), {
      status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Rate limiting — count requests per user per day
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { count: userCount } = await serviceClient
    .from('ai_usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('date', today);

  const { count: globalCount } = await serviceClient
    .from('ai_usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('date', today);

  // Check if user is premium
  const { data: sub } = await serviceClient
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  const isPremium = !!sub;
  const limit = isPremium ? LIMITS.premium : LIMITS.free;

  if ((userCount ?? 0) >= limit.perUser) {
    return new Response(JSON.stringify({
      error: 'Daily limit reached',
      limit: limit.perUser,
      reset: 'tomorrow',
      upgrade: !isPremium ? 'Upgrade to Recognition+ for 20 requests/day' : undefined
    }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  if ((globalCount ?? 0) >= LIMITS.free.perDay) {
    return new Response(JSON.stringify({ error: 'Service limit reached, try again tomorrow' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Log this request
  await serviceClient.from('ai_usage_log').insert({ user_id: user.id, date: today });

  try {
    const body = await req.json();
    const { type, profile, messages } = body;

    // Build system prompt based on request type
    const systemPrompt = buildSystemPrompt(type);
    const userMessage = buildUserMessage(type, profile);

    // Support both single-turn (profile analysis) and multi-turn (chat)
    const chatMessages = messages
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ];

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: type === 'coaching' ? { type: 'json_object' } : undefined,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('[ai-coaching] Groq error:', err);
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const groqData = await groqRes.json();
    const content = groqData.choices?.[0]?.message?.content ?? '';

    // For coaching type, parse JSON response
    if (type === 'coaching') {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify({ success: true, data: parsed }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch {
        return new Response(JSON.stringify({ success: true, data: { raw: content } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ success: true, message: content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('[ai-coaching] Error:', err.message);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function buildSystemPrompt(type: string): string {
  const base = `You are an expert aviation career coach for PilotRecognition.com — a platform that helps pilots bridge the gap between their current qualifications and airline requirements. You understand ICAO standards, CAAP regulations, airline hiring criteria, and pilot career progression. Be direct, specific, and actionable. Never give generic advice.`;

  switch (type) {
    case 'coaching':
      return `${base} Respond ONLY with a valid JSON object with these keys: immediateActions (array of 3 strings), shortTermGoals (array of 3 strings), longTermVision (array of 3 strings), skillGaps (array of strings), nextCertification (string), confidenceTip (string).`;
    case 'pathway':
      return `${base} Analyze whether a pilot meets a specific pathway's requirements. Be honest about gaps. Suggest what would close each gap.`;
    case 'atlas-cv':
      return `${base} Help pilots write a compelling ATLAS Aviation CV. Focus on quantifiable achievements, airline-relevant competencies, and EBT alignment. Output clean, professional text.`;
    case 'chat':
    default:
      return `${base} Answer the pilot's question concisely. If asked about specific airlines, pathways, or requirements, give specific answers. Max 3 paragraphs.`;
  }
}

function buildUserMessage(type: string, profile: any): string {
  if (!profile) return 'Introduce yourself and ask what I can help with.';

  const hours = profile.current_flight_hours || profile.totalFlightHours || 0;
  const licenses = profile.ratings || profile.licenses || [];
  const score = profile.overall_recognition_score || profile.recognitionScore || 0;
  const pathway = profile.targetPathway || 'not specified';
  const stage = profile.experience_level || profile.experienceLevel || 'unknown';

  return `Pilot profile:
- Flight hours: ${hours}
- Licenses/ratings: ${Array.isArray(licenses) ? licenses.join(', ') : licenses || 'none'}
- Recognition score: ${score}
- Experience level: ${stage}
- Target pathway: ${pathway}
- Country: ${profile.country || profile.nationality || 'not specified'}

Provide career coaching advice tailored to this exact profile.`;
}
