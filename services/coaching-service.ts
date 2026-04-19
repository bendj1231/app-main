/**
 * Career Coaching Service - Container 2
 * Account: coaching@pilotrecognition.com
 * Purpose: AI career coaching and advice
 */

import express from 'express';
import { aiCareerCoaching } from '../lib/ai-career-coaching';

const app = express();
const PORT = process.env.SERVICE_PORT || 3002;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'coaching@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'coaching',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Coaching session endpoint
app.post('/coaching', async (req, res) => {
  try {
    const { pilotId, profile } = req.body;
    
    const session = await aiCareerCoaching.generateCoachingSession(pilotId, profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: session,
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

// Career pivot recommendation endpoint
app.post('/pivots', async (req, res) => {
  try {
    const { profile } = req.body;
    
    const pivots = await aiCareerCoaching.recommendCareerPivots(profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: pivots,
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
  console.log(`🎓 Career Coaching Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
});
