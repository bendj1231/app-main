const functions = require('firebase-functions/v2/https');
const manufacturerFunctions = require('./manufacturer-functions');
const premiumFeatures = require('./premium-features');
const typeRatingFunctions = require('./type-rating-functions');

// Export all manufacturer functions
for (const [name, func] of Object.entries(manufacturerFunctions)) {
  exports[name] = func;
}

// Export all premium features functions
for (const [name, func] of Object.entries(premiumFeatures)) {
  exports[name] = func;
}

// Export all type rating functions
for (const [name, func] of Object.entries(typeRatingFunctions)) {
  exports[name] = func;
}
