#!/bin/bash
# Keep Supabase Auth Nodes Alive — Oracle VM Cron Script
# =======================================================
# Purpose: Prevents free-tier auto-pause by pinging auth health endpoints
# Install: Add to crontab: 0 0 */3 * * /path/to/keep-alive-oracle-vm.sh
#
# Environment vars (set in ~/.bashrc or Oracle VM systemd):
#   SUPABASE_URL_SYDNEY=https://gkbhgrozrzhalnjherfu.supabase.co
#   SUPABASE_ANON_KEY_SYDNEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYmhncm96cnpoYWxuamhlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzQxOTEsImV4cCI6MjA4OTExMDE5MX0.m49ula5RMn4uEtRTk6l9q_6VElyPrY1YPMj-gtUYRsY
#   SUPABASE_URL_SINGAPORE=https://xdrsipgwodmnhizxdsnp.supabase.co
#   SUPABASE_ANON_KEY_SINGAPORE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcnNpcGd3b2Rtbmhpenhkc25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MjIyMTYsImV4cCI6MjA5NzI5ODIxNn0.FWvIafAh2APggWZRQKV9BmMFqViiw2kzEsubibLuy34

set -euo pipefail

LOGFILE="${HOME}/logs/keep-alive.log"
mkdir -p "$(dirname "$LOGFILE")"

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOGFILE"
}

ping_node() {
  local name="$1"
  local url="${2:-}"
  local key="${3:-}"

  if [[ -z "$url" || -z "$key" ]]; then
    log "SKIP $name — URL or key not set"
    return 0
  fi

  if curl -sfL -H "apikey: $key" "$url/rest/v1/" > /dev/null 2>&1; then
    log "OK   $name — ping successful"
  else
    log "FAIL $name — ping failed (node may be down or URL incorrect)"
  fi
}

log "=== Keep-alive run started ==="

ping_node "sydney"    "$SUPABASE_URL_SYDNEY"    "$SUPABASE_ANON_KEY_SYDNEY"
ping_node "singapore" "$SUPABASE_URL_SINGAPORE" "$SUPABASE_ANON_KEY_SINGAPORE"

log "=== Keep-alive run complete ==="
