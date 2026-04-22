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

// Gap Calculator (Δ) - Calculate difference between current profile and pathway requirements
async function calculateGapAnalysis(profile, pathway, supabase) {
  const gaps = [];
  const recommendations = [];
  
  // Flight Hours Gap Analysis
  const requiredHours = pathway.required_total_hours || 0;
  const currentHours = profile.total_flight_time || 0;
  const hoursGap = requiredHours - currentHours;
  
  if (hoursGap > 0) {
    gaps.push({
      category: 'Flight Hours',
      current: currentHours,
      required: requiredHours,
      gap: hoursGap,
      priority: hoursGap > 500 ? 'high' : hoursGap > 200 ? 'medium' : 'low'
    });
    recommendations.push(`Need ${hoursGap} more flight hours. Consider: CFI position, banner towing, or pipeline patrol.`);
  }
  
  // Multi-Engine Gap
  const requiredME = pathway.required_multi_engine_hours || 0;
  const currentME = profile.multi_engine_time || 0;
  const meGap = requiredME - currentME;
  
  if (meGap > 0) {
    gaps.push({
      category: 'Multi-Engine Time',
      current: currentME,
      required: requiredME,
      gap: meGap,
      priority: meGap > 100 ? 'high' : 'medium'
    });
    recommendations.push(`Need ${meGap} more multi-engine hours. Consider: ME rating training or skydive operations.`);
  }
  
  // Turbine/Jet Gap
  const requiredTurbine = pathway.required_turbine_hours || 0;
  const currentTurbine = profile.turbine_time || 0;
  const turbineGap = requiredTurbine - currentTurbine;
  
  if (turbineGap > 0) {
    gaps.push({
      category: 'Turbine Time',
      current: currentTurbine,
      required: requiredTurbine,
      gap: turbineGap,
      priority: 'high'
    });
    recommendations.push(`Need ${turbineGap} more turbine hours. Consider: corporate charter or cargo operations.`);
  }
  
  // Ratings/Certificates Gap
  const requiredRatings = pathway.required_ratings || [];
  const currentRatings = profile.ratings || [];
  const missingRatings = requiredRatings.filter(r => !currentRatings.includes(r));
  
  if (missingRatings.length > 0) {
    gaps.push({
      category: 'Ratings/Certificates',
      current: currentRatings,
      required: requiredRatings,
      gap: missingRatings,
      priority: 'high'
    });
    recommendations.push(`Missing ratings: ${missingRatings.join(', ')}. Complete these certifications to qualify.`);
  }
  
  // Program Scores Gap
  const pathwayPrograms = pathway.required_program_scores || {};
  const profilePrograms = {
    technical: profile.technical_skills_score || 0,
    interview: profile.interview_score || 0,
    consultation: profile.consultation_score || 0,
    examination: profile.examination_score || 0,
    simulation: profile.simulation_score || 0,
    behavioral: (profile.behavioral_sjt_score || 0) + (profile.behavioral_psychometric_score || 0)
  };
  
  const programGaps = [];
  for (const [program, required] of Object.entries(pathwayPrograms)) {
    const current = profilePrograms[program] || 0;
    if (current < required) {
      programGaps.push({
        program,
        current,
        required,
        gap: required - current
      });
    }
  }
  
  if (programGaps.length > 0) {
    gaps.push({
      category: 'Program Assessments',
      gaps: programGaps,
      priority: 'medium'
    });
    recommendations.push(`Improve assessment scores in: ${programGaps.map(g => g.program).join(', ')}.`);
  }
  
  // Calculate overall gap percentage
  const totalRequirements = 6; // hours, ME, turbine, ratings, programs, recency
  const metRequirements = totalRequirements - gaps.filter(g => g.priority === 'high').length;
  const gapPercentage = ((totalRequirements - metRequirements) / totalRequirements) * 100;
  
  return {
    gapPercentage: Math.round(gapPercentage * 100) / 100,
    totalGaps: gaps.length,
    highPriorityGaps: gaps.filter(g => g.priority === 'high').length,
    mediumPriorityGaps: gaps.filter(g => g.priority === 'medium').length,
    lowPriorityGaps: gaps.filter(g => g.priority === 'low').length,
    gaps,
    recommendations,
    estimatedCost: calculateEstimatedTrainingCost(gaps),
    estimatedTime: calculateEstimatedTrainingTime(gaps)
  };
}

// Calculate estimated training cost based on gaps
function calculateEstimatedTrainingCost(gaps) {
  let cost = 0;
  
  for (const gap of gaps) {
    switch (gap.category) {
      case 'Flight Hours':
        cost += gap.gap * 150; // $150/hour average
        break;
      case 'Multi-Engine Time':
        cost += gap.gap * 300; // $300/hour for ME
        break;
      case 'Turbine Time':
        cost += gap.gap * 500; // $500/hour for turbine
        break;
      case 'Ratings/Certificates':
        cost += gap.gap.length * 5000; // $5000 per rating
        break;
      case 'Program Assessments':
        cost += (gap.gaps || []).length * 500; // $500 per program
        break;
    }
  }
  
  return Math.round(cost);
}

// Calculate estimated training time based on gaps
function calculateEstimatedTrainingTime(gaps) {
  let days = 0;
  
  for (const gap of gaps) {
    switch (gap.category) {
      case 'Flight Hours':
        days += Math.ceil(gap.gap / 5); // 5 hours/day average
        break;
      case 'Multi-Engine Time':
        days += Math.ceil(gap.gap / 3); // 3 hours/day for ME
        break;
      case 'Turbine Time':
        days += Math.ceil(gap.gap / 2); // 2 hours/day for turbine
        break;
      case 'Ratings/Certificates':
        days += gap.gap.length * 30; // 30 days per rating
        break;
      case 'Program Assessments':
        days += (gap.gaps || []).length * 7; // 1 week per program
        break;
    }
  }
  
  const months = Math.ceil(days / 30);
  return { days, months };
}

// Get real-time market volatility data
async function getMarketVolatilityRealTime(pathwayId, supabase) {
  try {
    // Fetch from market data table (to be populated by scraper)
    const { data: marketData, error } = await supabase
      .from('market_volatility_data')
      .select('*')
      .eq('pathway_id', pathwayId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !marketData) {
      // Return default volatility if no data
      return {
        volatilityIndex: 1.0,
        hiringVelocity: 'stable',
        competitionLevel: 'moderate',
        lastUpdated: new Date().toISOString(),
        source: 'default'
      };
    }
    
    return {
      volatilityIndex: marketData.volatility_index || 1.0,
      hiringVelocity: marketData.hiring_velocity || 'stable',
      competitionLevel: marketData.competition_level || 'moderate',
      openPositions: marketData.open_positions || 0,
      lastUpdated: marketData.timestamp,
      source: 'real-time'
    };
  } catch (error) {
    console.error('Error fetching market volatility:', error);
    return {
      volatilityIndex: 1.0,
      hiringVelocity: 'stable',
      competitionLevel: 'moderate',
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    };
  }
}

// Calculate dynamic cost friction based on gaps and market
async function calculateCostFrictionDynamic(gapAnalysis, marketVolatility, profile) {
  const baseCost = gapAnalysis.estimatedCost || 0;
  const financialCapacity = profile.financial_capacity || 1.0;
  
  // Adjust cost based on market volatility
  // High volatility = more competition = may need more training to stand out
  const volatilityMultiplier = marketVolatility.volatilityIndex || 1.0;
  
  // Calculate friction score (higher = more friction)
  // 1.0 = no friction, 3.0 = high friction
  let frictionScore = 1.0;
  
  if (baseCost > 0) {
    // Cost friction: inverse of financial capacity relative to cost
    const costToCapacityRatio = baseCost / (financialCapacity * 50000); // Assume 50k capacity baseline
    frictionScore += Math.min(2.0, costToCapacityRatio);
  }
  
  // Add volatility friction
  frictionScore += (volatilityMultiplier - 1.0) * 0.5;
  
  // Cap at 3.0
  const cappedFriction = Math.min(3.0, Math.max(1.0, frictionScore));
  
  return {
    frictionScore: Math.round(cappedFriction * 100) / 100,
    baseCost,
    adjustedCost: Math.round(baseCost * volatilityMultiplier),
    volatilityMultiplier,
    financialCapacity,
    affordability: financialCapacity >= cappedFriction ? 'affordable' : 'challenging'
  };
}

// Prepare Atlas CV data structure
function prepareAtlasCVData(profile, pathway, gapAnalysis, recognitionScore) {
  return {
    // Header Section
    pilotInfo: {
      name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      licenseNumber: profile.license_number,
      medicalClass: profile.medical_class,
      medicalExpiry: profile.medical_expiry
    },
    
    // Executive Summary
    executiveSummary: {
      totalFlightTime: profile.total_flight_time || 0,
      recognitionScore: Math.round(recognitionScore * 100) / 100,
      pathwayAlignment: pathway.name,
      keyStrengths: gapAnalysis.gaps
        .filter(g => g.current >= g.required)
        .map(g => g.category),
      developmentAreas: gapAnalysis.recommendations.slice(0, 3)
    },
    
    // Flight Experience (Chronological)
    flightExperience: {
      totalTime: profile.total_flight_time || 0,
      picTime: profile.pic_time || 0,
      multiEngineTime: profile.multi_engine_time || 0,
      turbineTime: profile.turbine_time || 0,
      ifrTime: profile.ifr_time || 0,
      nightTime: profile.night_time || 0,
      lastFlight: profile.last_flown || profile.last_flight_date,
      recencyStatus: calculateRecencyStatus(profile.last_flown)
    },
    
    // Certifications & Ratings
    certifications: {
      ratings: profile.ratings || [],
      typeRatings: profile.type_ratings || [],
      endorsements: profile.endorsements || [],
      certificates: profile.certificates || []
    },
    
    // WingMentor Programs (Recognition Profile)
    wingmentorPrograms: {
      technicalSkills: profile.technical_skills_score || 0,
      interviewReadiness: profile.interview_score || 0,
      consultationSkills: profile.consultation_score || 0,
      examinationResults: profile.examination_score || 0,
      simulationPerformance: profile.simulation_score || 0,
      behavioralAssessment: (profile.behavioral_sjt_score || 0) + (profile.behavioral_psychometric_score || 0),
      foundationProgress: profile.foundation_progress || 0
    },
    
    // Behavioral & CRM Profile
    behavioralProfile: {
      situationalJudgment: profile.behavioral_sjt_score || 0,
      psychometricProfile: profile.behavioral_psychometric_score || 0,
      cognitiveWorkload: profile.behavioral_cognitive_workload || 0,
      stressManagement: profile.behavioral_stress_management || 0,
      decisionMaking: profile.behavioral_decision_making || 0,
      crmAssessment: profile.behavioral_crm_assessment || 0
    },
    
    // Gap Analysis for Target Pathway
    pathwayReadiness: {
      targetPathway: pathway.name,
      alignmentScore: Math.round((100 - gapAnalysis.gapPercentage) * 100) / 100,
      criticalGaps: gapAnalysis.highPriorityGaps,
      estimatedInvestment: gapAnalysis.estimatedCost,
      estimatedTimeline: gapAnalysis.estimatedTime,
      actionPlan: gapAnalysis.recommendations
    },
    
    // Generated metadata
    generatedAt: new Date().toISOString(),
    version: '2.0',
    atsOptimized: true
  };
}

// Helper for recency status
function calculateRecencyStatus(lastFlownDate) {
  if (!lastFlownDate) return 'Unknown';
  
  const lastFlight = new Date(lastFlownDate);
  const today = new Date();
  const daysSince = Math.floor((today - lastFlight) / (1000 * 60 * 60 * 24));
  
  if (daysSince <= 30) return 'Current';
  if (daysSince <= 90) return 'Recent';
  if (daysSince <= 180) return 'Needs Currency';
  return 'Requires Recency Training';
}

// V12 Ferrari Engine - Master Cross-Project Integration (IMPROVED v2.0)
// Orchestrates all formula components across projects for complete pathway matching
// Now includes: Gap Calculator, Real-time Market Data, Dynamic Cost Friction, Atlas CV Prep

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
    
    // NEW: Calculate Gap Analysis (Δ)
    const gapAnalysis = await calculateGapAnalysis(profile.data, pathway.data, supabase);
    
    // NEW: Get real-time Market Volatility (V)
    const marketVolatility = await getMarketVolatilityRealTime(pathwayId, supabase);
    
    // Multipliers (boost probability)
    const M = profile.data.mentorship_endorsement || 1.0;
    const A = pathway.data.airline_preference || 1.0;
    const G = pathway.data.geographic_compatibility || 1.0;
    const D = profile.data.development_trajectory || 1.0;

    // NEW: Calculate dynamic Cost Friction (C) based on gaps and market
    const costFriction = await calculateCostFrictionDynamic(gapAnalysis, marketVolatility, profile.data);
    const C = costFriction.frictionScore;
    
    // Use real-time market volatility or fallback to pathway static value
    const V = marketVolatility.volatilityIndex || pathway.data.market_volatility || 1.0;
    
    // Financial Capacity
    const F = profile.data.financial_capacity || 1.0;

    // Gatekeeper (binary)
    const Rf = (profile.data.medical_valid && profile.data.license_valid) ? 1 : 0;

    // Master Formula: Wₚ = (R × M × A × G) / (V × C × F) × Rf × D
    // Now includes real-time V and dynamic C
    const numerator = recognitionScore * M * A * G;
    const denominator = V * C * F;
    const pathwayProbability = (numerator / denominator) * Rf * D;
    
    // NEW: Adjust probability based on gap percentage
    // If there are critical gaps, reduce probability
    const gapAdjustment = 1 - (gapAnalysis.gapPercentage / 200); // Max 50% reduction
    const adjustedProbability = pathwayProbability * gapAdjustment;
    
    // Cap at 97% for realistic probabilities (never 100% in real life)
    const clampedProbability = Math.max(0, Math.min(97, adjustedProbability));

    // Determine recommendation based on realistic ranges + gap analysis
    let recommendation;
    let actionItems = [];
    
    if (Rf === 0) {
      recommendation = 'Cannot proceed - Regulatory/Medical gatekeeper failed';
      actionItems = ['Renew medical certificate', 'Verify license validity'];
    } else if (clampedProbability === 0) {
      recommendation = 'No data - Complete profile to get assessment';
      actionItems = ['Complete pilot profile', 'Add flight hours', 'Take assessments'];
    } else if (clampedProbability < 50) {
      recommendation = 'Low chance - Significant gaps need to be addressed';
      actionItems = gapAnalysis.recommendations.slice(0, 3);
    } else if (clampedProbability < 64) {
      recommendation = 'Moderate chance - Good foundation but needs improvement';
      actionItems = gapAnalysis.recommendations.slice(0, 2);
    } else if (clampedProbability < 73) {
      recommendation = 'Average chance - New profile with data but no history yet';
      actionItems = ['Continue building flight hours', 'Complete WingMentor programs'];
    } else if (clampedProbability < 85) {
      recommendation = 'High chance - Strong candidate with good track record';
      actionItems = ['Maintain currency', 'Network with industry professionals'];
    } else {
      recommendation = 'Very high chance - Effort-based top achiever';
      actionItems = ['Apply to pathway', 'Prepare for interview', 'Connect with mentors'];
    }
    
    // NEW: Prepare Atlas CV data
    const atlasCVData = prepareAtlasCVData(profile.data, pathway.data, gapAnalysis, recognitionScore);

    return res.json({
      pathwayProbability: Math.round(clampedProbability * 100) / 100,
      engine: 'V12 Ferrari Engine v2.0',
      formula: 'Wₚ = (R × M × A × G) / (V × C × F) × Rf × D × (1 - Δ/200)',
      version: '2.0',
      newFeatures: ['Gap Calculator (Δ)', 'Real-time Market Volatility', 'Dynamic Cost Friction', 'Atlas CV Preparation'],
      
      // NEW: Gap Analysis Section
      gapAnalysis: {
        gapPercentage: gapAnalysis.gapPercentage,
        totalGaps: gapAnalysis.totalGaps,
        highPriorityGaps: gapAnalysis.highPriorityGaps,
        mediumPriorityGaps: gapAnalysis.mediumPriorityGaps,
        lowPriorityGaps: gapAnalysis.lowPriorityGaps,
        detailedGaps: gapAnalysis.gaps,
        recommendations: gapAnalysis.recommendations,
        estimatedInvestment: {
          cost: gapAnalysis.estimatedCost,
          currency: 'USD'
        },
        estimatedTimeline: gapAnalysis.estimatedTime
      },
      
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
            engagement: { learningHours: 0, forumParticipation: 0, eventAttendance: 0 },
            consistency: { loginFrequency: 0, completionRate: 0, goalCompletion: 0 },
            growth: { improvementRate: 0, learningSpeed: 0, adaptability: 0 },
            network: { peerEndorsements: 0, mentorshipQuality: 0, alumniConnections: 0 }
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
          V: { 
            name: 'Market Volatility', 
            value: V, 
            range: '0.5-2.0',
            source: marketVolatility.source,
            hiringVelocity: marketVolatility.hiringVelocity,
            competitionLevel: marketVolatility.competitionLevel,
            openPositions: marketVolatility.openPositions,
            lastUpdated: marketVolatility.lastUpdated
          },
          C: { 
            name: 'Cost Friction (Dynamic)', 
            value: C, 
            range: '1.0-3.0',
            baseCost: costFriction.baseCost,
            adjustedCost: costFriction.adjustedCost,
            volatilityMultiplier: costFriction.volatilityMultiplier,
            affordability: costFriction.affordability
          },
          F: { name: 'Financial Capacity', value: F, range: '0.8-1.5' }
        },
        gatekeeper: {
          Rf: { name: 'Regulatory/Medical', value: Rf, range: '0 or 1', status: Rf === 1 ? 'PASS' : 'FAIL' }
        },
        adjustment: {
          gapAdjustment: Math.round(gapAdjustment * 100) / 100,
          gapPercentage: gapAnalysis.gapPercentage
        },
        calculation: {
          numerator: Math.round(numerator * 100) / 100,
          denominator: Math.round(denominator * 100) / 100,
          rawProbability: Math.round(pathwayProbability * 100) / 100,
          adjustedProbability: Math.round(adjustedProbability * 100) / 100
        }
      },
      
      // NEW: Atlas CV Data (ready for generation)
      atlasCV: {
        ready: true,
        data: atlasCVData,
        downloadUrl: `https://us-central1-pilotrecognition-recognition.cloudfunctions.net/generateAtlasCV?userId=${userId}&pathwayId=${pathwayId}`
      },
      
      recommendations: {
        overall: recommendation,
        priority: gapAnalysis.highPriorityGaps > 0 ? 'Address critical gaps first' : 'Continue current trajectory',
        actionItems: actionItems,
        nextSteps: gapAnalysis.recommendations.slice(0, 3)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Generate Atlas CV - ATS-approved CV generation
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

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Fetch pathway data if pathwayId provided
    let pathway = null;
    let gapAnalysis = null;
    let recognitionScore = 0;
    
    if (pathwayId) {
      const { data: pathwayData } = await supabase
        .from('career_pathways')
        .select('*')
        .eq('id', pathwayId)
        .maybeSingle();
      
      if (pathwayData) {
        pathway = pathwayData;
        recognitionScore = await calculateRecognitionScore(profile, supabase);
        gapAnalysis = await calculateGapAnalysis(profile, pathway, supabase);
      }
    }

    // Generate HTML CV (ATS-optimized)
    const atlasCVData = prepareAtlasCVData(profile, pathway || {}, gapAnalysis || { gapPercentage: 0, gaps: [], recommendations: [] }, recognitionScore);
    const htmlCV = generateAtlasCVHTML(atlasCVData);

    // Store CV generation record
    await supabase.from('generated_cvs').insert({
      user_id: userId,
      pathway_id: pathwayId || null,
      recognition_score: recognitionScore,
      generated_at: new Date().toISOString(),
      version: '2.0'
    });

    return res.json({
      success: true,
      cv: {
        html: htmlCV,
        data: atlasCVData,
        generatedAt: new Date().toISOString(),
        version: '2.0'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Generate HTML for Atlas CV (ATS-optimized)
function generateAtlasCVHTML(cvData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.pilotInfo.name} - Pilot Recognition Profile</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .name { font-size: 32px; font-weight: bold; color: #1e40af; margin: 0; }
    .title { font-size: 18px; color: #64748b; margin: 5px 0; }
    .contact { font-size: 14px; color: #475569; margin-top: 10px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: bold; color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
    .recognition-score { background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .score-value { font-size: 48px; font-weight: bold; color: #2563eb; }
    .score-label { font-size: 14px; color: #64748b; }
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
    <h1 class="name">${cvData.pilotInfo.name}</h1>
    <p class="title">Professional Pilot - ${cvData.flightExperience.totalTime} Hours Total Time</p>
    <div class="contact">
      ${cvData.pilotInfo.email} | ${cvData.pilotInfo.phone || 'N/A'} | ${cvData.pilotInfo.location || 'N/A'}<br>
      License: ${cvData.pilotInfo.licenseNumber || 'N/A'} | Medical: ${cvData.pilotInfo.medicalClass || 'N/A'}
    </div>
  </div>

  <div class="recognition-score">
    <div class="score-label">WingMentor Recognition Score</div>
    <div class="score-value">${Math.round(cvData.executiveSummary.recognitionScore)}%</div>
    <div style="margin-top: 10px; font-size: 14px;">
      <strong>Pathway Alignment:</strong> ${cvData.executiveSummary.pathwayAlignment || 'Not specified'}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Flight Experience</div>
    <div class="flight-hours">
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.totalTime}</div>
        <div class="hour-label">Total Time</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.picTime}</div>
        <div class="hour-label">PIC Time</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.multiEngineTime}</div>
        <div class="hour-label">Multi-Engine</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.turbineTime}</div>
        <div class="hour-label">Turbine</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.ifrTime}</div>
        <div class="hour-label">IFR</div>
      </div>
      <div class="hour-item">
        <div class="hour-value">${cvData.flightExperience.nightTime}</div>
        <div class="hour-label">Night</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Certifications & Ratings</div>
    <div class="cert-grid">
      ${(cvData.certifications.ratings || []).map(r => `<div class="cert-item">${r}</div>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">WingMentor Assessment Scores</div>
    <div class="program-score">
      <span class="program-name">Technical Skills</span>
      <span class="program-value">${cvData.wingmentorPrograms.technicalSkills}/100</span>
    </div>
    <div class="program-score">
      <span class="program-name">Interview Readiness</span>
      <span class="program-value">${cvData.wingmentorPrograms.interviewReadiness}/100</span>
    </div>
    <div class="program-score">
      <span class="program-name">Behavioral Assessment</span>
      <span class="program-value">${cvData.wingmentorPrograms.behavioralAssessment}/100</span>
    </div>
  </div>

  <div class="footer">
    Generated by WingMentor Recognition Platform v2.0 | ${cvData.generatedAt}<br>
    ATS-Optimized CV | Verified Pilot Credentials
  </div>
</body>
</html>
  `.trim();
}

// Priority 1: Gap-to-Program Recommendation Engine
// Matches identified gaps to specific WingMentor programs that can close them
exports.getGapClosingRecommendations = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let gapAnalysis = null;
    if (pathwayId) {
      const { data: pathway } = await supabase
        .from('career_pathways')
        .select('*')
        .eq('id', pathwayId)
        .maybeSingle();
      
      if (pathway) {
        gapAnalysis = await calculateGapAnalysis(profile, pathway, supabase);
      }
    }

    // If no pathway specified, check for gaps in general profile completeness
    const recommendations = [];
    
    if (gapAnalysis && gapAnalysis.gaps) {
      // Map each gap to specific programs
      for (const gap of gapAnalysis.gaps) {
        const programRecs = mapGapToPrograms(gap, profile);
        recommendations.push(...programRecs);
      }
    }

    // Always check for missing assessments
    if (!profile.technical_skills_score || profile.technical_skills_score < 70) {
      recommendations.push({
        type: 'assessment',
        priority: 'high',
        title: 'Technical Skills Assessment',
        description: 'Complete technical evaluation to identify knowledge gaps',
        estimatedImpact: '+15% Recognition Score',
        duration: '2 hours',
        cost: 'Included in membership',
        programId: 'tech-assessment-001'
      });
    }

    if (!profile.interview_score || profile.interview_score < 70) {
      recommendations.push({
        type: 'program',
        priority: 'high',
        title: 'Airline Interview Preparation',
        description: 'Mock interviews with airline HR professionals',
        estimatedImpact: '+20% Interview Success Rate',
        duration: '4 weeks',
        cost: '$299',
        programId: 'interview-prep-001'
      });
    }

    // Check for behavioral/CRM gaps
    const behavioralScore = (profile.behavioral_sjt_score || 0) + 
                           (profile.behavioral_psychometric_score || 0) +
                           (profile.behavioral_crm_assessment || 0);
    if (behavioralScore < 150) {
      recommendations.push({
        type: 'program',
        priority: 'medium',
        title: 'CRM & Behavioral Excellence',
        description: 'Crew Resource Management and psychometric training',
        estimatedImpact: '+25% Behavioral Score',
        duration: '3 weeks',
        cost: '$199',
        programId: 'crm-training-001'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return res.json({
      success: true,
      userId,
      pathwayId: pathwayId || null,
      totalRecommendations: recommendations.length,
      highPriority: recommendations.filter(r => r.priority === 'high').length,
      mediumPriority: recommendations.filter(r => r.priority === 'medium').length,
      lowPriority: recommendations.filter(r => r.priority === 'low').length,
      recommendations: recommendations.slice(0, 10), // Top 10
      totalEstimatedCost: recommendations.reduce((sum, r) => {
        const cost = parseInt(r.cost?.replace(/[^0-9]/g, '') || 0);
        return sum + cost;
      }, 0),
      totalEstimatedTime: recommendations.reduce((sum, r) => {
        const weeks = parseInt(r.duration?.match(/(\d+)\s*week/)?.[1] || 0);
        return sum + weeks;
      }, 0)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to map specific gaps to programs
function mapGapToPrograms(gap, profile) {
  const recommendations = [];
  
  switch (gap.category) {
    case 'Flight Hours':
      if (gap.gap > 1000) {
        recommendations.push({
          type: 'pathway',
          priority: 'high',
          title: 'Certified Flight Instructor (CFI) Program',
          description: 'Build hours while teaching - fastest route to 1500 hours',
          estimatedImpact: `+${gap.gap} hours in 12-18 months`,
          duration: '12-18 months',
          cost: '$45,000 (includes salary)',
          programId: 'cfi-pathway-001'
        });
      }
      recommendations.push({
        type: 'pathway',
        priority: gap.gap > 500 ? 'high' : 'medium',
        title: 'Aerial Survey Operations',
        description: 'Paid flying for mapping and surveying companies',
        estimatedImpact: `+${Math.min(gap.gap, 500)} hours in 6 months`,
        duration: '6 months',
        cost: 'Paid position - $35/hr',
        programId: 'survey-ops-001'
      });
      break;
      
    case 'Multi-Engine Time':
      const hasMERating = (profile.ratings || []).some(r => 
        r.toLowerCase().includes('multi') || r.toLowerCase().includes('me')
      );
      
      if (!hasMERating) {
        recommendations.push({
          type: 'certification',
          priority: 'high',
          title: 'Multi-Engine Rating Program',
          description: '7-day intensive ME rating with checkride prep',
          estimatedImpact: 'ME Rating + 10 hours ME time',
          duration: '7 days',
          cost: '$4,500',
          programId: 'me-rating-001'
        });
      } else {
        recommendations.push({
          type: 'pathway',
          priority: 'high',
          title: 'Skydive Operations Pilot',
          description: 'Build ME time flying jump aircraft',
          estimatedImpact: `+${gap.gap} ME hours in 3-6 months`,
          duration: '3-6 months',
          cost: 'Paid position - $25/hr',
          programId: 'skydive-ops-001'
        });
      }
      break;
      
    case 'Turbine Time':
      recommendations.push({
        type: 'pathway',
        priority: 'high',
        title: 'Corporate Charter Right-Seat Program',
        description: 'SIC position on turboprop/turbine aircraft',
        estimatedImpact: `+${Math.min(gap.gap, 300)} turbine hours`,
        duration: '6-12 months',
        cost: 'Paid position - $50/hr',
        programId: 'corporate-sic-001'
      });
      recommendations.push({
        type: 'program',
        priority: 'medium',
        title: 'Jet Transition Training',
        description: 'Simulator-based turbine aircraft systems training',
        estimatedImpact: '+50 turbine-equivalent hours',
        duration: '2 weeks',
        cost: '$3,500',
        programId: 'jet-transition-001'
      });
      break;
      
    case 'Ratings/Certificates':
      for (const rating of gap.gap) {
        const ratingLower = rating.toLowerCase();
        if (ratingLower.includes('atpl')) {
          recommendations.push({
            type: 'certification',
            priority: 'high',
            title: 'ATPL Theory & Skills Test Prep',
            description: 'Complete ATPL license preparation',
            estimatedImpact: 'ATPL License',
            duration: '8 weeks',
            cost: '$2,500',
            programId: 'atpl-prep-001'
          });
        } else if (ratingLower.includes('instrument') || ratingLower.includes('ifr')) {
          recommendations.push({
            type: 'certification',
            priority: 'high',
            title: 'Instrument Rating (IR) Program',
            description: 'Full instrument rating with 40 hours IFR time',
            estimatedImpact: 'IR + 40 IFR hours',
            duration: '6 weeks',
            cost: '$8,500',
            programId: 'ir-rating-001'
          });
        }
      }
      break;
      
    case 'Program Assessments':
      for (const programGap of (gap.gaps || [])) {
        if (programGap.program === 'technical') {
          recommendations.push({
            type: 'program',
            priority: 'medium',
            title: 'Advanced Technical Refresher',
            description: 'Systems, weather, and regulations deep-dive',
            estimatedImpact: '+15 technical score',
            duration: '2 weeks',
            cost: '$399',
            programId: 'tech-refresh-001'
          });
        } else if (programGap.program === 'behavioral') {
          recommendations.push({
            type: 'program',
            priority: 'medium',
            title: 'Psychometric Assessment Prep',
            description: 'Practice airline-style behavioral testing',
            estimatedImpact: '+20 behavioral score',
            duration: '1 week',
            cost: '$199',
            programId: 'psych-prep-001'
          });
        }
      }
      break;
  }
  
  return recommendations;
}

// Priority 2: Market Data Scraper
// Scrapes airline hiring pages and job boards for real-time market data
exports.scrapeMarketData = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // This function would be called by a scheduled job (Cloud Scheduler)
    // For now, it accepts manual triggers for testing
    const { pathwayId, source } = req.query;
    
    const scrapedData = [];
    
    // Simulated scraping logic (in production, use Puppeteer or similar)
    // TODO: Replace with actual web scraping implementation
    
    // Example data structure for scraped information
    const mockScrapedJobs = [
      {
        airline: 'SkyWest Airlines',
        position: 'First Officer',
        location: 'Various Bases',
        requirements: '1500 TT, 500 ME preferred',
        postedDate: new Date().toISOString(),
        applicationUrl: 'https://skywest.com/careers',
        hiringVelocity: 'high',
        openPositions: 45
      },
      {
        airline: 'Atlas Air',
        position: 'Cargo First Officer',
        location: 'Miami, FL',
        requirements: '2000 TT, turbine preferred',
        postedDate: new Date().toISOString(),
        applicationUrl: 'https://atlasair.com/careers',
        hiringVelocity: 'moderate',
        openPositions: 12
      },
      {
        airline: 'NetJets',
        position: 'Corporate Pilot',
        location: 'Columbus, OH',
        requirements: '3000 TT, jet type rating',
        postedDate: new Date().toISOString(),
        applicationUrl: 'https://netjets.com/careers',
        hiringVelocity: 'low',
        openPositions: 5
      }
    ];
    
    // Calculate volatility index based on scraped data
    for (const job of mockScrapedJobs) {
      const volatilityIndex = calculateVolatilityIndex(job);
      
      // Store in database
      await supabase.from('market_volatility_data').upsert({
        pathway_id: pathwayId || 'general',
        airline: job.airline,
        position: job.position,
        open_positions: job.openPositions,
        hiring_velocity: job.hiringVelocity,
        competition_level: job.openPositions > 20 ? 'low' : job.openPositions > 10 ? 'moderate' : 'high',
        volatility_index: volatilityIndex,
        requirements: job.requirements,
        source_url: job.applicationUrl,
        timestamp: new Date().toISOString()
      }, {
        onConflict: 'pathway_id,airline,position'
      });
      
      scrapedData.push({
        ...job,
        volatilityIndex
      });
    }
    
    return res.json({
      success: true,
      scrapedAt: new Date().toISOString(),
      source: source || 'manual',
      jobsFound: scrapedData.length,
      data: scrapedData,
      note: 'This is using mock data. Implement actual scraper with Puppeteer/Playwright for production.'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate volatility index from job data
function calculateVolatilityIndex(jobData) {
  // Formula: Higher open positions = lower volatility (easier to get hired)
  // Lower open positions = higher volatility (harder competition)
  
  let baseIndex = 1.0;
  
  // Adjust based on open positions
  if (jobData.openPositions > 50) baseIndex = 0.5;
  else if (jobData.openPositions > 20) baseIndex = 0.7;
  else if (jobData.openPositions > 10) baseIndex = 1.0;
  else if (jobData.openPositions > 5) baseIndex = 1.3;
  else baseIndex = 1.5;
  
  // Adjust based on hiring velocity
  const velocityMultiplier = {
    high: 0.8,
    moderate: 1.0,
    low: 1.2
  };
  
  return Math.round(baseIndex * (velocityMultiplier[jobData.hiringVelocity] || 1.0) * 100) / 100;
}

// Priority 3: Notification System
// Sends alerts for critical events (medical expiry, pathway matches, market changes)
exports.sendNotification = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, type, message } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ error: 'userId and type required' });
    }

    // Get user profile for contact info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, phone, full_name, fcm_token')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store notification
    const { data: notification, error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: type,
        title: getNotificationTitle(type),
        message: message || getDefaultMessage(type, profile),
        status: 'pending',
        priority: getNotificationPriority(type),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (notifError) {
      return res.status(500).json({ error: notifError.message });
    }

    // Send email notification
    await sendEmailNotification(profile.email, notification);
    
    // Send push notification if FCM token exists
    if (profile.fcm_token) {
      await sendPushNotification(profile.fcm_token, notification);
    }

    // Update status
    await supabase
      .from('notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', notification.id);

    return res.json({
      success: true,
      notificationId: notification.id,
      type,
      recipient: profile.email,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Check and send automated notifications
exports.checkAutomatedNotifications = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const notificationsSent = [];
    
    // 1. Check for expiring medical certificates (60, 30, 7 days)
    const medicalAlerts = await checkMedicalExpiry(supabase);
    notificationsSent.push(...medicalAlerts);
    
    // 2. Check for new pathway matches (when profile updates)
    const pathwayMatches = await checkNewPathwayMatches(supabase);
    notificationsSent.push(...pathwayMatches);
    
    // 3. Check for market volatility changes
    const marketChanges = await checkMarketVolatilityChanges(supabase);
    notificationsSent.push(...marketChanges);
    
    // 4. Check for recency alerts (90-day currency)
    const recencyAlerts = await checkRecencyAlerts(supabase);
    notificationsSent.push(...recencyAlerts);

    return res.json({
      success: true,
      checkedAt: new Date().toISOString(),
      totalNotifications: notificationsSent.length,
      notifications: notificationsSent
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper functions for notifications
async function checkMedicalExpiry(supabase) {
  const alerts = [];
  const now = new Date();
  
  // Get pilots with medical expiring in 60, 30, or 7 days
  const warningDays = [60, 30, 7];
  
  for (const days of warningDays) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + days);
    
    const { data: pilots } = await supabase
      .from('profiles')
      .select('id, email, full_name, medical_expiry')
      .lte('medical_expiry', targetDate.toISOString())
      .gte('medical_expiry', now.toISOString());
    
    for (const pilot of (pilots || [])) {
      const daysRemaining = Math.ceil((new Date(pilot.medical_expiry) - now) / (1000 * 60 * 60 * 24));
      
      // Create notification
      await supabase.from('notifications').insert({
        user_id: pilot.id,
        type: 'medical_expiry',
        title: `Medical Certificate Expires in ${daysRemaining} Days`,
        message: `Your medical certificate expires on ${pilot.medical_expiry}. Schedule renewal now to avoid pathway disruption.`,
        priority: daysRemaining <= 7 ? 'high' : daysRemaining <= 30 ? 'medium' : 'low',
        status: 'pending',
        created_at: new Date().toISOString()
      });
      
      alerts.push({
        userId: pilot.id,
        type: 'medical_expiry',
        daysRemaining
      });
    }
  }
  
  return alerts;
}

async function checkNewPathwayMatches(supabase) {
  // Check for pilots whose recent profile updates created new high-probability matches
  const matches = [];
  
  // Get recent flight log additions
  const { data: recentLogs } = await supabase
    .from('flight_logs')
    .select('user_id, created_at')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });
  
  // Get unique users who added hours recently
  const recentUsers = [...new Set((recentLogs || []).map(l => l.user_id))];
  
  for (const userId of recentUsers.slice(0, 10)) { // Check top 10
    // This would recalculate pathway matches
    // For now, simplified check
    matches.push({
      userId,
      type: 'pathway_match',
      message: 'New flight hours may have unlocked pathways!'
    });
  }
  
  return matches;
}

async function checkMarketVolatilityChanges(supabase) {
  const changes = [];
  
  // Get market data that changed significantly in last 24h
  const { data: marketChanges } = await supabase
    .from('market_volatility_data')
    .select('*')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  // For each significant change, notify interested pilots
  for (const change of (marketChanges || [])) {
    if (change.hiring_velocity === 'high' && change.open_positions > 20) {
      // Find pilots targeting this pathway
      const { data: interestedPilots } = await supabase
        .from('user_pathway_interests')
        .select('user_id')
        .eq('pathway_id', change.pathway_id);
      
      for (const pilot of (interestedPilots || [])) {
        await supabase.from('notifications').insert({
          user_id: pilot.user_id,
          type: 'market_opportunity',
          title: `Hiring Alert: ${change.airline}`,
          message: `${change.airline} is actively hiring ${change.position} with ${change.open_positions} open positions!`,
          priority: 'high',
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
        changes.push({
          userId: pilot.user_id,
          airline: change.airline,
          type: 'market_opportunity'
        });
      }
    }
  }
  
  return changes;
}

async function checkRecencyAlerts(supabase) {
  const alerts = [];
  const now = new Date();
  
  // Find pilots whose last flight was 75+ days ago (warning before 90-day limit)
  const warningDate = new Date(now);
  warningDate.setDate(warningDate.getDate() - 75);
  
  const { data: pilots } = await supabase
    .from('profiles')
    .select('id, full_name, last_flown')
    .lte('last_flown', warningDate.toISOString())
    .gte('last_flown', new Date(now - 180 * 24 * 60 * 60 * 1000).toISOString()); // Within last 6 months
  
  for (const pilot of (pilots || [])) {
    const daysSince = Math.floor((now - new Date(pilot.last_flown)) / (1000 * 60 * 60 * 24));
    
    await supabase.from('notifications').insert({
      user_id: pilot.id,
      type: 'recency_warning',
      title: 'Flight Recency Expiring Soon',
      message: `Your last flight was ${daysSince} days ago. Fly within ${90 - daysSince} days to maintain currency.`,
      priority: daysSince > 85 ? 'high' : 'medium',
      status: 'pending',
      created_at: new Date().toISOString()
    });
    
    alerts.push({
      userId: pilot.id,
      daysSince,
      type: 'recency_warning'
    });
  }
  
  return alerts;
}

function getNotificationTitle(type) {
  const titles = {
    medical_expiry: 'Medical Certificate Expiring',
    pathway_match: 'New Pathway Match Available',
    market_opportunity: 'Airline Hiring Alert',
    recency_warning: 'Flight Currency Warning',
    gap_reminder: 'Gap Closing Reminder',
    program_complete: 'Program Completed',
    assessment_due: 'Assessment Due'
  };
  return titles[type] || 'WingMentor Notification';
}

function getDefaultMessage(type, profile) {
  const messages = {
    medical_expiry: `Hi ${profile.full_name}, your medical certificate is expiring soon. Please schedule a renewal.`,
    pathway_match: `Great news! Your updated profile now matches new career pathways.`,
    market_opportunity: `An airline you're interested in is actively hiring!`,
    recency_warning: `Your flight currency is expiring. Book simulator time soon.`,
    gap_reminder: `Don't forget to work on your identified gaps.`,
    program_complete: `Congratulations on completing your program!`,
    assessment_due: `You have an upcoming assessment scheduled.`
  };
  return messages[type] || 'You have a new notification from WingMentor.';
}

function getNotificationPriority(type) {
  const priorities = {
    medical_expiry: 'high',
    pathway_match: 'medium',
    market_opportunity: 'high',
    recency_warning: 'high',
    gap_reminder: 'low',
    program_complete: 'medium',
    assessment_due: 'high'
  };
  return priorities[type] || 'medium';
}

async function sendEmailNotification(email, notification) {
  // Use Resend API (already configured in project)
  // Implementation would use the existing sendEnrollmentEmail pattern
  console.log(`Sending email to ${email}: ${notification.title}`);
  // TODO: Implement actual email sending
}

async function sendPushNotification(fcmToken, notification) {
  // Use Firebase Cloud Messaging
  console.log(`Sending push to token ${fcmToken}: ${notification.title}`);
  // TODO: Implement FCM integration
}

// Priority 4: Mentorship Matching Engine
// Matches pilots with mentors based on target pathway and experience
exports.findMentorMatches = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, pathwayId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Get mentee (pilot) profile
    const { data: mentee, error: menteeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (menteeError || !mentee) {
      return res.status(404).json({ error: 'Mentee not found' });
    }

    // Get target pathway
    let targetPathway = null;
    if (pathwayId) {
      const { data: pathway } = await supabase
        .from('career_pathways')
        .select('*')
        .eq('id', pathwayId)
        .maybeSingle();
      targetPathway = pathway;
    }

    // Get all available mentors
    const { data: mentors, error: mentorsError } = await supabase
      .from('mentor_profiles')
      .select('*')
      .eq('available', true)
      .order('tier', { ascending: false });

    if (mentorsError) {
      return res.status(500).json({ error: mentorsError.message });
    }

    // Calculate match scores
    const matches = [];
    
    for (const mentor of (mentors || [])) {
      const score = calculateMentorMatchScore(mentee, mentor, targetPathway);
      
      matches.push({
        mentorId: mentor.id,
        mentorName: mentor.full_name,
        mentorTier: mentor.tier,
        currentAirline: mentor.current_airline,
        position: mentor.position,
        yearsExperience: mentor.years_experience,
        totalTime: mentor.total_flight_time,
        matchScore: score.overall,
        matchBreakdown: score.breakdown,
        compatibility: score.compatibility,
        estimatedImpact: score.impact,
        availability: mentor.availability,
        bio: mentor.bio,
        specialties: mentor.specialties || []
      });
    }

    // Sort by match score (descending)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      userId,
      pathwayId: pathwayId || null,
      totalMatches: matches.length,
      topMatches: matches.slice(0, 5),
      menteeProfile: {
        targetPathway: targetPathway?.name || 'Not specified',
        currentHours: mentee.total_flight_time,
        desiredPathway: targetPathway?.category || 'Commercial Airlines'
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate mentor match score
function calculateMentorMatchScore(mentee, mentor, pathway) {
  let score = 0;
  const breakdown = {};
  
  // 1. Pathway alignment (40% weight)
  if (pathway) {
    const mentorPathwayMatch = (mentor.specialties || []).some(s => 
      pathway.name.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(pathway.category?.toLowerCase())
    );
    breakdown.pathwayAlignment = mentorPathwayMatch ? 40 : 0;
    score += breakdown.pathwayAlignment;
  } else {
    breakdown.pathwayAlignment = 20; // Neutral if no pathway specified
    score += 20;
  }
  
  // 2. Experience gap appropriateness (30% weight)
  const experienceGap = (mentor.total_flight_time || 0) - (mentee.total_flight_time || 0);
  if (experienceGap > 1000 && experienceGap < 8000) {
    breakdown.experienceFit = 30; // Ideal gap
  } else if (experienceGap >= 500) {
    breakdown.experienceFit = 20; // Acceptable
  } else {
    breakdown.experienceFit = 10; // Too similar or too junior
  }
  score += breakdown.experienceFit;
  
  // 3. Geographic compatibility (15% weight)
  if (mentee.location && mentor.base_location) {
    const sameRegion = mentee.location.toLowerCase().includes(mentor.base_location.toLowerCase()) ||
                       mentor.base_location.toLowerCase().includes(mentee.location.toLowerCase());
    breakdown.geographicFit = sameRegion ? 15 : 5;
    score += breakdown.geographicFit;
  } else {
    breakdown.geographicFit = 10;
    score += 10;
  }
  
  // 4. Mentor tier/seniority (15% weight)
  const tierScores = { platinum: 15, gold: 12, silver: 10, bronze: 8 };
  breakdown.mentorTier = tierScores[mentor.tier?.toLowerCase()] || 8;
  score += breakdown.mentorTier;
  
  // Calculate compatibility level
  let compatibility = 'Low';
  if (score >= 80) compatibility = 'Excellent';
  else if (score >= 60) compatibility = 'High';
  else if (score >= 40) compatibility = 'Moderate';
  
  // Estimate impact based on mentor tier and match
  const impactMultiplier = { platinum: 1.5, gold: 1.3, silver: 1.1, bronze: 1.0 };
  const impact = Math.round((score / 100) * 25 * (impactMultiplier[mentor.tier?.toLowerCase()] || 1.0));
  
  return {
    overall: Math.round(score),
    breakdown,
    compatibility,
    impact: `+${impact}% pathway probability boost`
  };
}

// Request mentorship connection
exports.requestMentorship = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { menteeId, mentorId, message } = req.body;

    if (!menteeId || !mentorId) {
      return res.status(400).json({ error: 'menteeId and mentorId required' });
    }

    // Create mentorship request
    const { data: request, error } = await supabase
      .from('mentorship_requests')
      .insert({
        mentee_id: menteeId,
        mentor_id: mentorId,
        status: 'pending',
        message: message || 'I would like to connect with you as a mentor.',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Notify mentor
    await supabase.from('notifications').insert({
      user_id: mentorId,
      type: 'mentorship_request',
      title: 'New Mentorship Request',
      message: 'A pilot has requested to connect with you as a mentor.',
      priority: 'medium',
      status: 'pending',
      metadata: { request_id: request.id },
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      requestId: request.id,
      status: 'pending',
      message: 'Mentorship request sent successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Performance Analytics Dashboard
// Track pilot progress over time with trend analysis and velocity metrics
exports.getPerformanceAnalytics = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { userId, timeframe = '90' } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const daysBack = parseInt(timeframe);
    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    // Fetch score history
    const { data: scoreHistory, error: scoreError } = await supabase
      .from('score_history')
      .select('*')
      .eq('user_id', userId)
      .gte('calculated_at', startDate.toISOString())
      .order('calculated_at', { ascending: true });

    // Fetch flight log additions
    const { data: flightLogs, error: logError } = await supabase
      .from('flight_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Fetch program completions
    const { data: programProgress, error: progError } = await supabase
      .from('user_program_progress')
      .select('*')
      .eq('user_id', userId)
      .gte('updated_at', startDate.toISOString());

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    // Calculate analytics
    const analytics = {
      recognitionScore: calculateScoreTrend(scoreHistory || []),
      flightHours: calculateFlightHoursTrend(flightLogs || []),
      gapClosing: calculateGapClosingVelocity(scoreHistory || [], programProgress || []),
      pathwayProgress: await calculatePathwayProgress(userId, supabase),
      engagement: calculateEngagementMetrics(scoreHistory || [], flightLogs || [], programProgress || [], daysBack),
      projections: calculateProjections(profile, scoreHistory || [], daysBack)
    };

    return res.json({
      success: true,
      userId,
      timeframe: `${daysBack} days`,
      generatedAt: new Date().toISOString(),
      analytics
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Calculate recognition score trend
function calculateScoreTrend(scoreHistory) {
  if (scoreHistory.length === 0) {
    return { trend: 'insufficient_data', change: 0, dataPoints: 0 };
  }

  const firstScore = scoreHistory[0].score_value || 0;
  const lastScore = scoreHistory[scoreHistory.length - 1].score_value || 0;
  const change = lastScore - firstScore;
  const percentChange = firstScore > 0 ? (change / firstScore) * 100 : 0;

  // Calculate trend line slope
  let trend = 'stable';
  if (scoreHistory.length >= 3) {
    const midpoint = Math.floor(scoreHistory.length / 2);
    const firstHalf = scoreHistory.slice(0, midpoint);
    const secondHalf = scoreHistory.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((a, b) => a + (b.score_value || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + (b.score_value || 0), 0) / secondHalf.length;
    
    if (secondHalfAvg > firstHalfAvg + 5) trend = 'accelerating';
    else if (secondHalfAvg < firstHalfAvg - 5) trend = 'decelerating';
  }

  return {
    currentScore: Math.round(lastScore),
    startScore: Math.round(firstScore),
    change: Math.round(change * 100) / 100,
    percentChange: Math.round(percentChange * 100) / 100,
    trend,
    dataPoints: scoreHistory.length,
    trendLine: scoreHistory.map(s => ({
      date: s.calculated_at,
      score: s.score_value
    }))
  };
}

// Calculate flight hours trend
function calculateFlightHoursTrend(flightLogs) {
  const totalHoursAdded = flightLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
  
  // Group by month
  const monthlyData = {};
  for (const log of flightLogs) {
    const month = log.created_at?.substring(0, 7) || 'unknown';
    monthlyData[month] = (monthlyData[month] || 0) + (log.duration || 0);
  }

  const monthlyAvg = Object.keys(monthlyData).length > 0
    ? totalHoursAdded / Object.keys(monthlyData).length
    : 0;

  // Calculate velocity (hours per week)
  const firstLog = flightLogs[0]?.created_at;
  const lastLog = flightLogs[flightLogs.length - 1]?.created_at;
  let hoursPerWeek = 0;
  
  if (firstLog && lastLog && flightLogs.length > 1) {
    const daysSpan = (new Date(lastLog) - new Date(firstLog)) / (1000 * 60 * 60 * 24);
    const weeks = Math.max(1, daysSpan / 7);
    hoursPerWeek = totalHoursAdded / weeks;
  }

  return {
    totalHoursAdded: Math.round(totalHoursAdded * 10) / 10,
    monthlyAverage: Math.round(monthlyAvg * 10) / 10,
    hoursPerWeek: Math.round(hoursPerWeek * 10) / 10,
    monthlyBreakdown: monthlyData,
    trend: hoursPerWeek > 10 ? 'strong' : hoursPerWeek > 5 ? 'moderate' : 'slow'
  };
}

// Calculate gap closing velocity
function calculateGapClosingVelocity(scoreHistory, programProgress) {
  // How fast are they completing programs?
  const completedPrograms = programProgress.filter(p => p.status === 'completed').length;
  const inProgressPrograms = programProgress.filter(p => p.status === 'in_progress').length;
  
  // Calculate average completion time
  const completionTimes = programProgress
    .filter(p => p.status === 'completed' && p.started_at && p.completed_at)
    .map(p => {
      const days = (new Date(p.completed_at) - new Date(p.started_at)) / (1000 * 60 * 60 * 24);
      return days;
    });
  
  const avgCompletionDays = completionTimes.length > 0
    ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
    : 0;

  // Estimate time to close remaining gaps based on velocity
  const velocity = scoreHistory.length > 1
    ? (scoreHistory[scoreHistory.length - 1].score_value - scoreHistory[0].score_value) / scoreHistory.length
    : 0;

  return {
    completedPrograms,
    inProgressPrograms,
    averageCompletionDays: Math.round(avgCompletionDays),
    scoreVelocityPerWeek: Math.round(velocity * 100) / 100,
    efficiency: avgCompletionDays < 30 ? 'fast' : avgCompletionDays < 60 ? 'moderate' : 'slow',
    gapClosingRate: velocity > 2 ? 'excellent' : velocity > 0.5 ? 'good' : 'needs_acceleration'
  };
}

// Calculate pathway progress
async function calculatePathwayProgress(userId, supabase) {
  // Get all pathways user is tracking
  const { data: interests } = await supabase
    .from('user_pathway_interests')
    .select('pathway_id, created_at')
    .eq('user_id', userId);

  const pathwayProgress = [];
  
  for (const interest of (interests || [])) {
    // Get pathway details
    const { data: pathway } = await supabase
      .from('career_pathways')
      .select('*')
      .eq('id', interest.pathway_id)
      .maybeSingle();
    
    if (pathway) {
      // Calculate current probability (simplified)
      const daysSinceInterest = Math.floor(
        (Date.now() - new Date(interest.created_at)) / (1000 * 60 * 60 * 24)
      );
      
      pathwayProgress.push({
        pathwayId: pathway.id,
        pathwayName: pathway.name,
        trackingSince: interest.created_at,
        daysTracking: daysSinceInterest,
        targetProbability: 85, // Target 85%
        estimatedTimeToReady: '3-6 months' // Would calculate from gaps
      });
    }
  }

  return pathwayProgress;
}

// Calculate engagement metrics
function calculateEngagementMetrics(scoreHistory, flightLogs, programProgress, daysBack) {
  const weeks = daysBack / 7;
  
  // Activity frequency
  const scoreUpdates = scoreHistory.length;
  const flightLogEntries = flightLogs.length;
  const programUpdates = programProgress.length;
  
  // Weekly averages
  const weeklyScoreUpdates = scoreUpdates / weeks;
  const weeklyFlightLogs = flightLogEntries / weeks;
  const weeklyProgramUpdates = programUpdates / weeks;
  
  // Engagement score (0-100)
  const engagementScore = Math.min(100, 
    (weeklyScoreUpdates * 10) + 
    (weeklyFlightLogs * 5) + 
    (weeklyProgramUpdates * 15)
  );

  return {
    engagementScore: Math.round(engagementScore),
    weeklyActivity: {
      scoreUpdates: Math.round(weeklyScoreUpdates * 10) / 10,
      flightLogs: Math.round(weeklyFlightLogs * 10) / 10,
      programUpdates: Math.round(weeklyProgramUpdates * 10) / 10
    },
    level: engagementScore > 70 ? 'highly_engaged' : engagementScore > 40 ? 'moderately_engaged' : 'low_engagement'
  };
}

// Calculate projections
function calculateProjections(profile, scoreHistory, daysBack) {
  const currentScore = scoreHistory.length > 0
    ? scoreHistory[scoreHistory.length - 1].score_value
    : 70; // Default baseline

  const targetScore = 90; // Target recognition score
  const gap = targetScore - currentScore;

  // Calculate velocity from recent history
  const recentHistory = scoreHistory.slice(-5); // Last 5 measurements
  let velocity = 0;
  
  if (recentHistory.length >= 2) {
    const first = recentHistory[0].score_value;
    const last = recentHistory[recentHistory.length - 1].score_value;
    const timeSpan = recentHistory.length; // in update cycles
    velocity = (last - first) / timeSpan;
  }

  // Time to reach 90% score
  const updatesNeeded = velocity > 0 ? Math.ceil(gap / velocity) : null;
  const estimatedWeeks = updatesNeeded ? updatesNeeded * 2 : null; // Assuming bi-weekly updates

  // Projected pathway readiness
  const readiness = currentScore >= 85 ? 'ready_now' : 
                   currentScore >= 70 ? 'ready_3_months' : 
                   currentScore >= 60 ? 'ready_6_months' : 'ready_12_months';

  return {
    currentScore: Math.round(currentScore),
    targetScore,
    gap: Math.round(gap),
    velocity: Math.round(velocity * 100) / 100,
    estimatedWeeksToTarget: estimatedWeeks,
    projectedReadiness: readiness,
    milestoneDates: {
      seventyFivePct: currentScore >= 75 ? 'achieved' : estimatedWeeks ? `~${Math.round(estimatedWeeks * 0.5)} weeks` : 'unknown',
      eightyFivePct: currentScore >= 85 ? 'achieved' : estimatedWeeks ? `~${estimatedWeeks} weeks` : 'unknown',
      ninetyPct: currentScore >= 90 ? 'achieved' : estimatedWeeks ? `~${Math.round(estimatedWeeks * 1.3)} weeks` : 'unknown'
    }
  };
}

// B2B Airline Recruiter Portal
// Airlines search for and connect with qualified pilots (revenue stream)
exports.searchPilotCandidates = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for B2B access
  );

  try {
    // Verify airline API key (simplified - would check against airline_subscriptions table)
    const { airlineApiKey } = req.headers;
    
    // In production, validate API key and check subscription tier
    // const { data: airline } = await validateAirlineApiKey(airlineApiKey, supabase);
    // if (!airline) return res.status(401).json({ error: 'Invalid API key' });

    // Parse search filters
    const {
      minRecognitionScore = 70,
      minTotalHours = 500,
      pathwayCategory,
      location,
      ratings = [],
      minWpScore = 60,
      limit = 20,
      offset = 0
    } = req.query;

    // Build query
    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        location,
        total_flight_time,
        pic_time,
        multi_engine_time,
        turbine_time,
        ratings,
        technical_skills_score,
        interview_score,
        behavioral_sjt_score,
        medical_valid,
        license_valid,
        last_flown,
        recognition_score:score_history!inner(score_value)
      `, { count: 'exact' })
      .gte('total_flight_time', parseInt(minTotalHours))
      .eq('medical_valid', true)
      .eq('license_valid', true);

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (ratings.length > 0) {
      // Filter by ratings overlap
      query = query.overlaps('ratings', ratings);
    }

    // Execute query
    const { data: candidates, error, count } = await query
      .order('total_flight_time', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate Wp scores for each candidate (simplified)
    const enrichedCandidates = (candidates || []).map(candidate => {
      // Calculate a simplified pathway probability
      const recencyScore = calculateRecencyScore(candidate.last_flown);
      const ratingScore = (candidate.ratings || []).length * 5;
      const experienceScore = Math.min(100, (candidate.total_flight_time || 0) / 15);
      const programScore = (
        (candidate.technical_skills_score || 0) +
        (candidate.interview_score || 0) +
        (candidate.behavioral_sjt_score || 0)
      ) / 3;

      const estimatedWp = Math.round(
        (experienceScore * 0.4 + ratingScore * 0.2 + programScore * 0.3 + recencyScore * 0.1) * 
        (candidate.medical_valid && candidate.license_valid ? 1 : 0)
      );

      return {
        pilotId: candidate.id,
        name: candidate.full_name,
        location: candidate.location,
        flightExperience: {
          totalTime: candidate.total_flight_time,
          picTime: candidate.pic_time,
          multiEngine: candidate.multi_engine_time,
          turbine: candidate.turbine_time
        },
        ratings: candidate.ratings || [],
        assessmentScores: {
          technical: candidate.technical_skills_score,
          interview: candidate.interview_score,
          behavioral: candidate.behavioral_sjt_score
        },
        estimatedWpScore: estimatedWp,
        medicalStatus: candidate.medical_valid ? 'valid' : 'expired',
        recency: candidate.last_flown,
        expressInterestUrl: `https://us-central1-pilotrecognition-recognition.cloudfunctions.net/expressInterest?pilotId=${candidate.id}&airlineKey=${airlineApiKey}`,
        viewFullProfileUrl: `https://us-central1-pilotrecognition-recognition.cloudfunctions.net/viewPilotProfile?pilotId=${candidate.id}&airlineKey=${airlineApiKey}`
      };
    }).filter(c => c.estimatedWpScore >= parseInt(minWpScore));

    // Sort by Wp score
    enrichedCandidates.sort((a, b) => b.estimatedWpScore - a.estimatedWpScore);

    return res.json({
      success: true,
      // airline: airline?.name || 'Demo Airline',
      searchFilters: {
        minRecognitionScore,
        minTotalHours,
        pathwayCategory,
        location,
        ratings,
        minWpScore
      },
      totalResults: count,
      showing: enrichedCandidates.length,
      candidates: enrichedCandidates
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper for recency score
function calculateRecencyScore(lastFlown) {
  if (!lastFlown) return 0;
  
  const daysSince = Math.floor((Date.now() - new Date(lastFlown)) / (1000 * 60 * 60 * 24));
  
  if (daysSince <= 30) return 100;
  if (daysSince <= 90) return 80;
  if (daysSince <= 180) return 60;
  if (daysSince <= 365) return 40;
  return 20;
}

// Express interest in a pilot (B2B feature)
exports.expressInterest = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { pilotId, airlineKey, message } = req.query;

    if (!pilotId || !airlineKey) {
      return res.status(400).json({ error: 'pilotId and airlineKey required' });
    }

    // In production: Validate airline API key
    // const airline = await validateAirlineApiKey(airlineKey, supabase);

    // Get pilot contact info
    const { data: pilot } = await supabase
      .from('profiles')
      .select('email, full_name, fcm_token')
      .eq('id', pilotId)
      .maybeSingle();

    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    // Store interest expression
    await supabase.from('airline_interest_expressions').insert({
      pilot_id: pilotId,
      airline_key: airlineKey,
      message: message || 'An airline has expressed interest in your profile.',
      status: 'pending',
      created_at: new Date().toISOString()
    });

    // Notify pilot
    await supabase.from('notifications').insert({
      user_id: pilotId,
      type: 'airline_interest',
      title: 'Airline Interest Received',
      message: 'An airline recruiter has viewed your profile and expressed interest. Check your email for details.',
      priority: 'high',
      status: 'pending',
      created_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Interest expressed successfully',
      pilotNotified: true,
      nextSteps: [
        'Pilot will be notified via email and push notification',
        'Pilot can choose to share full profile details',
        'If interested, pilot can generate Atlas CV for your review'
      ]
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// PATHWAYS PROJECT FUNCTIONS — deployed to pilotrecognition-pathways
// Full WingMentor R-Formula: R = [Σ(Pᵢ×wᵢ) + Σ(Eⱼ×Tₖ×wⱼ) + Σ(Bₗ×wₗ) + Σ(Lₘ×wₘ) + Σ(Sₙ×wₙ)]
// ============================================================================

// Helper: CORS headers for all pathways functions
const setPathwaysCors = (res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
};

// Helper: Compute full R-formula score from a Supabase profile row
const computeRFormula = (profile) => {
  // --- P: Programs factor (max 100, weight 20%) ---
  const techSkills   = parseFloat(profile.technical_skills_score) || 0;
  const interviewSc  = parseFloat(profile.interview_score) || 0;
  const consultSc    = parseFloat(profile.consultation_score) || 0;
  const simSc        = parseFloat(profile.simulation_score) || 0;
  const examSc       = parseFloat(profile.examination_score) || 0;
  const P = Math.min(100, (techSkills + interviewSc + consultSc + simSc + examSc) / 5);

  // --- E×T: Experience × Time Decay factor (max 100, weight 35%) ---
  const totalHours  = parseFloat(profile.total_flight_hours) || parseFloat(profile.current_flight_hours) || 0;
  const timeDecay   = parseFloat(profile.time_decay_coefficient) || 1.0;
  // Logarithmic hours scale: 0h=0, 200h=40, 1500h=70, 5000h=90, 10000h=100
  const hoursScore  = totalHours === 0 ? 0 : Math.min(100, Math.round(20 + Math.log10(Math.max(1, totalHours)) * 20));
  const ET = Math.min(100, hoursScore * timeDecay);

  // --- B: Behavioral factor (max 100, weight 20%) ---
  const crmSc       = parseFloat(profile.behavioral_crm_assessment) || 0;
  const decisionSc  = parseFloat(profile.behavioral_decision_making) || 0;
  const stressSc    = parseFloat(profile.behavioral_stress_management) || 0;
  const sjtSc       = parseFloat(profile.behavioral_sjt_score) || 0;
  const psychoSc    = parseFloat(profile.behavioral_psychometric_score) || 0;
  const cogSc       = parseFloat(profile.behavioral_cognitive_workload) || 0;
  const bScores     = [crmSc, decisionSc, stressSc, sjtSc, psychoSc, cogSc].filter(s => s > 0);
  const B = bScores.length > 0 ? Math.min(100, bScores.reduce((a, b) => a + b, 0) / bScores.length) : 50;

  // --- L: Language factor (max 100, weight 10%) ---
  const icaoRaw     = (profile.language_icao_level || profile.english_proficiency_level || 'None').toString();
  const icaoNum     = parseInt(icaoRaw.replace(/\D/g, '')) || 0;
  const icaoScore   = icaoNum >= 6 ? 100 : icaoNum === 5 ? 88 : icaoNum === 4 ? 72 : icaoNum === 3 ? 45 : 20;
  const cultAdapt   = parseFloat(profile.language_cultural_adaptability) || 0;
  const crossComm   = parseFloat(profile.language_cross_cultural_comm) || 0;
  const intlExp     = profile.language_international_experience ? 20 : 0;
  const lScores     = [icaoScore, cultAdapt, crossComm].filter(s => s > 0);
  const L = Math.min(100, (lScores.reduce((a, b) => a + b, 0) / Math.max(lScores.length, 1)) + intlExp);

  // --- S: Specialized Skills factor (max 100, weight 15%) ---
  const weatherSc   = parseFloat(profile.skills_weather_ops) || 0;
  const terrainSc   = parseFloat(profile.skills_terrain_complexity) || 0;
  const emergSc     = parseFloat(profile.skills_emergency_procedures) || 0;
  const trDivSc     = parseFloat(profile.skills_type_rating_diversity) || 0;
  const instrSc     = parseFloat(profile.skills_instrument_approaches) || 0;
  const medClass    = (profile.medical_class || '').toString();
  const medScore    = medClass.includes('1') ? 100 : medClass.includes('2') ? 75 : 40;
  const typeRatings = profile.ratings || [];
  const trBonus     = Math.min(20, typeRatings.length * 5);
  const sRaw        = [weatherSc, terrainSc, emergSc, trDivSc, instrSc].filter(s => s > 0);
  const S = Math.min(100, (sRaw.length > 0 ? sRaw.reduce((a, b) => a + b, 0) / sRaw.length : medScore * 0.5) + trBonus);

  // --- Weighted composite (0–100) ---
  const totalScore = Math.round(P * 0.20 + ET * 0.35 + B * 0.20 + L * 0.10 + S * 0.15);

  // Profile completeness: how many key fields are filled
  const keyFields = ['total_flight_hours', 'medical_class', 'language_icao_level', 'behavioral_crm_assessment',
    'technical_skills_score', 'ratings', 'country', 'english_proficiency_level'];
  const filled = keyFields.filter(f => {
    const v = profile[f];
    return v !== null && v !== undefined && v !== '' && v !== 0 && !(Array.isArray(v) && v.length === 0);
  }).length;
  const profileCompleteness = Math.round((filled / keyFields.length) * 100);

  // Rank label
  const rankLabel = totalScore >= 85 ? 'Elite' : totalScore >= 70 ? 'Advanced' : totalScore >= 55 ? 'Developing' : totalScore >= 35 ? 'Building' : 'Foundation';

  return { P, ET, B, L, S, totalScore, profileCompleteness, rankLabel, totalHours, typeRatings, icaoScore };
};

// F1: pathways_calculateFullScore
// Returns the full R-formula breakdown for a user, with score history trend
exports.pathways_calculateFullScore = onRequest(async (req, res) => {
  setPathwaysCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

    const scores = computeRFormula(profile);

    // Score history for velocity calculation
    const { data: history } = await supabase
      .from('score_history')
      .select('score_value, calculated_at')
      .eq('user_id', userId)
      .eq('score_type', 'recognition')
      .order('calculated_at', { ascending: false })
      .limit(6);

    // Calculate month-over-month velocity
    let scoreVelocity = 0;
    let velocityLabel = '';
    if (history && history.length >= 2) {
      const latest = parseFloat(history[0].score_value) || 0;
      const previous = parseFloat(history[history.length - 1].score_value) || 0;
      scoreVelocity = Math.round(latest - previous);
      velocityLabel = scoreVelocity > 0 ? `↑ +${scoreVelocity}% this period` : scoreVelocity < 0 ? `↓ ${scoreVelocity}% this period` : 'Stable';
    }

    // Insights: what's pulling score down
    const insights = [];
    if (scores.B < 50) insights.push({ factor: 'Behavioral', message: 'Complete the CRM & SJT assessment to unlock behavioral scores', impact: 'high' });
    if (scores.P < 40) insights.push({ factor: 'Programs', message: 'Enroll in a WingMentor program to boost your Programs score', impact: 'high' });
    if (scores.L < 60) insights.push({ factor: 'Language', message: 'Your ICAO language level is limiting matches with premium airlines', impact: 'medium' });
    if (scores.S < 50) insights.push({ factor: 'Skills', message: 'Add your type ratings and specialized skills to improve match accuracy', impact: 'medium' });
    if (scores.ET < 50) insights.push({ factor: 'Experience', message: 'Build flight hours or update your last-flown date to improve recency', impact: 'high' });

    return res.json({
      success: true,
      totalScore: scores.totalScore,
      rankLabel: scores.rankLabel,
      profileCompleteness: scores.profileCompleteness,
      breakdown: { P: Math.round(scores.P), ET: Math.round(scores.ET), B: Math.round(scores.B), L: Math.round(scores.L), S: Math.round(scores.S) },
      scoreVelocity,
      velocityLabel,
      scoreHistory: (history || []).map(h => ({ value: parseFloat(h.score_value), date: h.calculated_at })).reverse(),
      insights,
      totalHours: scores.totalHours,
      typeRatings: scores.typeRatings,
      icaoLevel: scores.icaoScore
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// F2: pathways_getJobMatches
// Scores a batch of job listings against the full R-formula and returns blind spot picks
exports.pathways_getJobMatches = onRequest(async (req, res) => {
  setPathwaysCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const { userId, jobListings } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!jobListings || !Array.isArray(jobListings)) return res.status(400).json({ error: 'jobListings array required' });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const scores = computeRFormula(profile);
    const userHours = scores.totalHours;
    const userTRs = (scores.typeRatings || []).map(t => t.toLowerCase());
    const pathwayInterests = profile.pathway_interests || [];

    const scoredJobs = jobListings.map(job => {
      // Hours component (40 pts)
      const flightTimeText = (job.flightTime || '').replace(/,/g, '');
      const reqHoursMatch = flightTimeText.match(/(\d{3,5})/);
      const reqHours = reqHoursMatch ? parseInt(reqHoursMatch[1]) : 0;
      let hoursScore = 0;
      if (reqHours === 0 || userHours >= reqHours) hoursScore = 40;
      else if (userHours >= reqHours * 0.80) hoursScore = 32;
      else if (userHours >= reqHours * 0.60) hoursScore = 20;
      else if (userHours >= reqHours * 0.40) hoursScore = 10;
      else hoursScore = 3;
      const hoursGap = reqHours > userHours ? reqHours - userHours : 0;

      // Type rating component (25 pts)
      const trReq = (job.typeRating || '').toLowerCase();
      let trScore = 0;
      let missingRating = null;
      if (!trReq || trReq === 'not required' || trReq === 'n/a') {
        trScore = 25;
      } else if (userTRs.some(tr => trReq.includes(tr) || tr.includes(trReq.split(' ')[0]))) {
        trScore = 25;
      } else {
        trScore = userTRs.length > 0 ? 8 : 0;
        missingRating = job.typeRating;
      }

      // Behavioral fit component (20 pts) — uses pilot's B score weighted by role
      const roleText = (job.role || job.title || '').toLowerCase();
      const isCaptain = roleText.includes('captain') || roleText.includes('commander');
      const bThreshold = isCaptain ? 65 : 45; // captains need higher CRM
      const bScore = Math.round((scores.B / 100) * (scores.B >= bThreshold ? 20 : 12));

      // Language / location component (15 pts)
      const lScore = Math.round((scores.L / 100) * 15);

      const raw = hoursScore + trScore + bScore + lScore;
      const matchPct = Math.max(45, Math.min(99, Math.round((raw / 100) * 100)));

      // Blind spot detection: high match but category not in pilot's stated interests
      const jobCategory = job.role || job.category || '';
      const isBlindSpot = matchPct >= 78 && !pathwayInterests.some(interest =>
        jobCategory.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(jobCategory.toLowerCase())
      );

      return {
        jobId: job.id || `${job.company}-${job.title}`.replace(/\s+/g, '-').toLowerCase(),
        title: job.title,
        company: job.company,
        matchPct,
        hoursGap,
        missingRating,
        blindSpotScore: isBlindSpot ? matchPct : 0,
        isBlindSpot,
        breakdown: { hours: hoursScore, typeRating: trScore, behavioral: bScore, language: lScore },
        hiringStatus: job.status || 'moderate'
      };
    });

    // Sort by match descending
    scoredJobs.sort((a, b) => b.matchPct - a.matchPct);

    // Blind spot picks: top 3 blind spots
    const blindSpotPicks = scoredJobs
      .filter(j => j.isBlindSpot)
      .sort((a, b) => b.blindSpotScore - a.blindSpotScore)
      .slice(0, 3);

    // Summary stats
    const above75 = scoredJobs.filter(j => j.matchPct >= 75).length;
    const above90 = scoredJobs.filter(j => j.matchPct >= 90).length;

    return res.json({
      success: true,
      totalJobs: scoredJobs.length,
      matchesAbove75: above75,
      matchesAbove90: above90,
      scoredJobs,
      blindSpotPicks,
      pilotScore: { totalScore: scores.totalScore, B: Math.round(scores.B), L: Math.round(scores.L) }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// F3: pathways_getPathwayRoadmap
// Returns 4-step career roadmap for a selected pathway including ETA and program recommendations
exports.pathways_getPathwayRoadmap = onRequest(async (req, res) => {
  setPathwaysCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const { userId, pathway } = req.body;
    if (!userId || !pathway) return res.status(400).json({ error: 'userId and pathway required' });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const scores = computeRFormula(profile);

    // Pull enrolled programs for gap-closing recommendations
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId);

    const { data: programProgress } = await supabase
      .from('program_progress')
      .select('*')
      .eq('user_id', userId);

    // Parse pathway requirements
    const reqHoursText = (pathway.requirements?.totalHours || 0).toString();
    const reqHours = parseInt(reqHoursText) || 0;
    const userHours = scores.totalHours;
    const hoursGap = Math.max(0, reqHours - userHours);

    // ETA calculation: assume 80 flight hours per month for active pilot
    const hoursPerMonth = 80;
    const etaMonths = hoursGap > 0 ? Math.ceil(hoursGap / hoursPerMonth) : 0;

    // Gap analysis per dimension
    const gaps = [];
    if (hoursGap > 0) gaps.push({ dimension: 'Flight Hours', current: userHours, required: reqHours, gap: hoursGap, status: hoursGap > 500 ? 'far' : 'close', suggestion: `Build ${hoursGap} more hours — approximately ${etaMonths} months at current pace` });
    if (scores.P < 60) gaps.push({ dimension: 'Programs Score', current: Math.round(scores.P), required: 60, gap: 60 - Math.round(scores.P), status: scores.P < 30 ? 'far' : 'close', suggestion: 'Enroll in WingMentor Foundation or CRM program' });
    if (scores.B < 55) gaps.push({ dimension: 'Behavioral Assessment', current: Math.round(scores.B), required: 55, gap: 55 - Math.round(scores.B), status: scores.B < 30 ? 'far' : 'close', suggestion: 'Complete the SJT and psychometric assessments in your portal' });
    if (scores.L < 65) gaps.push({ dimension: 'Language Proficiency', current: Math.round(scores.L), required: 65, gap: 65 - Math.round(scores.L), status: 'medium', suggestion: 'Achieve ICAO Level 5 or above for major airline eligibility' });

    // Program recommendations to close gaps
    const programRecs = [];
    if (scores.B < 55) programRecs.push({ name: 'CRM & Behavioral Excellence', type: 'Behavioral', estimatedHours: 12, link: '/portal/programs/crm', priority: 'high', scoreImpact: '+15 Behavioral' });
    if (scores.P < 60) programRecs.push({ name: 'Foundation Assessment Program', type: 'Programs', estimatedHours: 20, link: '/portal/programs/foundation', priority: 'high', scoreImpact: '+20 Programs' });
    if (scores.L < 65) programRecs.push({ name: 'ICAO Language Preparation', type: 'Language', estimatedHours: 30, link: '/portal/programs/language', priority: 'medium', scoreImpact: '+18 Language' });
    if (scores.S < 50) programRecs.push({ name: 'Advanced Systems & Technical', type: 'Skills', estimatedHours: 15, link: '/portal/programs/technical', priority: 'medium', scoreImpact: '+12 Skills' });

    // Mark which programs are already enrolled
    programRecs.forEach(rec => {
      rec.enrolled = (enrollments || []).some(e => e.program_name?.toLowerCase().includes(rec.type.toLowerCase()));
      rec.progress = (programProgress || []).find(p => p.program_name?.toLowerCase().includes(rec.type.toLowerCase()))?.progress_percentage || 0;
    });

    // 4-step roadmap
    const roadmapSteps = [
      {
        step: 1,
        title: 'Your Current Profile',
        status: 'current',
        description: `Recognition Score: ${scores.totalScore}/100 · ${Math.round(userHours)} flight hours · Rank: ${scores.rankLabel}`,
        metrics: { totalScore: scores.totalScore, hours: Math.round(userHours), rank: scores.rankLabel, breakdown: { P: Math.round(scores.P), ET: Math.round(scores.ET), B: Math.round(scores.B), L: Math.round(scores.L), S: Math.round(scores.S) } }
      },
      {
        step: 2,
        title: 'Gap Analysis',
        status: gaps.length === 0 ? 'complete' : 'active',
        description: gaps.length === 0 ? 'You meet all baseline requirements for this pathway!' : `${gaps.length} gap${gaps.length > 1 ? 's' : ''} identified`,
        gaps
      },
      {
        step: 3,
        title: 'Close the Gaps',
        status: programRecs.length === 0 ? 'complete' : 'pending',
        description: programRecs.length === 0 ? 'No programs needed — profile is aligned' : `${programRecs.length} recommended program${programRecs.length > 1 ? 's' : ''}`,
        programs: programRecs
      },
      {
        step: 4,
        title: `Target: ${pathway.name || 'Your Pathway'}`,
        status: gaps.length === 0 ? 'ready' : 'future',
        description: etaMonths === 0 ? 'You qualify now — start applying!' : `Estimated readiness: ~${etaMonths} months`,
        etaMonths,
        targetRole: pathway.name,
        targetAirline: pathway.airline,
        estimatedSalary: pathway.salary?.firstYear || 'Varies by operator'
      }
    ];

    // Cache in Supabase
    await supabase.from('pathway_roadmap_cache').upsert({
      user_id: userId,
      pathway_id: pathway.id || 'unknown',
      total_score: scores.totalScore,
      breakdown: { P: Math.round(scores.P), ET: Math.round(scores.ET), B: Math.round(scores.B), L: Math.round(scores.L), S: Math.round(scores.S) },
      roadmap_steps: roadmapSteps,
      gap_score: gaps.length,
      eta_months: etaMonths,
      program_recommendations: programRecs,
      calculated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }, { onConflict: 'user_id,pathway_id' });

    return res.json({ success: true, roadmapSteps, gapScore: gaps.length, etaMonths, programRecommendations: programRecs, pilotScore: scores.totalScore });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// F4: pathways_getTypeRatingRecommendations
// Ranks type ratings by unlock value (how many additional jobs/airlines become accessible)
exports.pathways_getTypeRatingRecommendations = onRequest(async (req, res) => {
  setPathwaysCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const scores = computeRFormula(profile);
    const currentRatings = (scores.typeRatings || []).map(r => r.toLowerCase());

    // Type rating unlock data: airlines per rating type
    const typeRatingData = [
      { rating: 'A320', family: 'Airbus A320 Family', airlines: ['IndiGo', 'EasyJet', 'Lufthansa', 'Swiss', 'TAP', 'Vueling', 'Wizz Air', 'AirAsia', 'Cebu Pacific', 'Philippine Airlines'], costUSD: 35000, jobsUnlocked: 94, priority: 'critical' },
      { rating: 'B737', family: 'Boeing 737 Family', airlines: ['Ryanair', 'Southwest', 'Alaska', 'GOL', 'Korean Air', 'Lion Air', 'Norwegian', 'WestJet', 'Aeromexico'], costUSD: 30000, jobsUnlocked: 87, priority: 'critical' },
      { rating: 'A350', family: 'Airbus A350', airlines: ['Qatar Airways', 'Singapore Airlines', 'Cathay Pacific', 'Air France', 'Finnair', 'Japan Airlines', 'Vietnam Airlines'], costUSD: 55000, jobsUnlocked: 38, priority: 'high' },
      { rating: 'B777', family: 'Boeing 777', airlines: ['Emirates', 'Qatar Airways', 'United', 'Delta', 'Korean Air', 'Etihad', 'Turkish Airlines', 'Air France'], costUSD: 50000, jobsUnlocked: 42, priority: 'high' },
      { rating: 'B787', family: 'Boeing 787 Dreamliner', airlines: ['ANA', 'JAL', 'British Airways', 'LOT Polish', 'Oman Air', 'Scoot', 'Norwegian', 'Etihad'], costUSD: 45000, jobsUnlocked: 35, priority: 'high' },
      { rating: 'ATR', family: 'ATR 72/42', airlines: ['Regional carriers', 'Commuter airlines', 'Island operators', 'Charter ops'], costUSD: 18000, jobsUnlocked: 28, priority: 'medium' },
      { rating: 'CRJ', family: 'Canadair Regional Jet', airlines: ['SkyWest', 'Mesa', 'Republic', 'Air Wisconsin', 'PSA'], costUSD: 20000, jobsUnlocked: 22, priority: 'medium' },
      { rating: 'E175', family: 'Embraer 175/190/195', airlines: ['Horizon Air', 'Republic', 'Regional operators', 'Azul'], costUSD: 22000, jobsUnlocked: 19, priority: 'medium' },
      { rating: 'A380', family: 'Airbus A380', airlines: ['Emirates', 'Singapore Airlines', 'British Airways', 'Qantas', 'Korean Air'], costUSD: 60000, jobsUnlocked: 12, priority: 'prestige' },
      { rating: 'B747', family: 'Boeing 747', airlines: ['Cargo operators', 'Cargolux', 'Korean Air', 'Nippon Cargo', 'Atlas Air'], costUSD: 45000, jobsUnlocked: 15, priority: 'medium' }
    ];

    // Filter out ratings pilot already has, compute ROI
    const recommendations = typeRatingData
      .filter(tr => !currentRatings.some(cr => tr.rating.toLowerCase().includes(cr) || cr.includes(tr.rating.toLowerCase())))
      .map(tr => {
        // ROI calculation: assume average FO salary boost of $20k/yr for major airline
        const avgSalaryBoostPerYear = tr.priority === 'critical' ? 25000 : tr.priority === 'high' ? 20000 : 15000;
        const breakevenMonths = Math.round((tr.costUSD / avgSalaryBoostPerYear) * 12);
        const scoreImpact = Math.round(tr.jobsUnlocked * 0.15); // estimated score uplift

        return {
          rating: tr.rating,
          family: tr.family,
          airlines: tr.airlines,
          costUSD: tr.costUSD,
          jobsUnlocked: tr.jobsUnlocked,
          priority: tr.priority,
          priorityLabel: tr.priority === 'critical' ? '🔥 Critical — opens most doors' : tr.priority === 'high' ? '⭐ High Value' : tr.priority === 'prestige' ? '👑 Prestige' : '📈 Growth',
          roiMonths: breakevenMonths,
          roiLabel: `Break even in ~${breakevenMonths} months at target salary`,
          estimatedScoreImpact: `+${scoreImpact} more job matches`,
          programLink: `/portal/type-ratings/${tr.rating.toLowerCase()}`
        };
      })
      .sort((a, b) => b.jobsUnlocked - a.jobsUnlocked)
      .slice(0, 6);

    // Current portfolio analysis
    const currentPortfolio = typeRatingData.filter(tr =>
      currentRatings.some(cr => tr.rating.toLowerCase().includes(cr) || cr.includes(tr.rating.toLowerCase()))
    );
    const totalAirlinesAccessible = new Set(currentPortfolio.flatMap(tr => tr.airlines)).size;
    const coverageScore = Math.round((totalAirlinesAccessible / 60) * 100);

    return res.json({
      success: true,
      recommendations,
      currentPortfolio: currentRatings,
      airlinesAccessible: totalAirlinesAccessible,
      coverageScore,
      coverageLabel: `You can fly for ${totalAirlinesAccessible} of 60 major airlines`,
      pilotScore: scores.totalScore
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// F5: pathways_getAirlineExpectationsMatch
// Runs R-formula against all major airlines and returns per-airline compatibility scores
exports.pathways_getAirlineExpectationsMatch = onRequest(async (req, res) => {
  setPathwaysCors(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const scores = computeRFormula(profile);
    const userHours = scores.totalHours;
    const userTRs = (scores.typeRatings || []).map(r => r.toLowerCase());

    // Airline requirement benchmarks
    const airlineBenchmarks = [
      { id: 'qatar', name: 'Qatar Airways', reqHours: 4000, reqRating: 'B777', reqIcao: 5, reqBehavioral: 70, tier: 'premium' },
      { id: 'emirates', name: 'Emirates', reqHours: 4000, reqRating: 'B777', reqIcao: 5, reqBehavioral: 72, tier: 'premium' },
      { id: 'singapore', name: 'Singapore Airlines', reqHours: 3000, reqRating: 'A350', reqIcao: 5, reqBehavioral: 68, tier: 'premium' },
      { id: 'cathay', name: 'Cathay Pacific', reqHours: 2500, reqRating: 'A330', reqIcao: 4, reqBehavioral: 65, tier: 'premium' },
      { id: 'etihad', name: 'Etihad Airways', reqHours: 2500, reqRating: 'B787', reqIcao: 5, reqBehavioral: 65, tier: 'premium' },
      { id: 'lufthansa', name: 'Lufthansa', reqHours: 1500, reqRating: 'A320', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'british', name: 'British Airways', reqHours: 1500, reqRating: 'B777', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'airfrance', name: 'Air France', reqHours: 1500, reqRating: 'A320', reqIcao: 4, reqBehavioral: 58, tier: 'legacy' },
      { id: 'klm', name: 'KLM', reqHours: 1200, reqRating: 'B777', reqIcao: 4, reqBehavioral: 58, tier: 'legacy' },
      { id: 'turkish', name: 'Turkish Airlines', reqHours: 2000, reqRating: 'A320', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'ana', name: 'ANA All Nippon', reqHours: 1500, reqRating: 'B787', reqIcao: 4, reqBehavioral: 65, tier: 'premium' },
      { id: 'jal', name: 'Japan Airlines', reqHours: 1500, reqRating: 'A350', reqIcao: 4, reqBehavioral: 63, tier: 'premium' },
      { id: 'korean', name: 'Korean Air', reqHours: 2000, reqRating: 'A380', reqIcao: 4, reqBehavioral: 62, tier: 'legacy' },
      { id: 'delta', name: 'Delta Air Lines', reqHours: 1500, reqRating: 'A350', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'united', name: 'United Airlines', reqHours: 1500, reqRating: 'B787', reqIcao: 4, reqBehavioral: 58, tier: 'legacy' },
      { id: 'american', name: 'American Airlines', reqHours: 1500, reqRating: 'B777', reqIcao: 4, reqBehavioral: 58, tier: 'legacy' },
      { id: 'southwest', name: 'Southwest Airlines', reqHours: 1000, reqRating: 'B737', reqIcao: 4, reqBehavioral: 55, tier: 'lowcost' },
      { id: 'qantas', name: 'Qantas', reqHours: 2000, reqRating: 'A380', reqIcao: 4, reqBehavioral: 65, tier: 'legacy' },
      { id: 'aircanada', name: 'Air Canada', reqHours: 1500, reqRating: 'B787', reqIcao: 4, reqBehavioral: 58, tier: 'legacy' },
      { id: 'thai', name: 'Thai Airways', reqHours: 1500, reqRating: 'A330', reqIcao: 4, reqBehavioral: 55, tier: 'legacy' },
      { id: 'malaysia', name: 'Malaysia Airlines', reqHours: 1200, reqRating: 'A350', reqIcao: 4, reqBehavioral: 55, tier: 'legacy' },
      { id: 'asiana', name: 'Asiana Airlines', reqHours: 1800, reqRating: 'A350', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'garuda', name: 'Garuda Indonesia', reqHours: 1500, reqRating: 'A330', reqIcao: 4, reqBehavioral: 55, tier: 'legacy' },
      { id: 'philippine', name: 'Philippine Airlines', reqHours: 1200, reqRating: 'A321', reqIcao: 4, reqBehavioral: 52, tier: 'regional' },
      { id: 'vietnam', name: 'Vietnam Airlines', reqHours: 1500, reqRating: 'A350', reqIcao: 4, reqBehavioral: 55, tier: 'regional' },
      { id: 'indigo', name: 'IndiGo', reqHours: 1000, reqRating: 'A320', reqIcao: 4, reqBehavioral: 50, tier: 'lowcost' },
      { id: 'cebu', name: 'Cebu Pacific', reqHours: 1000, reqRating: 'A320', reqIcao: 4, reqBehavioral: 48, tier: 'lowcost' },
      { id: 'scoot', name: 'Scoot', reqHours: 1200, reqRating: 'B787', reqIcao: 4, reqBehavioral: 50, tier: 'lowcost' },
      { id: 'saudia', name: 'Saudia', reqHours: 2500, reqRating: 'A320', reqIcao: 4, reqBehavioral: 60, tier: 'legacy' },
      { id: 'ethiopian', name: 'Ethiopian Airlines', reqHours: 1500, reqRating: 'B787', reqIcao: 4, reqBehavioral: 55, tier: 'regional' }
    ];

    const airlineMatches = airlineBenchmarks.map(airline => {
      // Hours match (40 pts)
      let hoursScore = 0;
      if (userHours >= airline.reqHours) hoursScore = 40;
      else if (userHours >= airline.reqHours * 0.80) hoursScore = 30;
      else if (userHours >= airline.reqHours * 0.60) hoursScore = 18;
      else hoursScore = Math.round((userHours / airline.reqHours) * 10);
      const hoursGap = Math.max(0, airline.reqHours - userHours);

      // Type rating match (30 pts)
      const reqRatingKey = airline.reqRating.toLowerCase();
      const hasRating = userTRs.some(tr => reqRatingKey.includes(tr) || tr.includes(reqRatingKey.split('-')[0]));
      const trScore = hasRating ? 30 : (userTRs.length > 0 ? 10 : 0);
      const ratingGap = hasRating ? null : airline.reqRating;

      // Behavioral fit (20 pts)
      const bFit = scores.B >= airline.reqBehavioral ? 20 : Math.round((scores.B / airline.reqBehavioral) * 20);

      // Language (10 pts)
      const lFit = scores.icaoScore >= (airline.reqIcao === 5 ? 88 : 72) ? 10 : Math.round((scores.icaoScore / 100) * 10);

      const rawMatch = hoursScore + trScore + bFit + lFit;
      const matchPct = Math.max(20, Math.min(99, Math.round((rawMatch / 100) * 100)));

      const readinessLabel = matchPct >= 75 ? 'Ready Now' : matchPct >= 50 ? 'Close (within reach)' : 'Long-Term Goal';
      const readinessColor = matchPct >= 75 ? 'emerald' : matchPct >= 50 ? 'amber' : 'slate';

      return {
        id: airline.id,
        name: airline.name,
        tier: airline.tier,
        matchPct,
        hoursGap,
        ratingGap,
        readinessLabel,
        readinessColor,
        breakdown: { hours: hoursScore, typeRating: trScore, behavioral: bFit, language: lFit },
        reqHours: airline.reqHours,
        reqRating: airline.reqRating,
        behavioralFit: scores.B >= airline.reqBehavioral
      };
    });

    // Sort by match descending
    airlineMatches.sort((a, b) => b.matchPct - a.matchPct);

    // Group by readiness
    const readyNow = airlineMatches.filter(a => a.matchPct >= 75);
    const closeReach = airlineMatches.filter(a => a.matchPct >= 50 && a.matchPct < 75);
    const longTerm = airlineMatches.filter(a => a.matchPct < 50);

    // Global percentile estimate (compared against hour milestones)
    const percentile = userHours >= 5000 ? 92 : userHours >= 3000 ? 78 : userHours >= 1500 ? 58 : userHours >= 500 ? 35 : 15;

    return res.json({
      success: true,
      airlineMatches,
      readyNow: readyNow.length,
      closeReach: closeReach.length,
      longTerm: longTerm.length,
      globalPercentile: percentile,
      percentileLabel: `Top ${100 - percentile}% of pilots for airline readiness`,
      grouped: { readyNow, closeReach, longTerm },
      pilotScore: scores.totalScore
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Check if user has enterprise access authorization
exports.checkEnterpriseAccess = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

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
      .from('profiles')
      .select('enterprise_access')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const hasEnterpriseAccess = data?.enterprise_access === true;

    return res.json({
      hasEnterpriseAccess,
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Check if user is verified for posting pathway cards
exports.checkVerifiedAccount = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

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
      .from('profiles')
      .select('verified_account')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const isVerified = data?.verified_account === true;

    return res.json({
      isVerified,
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Check if user can post pathway cards (enterprise access or verified account)
exports.checkPathwayPostingAccess = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

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
      .from('profiles')
      .select('enterprise_access, verified_account')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const canPost = data?.enterprise_access === true || data?.verified_account === true;

    return res.json({
      canPost,
      hasEnterpriseAccess: data?.enterprise_access === true,
      isVerified: data?.verified_account === true,
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Post pathway card with authorization check
exports.postPathwayCard = onRequest(async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

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
    const { userId, pathwayData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    if (!pathwayData) {
      return res.status(400).json({ error: 'pathwayData required' });
    }

    // Check if user has posting authorization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('enterprise_access, verified_account')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const canPost = profile?.enterprise_access === true || profile?.verified_account === true;

    if (!canPost) {
      return res.status(403).json({ 
        error: 'Unauthorized: User does not have enterprise access or verified account status',
        hasEnterpriseAccess: profile?.enterprise_access === true,
        isVerified: profile?.verified_account === true
      });
    }

    // Insert pathway card
    const { data: pathway, error: pathwayError } = await supabase
      .from('career_pathways')
      .insert({
        ...pathwayData,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (pathwayError) {
      return res.status(500).json({ error: pathwayError.message });
    }

    return res.json({
      success: true,
      message: 'Pathway card posted successfully',
      pathway
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ============================================================
// ENTERPRISE / AIRLINE FUNCTIONS
// Project: pilotrecognition-airline
// ============================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
};

function setCORS(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.set(k, v));
}

// Grant enterprise access to a profile (admin only)
exports.grantEnterpriseAccess = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { adminUserId, targetUserId, verified = false } = req.body;
    if (!adminUserId || !targetUserId) return res.status(400).json({ error: 'adminUserId and targetUserId required' });

    // Verify caller is super_admin
    const { data: admin, error: adminError } = await supabase
      .from('profiles').select('role').eq('id', adminUserId).single();
    if (adminError || admin?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super_admin can grant enterprise access' });
    }

    const { error } = await supabase
      .from('profiles')
      .update({ enterprise_access: true, verified_account: verified, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, message: 'Enterprise access granted', targetUserId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create or update enterprise account (airline profile)
exports.upsertEnterpriseAccount = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (!['POST', 'PUT'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, accountData } = req.body;
    if (!userId || !accountData?.airline_name) {
      return res.status(400).json({ error: 'userId and accountData.airline_name required' });
    }

    // Check enterprise_access flag
    const { data: profile } = await supabase
      .from('profiles').select('enterprise_access').eq('id', userId).single();
    if (!profile?.enterprise_access) {
      return res.status(403).json({ error: 'Enterprise access required' });
    }

    // Upsert enterprise account
    const { data: account, error } = await supabase
      .from('enterprise_accounts')
      .upsert({ ...accountData, profile_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'profile_id' })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, account });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get enterprise account for a user
exports.getEnterpriseAccount = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabase
      .from('enterprise_accounts')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });

    return res.json({ account: data || null });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Post a full enterprise pathway card with all components
exports.postEnterprisePathwayCard = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, cardData } = req.body;
    if (!userId || !cardData) return res.status(400).json({ error: 'userId and cardData required' });

    // Auth check
    const { data: profile } = await supabase
      .from('profiles').select('enterprise_access, verified_account').eq('id', userId).single();
    const canPost = profile?.enterprise_access === true || profile?.verified_account === true;
    if (!canPost) return res.status(403).json({ error: 'Enterprise access or verified account required' });

    // Get enterprise account
    const { data: account } = await supabase
      .from('enterprise_accounts').select('id').eq('profile_id', userId).single();
    if (!account) return res.status(400).json({ error: 'Enterprise account not found. Create enterprise account first.' });

    const {
      title, subtitle, category, position_type, hiring_status,
      minimum_requirements, profile_alignment, compensation,
      career_progression, training_programs, recruitment_process,
      company_culture, benefits_summary,
      application_url, application_email, application_deadline,
      positions_available, base_locations, is_published, is_featured, expires_at
    } = cardData;

    if (!title || !position_type) {
      return res.status(400).json({ error: 'title and position_type required' });
    }

    const { data: card, error } = await supabase
      .from('enterprise_pathway_cards')
      .insert({
        enterprise_account_id: account.id,
        posted_by: userId,
        title, subtitle, category: category || 'airline-pathways',
        position_type, hiring_status: hiring_status || 'active',
        minimum_requirements: minimum_requirements || {},
        profile_alignment: profile_alignment || {},
        compensation: compensation || {},
        career_progression: career_progression || [],
        training_programs: training_programs || [],
        recruitment_process: recruitment_process || [],
        company_culture, benefits_summary,
        application_url, application_email, application_deadline,
        positions_available: positions_available || 1,
        base_locations: base_locations || [],
        is_published: is_published || false,
        is_featured: is_featured || false,
        expires_at,
        published_at: is_published ? new Date().toISOString() : null,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, message: 'Enterprise pathway card posted', card });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Post a job listing to job_opportunities table
exports.postEnterpriseJobListing = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, jobData } = req.body;
    if (!userId || !jobData) return res.status(400).json({ error: 'userId and jobData required' });

    const { data: profile } = await supabase
      .from('profiles').select('enterprise_access').eq('id', userId).single();
    if (!profile?.enterprise_access) return res.status(403).json({ error: 'Enterprise access required' });

    const { data: account } = await supabase
      .from('enterprise_accounts').select('id, airline_name').eq('profile_id', userId).single();
    if (!account) return res.status(400).json({ error: 'Enterprise account not found' });

    const { data: job, error } = await supabase
      .from('job_opportunities')
      .insert({
        job_id: `ENT-${Date.now()}`,
        title: jobData.title,
        company: jobData.company || account.airline_name,
        location: jobData.location,
        job_type: jobData.job_type || 'Full-time',
        category: jobData.category || 'airline-pathways',
        aircraft_types: jobData.aircraft_types || [],
        minimum_requirements: jobData.minimum_requirements || {},
        preferred_qualifications: jobData.preferred_qualifications || {},
        benefits: jobData.benefits || {},
        application_url: jobData.application_url,
        flight_hours_required: jobData.flight_hours_required,
        pic_hours_required: jobData.pic_hours_required,
        pic_in_type_hours: jobData.pic_in_type_hours,
        type_rating_required: jobData.type_rating_required || false,
        medical_class_required: jobData.medical_class_required,
        icao_elp_level: jobData.icao_elp_level,
        license_required: jobData.license_required,
        visa_sponsorship: jobData.visa_sponsorship || false,
        compensation: jobData.compensation,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        salary_currency: jobData.salary_currency || 'USD',
        description: jobData.description,
        logo_url: jobData.logo_url,
        positions_available: jobData.positions_available || 1,
        application_deadline: jobData.application_deadline,
        posting_date: new Date().toISOString(),
        expiry_date: jobData.expiry_date,
        is_active: true,
        status: 'active',
        is_enterprise_listing: true,
        enterprise_account_id: account.id,
        posted_by: userId,
      })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, message: 'Job listing posted', job });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update airline expectations (enterprise-managed record)
exports.updateAirlineExpectations = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (!['POST', 'PUT'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, airlineExpectationId, updates } = req.body;
    if (!userId || !updates) return res.status(400).json({ error: 'userId and updates required' });

    const { data: profile } = await supabase
      .from('profiles').select('enterprise_access').eq('id', userId).single();
    if (!profile?.enterprise_access) return res.status(403).json({ error: 'Enterprise access required' });

    const { data: account } = await supabase
      .from('enterprise_accounts').select('id').eq('profile_id', userId).single();
    if (!account) return res.status(400).json({ error: 'Enterprise account not found' });

    const allowedFields = [
      'pilot_expectations', 'recruitment_process', 'training_programs',
      'career_progression', 'company_culture', 'benefits_compensation',
      'base_locations', 'fleet_information', 'minimum_requirements',
      'preferred_qualifications', 'interview_process', 'contact_information',
      'airline_logo_url', 'airline_website', 'company_description'
    ];
    const safeUpdates = {};
    allowedFields.forEach(f => { if (updates[f] !== undefined) safeUpdates[f] = updates[f]; });

    let query;
    if (airlineExpectationId) {
      // Update specific record — must belong to this enterprise
      const { data: existing } = await supabase
        .from('airline_expectations').select('enterprise_account_id').eq('id', airlineExpectationId).single();
      if (existing?.enterprise_account_id && existing.enterprise_account_id !== account.id) {
        return res.status(403).json({ error: 'Cannot update another enterprise\'s expectation record' });
      }
      query = supabase.from('airline_expectations')
        .update({ ...safeUpdates, enterprise_account_id: account.id, last_updated_by: userId, is_enterprise_managed: true, last_updated: new Date().toISOString() })
        .eq('id', airlineExpectationId);
    } else {
      // Upsert by enterprise_account_id
      query = supabase.from('airline_expectations')
        .upsert({ ...safeUpdates, enterprise_account_id: account.id, last_updated_by: userId, is_enterprise_managed: true, last_updated: new Date().toISOString(), created_at: new Date().toISOString(), airline_name: updates.airline_name || 'Enterprise Airline' }, { onConflict: 'enterprise_account_id' });
    }

    const { data, error } = await query.select().single();
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ success: true, message: 'Airline expectations updated', data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Search pilot profiles (for enterprise/airline use — returns safe public data)
exports.searchPilotProfiles = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, minHours, maxHours, licenseType, icaoLevel, nationality, typeRating, limit = 20, offset = 0 } = req.query;

    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data: caller } = await supabase
      .from('profiles').select('enterprise_access').eq('id', userId).single();
    if (!caller?.enterprise_access) return res.status(403).json({ error: 'Enterprise access required' });

    let query = supabase
      .from('profiles')
      .select(`
        id, display_name, full_name, country, nationality,
        total_flight_hours, overall_recognition_score,
        language_icao_level, license_id, country_of_license,
        aircraft_rated_on, ratings, profile_image_url,
        english_proficiency_level, technical_skills_score,
        behavioral_sjt_score, behavioral_crm_assessment
      `)
      .eq('status', 'active')
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (minHours) query = query.gte('total_flight_hours', parseFloat(minHours));
    if (maxHours) query = query.lte('total_flight_hours', parseFloat(maxHours));
    if (icaoLevel) query = query.eq('language_icao_level', icaoLevel);
    if (nationality) query = query.ilike('nationality', `%${nationality}%`);
    if (typeRating) query = query.ilike('aircraft_rated_on', `%${typeRating}%`);

    const { data, error, count } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ pilots: data, total: count, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get enterprise pathway cards (published ones for the pathways page)
exports.getEnterprisePathwayCards = onRequest(async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { category, position_type, hiring_status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('enterprise_pathway_cards')
      .select(`*, enterprise_accounts(airline_name, airline_logo_url, airline_iata_code, airline_website, country)`)
      .eq('is_published', true)
      .limit(parseInt(limit))
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (position_type) query = query.eq('position_type', position_type);
    if (hiring_status) query = query.eq('hiring_status', hiring_status);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ cards: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
