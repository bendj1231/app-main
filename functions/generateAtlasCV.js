// Generate Atlas CV - ATS-approved CV generation
const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

// Helper function to check if user has Recognition Plus subscription
async function checkRecognitionPlusAccess(userId, supabase) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .eq('plan', 'recognition_plus')
    .single();

  if (error || !subscription) {
    return false;
  }
  return true;
}

exports.generateAtlasCV = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Check Recognition Plus subscription
    const hasAccess = await checkRecognitionPlusAccess(userId, supabase);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Recognition Plus subscription required' });
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Generate HTML CV (ATS-optimized)
    const htmlCV = generateAtlasCVHTML(profile);

    return res.json({
      success: true,
      cv: {
        html: htmlCV,
        generatedAt: new Date().toISOString(),
        version: '2.0'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Generate HTML for Atlas CV (ATS-optimized)
function generateAtlasCVHTML(profile) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.full_name || 'Pilot'} - Pilot Recognition Profile</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .name { font-size: 32px; font-weight: bold; color: #1e40af; margin: 0; }
    .title { font-size: 18px; color: #64748b; margin: 5px 0; }
    .contact { font-size: 14px; color: #475569; margin-top: 10px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
    .flight-hours { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0; }
    .hour-item { background: #f8fafc; padding: 10px; border-radius: 6px; text-align: center; }
    .hour-value { font-size: 24px; font-weight: bold; color: #1e40af; }
    .hour-label { font-size: 12px; color: #64748b; }
    .cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .cert-item { background: #f1f5f9; padding: 8px 12px; border-radius: 4px; font-size: 14px; }
    .program-score { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .program-name { font-weight: 500; }
    .program-value { color: #2563eb; font-weight: bold; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${profile.full_name || 'Pilot'}</h1>
    <p class="title">Professional Pilot - ${profile.total_flight_time || 0} Hours Total Time</p>
    <div class="contact">
      ${profile.email || 'N/A'} | ${profile.phone || 'N/A'} | ${profile.location || 'N/A'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Flight Experience</div>
    <div class="flight-hours">
      <div class="hour-item">
        <div class="hour-value">${profile.total_flight_time || 0}</div>
        <div class="hour-label">Total Time</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${profile.pic_time || 0}</div>
        <div class="hour-label">PIC Time</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${profile.multi_engine_time || 0}</div>
        <div class="hour-label">Multi-Engine</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${profile.turbine_time || 0}</div>
        <div class="hour-label">Turbine</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${profile.ifr_time || 0}</div>
        <div class="hour-label">IFR</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${profile.night_time || 0}</div>
        <div class="hour-label">Night</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Certifications & Ratings</div>
    <div class="cert-grid">
      ${(profile.ratings || []).map(r => `<div class="cert-item">${r}</div>`).join('')}
    </div>
  </div>

  <div class="footer">
    Generated by WingMentor Recognition Platform v2.0 | ${new Date().toISOString()}<br>
    ATS-Optimized CV | Verified Pilot Credentials
  </div>
</body>
</html>
  `.trim();
}
