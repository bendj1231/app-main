#!/bin/bash
# scrub-secrets-from-history.sh
# Removes .env and .env.local from entire git history
# WARNING: This rewrites history. Coordinate with your team before running.
#
# Prerequisites:
#   git filter-repo (install: pip install git-filter-repo)
#   OR bfg-repo-cleaner (install: brew install bfg)
#
# Run from repo root: bash scripts/scrub-secrets-from-history.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "=========================================="
echo "Git History Secret Scrubber"
echo "=========================================="
echo ""
echo "This will REMOVE .env and .env.local from ALL git history."
echo "It rewrites commits. Your team will need to re-clone."
echo ""
read -p "Type 'SCRUB' to proceed: " CONFIRM

if [ "$CONFIRM" != "SCRUB" ]; then
  echo "Aborted."
  exit 1
fi

# Check for git-filter-repo
if command -v git-filter-repo &> /dev/null; then
  echo "Using git-filter-repo..."
  git filter-repo --path .env --path .env.local --invert-paths --force
elif command -v bfg &> /dev/null; then
  echo "Using BFG Repo-Cleaner..."
  # BFG approach
  git clone --mirror . git-bfg-mirror
  bfg --delete-files .env --delete-files .env.local git-bfg-mirror
  cd git-bfg-mirror
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive
  echo "Mirror cleaned. Review git-bfg-mirror, then push manually:"
  echo "  cd git-bfg-mirror && git push --mirror origin"
  exit 0
else
  echo "ERROR: Neither git-filter-repo nor bfg found."
  echo "Install one of them:"
  echo "  pip install git-filter-repo"
  echo "  OR"
  echo "  brew install bfg"
  exit 1
fi

echo ""
echo "History rewritten. Verifying secrets are gone..."

# Verify
count=$(git log --all -p -S "SUPABASE_SERVICE_ROLE_KEY" | wc -l)
if [ "$count" -eq 0 ]; then
  echo "OK: SUPABASE_SERVICE_ROLE_KEY not found in history"
else
  echo "WARNING: $count occurrences still found. Manual review needed."
fi

count2=$(git log --all -p -S "STRIPE_SECRET_KEY" | wc -l)
if [ "$count2" -eq 0 ]; then
  echo "OK: STRIPE_SECRET_KEY not found in history"
else
  echo "WARNING: $count2 occurrences still found."
fi

echo ""
echo "=========================================="
echo "NEXT STEPS:"
echo "=========================================="
echo "1. Review the cleaned history: git log --oneline"
echo "2. Force-push to origin: git push origin --force --all"
echo "3. Tell your team to re-clone the repo (DO NOT pull)"
echo "4. Rotate ALL keys (see PRE_AUDIT_REMEDIATION_REPORT.md)"
echo "5. Run: git reflog expire --expire=now --all && git gc --prune=now --aggressive"
echo ""
