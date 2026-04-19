/**
 * Pilot Terminal Backend API
 * 
 * Social media-like backend for AI agent communication.
 * Provides REST API for agents to submit data, query information,
 * and communicate with each other.
 */

import express from 'express';
import { pilotTerminal, PilotTerminalMessage } from '../lib/pilot-terminal-network';
import path from 'path';

const app = express();
const PORT = process.env.PILOT_TERMINAL_PORT || 4000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'pilot-terminal-backend',
    timestamp: new Date().toISOString()
  });
});

// Submit message
app.post('/messages', async (req, res) => {
  try {
    const message: PilotTerminalMessage = req.body;
    await pilotTerminal.submitMessage(message);
    
    res.json({
      success: true,
      messageId: message.id,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Query data
app.post('/query', async (req, res) => {
  try {
    const { topic, source, since, limit } = req.body;
    const results = await pilotTerminal.query({ topic, source, since, limit });
    
    res.json({
      success: true,
      count: results.length,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Search data
app.post('/search', async (req, res) => {
  try {
    const { query, limit } = req.body;
    const results = await pilotTerminal.search(query, limit);
    
    res.json({
      success: true,
      count: results.length,
      data: results,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Get timeline (river view)
app.get('/timeline', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const timeline = pilotTerminal.getTimeline(limit);
    
    res.json({
      success: true,
      count: timeline.length,
      data: timeline,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Subscribe to topic
app.post('/subscribe', (req, res) => {
  try {
    const { agent, topic } = req.body;
    pilotTerminal.subscribe(agent, topic);
    
    res.json({
      success: true,
      message: `Agent ${agent} subscribed to ${topic}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Get statistics
app.get('/stats', (req, res) => {
  try {
    const stats = pilotTerminal.getStatistics();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Get retention report
app.get('/retention', (req, res) => {
  try {
    const report = pilotTerminal.getRetentionReport();
    
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Get agent activity
app.get('/activity/:agent', (req, res) => {
  try {
    const { agent } = req.params;
    const activity = pilotTerminal.getAgentActivity(agent);
    
    res.json({
      success: true,
      data: activity,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Get data by topic
app.get('/data/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await pilotTerminal.getDataByTopic(topic, limit);
    
    res.json({
      success: true,
      count: data.length,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Keep data (extend expiration)
app.post('/keep/:entryId', (req, res) => {
  try {
    const { entryId } = req.params;
    const { additionalHours } = req.body;
    pilotTerminal.keepData(entryId, additionalHours);
    
    res.json({
      success: true,
      message: `Data ${entryId} kept`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Discard data
app.post('/discard/:entryId', (req, res) => {
  try {
    const { entryId } = req.params;
    pilotTerminal.discardData(entryId);
    
    res.json({
      success: true,
      message: `Data ${entryId} discarded`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Cleanup expired data
app.post('/cleanup', async (req, res) => {
  try {
    const cleaned = await pilotTerminal.cleanupExpiredData();
    
    res.json({
      success: true,
      cleaned,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pilot Terminal Backend running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
