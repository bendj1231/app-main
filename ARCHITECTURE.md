# PilotRecognition.com — System Architecture

**Document Reference:** PR-SYS-ARCH-001  
**Version:** 1.0  
**Last Updated:** 16 June 2026  

---

## 1. Overview

PilotRecognition.com is a multi-domain, multi-tenant React application serving three distinct products from a single codebase:

| Property | Domain | Purpose |
|---|---|---|
| **PilotRecognition** | `pilotrecognition.com` | Core platform — pilot profiles, verification, pathways |
| **PilotCareerPathways** | `pilotcareerpathways.com` | Airline pathway discovery and matching |
| **PilotShortage** | `pilotshortage.org` | Industry advocacy and coalition building |

The app uses domain-based routing at runtime to render the correct experience without separate builds.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Router** | React Router v6 (BrowserRouter) |
| **Styling** | Tailwind CSS + inline styles for glass-morphism effects |
| **Auth** | Auth0 (Universal Login) + Supabase Auth (Magic Link / OAuth) |
| **State Management** | React Context (AuthContext, ThemeContext) |
| **Animation** | Framer Motion + CSS keyframes |
| **Shaders** | `@paper-design/shaders-react` (MeshGradient backgrounds) |

---

## 3. Monorepo Structure

```
app-main/
├── index.tsx                    # Entry point — BrowserRouter + Auth0 + AuthProvider
├── src/
│   ├── components/
│   │   ├── App.tsx              # Root App — state, profile fetching, nav
│   │   ├── ui/Styles.tsx        # Global CSS (loading overlay, keyframes, etc.)
│   │   └── ErrorBoundary.tsx    # Top-level error boundary
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth state, login/logout, OTP, profile sync
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   ├── url-validator.ts   # safeRedirect — prevents open redirects
│   │   └── auth0.ts             # Auth0 config helpers
│   └── routes/
│       └── AppRoutes.tsx        # All routes — domain routing + lazy imports
│
├── components/website/
│   ├── components/              # Page components (HomePage, TopNavbar, etc.)
│   ├── pages/                   # Standalone pages (DataControllerAgreement, etc.)
│   └── context/ThemeContext.tsx # Dark/light mode
│
├── app/                         # Next.js-style app directory (some routes)
├── portal/                      # Legacy portal build assets
├── docs/                        # Architecture & planning documents
└── dist/                        # Vite build output
```

---

## 4. Routing Architecture

### 4.1 Domain Router (`AppRoutes.tsx`)

Runtime domain detection happens before any `<Routes>` render:

```
pilotshortage.org       → ShortageApp
careerpathways...       → CareerPathwaysApp
platform...             → UnifiedPilotPlatform
wallet...               → WalletRouter
localhost (no params)   → DevDomainSelector

fallback                → Full <Routes> tree
```

### 4.2 Route Categories

| Category | Pattern | Example |
|---|---|---|
| **Public marketing** | `/`, `/about`, `/faq` | Home, About, Pricing |
| **Auth** | `/flight-deck-login`, `/become-member` | Login, Signup, DCA, Email confirmation |
| **Programs** | `/foundational-program`, `/transition-program` | Course content |
| **Pathways** | `/programs`, `/discover-pathways` | Airline listings |
| **Profile** | `/professional-profile`, `/recognition-plus` | Pilot dashboard |
| **Verification** | `/background-check`, `/verification-service` | Veremark integration |
| **Enterprise** | `/enterprise-access`, `/enterprise` | Airline operator portal |
| **Admin** | `/moa-executive-summary`, `/investor-pitch` | Internal tools |

### 4.3 Lazy Loading Strategy

Every page component is wrapped in `React.lazy()` with a single `Suspense` boundary:

```tsx
const HomePage = lazy(() => import('@/components/website/components/home/HomePage'));

<Suspense fallback={<LoadingFallback />}>
  <Routes>...</Routes>
</Suspense>
```

This means switching routes triggers a chunk download. The perceived lag comes from:
1. Network round-trip for the JS chunk
2. React rendering the new component tree
3. Any data fetching inside the new page

**Mitigation:** Hover-based chunk preloading in `TopNavbar.tsx` (see §9).

---

## 5. Authentication Architecture

### 5.1 Dual-Auth System

| System | Used For | Flow |
|---|---|---|
| **Auth0** | Primary login (password, social) | Universal Login → callback → token |
| **Supabase Auth** | Magic link (OTP), Google OAuth | `signInWithOtp()` / `signInWithOAuth()` |

### 5.2 Auth Flows

**Login (existing user):**
```
FlightDeckLoginPage
  → Auth0 Universal Login OR Supabase Magic Link
  → OAuthCallback / Email verification
  → AuthContext.handlePostLogin()
  → navigate('/platform')  ← post-auth redirect
```

**Signup (new user):**
```
BecomeMemberPage
  → "Sign up with Google" → DataControllerAgreement → Google OAuth → /become-member?setup=1
  → "Sign up with Email" → DataControllerAgreement → /email-confirmation → Magic Link → /become-member?setup=1
```

### 5.3 AuthContext Responsibilities

- `currentUser` — decoded JWT / Supabase user
- `userProfile` — Supabase `profiles` row (pilot_id, hours, scores)
- `sendOtp(email, redirectTo?)` — sends magic link with configurable redirect
- `verifyOtp(email, token)` — verifies email OTP
- Session management: idle timeout (15 min), vault key flush on logout/tab close

---

## 6. Data Layer — Three-Database Polyglot

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Supabase     │     │   Neon (PG17)   │     │  MongoDB Atlas  │
│  (ap-southeast-2)   │     │  (ap-southeast-1)   │     │  (ap-southeast-1)   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ • Auth / RLS    │     │ • OEM data      │     │ • Raw aviation  │
│ • profiles      │     │ • Pathway cards │     │   API payloads  │
│ • credentials   │     │ • IPFS CID index│     │ • Flight telemetry│
│ • wallet VCs    │     │                 │     │ • Logbook JSON  │
│ • user_activity │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Database | Role | Connection |
|---|---|---|
| **Supabase** | Auth, profiles, activity logs, wallet credentials | `src/lib/supabase.ts` |
| **Neon** | Pathway cards, OEM partner data, IPFS indexing | `src/lib/neon.ts` |
| **MongoDB** | Flight logbook JSON, telemetry, raw API responses | `src/lib/mongodb.ts` |

---

## 7. Component Architecture

### 7.1 Page Layout Pattern

Most marketing pages follow:

```
<div className="relative min-h-screen">
  {/* Shader background */}
  <MeshGradient colors={[...]} speed={0.22} />
  <div className="absolute inset-0 bg-gradient-to-b ..." />

  {/* TopNavbar */}
  <TopNavbar onNavigate={...} />

  {/* Page content */}
  <main>...</main>

  {/* Footer */}
  <Footer />
</div>
```

### 7.2 TopNavbar

- `onNavigate` prop — receives string page keys, converts to router navigation
- Domain-aware styling (`careerpathways` gets different layout)
- Conditional rendering based on `currentUser` + `currentPage`
- Logged-in state on home page: hides profile/bell/gear, shows "Go to Platform"

### 7.3 Glass-Morphism Animation Pattern

Reusable animation system applied to login/signup cards:

```css
@keyframes glassMaterialize {
  0%   { opacity: 0; transform: scale(0.92) translateY(20px); filter: blur(12px); }
  60%  { opacity: 1; transform: scale(1.01) translateY(-2px); filter: blur(2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
}
```

Applied via inline `style={{ animation: 'glassMaterialize 0.8s ...' }}`.

---

## 8. Security Architecture

### 8.1 Key Controls

| Control | Implementation |
|---|---|
| **Open Redirect Prevention** | `safeRedirect()` in `url-validator.ts` — whitelist of allowed domains |
| **CSRF Protection** | HttpOnly cookie, validated on POST |
| **Client-Side Encryption** | AES-256-GCM (`vault.ts`) — encrypts before Supabase write |
| **Session Timeout** | 15-min idle timer → auto logout + vault key flush |
| **Age Gate** | DOB check at signup — minors blocked from Terminal 3 |
| **Data Controller Agreement** | 12-article consent modal + public DCA page |

### 8.2 Zero-Knowledge Storage

- Server stores only AES-256-GCM ciphertext
- Encryption key derived client-side from user password + salt
- Server cannot read, alter, or decrypt pilot credential payloads

---

## 9. Performance Optimizations

### 9.1 Current

| Technique | Location |
|---|---|
| Code splitting | Every route is `React.lazy()` |
| Hover preloading | `TopNavbar.preloadPage()` — imports chunks on mouse enter |
| Memoized dropdowns | `DropdownItem` wrapped in `React.memo` |
| Shader lazy init | `MeshGradient` only renders when visible |

### 9.2 Loading States

- `LoadingFallback` — branded loader with animated progress bar (replaced plain "Loading...")
- `CareerPathwaysLoadingFallback` — domain-specific white loader

---

## 10. Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `VITE_AUTH0_AUDIENCE` | Auth0 API audience |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEON_DATABASE_URL` | Neon PostgreSQL connection |
| `MONGODB_URI` | MongoDB Atlas connection |

---

## 11. Build & Deploy

```bash
# Local dev
npm run dev          # Vite dev server on localhost:3000

# Production build
npm run build        # Outputs to dist/

# Deploy
# GitHub → Netlify (auto-deploy on main branch push)
```

---

## 12. Key Files Reference

| File | Responsibility |
|---|---|
| `index.tsx` | React root render, BrowserRouter, global providers |
| `src/components/App.tsx` | Root state, profile fetching, `navigateTo()` helper |
| `src/routes/AppRoutes.tsx` | All route definitions, domain routing, lazy imports |
| `src/contexts/AuthContext.tsx` | Authentication state, login/logout/OTP/Magic Link |
| `components/website/components/TopNavbar.tsx` | Primary navigation, domain-aware |
| `components/website/components/FlightDeckLoginPage.tsx` | Login page with glass animations |
| `components/website/components/BecomeMemberPage.tsx` | Signup page with glass animations |
| `components/website/pages/EmailSignupConfirmPage.tsx` | Email OTP confirmation step |
| `components/website/pages/DataControllerAgreementPage.tsx` | Legal consent before signup |
| `src/lib/url-validator.ts` | Safe redirect validation |

---

*End of Document*
