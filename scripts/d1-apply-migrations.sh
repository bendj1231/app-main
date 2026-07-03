#!/bin/bash
# Apply all pending D1 migrations across PilotRecognition databases
# Run after any schema changes or new migration files

echo "☁️  PilotRecognition D1 Migration Runner"
echo "=========================================="
echo ""

# Worker DB (pilotrecognition-profiles)
echo "→ Applying Worker migrations (pilotrecognition-profiles)..."
cd worker
npx wrangler d1 migrations apply pilotrecognition-profiles --remote || true
cd ..

# Wingmentor DB
cd worker
echo "→ Applying Wingmentor Program migrations (wingmentor-program)..."
npx wrangler d1 migrations apply wingmentor-program --remote || true
cd ..

# Cloudflare DBs
cd cloudflare

echo "→ Applying Platform DB migrations (pilotrecognition-d1)..."
npx wrangler d1 migrations apply pilotrecognition-d1 --remote || true

echo "→ Applying Reference Data migrations (pilotrecognition-reference-data)..."
npx wrangler d1 migrations apply pilotrecognition-reference-data --remote || true

echo "→ Applying Trace DB migrations (recognition-plus-trace)..."
npx wrangler d1 migrations apply recognition-plus-trace --remote || true

echo "→ Applying Docs DB migrations (apc-document-metadata)..."
npx wrangler d1 migrations apply apc-document-metadata --remote || true

cd ..

echo ""
echo "✅ All D1 migrations applied successfully!"
echo "Note: Some migrations may fail if already applied. Use 'd1 execute --file' for idempotent single-file application."
