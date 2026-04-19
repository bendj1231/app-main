/**
 * Social Proof Service - Container 5
 * Account: social@pilotrecognition.com
 * Purpose: Social proof matching and peer data
 */

import express from 'express';
import { socialProofMatching } from '../lib/social-proof-matching';

const app = express();
const PORT = process.env.SERVICE_PORT || 3005;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'social@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'social',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Similar pilots endpoint
app.post('/similar-pilots', (req, res) => {
  try {
    const { profile, limit } = req.body;
    
    const socialProof = socialProofMatching.findSimilarPilots(profile, limit);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: socialProof,
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

// Career timeline endpoint
app.get('/timeline/:pilotId', (req, res) => {
  try {
    const { pilotId } = req.params;
    
    const timeline = socialProofMatching.getCareerTimelineVisualization(pilotId);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: timeline,
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

// Mentor connection endpoint
app.post('/mentors', (req, res) => {
  try {
    const { profile, limit } = req.body;
    
    const mentors = socialProofMatching.findMentors(profile, limit);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: mentors,
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
  console.log(`👥 Social Proof Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'groq'}`);
});
