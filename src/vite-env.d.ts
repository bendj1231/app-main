/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_MFB_CLIENT_ID: string
  readonly VITE_WALT_ISSUER_URL: string
  readonly VITE_WALT_ISSUER_DID: string
  readonly VITE_WALT_WALLET_URL: string
  // Add other VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
