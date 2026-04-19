/**
 * Consensus Service - Container 4
 * Account: consensus@pilotrecognition.com
 * Purpose: Multi-AI consensus validation
 */

import express from 'express';
import { consensusSystem } from '../lib/multi-ai-consensus-system';

const app = express();
const PORT = process.env.SERVICE_PORT || 3004;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'consensus@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'consensus',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Consensus recommendation endpoint
app.post('/consensus', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    const consensus = await consensusSystem.getConsensusRecommendation(prompt, context);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: consensus,
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

// Career path consensus endpoint
app.post('/career-consensus', async (req, res) => {
  try {
    const { pilotProfile, pathways } = req.body;
    
    const consensus = await consensusSystem.getCareerPathConsensus(pilotProfile, pathways);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: consensus,
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
  console.log(`🧠 Consensus Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'multi'}`);
});
