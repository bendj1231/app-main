# Concept Hero Section: "The Terminal"

## Overview
A cinematic, immersive hero section designed for the main pilotrecognition.com landing page. Inspired by flight deck aesthetics, air traffic control interfaces, and the gravity of aviation professionalism.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [NAV: Logo | Platform | Programs | Pathways | Recognition | Enterprise]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌────────────────────────────────┐    ┌──────────────────────────────┐   │
│   │                                │    │                              │   │
│   │   "Your Career                │    │    [LIVE FLIGHT DECK]       │   │
│   │    Is A Flight Plan           │    │                              │   │
│   │    Without Waypoints"         │    │    ┌────────────────────┐   │   │
│   │                                │    │    │  RECOGNITION+      │   │   │
│   │   Subhead: Verification-first │    │    │  ┌─────────────┐    │   │   │
│   │   pilot profiles that airlines│    │    │  │ LICENSE ✓   │    │   │   │
│   │   actually trust.             │    │    │  │ MEDICAL ✓   │    │   │   │
│   │                                │    │    │  │ ELP ✓       │    │   │   │
│   │   [CREATE FREE ACCOUNT]       │    │    │  │ HOURS ▶     │   │   │   │
│   │   [EXPLORE PATHWAYS]          │    │    │  └─────────────┘    │   │   │
│   │                                │    │    │                     │   │   │
│   │   ┌─────────────────────────┐   │    │    │  15,000+ Pilots     │   │   │
│   │   │ Trust Bar: Etihad ·    │   │    │    │  Verified Weekly  │   │   │
│   │   │ Airbus · CAAP · FAA    │   │    │    └────────────────────┘   │   │
│   │   └─────────────────────────┘   │    │                              │   │
│   └────────────────────────────────┘    └──────────────────────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  SCROLL INDICATOR: "See The Four Floors" + animated down arrow     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Visual Design System

### Color Palette
```css
--terminal-bg: #0a0f1c;        /* Deep space blue-black */
--terminal-panel: #111827;      /* Panel background */
--hud-cyan: #00b4d8;           /* Primary accent - HUD cyan */
--hud-amber: #ff9f1c;          /* Warning/attention - amber */
--hud-green: #10b981;          /* Verified/success */
--hud-red: #c41e3a;            /* PSA red for emphasis */
--glass-border: rgba(255,255,255,0.08);
--text-primary: #ffffff;
--text-secondary: #94a3b8;     /* Slate 400 */
```

### Typography
```css
Headlines: "Inter" or system-ui, 700 weight
   - H1: 72px/80px, tracking-tight
   - Accent word: "Flight Plan" in hud-cyan

Subheads: 18px/28px, font-normal, text-secondary

Terminal Text: "JetBrains Mono" or monospace
   - For "verification badges" and stats
   - 14px, uppercase, tracking-wider
```

---

## Section Breakdown

### 1. LEFT COLUMN: The Problem/Solution Statement

**Main Headline (staggered reveal animation):**
```
Line 1: "Your Career"           [fade in, 0ms]
Line 2: "Is A Flight Plan"    [fade in, 200ms, cyan color]
Line 3: "Without Waypoints"   [fade in, 400ms]
```

**Subhead (typewriter effect):**
"Verification-first pilot profiles that airlines actually trust. No more CV black holes. No more 'we'll call you.' Just cryptographic proof of who you are and what you've flown."

**CTA Buttons:**
- Primary: "Create Free Account" (red bg, white text, glow on hover)
- Secondary: "Explore Pathways" (transparent, cyan border)

**Trust Bar:**
Logos: Etihad Airways | Airbus | CAAP | FAA | IATA
(Fade in with 100ms stagger)

---

### 2. RIGHT COLUMN: The Live Flight Deck

A glass-morphism panel that looks like an EFB (Electronic Flight Bag) or FMS display.

```
┌─────────────────────────────────────┐
│  ◉ LIVE  │  RECOGNITION+ DASHBOARD │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │  PILOT CREDENTIAL STATUS    │    │
│  │                             │    │
│  │  ✓ LICENSE    [VERIFIED]    │    │
│  │  ✓ MEDICAL    [VERIFIED]    │    │
│  │  ✓ ELP        [VERIFIED]    │    │
│  │  ▶ HOURS      [PENDING]     │    │
│  │                             │    │
│  │  ─────────────────────────  │    │
│  │  Terminal Status: TIER 3    │    │
│  │  [🟢 ACTIVE]                │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  > 15,000 pilots verified   │    │
│  │  > 847 pathways active       │    │
│  │  > 12 airlines pulling      │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

**Panel Effects:**
- `backdrop-filter: blur(24px) saturate(130%)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Subtle animated scanline every 8 seconds
- Blinking cursor on "pending" items

---

### 3. BOTTOM: The Scroll Indicator

**The Four Floors Navigation:**
Instead of a standard scroll indicator, show the "Four Floors" concept as a horizontal mini-map:

```
"The Pipeline Problem"

[Floor 0: Graduate] — [Floor 1: Instructor] — [Floor 2: Stuck] — [Floor 3: Airline]
      ◉                    ○                    ○                   ○
   (click to            (locked)            (locked)           (locked)
   scroll to)
```

On hover, reveal:
- Floor 0: "200 hrs, no job, $50K debt"
- Floor 1: "5,000 hrs, no pathway forward"
- Floor 2: "The collapse point. This is where we help."
- Floor 3: "12+ years, seniority trap"

---

## Animations & Interactions

### Entrance Sequence (1.5s total)

| Element | Animation | Duration | Delay | Easing |
|---------|-------------|----------|-------|--------|
| Background | Fade from black | 800ms | 0ms | ease-out |
| Headline Line 1 | Slide up + fade | 600ms | 200ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Headline Line 2 | Slide up + fade | 600ms | 400ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Headline Line 3 | Slide up + fade | 600ms | 600ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Subhead | Typewriter reveal | 1200ms | 800ms | steps(40) |
| CTA Buttons | Scale + fade | 400ms | 1400ms | ease-out |
| Flight Deck Panel | Slide from right + blur | 800ms | 600ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Trust Bar | Fade + stagger logos | 600ms | 1600ms | ease-out |

### Continuous Animations

**Flight Deck Panel:**
- Scanline: Horizontal line sweeps down every 8s (opacity 0.1, height 2px)
- Blinking cursor on pending items: 1s blink interval
- Subtle "breathing" glow on panel border (box-shadow pulse, 4s cycle)

**Background:**
- Very subtle moving grid pattern (CSS background-position animation)
- Occasional "radar sweep" arc (SVG, opacity 0.03, 20s rotation)

### Hover States

**Primary CTA:**
- Scale: 1.05
- Box-shadow: `0 0 40px rgba(196, 30, 58, 0.4)` (red glow)
- Background brightens 10%

**Flight Deck Panel:**
- Scale: 1.02
- Border brightens to `rgba(255,255,255,0.15)`
- Internal content subtle parallax shift

---

## Responsive Behavior

### Desktop (1440px+)
- Two-column layout as described
- Full animations enabled

### Tablet (768px-1439px)
- Stack: Headline → Flight Deck → CTAs → Trust Bar
- Flight Deck becomes centered, max-width 500px
- Reduced animation complexity

### Mobile (<768px)
- Single column, full-width
- Headline: 40px/48px
- Flight Deck: Simplified, no scanline animation
- Trust Bar: Horizontal scroll or 2x2 grid
- Four Floors: Vertical stack, not horizontal

---

## Technical Implementation Notes

### Performance
- Use `transform` and `opacity` only for animations
- `will-change: transform` on Flight Deck panel
- Lazy load background pattern
- Respect `prefers-reduced-motion`

### Accessibility
- Headlines: `aria-label` with full text
- Typewriter: Include complete text visually, animation decorative only
- Color contrast: All text meets WCAG AA
- Focus states: Visible cyan outline on all interactive elements

### Key Components to Build

```typescript
// TerminalHero.tsx
interface TerminalHeroProps {
  headline: string[];        // ["Your Career", "Is A Flight Plan", "Without Waypoints"]
  accentLine: number;        // 1 (which line gets cyan color)
  subhead: string;
  flightDeckData: {
    credentials: Array<{
      type: string;
      status: 'verified' | 'pending' | 'expired';
    }>;
    terminalStatus: 'tier1' | 'tier2' | 'tier3';
    stats: {
      pilotsVerified: number;
      activePathways: number;
      pullingAirlines: number;
    };
  };
  trustLogos: string[];
  fourFloors: FloorData[];
}
```

---

## Copy Variations

### Version A: Problem-First (PilotShortage tone)
"Your Career Is A Flight Plan Without Waypoints"
"15,000+ trained pilots are stuck. Airlines can't find them. The system is broken. We're building the fix."

### Version B: Solution-First (Recognition+ tone)  
"Verified Pilots. Trusted By Airlines."
"Cryptographic proof of your flight hours, medical, and ratings. No more manual verification. No more waiting."

### Version C: Aspirational (Enterprise tone)
"The Global Standard For Pilot Verification"
"Connecting the world's aviation authorities, training organizations, and operators through one trusted protocol."

---

## Assets Needed

| Asset | Type | Description |
|-------|------|-------------|
| etihad-logo-white | SVG | White version, 80px width |
| airbus-logo-white | SVG | White version, 80px width |
| caap-logo-white | SVG | White version, 60px width |
| faa-logo-white | SVG | White version, 60px width |
| grid-pattern.svg | SVG | Subtle 100px grid, 0.03 opacity |
| radar-sweep.svg | SVG | Single arc, for background animation |
| aircraft-silhouette | PNG | Optional: Subtle background element |

---

## Next Steps

1. **Get feedback** on concept direction (A, B, or C tone)
2. **Asset collection** - gather partner logos
3. **Prototype** - build static version in `TerminalHero.tsx`
4. **Animation pass** - add entrance and continuous animations
5. **A/B test** - against current hero to measure engagement

---

*Concept: Terminal Hero Section v1.0*
*For: pilotrecognition.com main landing*
*Inspired by: Flight deck UIs, air traffic control, MSFS aesthetic*
