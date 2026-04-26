const functions = require('firebase-functions/v2/https');

// Placeholder for airline/enterprise functions
// Add enterprise functions here when ready

exports.healthCheck = functions.https.onRequest((req, res) => res.send('OK'));
