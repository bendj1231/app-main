#!/usr/bin/env node

/**
 * AI-Powered Database Manager
 * 
 * This script uses free AI APIs to manage and optimize the database automatically.
 * It monitors database health, performance, and makes intelligent decisions.
 * 
 * Free AI Options:
 * - Groq API (https://groq.com/) - Very fast, free tier
 * - Hugging Face Inference API - Free for many models
 * - OpenAI API - Limited free tier
 * - Local AI (Ollama) - Completely free, requires local compute
 * 
 * Usage: node scripts/ai-database-manager.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// AI Providers (ordered by priority - will try in order)
const AI_PROVIDERS = [
  {
    name: 'groq',
    apiKey: process.env.GROQ_API_KEY || '',
    enabled: !!process.env.GROQ_API_KEY
  },
  {
    name: 'huggingface',
    apiKey: process.env.HF_TOKEN || '',
    enabled: !!process.env.HF_TOKEN
  },
  {
    name: 'openai',
    apiKey: process.env.OPENAI_API_KEY || '',
    enabled: !!process.env.OPENAI_API_KEY
  },
  {
    name: 'local',
    apiKey: '',
    enabled: true // Local AI (Ollama) always available if installed
  }
];

const AI_API_PROVIDER = process.env.AI_PROVIDER || 'auto'; // 'auto' tries all, or specific provider

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  metrics: {
    totalPathways: number;
    activePathways: number;
    totalProfiles: number;
    recentCalculations: number;
    errorRate: number;
  };
}

class AIDatabaseManager {
  private supabase: any;
  private providers: any[];

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.providers = AI_PROVIDERS.filter(p => p.enabled);
  }

  /**
   * Get enabled providers in priority order
   */
  private getProviders(): any[] {
    if (AI_API_PROVIDER === 'auto') {
      return this.providers;
    }
    const specific = this.providers.find(p => p.name === AI_API_PROVIDER);
    return specific ? [specific] : this.providers;
  }

  /**
   * Get database health metrics
   */
  async getDatabaseHealth(): Promise<DatabaseHealth> {
    console.log('🔍 Analyzing database health...');

    const health: DatabaseHealth = {
      status: 'healthy',
      issues: [],
      recommendations: [],
      metrics: {
        totalPathways: 0,
        activePathways: 0,
        totalProfiles: 0,
        recentCalculations: 0,
        errorRate: 0
      }
    };

    try {
      // Get pathway statistics
      const { data: pathways } = await this.supabase
        .from('pathways')
        .select('id, active');
      
      if (pathways) {
        health.metrics.totalPathways = pathways.length;
        health.metrics.activePathways = pathways.filter(p => p.active).length;
      }

      // Get profile statistics
      const { count: profileCount } = await this.supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      health.metrics.totalProfiles = profileCount || 0;

      // Get recent calculation logs
      const { data: logs } = await this.supabase
        .from('match_calculation_logs')
        .select('status, error_message')
        .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (logs) {
        health.metrics.recentCalculations = logs.length;
        const errors = logs.filter(log => log.status === 'failed');
        health.metrics.errorRate = logs.length > 0 ? (errors.length / logs.length) * 100 : 0;
      }

      // Analyze health status
      if (health.metrics.errorRate > 10) {
        health.status = 'critical';
        health.issues.push(`High error rate: ${health.metrics.errorRate.toFixed(1)}%`);
        health.recommendations.push('Review failed calculation logs');
      } else if (health.metrics.errorRate > 5) {
        health.status = 'warning';
        health.issues.push(`Elevated error rate: ${health.metrics.errorRate.toFixed(1)}%`);
        health.recommendations.push('Monitor error patterns');
      }

      if (health.metrics.activePathways < health.metrics.totalPathways * 0.8) {
        health.status = health.status === 'healthy' ? 'warning' : health.status;
        health.issues.push('Low pathway activation rate');
        health.recommendations.push('Review inactive pathways');
      }

    } catch (error) {
      console.error('Error analyzing database health:', error);
      health.status = 'critical';
      health.issues.push('Failed to analyze database health');
    }

    return health;
  }

  /**
   * Get AI recommendations for optimization with automatic fallback
   */
  async getAIRecommendations(health: DatabaseHealth): Promise<string[]> {
    const providers = this.getProviders();

    if (providers.length === 0) {
      console.log('⚠️  No AI providers available, using rule-based recommendations');
      return this.getRuleBasedRecommendations(health);
    }

    console.log(`🤢 Getting AI recommendations via ${providers.length} provider(s)...`);

    // Try each provider in order with fallback
    for (const provider of providers) {
      try {
        console.log(`  → Trying ${provider.name}...`);
        const recommendations = await this.callAIWithProvider(provider, health);
        
        try {
          const parsed = JSON.parse(recommendations);
          if (Array.isArray(parsed)) {
            console.log(`  ✓ Success using ${provider.name}`);
            return parsed;
          }
        } catch {
          // If AI response is not valid JSON, try next provider
          console.log(`  ✗ Invalid JSON from ${provider.name}, trying next...`);
          continue;
        }
      } catch (error) {
        console.log(`  ✗ ${provider.name} failed: ${error.message}, trying next...`);
        continue;
      }
    }

    // All providers failed, fall back to rule-based
    console.log('⚠️  All AI providers failed, using rule-based recommendations');
    return this.getRuleBasedRecommendations(health);
  }

  /**
   * Call AI API with specific provider
   */
  private async callAIWithProvider(provider: any, health: DatabaseHealth): Promise<string> {
    const prompt = `
As a database optimization expert, analyze this database health report and provide 3-5 specific recommendations:

Database Status: ${health.status}
Issues: ${health.issues.join(', ')}
Metrics:
- Total Pathways: ${health.metrics.totalPathways}
- Active Pathways: ${health.metrics.activePathways}
- Total Profiles: ${health.metrics.totalProfiles}
- Recent Calculations: ${health.metrics.recentCalculations}
- Error Rate: ${health.metrics.errorRate.toFixed(1)}%

Provide actionable recommendations as a JSON array of strings.
`;

    switch (provider.name) {
      case 'groq':
        return this.callGroqAPI(prompt, provider.apiKey);
      case 'openai':
        return this.callOpenAIAPI(prompt, provider.apiKey);
      case 'huggingface':
        return this.callHuggingFaceAPI(prompt, provider.apiKey);
      case 'local':
        return this.callLocalAI(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${provider.name}`);
    }
  }

  /**
   * Call Groq API (free tier, very fast)
   */
  private async callGroqAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a database optimization expert. Provide concise, actionable recommendations in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAIAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a database optimization expert. Provide concise, actionable recommendations in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Call Hugging Face Inference API
   */
  private async callHuggingFaceAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `<s>[INST] You are a database optimization expert. Provide concise, actionable recommendations in JSON format. ${prompt} [/INST]`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
  }

  /**
   * Call Local AI (Ollama)
   */
  private async callLocalAI(prompt: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: `You are a database optimization expert. Provide concise, actionable recommendations in JSON format. ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * Rule-based recommendations (fallback)
   */
  private getRuleBasedRecommendations(health: DatabaseHealth): string[] {
    const recommendations: string[] = [];

    if (health.metrics.errorRate > 10) {
      recommendations.push('Immediate: Investigate failed calculation logs');
      recommendations.push('Check database connection stability');
    }

    if (health.metrics.activePathways < health.metrics.totalPathways * 0.8) {
      recommendations.push('Review inactive pathways and update status');
      recommendations.push('Consider archiving old pathway data');
    }

    if (health.metrics.recentCalculations > 1000) {
      recommendations.push('Consider implementing caching to reduce calculations');
      recommendations.push('Review calculation frequency patterns');
    }

    if (health.metrics.totalProfiles > 1000) {
      recommendations.push('Consider database partitioning for better performance');
      recommendations.push('Review indexing strategy');
    }

    if (recommendations.length === 0) {
      recommendations.push('Database health is optimal, continue monitoring');
    }

    return recommendations;
  }

  /**
   * Execute AI recommendations
   */
  async executeRecommendations(recommendations: string[]): Promise<void> {
    console.log('🚀 Executing recommendations...');

    for (const recommendation of recommendations) {
      console.log(`  → ${recommendation}`);

      // Execute based on recommendation type
      if (recommendation.includes('cache')) {
        await this.refreshCaches();
      } else if (recommendation.includes('inactive')) {
        await this.reviewInactivePathways();
      } else if (recommendation.includes('index')) {
        await this.optimizeIndexes();
      } else if (recommendation.includes('partition')) {
        console.log('  ℹ️  Partitioning requires manual implementation');
      }
    }
  }

  /**
   * Refresh database caches
   */
  async refreshCaches(): Promise<void> {
    try {
      const { data, error } = await this.supabase.rpc('refresh_all_caches');
      if (error) throw error;
      console.log('  ✓ Caches refreshed successfully');
    } catch (error) {
      console.error('  ✗ Failed to refresh caches:', error);
    }
  }

  /**
   * Review inactive pathways
   */
  async reviewInactivePathways(): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('pathways')
        .select('id, title, active, updated_at')
        .eq('active', false)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      console.log(`  ℹ️  Found ${data.length} inactive pathways`);
      data.forEach((pathway: any) => {
        console.log(`    - ${pathway.title} (last updated: ${pathway.updated_at})`);
      });
    } catch (error) {
      console.error('  ✗ Failed to review inactive pathways:', error);
    }
  }

  /**
   * Optimize database indexes
   */
  async optimizeIndexes(): Promise<void> {
    console.log('  ℹ️  Index optimization requires manual review');
    console.log('  ℹ️  Consider adding indexes for frequently queried columns');
  }

  /**
   * Run full AI management cycle
   */
  async runManagementCycle(): Promise<void> {
    console.log('🤖 Starting AI Database Management Cycle');
    console.log('='.repeat(50));

    try {
      // Get database health
      const health = await this.getDatabaseHealth();
      console.log(`\n📊 Database Status: ${health.status.toUpperCase()}`);
      console.log(`   Issues: ${health.issues.length}`);
      console.log(`   Error Rate: ${health.metrics.errorRate.toFixed(1)}%`);

      if (health.issues.length > 0) {
        console.log('\n⚠️  Issues:');
        health.issues.forEach(issue => console.log(`   - ${issue}`));
      }

      // Get AI recommendations
      const recommendations = await this.getAIRecommendations(health);
      console.log('\n💡 Recommendations:');
      recommendations.forEach(rec => console.log(`   - ${rec}`));

      // Execute recommendations
      await this.executeRecommendations(recommendations);

      console.log('\n✅ Management cycle completed');

    } catch (error) {
      console.error('\n❌ Management cycle failed:', error);
    }
  }
}

// Run the AI manager
async function main() {
  const manager = new AIDatabaseManager();
  await manager.runManagementCycle();
}

main();
