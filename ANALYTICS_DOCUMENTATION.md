# Analytics & Performance Monitoring Documentation

## Overview

This application implements comprehensive analytics, performance monitoring, and error tracking to ensure optimal user experience and system reliability.

## Components

### 1. Analytics Infrastructure

#### Google Analytics 4 (GA4)
- **Location**: `src/lib/analytics.ts`
- **Features**:
  - Page view tracking
  - Custom event tracking
  - Conversion funnel tracking
  - User property tracking
  - Session management

#### Web Vitals Tracking
- **Location**: `src/lib/web-vitals.ts`
- **Metrics Tracked**:
  - LCP (Largest Contentful Paint)
  - INP (Interaction to Next Paint)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)

#### Sentry Error Tracking
- **Location**: `src/lib/sentry.ts`
- **Features**:
  - JavaScript error tracking
  - Performance monitoring
  - User context tracking
  - Breadcrumb tracking
  - Release tracking

#### Performance Monitoring
- **Location**: `src/lib/performance-monitor.ts`
- **Features**:
  - API response time tracking
  - Edge Function performance monitoring
  - Resource loading performance
  - Custom metric tracking

#### Database Query Monitoring
- **Location**: `src/lib/database-monitor.ts`
- **Features**:
  - Query execution time tracking
  - Slow query detection
  - Query pattern analysis
  - Error rate tracking

### 2. React Hooks

#### useAnalytics Hooks
- **Location**: `src/hooks/useAnalytics.ts`
- **Available Hooks**:
  - `usePageViewTracking()` - Track page views
  - `useEventTracking()` - Track custom events
  - `useConversionTracking()` - Track conversions
  - `useUserTracking()` - Track user actions
  - `usePerformanceTracking()` - Track performance metrics
  - `useErrorTracking()` - Track errors
  - `useFunnelTracking()` - Track conversion funnels
  - `useSignupFunnel()` - Pre-built signup funnel
  - `useEnrollmentFunnel()` - Pre-built enrollment funnel

### 3. UI Components

#### Consent Banner
- **Location**: `src/components/Analytics/ConsentBanner.tsx`
- **Features**:
  - GDPR compliant cookie consent
  - Granular preference controls
  - Consent persistence
  - Automatic re-consent after 1 year

#### Analytics Dashboard
- **Location**: `src/components/Analytics/AnalyticsDashboard.tsx`
- **Features**:
  - Real-time performance score
  - API performance metrics
  - Edge Function metrics
  - Web Vitals display
  - Session information

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_DEBUG=false

# Sentry Error Tracking
VITE_SENTRY_DSN=https://xxxxxxxxxxxxx@o1234.ingest.sentry.io/1234567
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE=1.0

# Environment
VITE_ENVIRONMENT=development
VITE_APP_VERSION=1.0.0

# Web Vitals
VITE_WEB_VITALS_ENABLED=true
```

### 2. Initialization

Analytics services are automatically initialized in `index.tsx`:

```typescript
import { initializeAnalyticsServices } from '@/src/lib/analytics-config';

// Initialize analytics services on app load
initializeAnalyticsServices();
```

### 3. Usage in Components

#### Track Page Views
```typescript
import { usePageViewTracking } from '@/src/hooks/useAnalytics';

function MyComponent() {
  usePageViewTracking();
  // ...
}
```

#### Track Custom Events
```typescript
import { useEventTracking } from '@/src/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent } = useEventTracking();

  const handleClick = () => {
    trackEvent({
      name: 'button_click',
      params: {
        button_id: 'submit',
        page: 'signup'
      }
    });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

#### Track Conversions
```typescript
import { useEnrollmentFunnel } from '@/src/hooks/useAnalytics';

function EnrollmentPage() {
  const { trackEnrollmentStart, trackEnrollmentComplete } = useEnrollmentFunnel();

  const handleStart = () => {
    trackEnrollmentStart('foundational');
  };

  const handleComplete = () => {
    trackEnrollmentComplete('foundational');
  };

  // ...
}
```

#### Track Errors
```typescript
import { useErrorTracking } from '@/src/hooks/useAnalytics';

function MyComponent() {
  const { trackError } = useErrorTracking();

  const handleAsyncOperation = async () => {
    try {
      await someOperation();
    } catch (error) {
      trackError(error as Error, {
        context: 'async_operation',
        component: 'MyComponent'
      });
    }
  };

  // ...
}
```

#### Add Consent Banner
```typescript
import { ConsentBanner } from '@/src/components/Analytics/ConsentBanner';

function App() {
  return (
    <>
      <ConsentBanner />
      {/* Your app content */}
    </>
  );
}
```

#### Display Analytics Dashboard
```typescript
import { AnalyticsDashboard } from '@/src/components/Analytics/AnalyticsDashboard';

function AdminPanel() {
  return (
    <div>
      <AnalyticsDashboard />
    </div>
  );
}
```

## Performance Thresholds

### Web Vitals
- **LCP**: Good < 2.5s, Needs Improvement < 4s, Poor > 4s
- **INP**: Good < 200ms, Needs Improvement < 500ms, Poor > 500ms
- **CLS**: Good < 0.1, Needs Improvement < 0.25, Poor > 0.25
- **FCP**: Good < 1.8s, Needs Improvement < 3s, Poor > 3s
- **TTFB**: Good < 800ms, Needs Improvement < 1800ms, Poor > 1800ms

### API Performance
- **Good**: < 500ms
- **Acceptable**: < 1000ms
- **Slow**: > 1000ms

### Edge Functions
- **Good**: < 200ms
- **Acceptable**: < 500ms
- **Slow**: > 500ms
- **Cold Start Rate**: Target < 10%

### Database Queries
- **Good**: < 100ms
- **Acceptable**: < 500ms
- **Slow**: > 1000ms

## GDPR Compliance

### Consent Management
- Users must grant consent before analytics tracking begins
- Consent is stored in localStorage with timestamp
- Consent expires after 1 year (GDPR requirement)
- Users can withdraw consent at any time
- Granular controls for different cookie types

### Data Collection
- Only collect necessary data
- Anonymize user data where possible
- Provide clear privacy policy
- Allow users to request data deletion

## Best Practices

### 1. Event Naming
- Use descriptive event names
- Use snake_case for event names
- Group related events with prefixes
- Example: `user_action`, `feature_usage`, `conversion_event`

### 2. Event Parameters
- Include relevant context
- Use consistent parameter names
- Avoid PII (Personally Identifiable Information)
- Limit parameter values to reasonable lengths

### 3. Error Tracking
- Track all unhandled errors
- Include relevant context
- Filter out expected errors
- Set appropriate error levels

### 4. Performance Monitoring
- Monitor critical user paths
- Set appropriate thresholds
- Review slow queries regularly
- Optimize based on data

### 5. Conversion Funnels
- Define clear funnel steps
- Track drop-off points
- Analyze conversion rates
- Optimize based on insights

## Troubleshooting

### Analytics Not Working
1. Check environment variables are set
2. Verify consent has been granted
3. Check browser console for errors
4. Ensure initialization is called

### Web Vitals Not Reporting
1. Check if Web Vitals is enabled
2. Verify browser supports Performance API
3. Check console for initialization errors

### Sentry Not Capturing Errors
1. Verify DSN is correct
2. Check Sentry dashboard for project status
3. Ensure Sentry is initialized before errors occur

### Performance Issues
1. Check Analytics Dashboard for slow metrics
2. Review API response times
3. Analyze database query performance
4. Check Edge Function cold starts

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **PII**: Avoid collecting personally identifiable information
3. **Data Minimization**: Only collect necessary data
4. **Consent**: Always obtain user consent
5. **Error Context**: Don't include sensitive data in error context

## Maintenance

### Regular Tasks
- Review analytics dashboards weekly
- Check error rates daily
- Monitor performance metrics
- Update documentation as needed
- Review and update thresholds

### Optimization
- Analyze slow queries monthly
- Review conversion funnels quarterly
- Update tracking based on user feedback
- Optimize based on performance data

## Support

For issues or questions:
1. Check this documentation first
2. Review component source code
3. Check browser console for errors
4. Review environment configuration
5. Contact development team

## Version History

- **v1.0.0** (2026-04-18): Initial implementation
  - Google Analytics 4 integration
  - Web Vitals tracking
  - Sentry error tracking
  - Performance monitoring
  - GDPR compliance
  - Analytics dashboard
