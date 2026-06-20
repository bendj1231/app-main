// STUB — Supabase client removed. Migrate to Worker API.
// This file exists to prevent build errors while other files are being migrated.
// TODO: Remove after all imports are replaced with Worker calls.
const noopChannel = {
  on: () => noopChannel,
  subscribe: () => ({ unsubscribe: () => {} }),
};
export const supabase = {
  channel: () => noopChannel,
  removeChannel: () => {},
  removeAllChannels: () => {},
} as any;
