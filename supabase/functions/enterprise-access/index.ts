import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { 
  SecurityMiddleware, 
  RATE_LIMIT_CONFIGS, 
  Logger, 
  PerformanceMonitor, 
  generateRequestId 
} from '../_shared/security-middleware.ts'

serve(async (req) => {
  const requestId = generateRequestId()
  PerformanceMonitor.startTimer(requestId)
  
  try {
    Logger.info('Enterprise access request started', { method: req.method }, requestId)
    
    // Rate limiting check
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `enterprise-access:${clientId}`,
      RATE_LIMIT_CONFIGS.signup // Use same rate limit as signup
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many submissions. Please try again later.',
        retryAfter: rateLimitResult.resetTime
      }, 429, { 'Retry-After': '3600' })
    }

    // CSRF protection for POST requests
    if (req.method === 'POST') {
      if (!SecurityMiddleware.validateCSRFToken(req)) {
        Logger.warn('Invalid CSRF token', {}, requestId)
        return SecurityMiddleware.createErrorResponse('Invalid CSRF token', 403, requestId)
      }
    }

    const formData = await req.json()

    // Input validation
    if (!formData.email || !formData.company || !formData.name) {
      Logger.warn('Missing required fields', {}, requestId)
      return SecurityMiddleware.createErrorResponse('Name, email, and company are required', 400, requestId)
    }

    if (!SecurityMiddleware.isValidEmail(formData.email)) {
      Logger.warn('Invalid email format', { email: formData.email }, requestId)
      return SecurityMiddleware.createErrorResponse('Invalid email format', 400, requestId)
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
    `.trim()

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      Logger.error('RESEND_API_KEY not configured', {}, requestId)
      return SecurityMiddleware.createErrorResponse('Email service not configured', 500, requestId)
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'WingMentor Enterprise <enterprise@pilotrecognition.com>',
        to: ['enterprise@pilotrecognition.com'],
        subject: `Enterprise Access Request - ${formData.company}`,
        text: emailBody,
        reply_to: formData.email,
      }),
    })

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text()
      Logger.error('Resend API error', { status: resendResponse.status, error: errorText }, requestId)
      return SecurityMiddleware.createErrorResponse('Failed to send email', 500, requestId)
    }

    const resendData = await resendResponse.json()
    Logger.info('Email sent successfully', { emailId: resendData.id }, requestId)

    const response = SecurityMiddleware.createResponse({
      success: true,
      message: 'Your request has been sent successfully',
      emailId: resendData.id
    })

    // Set CSRF token for future requests
    const csrfToken = SecurityMiddleware.generateCSRFToken()
    SecurityMiddleware.setCSRFCookie(response, csrfToken)
    response.headers.append('X-CSRF-Token', csrfToken)

    PerformanceMonitor.endTimer(requestId)
    return response

  } catch (error) {
    Logger.error('Unexpected error', { error: error.message }, requestId)
    PerformanceMonitor.endTimer(requestId)
    return SecurityMiddleware.createErrorResponse('An unexpected error occurred', 500, requestId)
  }
})
