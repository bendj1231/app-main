/**
 * Matching Service - Container 1
 * Account: matching@pilotrecognition.com
 * Purpose: Pathway matching calculations
 */

import express from 'express';
import { matchingEngine } from '../lib/pathway-matching-engine';

const app = express();
const PORT = process.env.SERVICE_PORT || 3001;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'matching@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'matching',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Matching endpoint
app.post('/match', async (req, res) => {
  try {
    const { pathways, profile, weights } = req.body;
    
    const matches = matchingEngine.calculateMatches(pathways, profile, weights);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: matches,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Matching Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'groq'}`);
});
