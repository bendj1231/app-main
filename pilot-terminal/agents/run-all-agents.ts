/**
 * Run All AI Agents
 * Starts all compartmentalized AI agents for the Pilot Terminal Network
 */

import { EnrollmentAgent } from './enrollment-agent';
import { PathwaysAgent } from './pathways-agent';
import { DemandAgent } from './demand-agent';
import { MatchingAgent } from './matching-agent';
import { CoachingAgent } from './coaching-agent';
import { SocialAgent } from './social-agent';
import { RetentionManagerAgent } from '../lib/retention-manager-agent';

async function runAllAgents() {
  console.log('🚀 Starting all Pilot Terminal AI agents...');

  // Initialize agents with API keys from environment
  const enrollmentAgent = new EnrollmentAgent(process.env.ENROLLMENT_AGENT_API_KEY || '');
  const pathwaysAgent = new PathwaysAgent(process.env.PATHWAYS_AGENT_API_KEY || '');
  const demandAgent = new DemandAgent(process.env.DEMAND_AGENT_API_KEY || '');
  const matchingAgent = new MatchingAgent(process.env.MATCHING_AGENT_API_KEY || '');
  const coachingAgent = new CoachingAgent(process.env.COACHING_AGENT_API_KEY || '');
  const socialAgent = new SocialAgent(process.env.SOCIAL_AGENT_API_KEY || '');
  const retentionManager = new RetentionManagerAgent(process.env.RETENTION_AGENT_API_KEY || '');

  // Start retention manager with automatic cycles
  retentionManager.startAutomaticCycles(60 * 60 * 1000); // Every hour

  // Run initial cycles for each agent
  await enrollmentAgent.runMonitoringCycle();
  await pathwaysAgent.runMonitoringCycle();
  await demandAgent.runMonitoringCycle();
  await socialAgent.runSocialCycle();

  // Set up periodic cycles for each agent (every 30 minutes)
  setInterval(async () => {
    await enrollmentAgent.runMonitoringCycle();
  }, 30 * 60 * 1000);

  setInterval(async () => {
    await pathwaysAgent.runMonitoringCycle();
  }, 30 * 60 * 1000);

  setInterval(async () => {
    await demandAgent.runMonitoringCycle();
  }, 30 * 60 * 1000);

  setInterval(async () => {
    await socialAgent.runSocialCycle();
  }, 30 * 60 * 1000);

  console.log('✅ All agents started and running in 30-minute cycles');
  console.log('📊 Retention manager running hourly cleanup cycles');
  console.log('Press Ctrl+C to stop all agents');

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping all agents...');
    process.exit(0);
  });
}

runAllAgents();
