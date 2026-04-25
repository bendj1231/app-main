/**
 * AI Career Coaching API Service - Container 3
 * Account: ai-coaching@pilotrecognition.com
 * Purpose: API endpoints for AI career coaching features
 */

import express from 'express';
import { aiCareerCoachingIntegration } from '../lib/ai-career-coaching-integration';

const app = express();
const PORT = process.env.SERVICE_PORT || 3003;
const AI_ACCOUNT = process.env.AI_ACCOUNT || 'ai-coaching@pilotrecognition.com';

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-career-coaching-api',
    account: AI_ACCOUNT,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// System status endpoint
app.get('/status', (req, res) => {
  res.json({
    success: true,
    account: AI_ACCOUNT,
    data: aiCareerCoachingIntegration.getSystemStatus(),
    timestamp: new Date().toISOString()
  });
});

// Comprehensive coaching session endpoint
app.post('/coaching/comprehensive', async (req, res) => {
  try {
    const { pilotId, profile } = req.body;
    
    const session = await aiCareerCoachingIntegration.getComprehensiveCoachingSession(pilotId, profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: session,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Pathway recommendations endpoint
app.post('/pathways/recommendations', async (req, res) => {
  try {
    const { profile, pathways } = req.body;
    
    const recommendations = await aiCareerCoachingIntegration.getPathwayRecommendations(profile, pathways);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Score tracking endpoint
app.get('/score/tracking/:pilotId', (req, res) => {
  try {
    const { pilotId } = req.params;
    const timeframe = (req.query.timeframe as string) || '30d';
    
    const tracking = aiCareerCoachingIntegration.getScoreTracking(pilotId, timeframe);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: tracking,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Score advice endpoint
app.post('/score/advice', async (req, res) => {
  try {
    const { pilotId, currentScore, targetScore, components, profile } = req.body;
    
    const { scoreMaintenanceAdvice } = await import('../lib/score-maintenance-advice');
    const advice = await scoreMaintenanceAdvice.generateScoreAdvice(
      pilotId,
      currentScore,
      targetScore,
      components,
      profile
    );
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: advice,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Component advice endpoint
app.get('/score/component/:component/:value', (req, res) => {
  try {
    const { component, value } = req.params;
    const numValue = parseInt(value);
    
    const advice = aiCareerCoachingIntegration.getComponentAdvice(component, numValue);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: advice,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Job shortage alerts endpoint
app.post('/jobs/alerts', async (req, res) => {
  try {
    const { pilotId, profile } = req.body;
    
    const alerts = await aiCareerCoachingIntegration.getJobShortageAlerts(pilotId, profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Notification history endpoint
app.get('/notifications/history/:pilotId', (req, res) => {
  try {
    const { pilotId } = req.params;
    
    const history = aiCareerCoachingIntegration.getNotificationHistory(pilotId);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: history,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Update notification preferences endpoint
app.post('/notifications/preferences', (req, res) => {
  try {
    const preferences = req.body;
    
    aiCareerCoachingIntegration.updateNotificationPreferences(preferences);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      message: 'Preferences updated',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Mark alert as read endpoint
app.post('/notifications/read', (req, res) => {
  try {
    const { pilotId, alertId } = req.body;
    
    aiCareerCoachingIntegration.markAlertAsRead(pilotId, alertId);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      message: 'Alert marked as read',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Market intelligence dashboard endpoint
app.get('/market/intelligence', async (req, res) => {
  try {
    const profile = req.body.profile;
    
    const intelligence = await aiCareerCoachingIntegration.getMarketIntelligence(profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: intelligence,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Market intelligence with profile endpoint
app.post('/market/intelligence/personalized', async (req, res) => {
  try {
    const { profile } = req.body;
    
    const intelligence = await aiCareerCoachingIntegration.getMarketIntelligence(profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: intelligence,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Historical market data endpoint
app.get('/market/historical', (req, res) => {
  try {
    const timeframe = (req.query.timeframe as string) || '12m';
    
    const data = aiCareerCoachingIntegration.getHistoricalMarketData(timeframe);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Industry demand prediction endpoint
app.get('/industry/demand', async (req, res) => {
  try {
    const demand = await aiCareerCoachingIntegration.getIndustryDemand();
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: demand,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Pathway demand endpoint
app.post('/pathways/demand', async (req, res) => {
  try {
    const { pathway } = req.body;
    
    const demand = await aiCareerCoachingIntegration.getPathwayDemand(pathway);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: demand,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Career pivot recommendations endpoint
app.post('/career/pivots', async (req, res) => {
  try {
    const { profile } = req.body;
    
    const pivots = await aiCareerCoachingIntegration.getCareerPivotRecommendations(profile);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: pivots,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Learning plan endpoint
app.post('/learning/plan', (req, res) => {
  try {
    const { profile, timeframe } = req.body;
    
    const plan = aiCareerCoachingIntegration.getLearningPlan(profile, timeframe);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      data: plan,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Configuration update endpoint
app.post('/config', (req, res) => {
  try {
    const config = req.body;
    
    aiCareerCoachingIntegration.updateConfig(config);
    
    res.json({
      success: true,
      account: AI_ACCOUNT,
      message: 'Configuration updated',
      data: aiCareerCoachingIntegration.getSystemStatus(),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      account: AI_ACCOUNT
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Career Coaching API running on port ${PORT}`);
  console.log(`📧 Account: ${AI_ACCOUNT}`);
  console.log(`🤢 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
});
