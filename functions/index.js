const { onRequest } = require('firebase-functions/v2/https');
const { createClient } = require('@supabase/supabase-js');

// Health check function
exports.healthCheck = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const startTime = Date.now();
  let dbStatus = { status: 'unhealthy', responseTime: 0 };

  try {
    // Test database connection
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    const dbResponseTime = Date.now() - startTime;

    if (error) {
      dbStatus = {
        status: 'unhealthy',
        responseTime: dbResponseTime,
        message: error.message
      };
    } else {
      dbStatus = {
        status: dbResponseTime < 500 ? 'healthy' : 'unhealthy',
        responseTime: dbResponseTime
      };
    }
  } catch (dbError) {
    dbStatus = {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: dbError.message
    };
  }

  const healthStatus = {
    status: dbStatus.status === 'healthy' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {
      database: dbStatus,
      memory: { status: 'healthy', usage: process.memoryUsage().heapUsed, limit: 512 * 1024 * 1024 }
    }
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// Get user data function
exports.getUserData = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Send enrollment email function
exports.sendEnrollmentEmail = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const { email, name, program, type } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const displayName = name || email.split('@')[0];
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return res.status(500).json({ error: 'Resend API key not configured' });
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.5);">
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center;">
              <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="WingMentor Logo" style="height: 90px; width: auto; object-fit: contain; display: block; margin: 0 auto 30px auto;" />
              <div style="color: #2563eb; font-size: 14px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 20px;">
                ENROLLMENT CONFIRMATION
              </div>
              <h2 style="font-size: 28px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; color: #0f172a; margin: 0 0 24px 0;">
                Welcome to the ${program || 'Foundation Program'}
              </h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                Congratulations <strong>${displayName}</strong>! Your enrollment in the <strong>${program || 'Foundation Program'}</strong> has been successfully confirmed.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="https://pilotrecognition.com/portal"
                 style="display: inline-block; padding: 16px 40px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600;">
                View Pilot Portfolio
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">For questions about your enrollment, contact: enroll@pilotrecognition.com</p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 PilotRecognition.com. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@pilotrecognition.com',
        to: email,
        subject: 'Enrollment Confirmation - WingMentor Foundation Program',
        html: emailHtml
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return res.status(500).json({ error: 'Resend API failed', details: errorText });
    }

    // Store notification
    await supabase.from('notifications').insert({
      user_id: null,
      title: 'Enrollment Confirmation Sent',
      message: `Your enrollment confirmation has been sent to ${email}`,
      type: 'system',
      priority: 'high',
      metadata: {
        email: email,
        displayName: displayName,
        program: program,
        enrollmentDate: new Date().toISOString()
      }
    });

    return res.json({
      success: true,
      message: 'Enrollment confirmation sent via Resend',
      email: email
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Enterprise access function
exports.enterpriseAccess = onRequest(async (req, res) => {
  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Input validation
    if (!formData.email || !formData.company || !formData.name) {
      return res.status(400).json({ error: 'Name, email, and company are required' });
    }

    // Format the email body
    const emailBody = `
Enterprise Access Request

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'N/A'}

Company Information:
- Company: ${formData.company}
- Role: ${formData.role || 'N/A'}
- Website: ${formData.website || 'N/A'}
- Company Size: ${formData.companySize || 'N/A'}
- Country: ${formData.country || 'N/A'}

Organization Type:
- Airline Operator: ${formData.operator ? 'Yes' : 'No'}
- Aircraft Manufacturer: ${formData.manufacturer ? 'Yes' : 'No'}
- ATO / Training Provider: ${formData.ato ? 'Yes' : 'No'}
- Type Rating Center: ${formData.typeRatingProvider ? 'Yes' : 'No'}
- Airline Recruiter: ${formData.airlineRecruiter ? 'Yes' : 'No'}
- Staffing Firm: ${formData.staffingFirm ? 'Yes' : 'No'}
- Recruitment Agency: ${formData.recruitmentAgency ? 'Yes' : 'No'}

Partnership Interest:
- What do you do: ${formData.businessType || 'N/A'}
- Partnership Interest: ${formData.partnershipInterest || 'N/A'}
- Pathway Interests: ${formData.pathwayInterests?.join(', ') || 'N/A'}
- Custom Pathway: ${formData.customPathway || 'N/A'}
- Timeline: ${formData.timeline || 'N/A'}
- Data Input Requirements: ${formData.dataInput || 'N/A'}

Additional Information:
- Partnership Goals: ${formData.message || 'N/A'}
    `.trim();

    // Send email using Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'WingMentor Enterprise <enterprise@pilotrecognition.com>',
        to: ['benjamintigerbowler@gmail.com', 'karlbrianabibas@gmail.com'],
        subject: `Enterprise Access Request - ${formData.company}`,
        text: emailBody,
        reply_to: formData.email,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const resendData = await resendResponse.json();

    return res.json({
      success: true,
      message: 'Your request has been sent successfully',
      emailId: resendData.id
    });
  } catch (error) {
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Metrics dashboard function (simplified)
exports.metricsDashboard = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const timeRange = req.query.range || '24h';
    const format = req.query.format || 'json';

    // Fetch basic metrics from database
    const { data: apiMetrics, error } = await supabase
      .from('api_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate summary
    const totalRequests = apiMetrics?.length || 0;
    const avgResponseTime = apiMetrics?.reduce((sum, m) => sum + (m.response_time_ms || 0), 0) / (totalRequests || 1) || 0;
    const errorCount = apiMetrics?.filter(m => m.status_code >= 400).length || 0;
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;
    const cacheHitRate = apiMetrics?.filter(m => m.cache_hit).length / (totalRequests || 1) * 100 || 0;

    const data = {
      summary: {
        totalRequests,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        uptime: 99.9
      },
      realtime: {
        requestsPerMinute: Math.round(totalRequests / 60),
        activeUsers: 0,
        topEndpoints: apiMetrics?.slice(0, 10).map(m => ({
          endpoint: m.endpoint,
          count: 1,
          avgTime: m.response_time_ms
        })) || []
      },
      performance: {
        p50: avgResponseTime,
        p95: avgResponseTime * 1.5,
        p99: avgResponseTime * 2,
        trend: []
      },
      errors: apiMetrics?.filter(m => m.status_code >= 400).map(m => ({
        endpoint: m.endpoint,
        count: 1,
        lastError: 'See logs'
      })) || [],
      cache: {
        hitRate: Math.round(cacheHitRate * 100) / 100,
        size: 0,
        entries: 0,
        evictions: 0
      }
    };

    if (format === 'prometheus') {
      const metrics = [
        `# HELP api_requests_total Total API requests`,
        `# TYPE api_requests_total counter`,
        `api_requests_total ${data.summary.totalRequests}`,
        ``,
        `# HELP api_response_time_avg Average response time`,
        `# TYPE api_response_time_avg gauge`,
        `api_response_time_avg ${data.summary.avgResponseTime}`,
        ``,
        `# HELP api_error_rate Error rate percentage`,
        `# TYPE api_error_rate gauge`,
        `api_error_rate ${data.summary.errorRate}`,
        ``,
        `# HELP api_cache_hit_rate Cache hit rate percentage`,
        `# TYPE api_cache_hit_rate gauge`,
        `api_cache_hit_rate ${data.summary.cacheHitRate}`,
        ``
      ].join('\n');

      res.set('Content-Type', 'text/plain; charset=utf-8');
      return res.send(metrics);
    }

    return res.json({
      success: true,
      timeRange,
      generatedAt: new Date().toISOString(),
      data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Send account created email function
exports.sendAccountCreatedEmail = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const displayName = name || email.split('@')[0];
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return res.status(500).json({ error: 'Resend API key not configured' });
    }

    const emailHtml = `
<div style="font-family: 'Georgia, serif'; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem; text-align: center;">
    <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 16px; padding: 3rem 2.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.5); width: 100%; font-family: sans-serif;">
      <img src="https://lh3.googleusercontent.com/d/1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6" alt="PilotRecognition Logo" style="height: 110px; width: auto; object-fit: contain; margin-bottom: 1.5rem;" />
      <div style="color: #2563eb; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 0.75rem;">
        ACCOUNT CREATED
      </div>
      <h2 style="font-size: 1.8rem; font-weight: 400; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing: -0.02em; line-height: 1.2; color: #0f172a; margin-bottom: 2.5rem;">
        Welcome to PilotRecognition.com
      </h2>
      <p style="color: #475569; font-size: 1.05rem; line-height: 1.8; margin: 0 auto 2rem; max-width: 40rem; text-align: left;">
        Welcome <strong>${displayName}</strong>! Your account has been successfully created at <strong>PilotRecognition.com</strong>. You can now access your pilot portfolio, track your progress, and explore our aviation development programs.
      </p>
      <div style="text-align: center; margin: 2.5rem 0;">
        <a href="https://pilotrecognition.com/portal"
           style="display: inline-block; padding: 1.1rem 2.75rem; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; border-radius: 12px; font-size: 1rem; font-weight: 700; transition: all 0.25s ease; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">
          Access the Pilot Portal
        </a>
      </div>
      <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
        <p style="color: #1e40af; margin: 0; font-size: 0.9rem;"><strong>Get Started:</strong> Complete your profile to unlock personalized pathway recommendations and mentorship opportunities.</p>
      </div>
      <div style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p>For questions about your account, contact: support@pilotrecognition.com</p>
        <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 15px;">© 2026 PilotRecognition.com. All rights reserved.</p>
      </div>
    </div>
  </div>
</div>
`;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@pilotrecognition.com',
        to: email,
        subject: 'Welcome to PilotRecognition.com',
        html: emailHtml
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return res.status(500).json({ error: 'Resend API failed', details: errorText });
    }

    // Get user ID from email
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    // Store notification
    if (profileData) {
      await supabase.from('notifications').insert({
        user_id: profileData.id,
        title: 'Account Creation Email Sent',
        message: `Your account creation email has been sent to ${email}`,
        type: 'system',
        priority: 'high',
        metadata: {
          email: email,
          displayName: displayName,
          emailSubject: 'Welcome to PilotRecognition.com'
        }
      });
    }

    return res.json({
      success: true,
      message: 'Account creation email sent via Resend',
      email: email
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Profile Management Functions

// Get complete pilot profile data
exports.getPilotProfile = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update pilot profile information
exports.updatePilotProfile = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete pilot profile
exports.deletePilotProfile = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get profile by user ID
exports.getProfileByUserId = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Search pilot profiles by criteria
exports.searchProfiles = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { query, limit = 10 } = req.query;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(parseInt(limit));

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Pilot Credentials Functions

// Add pilot license/certificate
exports.addCredential = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, credentialData } = req.body;

    if (!userId || !credentialData) {
      return res.status(400).json({ error: 'userId and credentialData required' });
    }

    const { data, error } = await supabase
      .from('credentials')
      .insert({ user_id: userId, ...credentialData })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove pilot license/certificate
exports.removeCredential = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { credentialId } = req.body;

    if (!credentialId) {
      return res.status(400).json({ error: 'credentialId required' });
    }

    const { error } = await supabase
      .from('credentials')
      .delete()
      .eq('id', credentialId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Credential removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Verify pilot credential authenticity
exports.verifyCredential = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { credentialId } = req.query;

    if (!credentialId) {
      return res.status(400).json({ error: 'credentialId required' });
    }

    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('id', credentialId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const isValid = data && data.verified === true;

    return res.json({ valid: isValid, credential: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pilot credentials
exports.getCredentials = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update credential information
exports.updateCredential = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { credentialId, ...credentialData } = req.body;

    if (!credentialId) {
      return res.status(400).json({ error: 'credentialId required' });
    }

    const { data, error } = await supabase
      .from('credentials')
      .update(credentialData)
      .eq('id', credentialId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Experience Tracking Functions

// Add flight experience entry
exports.addExperience = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, experienceData } = req.body;

    if (!userId || !experienceData) {
      return res.status(400).json({ error: 'userId and experienceData required' });
    }

    const { data, error } = await supabase
      .from('experience')
      .insert({ user_id: userId, ...experienceData })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update flight experience
exports.updateExperience = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { experienceId, ...experienceData } = req.body;

    if (!experienceId) {
      return res.status(400).json({ error: 'experienceId required' });
    }

    const { data, error } = await supabase
      .from('experience')
      .update(experienceData)
      .eq('id', experienceId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove flight experience entry
exports.deleteExperience = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { experienceId } = req.body;

    if (!experienceId) {
      return res.status(400).json({ error: 'experienceId required' });
    }

    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', experienceId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Experience removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get complete experience history
exports.getExperienceHistory = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate total flight hours
exports.calculateFlightHours = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('experience')
      .select('flight_hours')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const totalHours = data?.reduce((sum, exp) => sum + (exp.flight_hours || 0), 0) || 0;

    return res.json({ totalHours, count: data?.length || 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Portfolio Management Functions

// Generate pilot portfolio document
exports.generatePortfolio = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    return res.json({ success: true, portfolio: profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get pilot portfolio
exports.getPortfolio = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update portfolio visibility/settings
exports.updatePortfolioSettings = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, settings } = req.body;

    if (!userId || !settings) {
      return res.status(400).json({ error: 'userId and settings required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ portfolio_settings: settings })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Digital Flight Logbook Functions

// Get flight logs for a user
exports.getFlightLogs = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('pilot_flight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add a new flight log entry
exports.addFlightLog = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, date, aircraft_type, registration, route, category, hours, remarks } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: 'userId and date required' });
    }

    const { data, error } = await supabase
      .from('pilot_flight_logs')
      .insert({
        user_id: userId,
        date,
        aircraft_type,
        registration,
        route,
        category: category || 'flight',
        hours,
        remarks,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update a flight log entry
exports.updateFlightLog = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logId, date, aircraft_type, registration, route, category, hours, remarks } = req.body;

    if (!logId) {
      return res.status(400).json({ error: 'logId required' });
    }

    const { data, error } = await supabase
      .from('pilot_flight_logs')
      .update({
        date,
        aircraft_type,
        registration,
        route,
        category,
        hours,
        remarks,
      })
      .eq('id', logId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a flight log entry
exports.deleteFlightLog = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logId } = req.body;

    if (!logId) {
      return res.status(400).json({ error: 'logId required' });
    }

    const { error } = await supabase
      .from('pilot_flight_logs')
      .delete()
      .eq('id', logId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Generate shareable portfolio link
exports.sharePortfolio = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const shareLink = `https://pilotrecognition.com/portfolio/${userId}`;

    return res.json({ success: true, shareLink });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Download portfolio as PDF
exports.downloadPortfolio = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, downloadUrl: `https://pilotrecognition.com/api/portfolio/${userId}/pdf` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Achievements & Badges Functions

// Add pilot achievement/badge
exports.addAchievement = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, achievementData } = req.body;

    if (!userId || !achievementData) {
      return res.status(400).json({ error: 'userId and achievementData required' });
    }

    const { data, error } = await supabase
      .from('achievements')
      .insert({ user_id: userId, ...achievementData })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pilot achievements
exports.getAchievements = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Verify achievement authenticity
exports.verifyAchievement = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { achievementId } = req.query;

    if (!achievementId) {
      return res.status(400).json({ error: 'achievementId required' });
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const isValid = data && data.verified === true;

    return res.json({ valid: isValid, achievement: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Career Progress Functions

// Get pilot career pathway progress
exports.getCareerPath = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update career milestones
exports.updateCareerProgress = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, progressData } = req.body;

    if (!userId || !progressData) {
      return res.status(400).json({ error: 'userId and progressData required' });
    }

    const { data, error } = await supabase
      .from('career_paths')
      .update(progressData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get AI-powered career recommendations
exports.getCareerRecommendations = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // Mock recommendations - in real implementation, this would call an AI service
    const recommendations = [
      { role: 'First Officer', probability: 0.85, reason: 'Based on flight hours and experience' },
      { role: 'Captain', probability: 0.65, reason: 'Requires additional hours and certifications' },
      { role: 'Flight Instructor', probability: 0.45, reason: 'Consider teaching opportunities' }
    ];

    return res.json({ recommendations, profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Profile Analytics Functions

// Get profile engagement statistics
exports.getProfileStats = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: views, error: viewsError } = await supabase
      .from('profile_views')
      .select('*')
      .eq('profile_id', userId);

    if (viewsError) {
      return res.status(500).json({ error: viewsError.message });
    }

    const stats = {
      totalViews: views?.length || 0,
      uniqueViewers: new Set(views?.map(v => v.viewer_id)).size || 0,
      lastViewed: views?.[0]?.created_at || null
    };

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get who viewed the profile
exports.getProfileViews = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('profile_views')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Program Management Functions

// Enrollment & Status Functions

// Get user's program enrollment status
exports.getProgramEnrollment = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, programId } = req.query;

    if (!userId || !programId) {
      return res.status(400).json({ error: 'userId and programId required' });
    }

    const { data, error } = await supabase
      .from('program_enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('program_id', programId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Enroll user in a program
exports.enrollInProgram = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, programId } = req.body;

    if (!userId || !programId) {
      return res.status(400).json({ error: 'userId and programId required' });
    }

    const { data, error } = await supabase
      .from('program_enrollments')
      .insert({ user_id: userId, program_id: programId, status: 'active', enrolled_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Cancel program enrollment
exports.cancelProgramEnrollment = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, programId } = req.body;

    if (!userId || !programId) {
      return res.status(400).json({ error: 'userId and programId required' });
    }

    const { error } = await supabase
      .from('program_enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('program_id', programId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Enrollment cancelled successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get available programs
exports.getProgramList = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('active', true);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Content Delivery Functions

// Get program modules/lessons
exports.getProgramContent = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { programId } = req.query;

    if (!programId) {
      return res.status(400).json({ error: 'programId required' });
    }

    const { data, error } = await supabase
      .from('program_modules')
      .select('*')
      .eq('program_id', programId)
      .order('order_index');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get specific lesson content
exports.getLessonContent = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { lessonId } = req.query;

    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId required' });
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Mark lesson as completed
exports.markLessonComplete = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, lessonId, programId } = req.body;

    if (!userId || !lessonId || !programId) {
      return res.status(400).json({ error: 'userId, lessonId, and programId required' });
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({ user_id: userId, lesson_id: lessonId, program_id: programId, completed: true, completed_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get overall program progress
exports.getProgramProgress = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, programId } = req.query;

    if (!userId || !programId) {
      return res.status(400).json({ error: 'userId and programId required' });
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('program_id', programId);

    if (lessonsError) {
      return res.status(500).json({ error: lessonsError.message });
    }

    const { data: completed, error: completedError } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('program_id', programId)
      .eq('completed', true);

    if (completedError) {
      return res.status(500).json({ error: completedError.message });
    }

    const totalLessons = lessons?.length || 0;
    const completedLessons = completed?.length || 0;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return res.json({
      totalLessons,
      completedLessons,
      progressPercentage: Math.round(progressPercentage * 100) / 100
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Assessment Functions

// Submit quiz/exam answers
exports.submitAssessment = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, assessmentId, answers } = req.body;

    if (!userId || !assessmentId || !answers) {
      return res.status(400).json({ error: 'userId, assessmentId, and answers required' });
    }

    const { data, error } = await supabase
      .from('assessment_submissions')
      .insert({ user_id: userId, assessment_id: assessmentId, answers, submitted_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get assessment score/results
exports.getAssessmentResult = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { submissionId } = req.query;

    if (!submissionId) {
      return res.status(400).json({ error: 'submissionId required' });
    }

    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user's exam history
exports.getExamHistory = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Certificate Functions

// Generate completion certificate
exports.generateCertificate = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, programId } = req.body;

    if (!userId || !programId) {
      return res.status(400).json({ error: 'userId and programId required' });
    }

    const { data, error } = await supabase
      .from('certificates')
      .insert({ user_id: userId, program_id: programId, issued_at: new Date().toISOString(), certificate_id: `CERT-${Date.now()}` })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Verify certificate authenticity
exports.verifyCertificate = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { certificateId } = req.query;

    if (!certificateId) {
      return res.status(400).json({ error: 'certificateId required' });
    }

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('certificate_id', certificateId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const isValid = data && data.verified === true;

    return res.json({ valid: isValid, certificate: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user's certificates
exports.getCertificates = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Industry-Grade Program Tracking Functions (P₁-P₅)

// Update technical skills assessment score (P₁)
exports.updateTechnicalSkillsScore = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, score, assessmentDetails } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'userId and score required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        technical_skills_score: score,
        technical_skills_assessed_at: new Date().toISOString(),
        technical_skills_details: assessmentDetails
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, score, assessedAt: data.technical_skills_assessed_at });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update interview & communication score (P₂)
exports.updateInterviewScore = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, score, interviewDetails } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'userId and score required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        interview_score: score,
        interview_assessed_at: new Date().toISOString(),
        interview_details: interviewDetails
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, score, assessedAt: data.interview_assessed_at });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update consultation & mentorship score (P₃)
exports.updateConsultationScore = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, score, consultationDetails } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'userId and score required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        consultation_score: score,
        consultation_completed_at: new Date().toISOString(),
        consultation_details: consultationDetails
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, score, completedAt: data.consultation_completed_at });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update examination results score (P₄)
exports.updateExaminationScore = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, score, examDetails } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'userId and score required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        examination_score: score,
        examination_completed_at: new Date().toISOString(),
        examination_details: examDetails
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, score, completedAt: data.examination_completed_at });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update simulation performance score (P₅)
exports.updateSimulationScore = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, score, simulationDetails } = req.body;

    if (!userId || score === undefined) {
      return res.status(400).json({ error: 'userId and score required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        simulation_score: score,
        simulation_completed_at: new Date().toISOString(),
        simulation_details: simulationDetails
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, score, completedAt: data.simulation_completed_at });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get complete program scores summary (P₁-P₅)
exports.getProgramScoresSummary = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('technical_skills_score, interview_score, consultation_score, examination_score, simulation_score, technical_skills_assessed_at, interview_assessed_at, consultation_completed_at, examination_completed_at, simulation_completed_at')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const summary = {
      P1: { name: 'Technical Skills Assessment', score: profile.technical_skills_score || 0, assessedAt: profile.technical_skills_assessed_at },
      P2: { name: 'Interview & Communication', score: profile.interview_score || 0, assessedAt: profile.interview_assessed_at },
      P3: { name: 'Consultation & Mentorship', score: profile.consultation_score || 0, assessedAt: profile.consultation_completed_at },
      P4: { name: 'Examination Results', score: profile.examination_score || 0, assessedAt: profile.examination_completed_at },
      P5: { name: 'Simulation Performance', score: profile.simulation_score || 0, assessedAt: profile.simulation_completed_at }
    };

    const totalProgramsScore = Object.values(summary).reduce((sum, p) => sum + p.score, 0);
    const averageProgramScore = totalProgramsScore / 5;

    return res.json({
      summary,
      totalProgramsScore: Math.round(totalProgramsScore * 100) / 100,
      averageProgramScore: Math.round(averageProgramScore * 100) / 100
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Pathway Functions

// Match user to appropriate career pathway
exports.matchPathway = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const matchedPathway = {
      pathwayId: 'path-001',
      name: 'Commercial Pilot Pathway',
      matchScore: 0.85,
      reason: 'Based on flight hours and qualifications'
    };

    return res.json(matchedPathway);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get AI-powered pathway recommendations
exports.getPathwayRecommendations = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const recommendations = [
      { pathwayId: 'path-001', name: 'Commercial Pilot', probability: 0.85 },
      { pathwayId: 'path-002', name: 'Cargo Pilot', probability: 0.65 },
      { pathwayId: 'path-003', name: 'Flight Instructor', probability: 0.45 }
    ];

    return res.json({ recommendations, profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get pathway details/requirements
exports.getPathwayDetails = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId } = req.query;

    if (!pathwayId) {
      return res.status(400).json({ error: 'pathwayId required' });
    }

    const { data, error } = await supabase
      .from('career_pathways')
      .select('*')
      .eq('id', pathwayId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user's pathway progress
exports.getPathwayProgress = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId || !pathwayId) {
      return res.status(400).json({ error: 'userId and pathwayId required' });
    }

    const { data, error } = await supabase
      .from('pathway_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('pathway_id', pathwayId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update pathway milestone
exports.updatePathwayMilestone = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId, milestoneData } = req.body;

    if (!userId || !pathwayId || !milestoneData) {
      return res.status(400).json({ error: 'userId, pathwayId, and milestoneData required' });
    }

    const { data, error } = await supabase
      .from('pathway_progress')
      .update(milestoneData)
      .eq('user_id', userId)
      .eq('pathway_id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Mark pathway as complete
exports.completePathway = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.body;

    if (!userId || !pathwayId) {
      return res.status(400).json({ error: 'userId and pathwayId required' });
    }

    const { data, error } = await supabase
      .from('pathway_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('pathway_id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Industry-Grade Pathway Multiplier Management

// Update mentorship endorsement multiplier (M)
exports.updateMentorshipEndorsement = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, mentorshipEndorsement, mentorTier } = req.body;

    if (!userId || mentorshipEndorsement === undefined) {
      return res.status(400).json({ error: 'userId and mentorshipEndorsement required' });
    }

    if (mentorshipEndorsement < 0.8 || mentorshipEndorsement > 1.5) {
      return res.status(400).json({ error: 'mentorshipEndorsement must be between 0.8 and 1.5' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ mentorship_endorsement: mentorshipEndorsement, mentor_tier: mentorTier })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, mentorshipEndorsement, mentorTier });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update airline preference matrix (A)
exports.updateAirlinePreference = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId, airlinePreference, preferredAirlines } = req.body;

    if (!pathwayId || airlinePreference === undefined) {
      return res.status(400).json({ error: 'pathwayId and airlinePreference required' });
    }

    if (airlinePreference < 0.5 || airlinePreference > 2.0) {
      return res.status(400).json({ error: 'airlinePreference must be between 0.5 and 2.0' });
    }

    const { data, error } = await supabase
      .from('career_pathways')
      .update({ airline_preference: airlinePreference, preferred_airlines: preferredAirlines })
      .eq('id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, airlinePreference, preferredAirlines });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update geographic compatibility (G)
exports.updateGeographicCompatibility = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId, geographicCompatibility, domicileRegions } = req.body;

    if (!pathwayId || geographicCompatibility === undefined) {
      return res.status(400).json({ error: 'pathwayId and geographicCompatibility required' });
    }

    if (geographicCompatibility < 0.7 || geographicCompatibility > 1.3) {
      return res.status(400).json({ error: 'geographicCompatibility must be between 0.7 and 1.3' });
    }

    const { data, error } = await supabase
      .from('career_pathways')
      .update({ geographic_compatibility: geographicCompatibility, domicile_regions: domicileRegions })
      .eq('id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, geographicCompatibility, domicileRegions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update market volatility (V)
exports.updateMarketVolatility = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId, marketVolatility, hiringDemand } = req.body;

    if (!pathwayId || marketVolatility === undefined) {
      return res.status(400).json({ error: 'pathwayId and marketVolatility required' });
    }

    if (marketVolatility < 0.5 || marketVolatility > 2.0) {
      return res.status(400).json({ error: 'marketVolatility must be between 0.5 and 2.0' });
    }

    const { data, error } = await supabase
      .from('career_pathways')
      .update({ market_volatility: marketVolatility, hiring_demand: hiringDemand })
      .eq('id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, marketVolatility, hiringDemand });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update cost friction (C)
exports.updateCostFriction = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId, costFriction, trainingCost } = req.body;

    if (!pathwayId || costFriction === undefined) {
      return res.status(400).json({ error: 'pathwayId and costFriction required' });
    }

    if (costFriction < 1.0 || costFriction > 3.0) {
      return res.status(400).json({ error: 'costFriction must be between 1.0 and 3.0' });
    }

    const { data, error } = await supabase
      .from('career_pathways')
      .update({ cost_friction: costFriction, training_cost: trainingCost })
      .eq('id', pathwayId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, costFriction, trainingCost });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pathway multipliers summary
exports.getPathwayMultipliers = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { pathwayId } = req.query;

    if (!pathwayId) {
      return res.status(400).json({ error: 'pathwayId required' });
    }

    const { data: pathway, error: pathwayError } = await supabase
      .from('career_pathways')
      .select('*')
      .eq('id', pathwayId)
      .single();

    if (pathwayError) {
      return res.status(500).json({ error: pathwayError.message });
    }

    return res.json({
      multipliers: {
        M: { name: 'Mentorship Endorsement', value: pathway.mentorship_endorsement || 1.0, range: '0.8-1.5', type: 'multiplier' },
        A: { name: 'Airline Preference', value: pathway.airline_preference || 1.0, range: '0.5-2.0', type: 'multiplier' },
        G: { name: 'Geographic Compatibility', value: pathway.geographic_compatibility || 1.0, range: '0.7-1.3', type: 'multiplier' },
        V: { name: 'Market Volatility', value: pathway.market_volatility || 1.0, range: '0.5-2.0', type: 'denominator' },
        C: { name: 'Cost Friction', value: pathway.cost_friction || 1.0, range: '1.0-3.0', type: 'denominator' }
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Airline Operations Functions

// Get airline information
exports.getAirlineData = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId } = req.query;

    if (!airlineId) {
      return res.status(400).json({ error: 'airlineId required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .eq('id', airlineId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update airline information
exports.updateAirlineData = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId, airlineData } = req.body;

    if (!airlineId || !airlineData) {
      return res.status(400).json({ error: 'airlineId and airlineData required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .update(airlineData)
      .eq('id', airlineId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get airline-specific metrics
exports.getAirlineMetrics = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId } = req.query;

    if (!airlineId) {
      return res.status(400).json({ error: 'airlineId required' });
    }

    const { data, error } = await supabase
      .from('airline_metrics')
      .select('*')
      .eq('airline_id', airlineId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Industry-Grade Airline Expectation Functions

// Update airline hiring expectations (market volatility, requirements)
exports.updateAirlineExpectations = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId, expectations } = req.body;

    if (!airlineId || !expectations) {
      return res.status(400).json({ error: 'airlineId and expectations required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .update({ 
        hiring_expectations: expectations,
        expectations_updated_at: new Date().toISOString()
      })
      .eq('id', airlineId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, expectations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get airline hiring requirements (minimum hours, type ratings, etc.)
exports.getAirlineRequirements = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId } = req.query;

    if (!airlineId) {
      return res.status(400).json({ error: 'airlineId required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .select('hiring_requirements, minimum_hours, type_ratings_required, aircraft_types')
      .eq('id', airlineId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update airline geographic coverage (domicile locations, bases)
exports.updateAirlineGeographicCoverage = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId, geographicCoverage } = req.body;

    if (!airlineId || !geographicCoverage) {
      return res.status(400).json({ error: 'airlineId and geographicCoverage required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .update({ 
        geographic_coverage: geographicCoverage,
        coverage_updated_at: new Date().toISOString()
      })
      .eq('id', airlineId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, geographicCoverage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get airline hiring demand index (market volatility V)
exports.getAirlineHiringDemand = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { airlineId } = req.query;

    if (!airlineId) {
      return res.status(400).json({ error: 'airlineId required' });
    }

    const { data, error } = await supabase
      .from('airlines')
      .select('hiring_demand, market_volatility, open_positions, hiring_trend')
      .eq('id', airlineId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Pilot Terminal Account Functions

// Get user account details
exports.getUserAccount = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update user account
exports.updateUserAccount = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, accountData } = req.body;

    if (!userId || !accountData) {
      return res.status(400).json({ error: 'userId and accountData required' });
    }

    const { data, error } = await supabase
      .from('user_accounts')
      .update(accountData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete user account
exports.deleteUserAccount = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user preferences/settings
exports.getUserSettings = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update user preferences
exports.updateUserSettings = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, settings } = req.body;

    if (!userId || !settings) {
      return res.status(400).json({ error: 'userId and settings required' });
    }

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...settings })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get terminal access status
exports.getTerminalAccess = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data, error } = await supabase
      .from('terminal_access')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Grant terminal access
exports.grantTerminalAccess = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, accessLevel } = req.body;

    if (!userId || !accessLevel) {
      return res.status(400).json({ error: 'userId and accessLevel required' });
    }

    const { data, error } = await supabase
      .from('terminal_access')
      .upsert({ user_id: userId, access_level: accessLevel, granted_at: new Date().toISOString() })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Revoke terminal access
exports.revokeTerminalAccess = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { error } = await supabase
      .from('terminal_access')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: 'Terminal access revoked successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Industry-Grade Pilot Terminal Functions (F and D)

// Update financial capacity (F) - 0.8-1.5
exports.updateFinancialCapacity = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, financialCapacity, budgetDetails } = req.body;

    if (!userId || financialCapacity === undefined) {
      return res.status(400).json({ error: 'userId and financialCapacity required' });
    }

    if (financialCapacity < 0.8 || financialCapacity > 1.5) {
      return res.status(400).json({ error: 'financialCapacity must be between 0.8 and 1.5' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        financial_capacity: financialCapacity,
        budget_details: budgetDetails,
        financial_updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, financialCapacity, budgetDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update development trajectory (D) - 0.9-1.2
exports.updateDevelopmentTrajectory = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, developmentTrajectory, improvementRate } = req.body;

    if (!userId || developmentTrajectory === undefined) {
      return res.status(400).json({ error: 'userId and developmentTrajectory required' });
    }

    if (developmentTrajectory < 0.9 || developmentTrajectory > 1.2) {
      return res.status(400).json({ error: 'developmentTrajectory must be between 0.9 and 1.2' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        development_trajectory: developmentTrajectory,
        improvement_rate: improvementRate,
        trajectory_updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, developmentTrajectory, improvementRate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update regulatory/medical gatekeeper (Rf) - 0 or 1
exports.updateRegulatoryMedicalStatus = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, medicalValid, licenseValid, expiryDate } = req.body;

    if (!userId || medicalValid === undefined || licenseValid === undefined) {
      return res.status(400).json({ error: 'userId, medicalValid, and licenseValid required' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        medical_valid: medicalValid,
        license_valid: licenseValid,
        medical_expiry: expiryDate,
        regulatory_updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const Rf = (medicalValid && licenseValid) ? 1 : 0;

    return res.json({ success: true, Rf, medicalValid, licenseValid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get complete user gatekeeper status
exports.getUserGatekeeperStatus = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('financial_capacity, development_trajectory, medical_valid, license_valid, medical_expiry, budget_details, improvement_rate')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const Rf = (profile.medical_valid && profile.license_valid) ? 1 : 0;
    const F = profile.financial_capacity || 1.0;
    const D = profile.development_trajectory || 1.0;

    return res.json({
      gatekeepers: {
        F: { name: 'Financial Capacity', value: F, range: '0.8-1.5', type: 'denominator' },
        Rf: { name: 'Regulatory/Medical', value: Rf, range: '0 or 1', type: 'gatekeeper' },
        D: { name: 'Development Trajectory', value: D, range: '0.9-1.2', type: 'multiplier' }
      },
      details: {
        medicalValid: profile.medical_valid,
        licenseValid: profile.license_valid,
        medicalExpiry: profile.medical_expiry,
        budgetDetails: profile.budget_details,
        improvementRate: profile.improvement_rate
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Recognition Formula Functions

// Calculate behavioral index (B₁-B₆)
exports.calculateBehavioralIndex = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('behavioral_sjt_score, behavioral_psychometric_score, behavioral_cognitive_workload, behavioral_stress_management, behavioral_decision_making, behavioral_crm_assessment')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const scores = [
      profile.behavioral_sjt_score || 0,
      profile.behavioral_psychometric_score || 0,
      profile.behavioral_cognitive_workload || 0,
      profile.behavioral_stress_management || 0,
      profile.behavioral_decision_making || 0,
      profile.behavioral_crm_assessment || 0
    ];

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return res.json({
      behavioralIndex: Math.round(average * 100) / 100,
      breakdown: {
        situationalJudgment: profile.behavioral_sjt_score || 0,
        psychometric: profile.behavioral_psychometric_score || 0,
        cognitiveWorkload: profile.behavioral_cognitive_workload || 0,
        stressManagement: profile.behavioral_stress_management || 0,
        decisionMaking: profile.behavioral_decision_making || 0,
        crmAssessment: profile.behavioral_crm_assessment || 0
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate language index (L₁-L₄)
exports.calculateLanguageIndex = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('language_icao_level, language_cultural_adaptability, language_international_experience, language_cross_cultural_comm')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // ICAO Level points
    const icaoPoints = {
      '6': 30,
      '5': 25,
      '4': 20,
      'None': 0
    };
    const icaoScore = icaoPoints[profile.language_icao_level] || 0;

    // International experience points
    const internationalScore = profile.language_international_experience ? 20 : 0;

    const scores = [
      icaoScore,
      profile.language_cultural_adaptability || 0,
      internationalScore,
      profile.language_cross_cultural_comm || 0
    ];

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return res.json({
      languageIndex: Math.round(average * 100) / 100,
      breakdown: {
        icaoLevel: profile.language_icao_level || 'None',
        icaoScore,
        culturalAdaptability: profile.language_cultural_adaptability || 0,
        internationalExperience: profile.language_international_experience || false,
        internationalScore,
        crossCulturalComm: profile.language_cross_cultural_comm || 0
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate specialized skills index (S₁-S₅)
exports.calculateSpecializedSkillsIndex = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('skills_weather_ops, skills_terrain_complexity, skills_emergency_procedures, skills_type_rating_diversity, skills_instrument_approaches')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const scores = [
      profile.skills_weather_ops || 0,
      profile.skills_terrain_complexity || 0,
      profile.skills_emergency_procedures || 0,
      profile.skills_type_rating_diversity || 0,
      profile.skills_instrument_approaches || 0
    ];

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return res.json({
      specializedSkillsIndex: Math.round(average * 100) / 100,
      breakdown: {
        weatherOps: profile.skills_weather_ops || 0,
        terrainComplexity: profile.skills_terrain_complexity || 0,
        emergencyProcedures: profile.skills_emergency_procedures || 0,
        typeRatingDiversity: profile.skills_type_rating_diversity || 0,
        instrumentApproaches: profile.skills_instrument_approaches || 0
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate time decay coefficient based on last flight date
exports.calculateTimeDecay = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('last_flight_date, time_decay_coefficient')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // If profile has stored time decay coefficient, use it
    if (profile.time_decay_coefficient) {
      return res.json({
        timeDecayCoefficient: profile.time_decay_coefficient,
        method: 'stored'
      });
    }

    // Calculate based on last flight date
    if (!profile.last_flight_date) {
      return res.json({
        timeDecayCoefficient: 0.3,
        method: 'calculated',
        daysSinceLastFlight: null,
        note: 'No flight date recorded'
      });
    }

    const lastFlight = new Date(profile.last_flight_date);
    const today = new Date();
    const daysSinceLastFlight = Math.floor((today - lastFlight) / (1000 * 60 * 60 * 24));

    let coefficient;
    if (daysSinceLastFlight <= 30) {
      coefficient = 1.0;
    } else if (daysSinceLastFlight <= 90) {
      coefficient = 0.9;
    } else if (daysSinceLastFlight <= 180) {
      coefficient = 0.7;
    } else if (daysSinceLastFlight <= 365) {
      coefficient = 0.5;
    } else {
      coefficient = 0.3;
    }

    return res.json({
      timeDecayCoefficient: coefficient,
      method: 'calculated',
      daysSinceLastFlight,
      lastFlightDate: profile.last_flight_date
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate complete recognition profile (ultra-advanced formula)
exports.calculateRecognitionProfile = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, useBasicFormula = false } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (useBasicFormula === 'true') {
      // Basic Formula: R = P + E
      const programsScore = (profile.technical_skills_score || 0) +
                          (profile.interview_score || 0) +
                          (profile.consultation_score || 0) +
                          (profile.examination_score || 0) +
                          (profile.simulation_score || 0);

      const experienceScore = (profile.total_flight_time || 0) +
                              (profile.pic_time || 0) +
                              (profile.multi_engine_time || 0) +
                              (profile.turbine_time || 0) +
                              (profile.ifr_time || 0) +
                              (profile.night_time || 0);

      const totalRecognition = programsScore + experienceScore;

      return res.json({
        formula: 'basic',
        totalRecognition,
        breakdown: {
          programs: programsScore,
          experience: experienceScore
        }
      });
    }

    // Ultra-Advanced Formula: R = [Σ(Pᵢ) + Σ(Eⱼ×Tₖ) + Σ(Bₗ) + Σ(Lₘ) + Σ(Sₙ)]
    // Use normalized helper function for percentage-based scoring
    const totalRecognition = await calculateRecognitionScore(profile, supabase);
    const { timeDecayCoefficient } = await calculateTimeDecayLogic(profile);

    // Log recognition score to score_history table for growth trajectory analysis
    try {
      await supabase
        .from('score_history')
        .insert({
          user_id: userId,
          score_type: 'recognition',
          score_value: totalRecognition,
          calculated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Failed to log score history:', error);
      // Non-critical error, don't block the response
    }

    // Programs (P)
    const programsScore = (profile.technical_skills_score || 0) +
                        (profile.interview_score || 0) +
                        (profile.consultation_score || 0) +
                        (profile.examination_score || 0) +
                        (profile.simulation_score || 0);

    // Experience with Time Decay (E × T)
    const experienceScore = ((profile.total_flight_time || 0) +
                             (profile.pic_time || 0) +
                             (profile.multi_engine_time || 0) +
                             (profile.turbine_time || 0) +
                             (profile.ifr_time || 0) +
                             (profile.night_time || 0)) * timeDecayCoefficient;

    // Behavioral (B)
    const behavioralScore = (profile.behavioral_sjt_score || 0) +
                           (profile.behavioral_psychometric_score || 0) +
                           (profile.behavioral_cognitive_workload || 0) +
                           (profile.behavioral_stress_management || 0) +
                           (profile.behavioral_decision_making || 0) +
                           (profile.behavioral_crm_assessment || 0);

    // Language (L)
    const icaoPoints = { '6': 30, '5': 25, '4': 20, 'None': 0 };
    const languageScore = (icaoPoints[profile.language_icao_level] || 0) +
                         (profile.language_cultural_adaptability || 0) +
                         (profile.language_international_experience ? 20 : 0) +
                         (profile.language_cross_cultural_comm || 0);

    // Specialized Skills (S)
    const skillsScore = (profile.skills_weather_ops || 0) +
                        (profile.skills_terrain_complexity || 0) +
                        (profile.skills_emergency_procedures || 0) +
                        (profile.skills_type_rating_diversity || 0) +
                        (profile.skills_instrument_approaches || 0);

    return res.json({
      formula: 'ultra-advanced',
      totalRecognition,
      breakdown: {
        programs: programsScore,
        experience: experienceScore,
        behavioral: behavioralScore,
        language: languageScore,
        specializedSkills: skillsScore
      },
      timeDecayCoefficient
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate pathway probability score
exports.calculatePathwayProbability = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId || !pathwayId) {
      return res.status(400).json({ error: 'userId and pathwayId required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const { data: pathway, error: pathwayError } = await supabase
      .from('career_pathways')
      .select('*')
      .eq('id', pathwayId)
      .maybeSingle();

    if (pathwayError) {
      return res.status(500).json({ error: pathwayError.message });
    }

    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Get recognition score
    const recognitionScore = await calculateRecognitionScore(profile);

    // Pathway Matching Engine: Wₚ = (R × M × A × G) / (V × C × F) × Rf × D

    const M = profile.mentorship_endorsement || 1.0; // Mentorship Endorsement
    const A = pathway.airline_preference || 1.0; // Airline Preference Matrix
    const G = pathway.geographic_compatibility || 1.0; // Geographic Compatibility
    const V = pathway.market_volatility || 1.0; // Market Volatility
    const C = pathway.cost_friction || 1.0; // Cost/Time Friction
    const F = profile.financial_capacity || 1.0; // Financial Capacity
    const Rf = (profile.medical_valid && profile.license_valid) ? 1 : 0; // Regulatory/Medical gatekeeper
    const D = profile.development_trajectory || 1.0; // Development Trajectory

    const numerator = recognitionScore * M * A * G;
    const denominator = V * C * F;
    const pathwayProbability = (numerator / denominator) * Rf * D;

    // Clamp to 0-100
    const clampedProbability = Math.max(0, Math.min(100, pathwayProbability));

    return res.json({
      pathwayProbability: Math.round(clampedProbability * 100) / 100,
      breakdown: {
        recognitionScore: Math.round(recognitionScore * 100) / 100,
        mentorshipEndorsement: M,
        airlinePreference: A,
        geographicCompatibility: G,
        marketVolatility: V,
        costFriction: C,
        financialCapacity: F,
        regulatoryMedical: Rf,
        developmentTrajectory: D
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function for time decay calculation
async function calculateTimeDecayLogic(profile) {
  if (profile.time_decay_coefficient) {
    return { timeDecayCoefficient: profile.time_decay_coefficient };
  }

  if (!profile.last_flight_date) {
    return { timeDecayCoefficient: 0.3 };
  }

  const lastFlight = new Date(profile.last_flight_date);
  const today = new Date();
  const daysSinceLastFlight = Math.floor((today - lastFlight) / (1000 * 60 * 60 * 24));

  let coefficient;
  if (daysSinceLastFlight <= 30) {
    coefficient = 1.0;
  } else if (daysSinceLastFlight <= 90) {
    coefficient = 0.9;
  } else if (daysSinceLastFlight <= 180) {
    coefficient = 0.7;
  } else if (daysSinceLastFlight <= 365) {
    coefficient = 0.5;
  } else {
    coefficient = 0.3;
  }

  return { timeDecayCoefficient: coefficient };
}

// Helper function for recognition score calculation (normalized to percentage out of 100)
async function calculateRecognitionScore(profile, supabaseClient) {
  const supabase = supabaseClient || createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  // Programs (P₁-P₅): each 0-100, max 500, weight 20%
  const programsScore = (profile.technical_skills_score || 0) +
                      (profile.interview_score || 0) +
                      (profile.consultation_score || 0) +
                      (profile.examination_score || 0) +
                      (profile.simulation_score || 0);
  const programsPercentage = Math.min(100, programsScore / 5); // Normalize to 0-100

  // Experience (E₁-E₆ + Personal Data): normalized based on typical ranges, weight 20%
  const { timeDecayCoefficient } = await calculateTimeDecayLogic(profile);
  
  // Flight hours (E₁-E₆)
  const flightHoursScore = ((profile.total_flight_time || 0) +
                           (profile.pic_time || 0) +
                           (profile.multi_engine_time || 0) +
                           (profile.turbine_time || 0) +
                           (profile.ifr_time || 0) +
                           (profile.night_time || 0)) * timeDecayCoefficient;
  
  // Ratings quality and quantity
  const ratings = profile.ratings || [];
  const ratingsCount = ratings.length;
  const highValueRatings = ratings.filter(r => ['atpl', 'cpl', 'multi_engine', 'instrument'].includes(r?.toLowerCase?.())).length;
  const ratingsScore = (ratingsCount * 5) + (highValueRatings * 10);
  
  // License validity (check expiry dates)
  const licenseExpiry = profile.license_expiry ? new Date(profile.license_expiry) : null;
  const medicalExpiry = profile.medical_expiry ? new Date(profile.medical_expiry) : null;
  const now = new Date();
  const licenseValid = licenseExpiry && licenseExpiry > now;
  const medicalValid = medicalExpiry && medicalExpiry > now;
  const licenseValidityScore = (licenseValid ? 20 : 0) + (medicalValid ? 20 : 0);
  
  // Recency (how current is the pilot - based on last_flown)
  const lastFlown = profile.last_flown ? new Date(profile.last_flown) : null;
  let recencyScore = 0;
  if (lastFlown) {
    const daysSinceLastFlight = Math.floor((now - lastFlown) / (1000 * 60 * 60 * 24));
    if (daysSinceLastFlight <= 30) recencyScore = 30; // Very current
    else if (daysSinceLastFlight <= 90) recencyScore = 20; // Current
    else if (daysSinceLastFlight <= 180) recencyScore = 10; // Somewhat current
    else recencyScore = 0; // Not current
  }
  
  // Foundation program completion (counts as experience)
  const foundationProgress = profile.foundation_progress || 0;
  const foundationScore = foundationProgress * 0.5; // 0-50 points based on progress
  
  // Certifications (if any stored in job_experiences or similar)
  const jobExperiences = profile.job_experiences || [];
  const certificationsCount = jobExperiences.filter(j => j?.certifications?.length > 0).length;
  const certificationsScore = certificationsCount * 5;
  
  // Total experience score
  const totalExperienceScore = flightHoursScore + ratingsScore + licenseValidityScore + recencyScore + foundationScore + certificationsScore;
  
  // Normalize experience: 0-15000 maps to 0-100 (increased range to account for additional factors)
  const experiencePercentage = Math.min(100, totalExperienceScore / 150);

  // Behavioral (B₁-B₆): each 0-100, max 600, weight 15% (reduced from 20%)
  const behavioralScore = (profile.behavioral_sjt_score || 0) +
                         (profile.behavioral_psychometric_score || 0) +
                         (profile.behavioral_cognitive_workload || 0) +
                         (profile.behavioral_stress_management || 0) +
                         (profile.behavioral_decision_making || 0) +
                         (profile.behavioral_crm_assessment || 0);
  const behavioralPercentage = Math.min(100, behavioralScore / 6); // Normalize to 0-100

  // Language (L₁-L₄): max 100, weight 10% (reduced from 15%)
  const icaoPoints = { '6': 30, '5': 25, '4': 20, 'None': 0 };
  const languageScore = (icaoPoints[profile.language_icao_level] || 0) +
                       (profile.language_cultural_adaptability || 0) +
                       (profile.language_international_experience ? 20 : 0) +
                       (profile.language_cross_cultural_comm || 0);
  const languagePercentage = Math.min(100, languageScore); // Already 0-100

  // Skills (S₁-S₅): each 0-100, max 500, weight 10% (reduced from 15%)
  const skillsScore = (profile.skills_weather_ops || 0) +
                      (profile.skills_terrain_complexity || 0) +
                      (profile.skills_emergency_procedures || 0) +
                      (profile.skills_type_rating_diversity || 0) +
                      (profile.skills_instrument_approaches || 0);
  const skillsPercentage = Math.min(100, skillsScore / 5); // Normalize to 0-100

  // Phase 1: Baseline scoring for new profiles
  // Give pilots 64-73% baseline just for completing profile + basic assessments
  // Formula: Baseline = 64% + (Program Score × 0.18) (max 73%)
  const hasBasicProfile = profile.email && profile.full_name && profile.date_of_birth;
  const hasProgramData = programsScore > 0;
  
  let baselineScore = 0;
  if (hasBasicProfile) {
    baselineScore = 64; // Base score for completing profile
    if (hasProgramData) {
      // Add bonus for program assessments (max 9% to reach 73%)
      baselineScore += Math.min(9, programsPercentage * 0.18);
    }
  }

  // Engagement (E₇-E₁₀): 10% weight
  // Fetch engagement data from new tables
  const { data: learningHours, error: learningError } = await supabase
    .from('learning_hours')
    .select('hours_completed')
    .eq('user_id', profile.id);
  
  const { data: forumPosts, error: forumError } = await supabase
    .from('forum_participation')
    .select('likes_received, helpful_votes')
    .eq('user_id', profile.id);
  
  const { data: events, error: eventsError } = await supabase
    .from('event_attendance')
    .select('duration_hours')
    .eq('user_id', profile.id);
  
  // Calculate engagement score
  const totalLearningHours = (learningHours || []).reduce((sum, h) => sum + (h.hours_completed || 0), 0);
  const totalForumLikes = (forumPosts || []).reduce((sum, f) => sum + (f.likes_received || 0) + (f.helpful_votes || 0), 0);
  const totalEventHours = (events || []).reduce((sum, e) => sum + (e.duration_hours || 0), 0);
  
  const engagementScore = Math.min(100, (totalLearningHours * 0.5) + (totalForumLikes * 0.2) + (totalEventHours * 2));
  const engagementPercentage = engagementScore;

  // Consistency (C₁-C₅): 10% weight
  // Fetch consistency data from activity log and completion tracking
  const { data: activityLogs, error: activityError } = await supabase
    .from('user_activity_log')
    .select('created_at')
    .eq('user_id', profile.id)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days
  
  const { data: completions, error: completionError } = await supabase
    .from('completion_tracking')
    .select('status, completion_percentage')
    .eq('user_id', profile.id);
  
  // Calculate consistency score
  const loginCount = (activityLogs || []).filter(a => a.activity_type === 'login').length;
  const completedItems = (completions || []).filter(c => c.status === 'completed').length;
  const avgCompletionPercentage = completions && completions.length > 0 
    ? completions.reduce((sum, c) => sum + (c.completion_percentage || 0), 0) / completions.length 
    : 0;
  
  const consistencyScore = Math.min(100, (loginCount * 3) + (completedItems * 5) + (avgCompletionPercentage * 0.3));
  const consistencyPercentage = consistencyScore;

  // Growth Trajectory (G₁-G₃): 5% weight
  // Fetch growth data from score history and learning metrics
  const { data: scoreHistory, error: scoreHistoryError } = await supabase
    .from('score_history')
    .select('score_value, calculated_at')
    .eq('user_id', profile.id)
    .gte('calculated_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // Last 90 days
    .order('calculated_at', { ascending: true });
  
  const { data: learningMetrics, error: learningMetricsError } = await supabase
    .from('learning_metrics')
    .select('total_hours_to_complete, difficulty_level')
    .eq('user_id', profile.id);
  
  // Calculate growth trajectory score
  let improvementRate = 0;
  if (scoreHistory && scoreHistory.length >= 2) {
    const oldestScore = scoreHistory[0].score_value || 0;
    const newestScore = scoreHistory[scoreHistory.length - 1].score_value || 0;
    improvementRate = newestScore - oldestScore;
  }
  
  const avgLearningSpeed = learningMetrics && learningMetrics.length > 0
    ? learningMetrics.reduce((sum, m) => sum + (m.total_hours_to_complete || 0), 0) / learningMetrics.length
    : 0;
  
  const growthScore = Math.min(100, (improvementRate * 10) + (100 - avgLearningSpeed) + (learningMetrics?.length || 0) * 2);
  const growthPercentage = growthScore;

  // Network Value (N₁-N₄): 5% weight
  // Fetch network data from peer endorsements and alumni network
  const { data: peerEndorsements, error: endorsementsError } = await supabase
    .from('peer_endorsements')
    .select('rating, endorsement_type')
    .eq('endorsee_id', profile.id);
  
  const { data: alumniNetwork, error: alumniError } = await supabase
    .from('alumni_network')
    .select('professional_value, interaction_frequency')
    .eq('user_id', profile.id);
  
  // Calculate network value score
  const avgEndorsementRating = peerEndorsements && peerEndorsements.length > 0
    ? peerEndorsements.reduce((sum, e) => sum + (e.rating || 0), 0) / peerEndorsements.length
    : 0;
  
  const highValueConnections = (alumniNetwork || []).filter(a => a.professional_value >= 4).length;
  const networkScore = Math.min(100, (avgEndorsementRating * 10) + (highValueConnections * 5) + (peerEndorsements?.length || 0) * 2);
  const networkPercentage = networkScore;

  // Weighted average to get final percentage out of 100
  // Adjusted weights: Programs 17%, Experience 17%, Behavioral 11%, Language 8%, Skills 8%, Baseline 20%, Engagement 8%, Consistency 6%, Growth 5%, Network 5%
  const weightedScore = (programsPercentage * 0.17) +
                       (experiencePercentage * 0.17) +
                       (behavioralPercentage * 0.11) +
                       (languagePercentage * 0.08) +
                       (skillsPercentage * 0.08) +
                       baselineScore +
                       (engagementPercentage * 0.08) +
                       (consistencyPercentage * 0.06) +
                       (growthPercentage * 0.05) +
                       (networkPercentage * 0.05);

  return Math.round(weightedScore * 100) / 100;
}

// V12 Ferrari Engine - Master Cross-Project Integration
// Orchestrates all formula components across projects for complete pathway matching

exports.calculateCompletePathwayMatch = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId || !pathwayId) {
      return res.status(400).json({ error: 'userId and pathwayId required' });
    }

    // Fetch all required data
    const [profile, pathway] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('career_pathways').select('*').eq('id', pathwayId).maybeSingle()
    ]);

    if (profile.error) {
      return res.status(500).json({ error: profile.error.message });
    }

    if (pathway.error) {
      return res.status(500).json({ error: pathway.error.message });
    }

    if (!profile.data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (!pathway.data) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Calculate all components
    const recognitionScore = await calculateRecognitionScore(profile.data, supabase);
    const { timeDecayCoefficient } = await calculateTimeDecayLogic(profile.data);

    // Multipliers (boost probability)
    const M = profile.data.mentorship_endorsement || 1.0;
    const A = pathway.data.airline_preference || 1.0;
    const G = pathway.data.geographic_compatibility || 1.0;
    const D = profile.data.development_trajectory || 1.0;

    // Denominators (reduce probability)
    const V = pathway.data.market_volatility || 1.0;
    const C = pathway.data.cost_friction || 1.0;
    const F = profile.data.financial_capacity || 1.0;

    // Gatekeeper (binary)
    const Rf = (profile.data.medical_valid && profile.data.license_valid) ? 1 : 0;

    // Master Formula: Wₚ = (R × M × A × G) / (V × C × F) × Rf × D
    const numerator = recognitionScore * M * A * G;
    const denominator = V * C * F;
    const pathwayProbability = (numerator / denominator) * Rf * D;
    
    // Cap at 97% for realistic probabilities (never 100% in real life)
    const clampedProbability = Math.max(0, Math.min(97, pathwayProbability));

    // Determine recommendation based on realistic ranges
    let recommendation;
    if (Rf === 0) {
      recommendation = 'Cannot proceed - Regulatory/Medical gatekeeper failed';
    } else if (clampedProbability === 0) {
      recommendation = 'No data - Complete profile to get assessment';
    } else if (clampedProbability < 50) {
      recommendation = 'Low chance - Not current, needs practice and improvement';
    } else if (clampedProbability < 64) {
      recommendation = 'Moderate chance - Good but needs improvement';
    } else if (clampedProbability < 73) {
      recommendation = 'Average chance - New profile with data but no history yet';
    } else if (clampedProbability < 85) {
      recommendation = 'High chance - Strong candidate with good track record';
    } else {
      recommendation = 'Very high chance - Effort-based top achiever';
    }

    return res.json({
      pathwayProbability: Math.round(clampedProbability * 100) / 100,
      engine: 'V12 Ferrari Engine',
      formula: 'Wₚ = (R × M × A × G) / (V × C × F) × Rf × D',
      components: {
        recognition: {
          score: Math.round(recognitionScore * 100) / 100,
          breakdown: {
            programs: Math.round((profile.data.technical_skills_score || 0) + (profile.data.interview_score || 0) + (profile.data.consultation_score || 0) + (profile.data.examination_score || 0) + (profile.data.simulation_score || 0) * 100) / 100,
            experience: {
              flightHours: Math.round(((profile.data.total_flight_time || 0) + (profile.data.pic_time || 0) + (profile.data.multi_engine_time || 0) + (profile.data.turbine_time || 0) + (profile.data.ifr_time || 0) + (profile.data.night_time || 0)) * timeDecayCoefficient * 100) / 100,
              ratings: (profile.data.ratings || []).length,
              licenseValid: profile.data.license_valid ? true : false,
              medicalValid: profile.data.medical_valid ? true : false,
              recency: profile.data.last_flown || 'N/A',
              foundationProgress: profile.data.foundation_progress || 0
            },
            behavioral: Math.round((profile.data.behavioral_sjt_score || 0) + (profile.data.behavioral_psychometric_score || 0) + (profile.data.behavioral_cognitive_workload || 0) + (profile.data.behavioral_stress_management || 0) + (profile.data.behavioral_decision_making || 0) + (profile.data.behavioral_crm_assessment || 0) * 100) / 100,
            language: Math.round((profile.data.language_cultural_adaptability || 0) + (profile.data.language_international_experience ? 20 : 0) + (profile.data.language_cross_cultural_comm || 0) + (profile.data.language_icao_level === '6' ? 30 : profile.data.language_icao_level === '5' ? 25 : profile.data.language_icao_level === '4' ? 20 : 0) * 100) / 100,
            specializedSkills: Math.round((profile.data.skills_weather_ops || 0) + (profile.data.skills_terrain_complexity || 0) + (profile.data.skills_emergency_procedures || 0) + (profile.data.skills_type_rating_diversity || 0) + (profile.data.skills_instrument_approaches || 0) * 100) / 100,
            engagement: {
              learningHours: 0, // Will be calculated from learning_hours table
              forumParticipation: 0, // Will be calculated from forum_participation table
              eventAttendance: 0 // Will be calculated from event_attendance table
            },
            consistency: {
              loginFrequency: 0, // Will be calculated from user_activity_log table
              completionRate: 0, // Will be calculated from completion_tracking table
              goalCompletion: 0 // Will be calculated from goal_tracking table
            },
            growth: {
              improvementRate: 0, // Will be calculated from score_history table
              learningSpeed: 0, // Will be calculated from learning_metrics table
              adaptability: 0 // Will be calculated from cross-training success
            },
            network: {
              peerEndorsements: 0, // Will be calculated from peer_endorsements table
              mentorshipQuality: 0, // Will be calculated from mentor_tier and endorsements
              alumniConnections: 0 // Will be calculated from alumni_network table
            }
          },
          timeDecayCoefficient
        },
        multipliers: {
          M: { name: 'Mentorship Endorsement', value: M, range: '0.8-1.5' },
          A: { name: 'Airline Preference', value: A, range: '0.5-2.0' },
          G: { name: 'Geographic Compatibility', value: G, range: '0.7-1.3' },
          D: { name: 'Development Trajectory', value: D, range: '0.9-1.2' }
        },
        denominators: {
          V: { name: 'Market Volatility', value: V, range: '0.5-2.0' },
          C: { name: 'Cost Friction', value: C, range: '1.0-3.0' },
          F: { name: 'Financial Capacity', value: F, range: '0.8-1.5' }
        },
        gatekeeper: {
          Rf: { name: 'Regulatory/Medical', value: Rf, range: '0 or 1', status: Rf === 1 ? 'PASS' : 'FAIL' }
        },
        calculation: {
          numerator: Math.round(numerator * 100) / 100,
          denominator: Math.round(denominator * 100) / 100,
          rawProbability: Math.round(pathwayProbability * 100) / 100
        }
      },
      recommendations: recommendation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
