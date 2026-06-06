<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PilotRecognition.com

A Vite + React + TypeScript web application for the PilotRecognition platform. The app delivers a multi-brand aviation career experience that includes pilot recognition profiles, EBT/CBTA training, foundation and transition programs, AI-powered career matching, and airline pathway support.

## App overview

- Public-facing website built with modern React and Vite.
- Multi-domain branding support in `app/page.tsx`:
  - `pilotshortage.org` → renders `PilotShortageUCF`
  - `pilotcareerpathways.com` → renders `PilotShortageUCF`
  - `pilotterminal.com` → renders `BrandSwitchWrapper`
  - default site → renders `HomePage`
- Uses a combination of static pages and dynamic brand experiences.
- Integrates with a broad ecosystem of services, including Auth0, Stripe, Supabase, Firebase, Sentry, Three.js, Recharts, and Google GenAI.

## Key features

- Industry recognition and career pathway landing experience
- Program onboarding and pilot journey content
- Domain-specific brand routing for multiple aviation-focused brands
- Developer tooling for building, testing, linting, and previewing

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS / shadcn UI
- Auth0
- Stripe
- Supabase
- Firebase
- Sentry
- Three.js, React Three Fiber, Framer Motion
- Google GenAI

## Repository layout

- `app/` — primary page entry and static route structure
- `components/` — shared UI and website components
- `portal/` — pilot and partner portal experiences
- `docs/` — product and architecture documentation
- `scripts/` — build and utility scripts
- `public/` — static assets
- `src/` — application source where applicable
- `types/` — shared type definitions

## Developer quick start

- `app/page.tsx` is the main site entry point and handles domain-based brand routing.
- Use `HomePage` for the default brand experience.
- `PilotShortageUCF` supports the `pilotshortage.org` and `pilotcareerpathways.com` brands.
- `BrandSwitchWrapper` supports the `pilotterminal.com` brand and local brand switching.
- Add or inspect brand routes under `app/` and page components in `portal/`, `career-pathways/`, `discover-programs/`, `for-airlines/`, and related directories.

## Environment and configuration

- `vite.config.ts` configures the development server, aliasing `@` to the repository root.
- `tsconfig.json` defines path mapping for `@/*` and uses modern ES2022 tooling.
- Environment values are populated from `.env.local` or `.env.local.example`.
- Core client-side env vars include:
  - `GEMINI_API_KEY`
  - `VITE_AUTH0_DOMAIN`
  - `VITE_AUTH0_CLIENT_ID`
  - `VITE_AUTH0_AUDIENCE`
  - `VITE_AUTH0_CALLBACK_URL`
  - `VITE_STRIPE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SENTRY_DSN`
- Server or secret-only env vars include:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `VAULT_MASTER_SECRET`
  - `WALT_ISSUER_JWK`

- The app uses build-time splitting for large third-party packages and custom vendor chunking.
- Do not store secrets in client-side code or `vite.config.ts`.

- `vite.config.ts` configures the development server, aliasing `@` to the repository root.
- `tsconfig.json` defines path mapping for `@/*` and uses modern ES2022 tooling.
- The app uses build-time splitting for large third-party packages and custom vendor chunking.
- Do not store secrets in client-side code or `vite.config.ts`.

## Local development

**Prerequisites:** Node.js

1. Install dependencies
   ```bash
   npm install
   ```
2. Add a local environment file
   ```bash
   cp .env.local.example .env.local
   ```
   If `.env.local.example` is not present, create `.env.local` manually.
3. Set required env vars
   - `GEMINI_API_KEY`
   - any other service keys used in your local environment
4. Start the dev server
   ```bash
   npm run dev
   ```

## Build and preview

```bash
npm run build
npm run preview
```

## Testing and linting

```bash
npm test
npm run test:watch
npm run lint
```

## Notes for maintainers

- `package.json` includes `prebuild` step: `npx tsx scripts/generate-framework-html.ts`
- `vite.config.ts` drops console statements in production builds and uses vendor chunking for performance
- `app/page.tsx` is the main entry point for brand selection and site routing

## Recommended next steps

- Document any required service environment variables and provide a `.env.local.example`
- Add a short developer section for branded domain testing
- Keep the README in sync with app route and page changes
