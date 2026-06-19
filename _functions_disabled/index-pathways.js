const { onRequest } = require('firebase-functions/v2/https');

// Pathway functions removed - using direct Supabase client instead
// See PathwaysPageModern.tsx for implementation
exports.healthCheck = onRequest((req, res) => res.send('OK'));
