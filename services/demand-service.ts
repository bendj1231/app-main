/**
 * Industry Demand Service - Container 6
 * Account: demand@pilotrecognition.com
 * Purpose: Industry demand prediction
 */

import express from 'express';
import { industryDemandPrediction } from '../lib/industry-demand-prediction';

const app = express();
const PORT = process.env.SERVICE_PORT || 3006;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'demand@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'demand',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Demand prediction endpoint
app.post('/demand-prediction', async (req, res) => {
  try {
    const prediction = await industryDemandPrediction.generateDemandPrediction();
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: prediction,
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

// Pathway demand endpoint
app.post('/pathway-demand', async (req, res) => {
  try {
    const { pathway } = req.body;
    
    const demand = await industryDemandPrediction.getPathwayDemand(pathway);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: demand,
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

// Market saturation endpoint
app.get('/saturation/:region/:role', (req, res) => {
  try {
    const { region, role } = req.params;
    
    const saturation = industryDemandPrediction.getMarketSaturationWarning(region, role);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: saturation,
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
  console.log(`📊 Industry Demand Service running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'huggingface'}`);
});
