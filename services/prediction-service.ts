/**
 * Career Prediction Service - Container 3
 * Account: prediction@pilotrecognition.com
 * Purpose: Predictive career pathing
 */

import express from 'express';
import { predictivePathing } from '../lib/predictive-career-pathing';

const app = express();
const PORT = process.env.SERVICE_PORT || 3003;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'prediction@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'prediction',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Career trajectory endpoint
app.post('/trajectory', async (req, res) => {
  try {
    const { pilotId, profile } = req.body;
    
    const trajectory = await predictivePathing.generateCareerTrajectory(pilotId, profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: trajectory,
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

// Path comparison endpoint
app.post('/compare', async (req, res) => {
  try {
    const { profile, paths } = req.body;
    
    const comparison = await predictivePathing.compareCareerPaths(profile, paths);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: comparison,
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
  console.log(`🔮 Career Prediction Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'huggingface'}`);
});
