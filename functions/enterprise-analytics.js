const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

function setCORS(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ─── View Count Tracking ────────────────────────────────────────────────────
exports.trackCardView = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cardId } = req.body;
    if (!cardId) return res.status(400).json({ error: 'cardId required' });

    await supabase.rpc('increment_card_view', { card_id: cardId });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Application Submission ───────────────────────────────────────────────────
exports.submitApplication = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { 
      cardId, 
      pilotProfileId,
      coverLetter,
      resumeUrl,
      pilotName,
      pilotEmail,
      pilotPhone,
      pilotTotalHours,
      pilotTypeRatings,
      pilotNationality,
      pilotPrScore
    } = req.body;

    if (!cardId || !pilotProfileId) {
      return res.status(400).json({ error: 'cardId and pilotProfileId required' });
    }

    // Get enterprise account id from card
    const { data: card, error: cardError } = await supabase
      .from('enterprise_pathway_cards')
      .select('enterprise_account_id')
      .eq('id', cardId)
      .single();

    if (cardError || !card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('pilot_applications')
      .insert({
        enterprise_pathway_card_id: cardId,
        pilot_profile_id: pilotProfileId,
        enterprise_account_id: card.enterprise_account_id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        pilot_name: pilotName,
        pilot_email: pilotEmail,
        pilot_phone: pilotPhone,
        pilot_total_hours: pilotTotalHours,
        pilot_type_ratings: pilotTypeRatings,
        pilot_nationality: pilotNationality,
        pilot_pr_score: pilotPrScore,
        status: 'applied'
      })
      .select()
      .single();

    if (error) throw error;

    // Increment application count
    await supabase.rpc('increment_card_application', { card_id: cardId });

    // Get enterprise email for notification
    const { data: enterprise } = await supabase
      .from('enterprise_accounts')
      .select('airline_name, profiles(email)')
      .eq('id', card.enterprise_account_id)
      .single();

    return res.json({ 
      success: true, 
      applicationId: application.id,
      message: `Application submitted to ${enterprise?.airline_name || 'airline'}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Get Card Analytics ─────────────────────────────────────────────────────
exports.getCardAnalytics = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { enterpriseAccountId, cardId } = req.query;
    
    if (!enterpriseAccountId) {
      return res.status(400).json({ error: 'enterpriseAccountId required' });
    }

    // Base query
    let query = supabase
      .from('enterprise_pathway_cards')
      .select('id, title, view_count, application_count, is_published, published_at, created_at')
      .eq('enterprise_account_id', enterpriseAccountId);

    if (cardId) {
      query = query.eq('id', cardId);
    }

    const { data: cards, error } = await query;
    if (error) throw error;

    // Calculate CTR and conversion
    const analytics = cards.map(card => ({
      ...card,
      ctr: card.view_count > 0 ? ((card.application_count / card.view_count) * 100).toFixed(2) + '%' : '0%',
      conversion_rate: card.view_count > 0 ? ((card.application_count / card.view_count) * 100).toFixed(2) : '0'
    }));

    return res.json({ cards: analytics });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Get Applications for Enterprise ───────────────────────────────────────
exports.getEnterpriseApplications = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { enterpriseAccountId, status } = req.query;
    
    if (!enterpriseAccountId) {
      return res.status(400).json({ error: 'enterpriseAccountId required' });
    }

    let query = supabase
      .from('pilot_applications')
      .select(`
        *,
        enterprise_pathway_cards(title, category)
      `)
      .eq('enterprise_account_id', enterpriseAccountId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({ applications: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Update Application Status ────────────────────────────────────────────
exports.updateApplicationStatus = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { applicationId, status, notes, interviewDate, interviewLocation, rating } = req.body;
    
    if (!applicationId || !status) {
      return res.status(400).json({ error: 'applicationId and status required' });
    }

    const updates = { status };
    
    if (notes !== undefined) updates.notes = notes;
    if (rating !== undefined) updates.rating = rating;
    if (interviewDate !== undefined) updates.interview_date = interviewDate;
    if (interviewLocation !== undefined) updates.interview_location = interviewLocation;

    // Set timestamp based on status
    const now = new Date().toISOString();
    if (status === 'shortlisted') updates.shortlisted_at = now;
    if (status === 'interview_scheduled') updates.interview_scheduled_at = now;
    if (status === 'offer_made') updates.offer_made_at = now;
    if (status === 'hired') updates.hired_at = now;
    if (status === 'rejected') updates.rejected_at = now;

    const { data, error } = await supabase
      .from('pilot_applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, application: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
