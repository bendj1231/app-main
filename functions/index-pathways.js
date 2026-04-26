const { onRequest } = require('firebase-functions/v2/https');
const pathwayFunctions = require('./pathway-functions');

exports.getCareerHierarchyGeneralCategories = pathwayFunctions.getCareerHierarchyGeneralCategories;
exports.getCareerHierarchyPathwaysByCategory = pathwayFunctions.getCareerHierarchyPathwaysByCategory;
exports.getCareerHierarchySubPathwaysByPathway = pathwayFunctions.getCareerHierarchySubPathwaysByPathway;
exports.getCareerHierarchyFull = pathwayFunctions.getCareerHierarchyFull;
exports.healthCheck = onRequest((req, res) => res.send('OK'));
