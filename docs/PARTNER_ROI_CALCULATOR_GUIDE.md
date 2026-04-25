# Partner ROI Calculator Guide

## Overview

This guide explains how to use the ROI calculators for flight schools and airlines to demonstrate the financial benefits of partnering with Atlas Aviation.

## Flight School ROI Calculator

### Component Location
`/components/FlightSchoolROICalculator.tsx`

### Usage

```tsx
import { FlightSchoolROICalculator } from '../components/FlightSchoolROICalculator';

// Embedded in existing page
<FlightSchoolROICalculator isEmbedded={true} />

// Full page calculator
<FlightSchoolROICalculator />
```

### Input Parameters

1. **Number of Active Students** (50-1,000)
   - Total number of currently enrolled students
   - Affects revenue calculations from subscriptions and enrollment increases

2. **Current Placement Rate** (5-50%)
   - Percentage of students placed within 6 months of graduation
   - Baseline for measuring improvement

3. **Target Placement Rate with Atlas** (20-70%)
   - Expected placement rate after partnership implementation
   - Based on historical performance of similar schools

4. **Average Tuition per Student** ($10,000-$200,000)
   - Average tuition charged per student
   - Used to calculate enrollment increase revenue

5. **Partnership Tier**
   - **Basic**: Free, no revenue sharing
   - **Premium**: $30,000/year, 15% subscription revenue share, $500 placement fee
   - **Strategic**: $50,000/year, 25% subscription revenue share, $1,000 placement fee

### Calculations

#### Revenue Sources

1. **Subscription Revenue Share**
   ```
   Student Count × $50/month × 12 months × Revenue Share %
   ```

2. **Placement Success Fees**
   ```
   Additional Placements × Placement Fee per Tier
   ```

3. **Increased Enrollment Revenue**
   ```
   (Student Count × 10%) × Average Tuition
   ```

#### ROI Calculation
```
Net ROI = Total Revenue - Partnership Cost
ROI % = (Net ROI / Partnership Cost) × 100
```

### Example Output

For a 200-student school with Premium partnership:

- **Partnership Cost**: $30,000
- **Subscription Revenue**: $18,000 (200 × $50 × 12 × 15%)
- **Placement Fees**: $22,000 (44 additional placements × $500)
- **Enrollment Revenue**: $150,000 (20 additional students × $75,000)
- **Total Revenue**: $190,000
- **Net ROI**: $160,000
- **ROI %**: 433%

---

## Airline ROI Calculator

### Component Location
`/components/AirlineROICalculator.tsx`

### Usage

```tsx
import { AirlineROICalculator } from '../components/AirlineROICalculator';

// Embedded in existing page
<AirlineROICalculator isEmbedded={true} />

// Full page calculator
<AirlineROICalculator />
```

### Input Parameters

1. **Annual Pilot Hires** (10-200)
   - Number of pilots hired annually
   - Affects all savings calculations

2. **Current Cost Per Hire** ($5,000-$50,000)
   - Total cost to hire one pilot including advertising, agency fees, interviews
   - Industry average: $15,000-$25,000

3. **Current Time-to-Hire** (3-18 months)
   - Average time from job posting to onboarding
   - Industry average: 6-12 months

4. **Current First-Year Retention Rate** (50-90%)
   - Percentage of new hires who stay beyond first year
   - Industry average: 70-75%

5. **Partnership Model**
   - **Standard**: $3,000 per successful hire, no monthly fee
   - **Premium**: $15,000/month + $1,500 per hire
   - **Strategic**: Revenue share model (20% of placement value)

### Calculations

#### Cost Savings

1. **Cost-Per-Hire Savings**
   ```
   (Current Cost - New Cost) × Annual Hires
   New Cost = Current Cost × 60% (40% reduction)
   ```

2. **Time Savings**
   ```
   (Current Time - New Time) × $160/hour × Annual Hires
   New Time = Current Time × 40% (60% reduction)
   ```

3. **Retention Savings**
   ```
   Annual Hires × Retention Improvement % × Current Cost Per Hire
   Retention Improvement = 15% (fixed improvement)
   ```

#### Partnership Costs

**Standard Model:**
```
Total Cost = Annual Hires × $3,000
```

**Premium Model:**
```
Total Cost = ($15,000 × 12) + (Annual Hires × $1,500)
```

**Strategic Model:**
```
Total Cost = Annual Hires × (Pilot Salary × 50% × 20%)
```

#### ROI Calculation
```
Net Savings = Total Savings - Total Cost
ROI % = (Net Savings / Total Cost) × 100
```

### Example Output

For a 50-pilot airline with Premium partnership:

- **Partnership Cost**: $187,500 ($180,000 subscription + $7,500 per-hire fees)
- **Cost-Per-Hire Savings**: $400,000 (50 × $8,000 savings)
- **Time Savings**: $432,000 (50 × $8,640 time savings)
- **Retention Savings**: $150,000 (50 × $3,000 retention savings)
- **Total Savings**: $982,000
- **Net Savings**: $794,500
- **ROI %**: 324%

---

## Integration Examples

### Flight School Partnership Page

```tsx
import React from 'react';
import { FlightSchoolROICalculator } from '../components/FlightSchoolROICalculator';

export const FlightSchoolPartnershipPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Flight School Partnership</h1>
      <p className="text-gray-600 mb-8">
        Calculate your potential ROI with Atlas Aviation
      </p>
      <FlightSchoolROICalculator />
    </div>
  );
};
```

### Airline Partnership Page

```tsx
import React from 'react';
import { AirlineROICalculator } from '../components/AirlineROICalculator';

export const AirlinePartnershipPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">Airline Partnership</h1>
      <p className="text-gray-600 mb-8">
        Estimate your recruitment cost savings
      </p>
      <AirlineROICalculator />
    </div>
  );
};
```

### Embedded in Pitch Deck

```tsx
import React from 'react';
import { FlightSchoolROICalculator } from '../components/FlightSchoolROICalculator';

export const PartnershipSlide: React.FC = () => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Calculate Your ROI</h2>
      <FlightSchoolROICalculator isEmbedded={true} />
    </div>
  );
};
```

---

## Customization

### Modifying Revenue Share Rates

Edit the `subscriptionRevenueShare` object in `FlightSchoolROICalculator.tsx`:

```typescript
const subscriptionRevenueShare = {
  basic: 0,
  premium: 0.20, // Changed from 0.15 to 0.20
  strategic: 0.30, // Changed from 0.25 to 0.30
};
```

### Adding Custom Tiers

Add new tier to partnership objects:

```typescript
const partnershipCosts = {
  basic: 0,
  premium: 30000,
  strategic: 50000,
  enterprise: 100000, // New tier
};

const subscriptionRevenueShare = {
  basic: 0,
  premium: 0.15,
  strategic: 0.25,
  enterprise: 0.35, // New tier
};
```

### Adjusting Improvement Percentages

Modify the calculation logic:

```typescript
// Flight School: Enrollment increase
const enrollmentIncrease = Math.floor(studentCount * 0.15); // Changed from 0.10 to 0.15

// Airline: Cost reduction
const newCostPerHire = currentCostPerHire * 0.5; // Changed from 0.6 to 0.5 (50% reduction)
```

---

## Best Practices

### During Sales Calls

1. **Start with conservative estimates**
   - Use lower bound of input ranges
   - Set realistic expectations
   - Build credibility with achievable numbers

2. **Show tier comparisons**
   - Demonstrate value at each tier
   - Let partner choose based on budget
   - Highlight premium features

3. **Document assumptions**
   - Explain how calculations work
   - Provide transparency in methodology
   - Reference historical performance

### For Marketing Materials

1. **Use average scenarios**
   - 100-200 student schools
   - 50-100 pilot airlines
   - Premium partnership tier

2. **Highlight key metrics**
   - Focus on ROI percentage
   - Show time-to-value
   - Emphasize competitive advantage

3. **Include case studies**
   - Reference real examples
   - Show actual vs. projected
   - Build trust with data

### For Internal Planning

1. **Run sensitivity analysis**
   - Test different input combinations
   - Identify best-case and worst-case scenarios
   - Plan for variability

2. **Track actual performance**
   - Compare projections to results
   - Refine calculator assumptions
   - Improve accuracy over time

---

## Troubleshooting

### Calculator Not Updating

**Issue:** Slider changes not reflected in results

**Solution:** Ensure state is properly bound to input values

```typescript
// Correct
<input
  value={studentCount}
  onChange={(e) => setStudentCount(parseInt(e.target.value))}
/>

// Incorrect
<input
  defaultValue={studentCount}
  onChange={(e) => setStudentCount(parseInt(e.target.value))}
/>
```

### Negative ROI Displayed

**Issue:** ROI shows negative value

**Causes:**
- Partnership cost exceeds revenue
- Input parameters are unrealistic
- Tier doesn't match school size

**Solutions:**
- Adjust partnership tier
- Increase student count or placement rate
- Verify input ranges are appropriate

### Formatting Issues

**Issue:** Currency not displaying correctly

**Solution:** Ensure `Intl.NumberFormat` is supported in browser

```typescript
// Fallback for older browsers
const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  } catch (e) {
    return `$${value.toLocaleString()}`;
  }
};
```

---

## Support

For questions or issues with the ROI calculators:
- Email: support@atlasaviation.com
- Documentation: docs.atlasaviation.com/roi-calculators
- GitHub Issues: github.com/atlas-aviation/calculators

---

## Version History

- **v1.0** - Initial release (April 2024)
- **v1.1** - Added strategic partnership model (May 2024)
- **v1.2** - Improved UI and responsiveness (June 2024)
