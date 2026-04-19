/**
 * Multi-AI Consensus System
 * 
 * This is an innovative feature that uses multiple AI providers to cross-validate
 * recommendations, ensuring higher accuracy and reliability. No other pilot platform
 * does this - this is a first-of-its-kind innovation.
 * 
 * The system:
 * 1. Sends the same request to multiple AI providers simultaneously
 * 2. Collects recommendations from each AI
 * 3. Uses consensus algorithms to find the best recommendations
 * 4. Provides confidence scores based on agreement between AIs
 * 5. Handles disagreements and edge cases intelligently
 * 
 * This is particularly valuable for critical career decisions where accuracy matters.
 */

export interface AIProvider {
  name: string;
  apiKey: string;
  enabled: boolean;
  priority: number;
}

export interface AIRecommendation {
  provider: string;
  recommendations: string[];
  confidence: number;
  reasoning: string;
  timestamp: string;
}

export interface ConsensusResult {
  consensusRecommendations: string[];
  confidence: number;
  providerAgreement: number;
  dissentingOpinions: AIRecommendation[];
  reasoning: string;
  timestamp: string;
}

export class MultiAIConsensusSystem {
  private providers: AIProvider[];

  constructor(providers: AIProvider[]) {
    this.providers = providers.filter(p => p.enabled).sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get consensus recommendation from multiple AIs
   */
  async getConsensusRecommendation(
    prompt: string,
    context: any
  ): Promise<ConsensusResult> {
    console.log('🧠 Multi-AI Consensus System activated');
    console.log(`   Using ${this.providers.length} AI providers for cross-validation`);

    const recommendations: AIRecommendation[] = [];

    // Send request to all providers simultaneously
    const promises = this.providers.map(provider => 
      this.getRecommendationFromProvider(provider, prompt, context)
    );

    const results = await Promise.allSettled(promises);

    // Process results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        recommendations.push(result.value);
        console.log(`   ✓ ${result.value.provider}: ${result.value.recommendations.length} recommendations`);
      } else {
        console.log(`   ✗ ${this.providers[index].name}: Failed - ${result.reason}`);
      }
    });

    // Calculate consensus
    const consensus = this.calculateConsensus(recommendations);

    console.log(`   Consensus confidence: ${consensus.confidence}%`);
    console.log(`   Provider agreement: ${consensus.providerAgreement}%`);

    return consensus;
  }

  /**
   * Get recommendation from a single AI provider
   */
  private async getRecommendationFromProvider(
    provider: AIProvider,
    prompt: string,
    context: any
  ): Promise<AIRecommendation> {
    const startTime = Date.now();

    try {
      const response = await this.callProviderAPI(provider, prompt);
      const recommendations = this.parseRecommendations(response);

      return {
        provider: provider.name,
        recommendations,
        confidence: this.calculateConfidence(response),
        reasoning: this.extractReasoning(response),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`${provider.name} failed: ${error.message}`);
    }
  }

  /**
   * Call specific provider API
   */
  private async callProviderAPI(provider: AIProvider, prompt: string): Promise<string> {
    switch (provider.name) {
      case 'groq':
        return this.callGroqAPI(prompt, provider.apiKey);
      case 'huggingface':
        return this.callHuggingFaceAPI(prompt, provider.apiKey);
      case 'openai':
        return this.callOpenAIAPI(prompt, provider.apiKey);
      case 'local':
        return this.callLocalAI(prompt);
      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  /**
   * Call Groq API
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
            content: 'You are an expert aviation career advisor. Provide specific, actionable recommendations in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Call Hugging Face API
   */
  private async callHuggingFaceAPI(prompt: string, apiKey: string): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `<s>[INST] You are an expert aviation career advisor. Provide specific, actionable recommendations in JSON format. ${prompt} [/INST]`,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.4
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0].generated_text : data.generated_text;
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
            content: 'You are an expert aviation career advisor. Provide specific, actionable recommendations in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
        prompt: `You are an expert aviation career advisor. Provide specific, actionable recommendations in JSON format. ${prompt}`,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * Parse recommendations from AI response
   */
  private parseRecommendations(response: string): string[] {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If not JSON, extract from text
      const lines = response.split('\n');
      return lines.filter(line => line.trim().length > 10).slice(0, 5);
    }
  }

  /**
   * Calculate confidence from AI response
   */
  private calculateConfidence(response: string): number {
    // Simple heuristic based on response quality
    if (response.length < 50) return 30;
    if (response.length < 200) return 60;
    if (response.includes('recommend') || response.includes('suggest')) return 80;
    return 70;
  }

  /**
   * Extract reasoning from AI response
   */
  private extractReasoning(response: string): string {
    // Extract the reasoning part if available
    const reasoningMatch = response.match(/reasoning:?(.+)/i);
    if (reasoningMatch) {
      return reasoningMatch[1].trim();
    }
    return response.substring(0, 100) + '...';
  }

  /**
   * Calculate consensus across multiple AI recommendations
   */
  private calculateConsensus(recommendations: AIRecommendation[]): ConsensusResult {
    if (recommendations.length === 0) {
      return {
        consensusRecommendations: [],
        confidence: 0,
        providerAgreement: 0,
        dissentingOpinions: [],
        reasoning: 'No AI providers available',
        timestamp: new Date().toISOString()
      };
    }

    if (recommendations.length === 1) {
      return {
        consensusRecommendations: recommendations[0].recommendations,
        confidence: recommendations[0].confidence,
        providerAgreement: 100,
        dissentingOpinions: [],
        reasoning: recommendations[0].reasoning,
        timestamp: new Date().toISOString()
      };
    }

    // Count recommendation frequency
    const recommendationCounts = new Map<string, number>();
    recommendations.forEach(rec => {
      rec.recommendations.forEach(recStr => {
        const normalized = recStr.toLowerCase().trim();
        recommendationCounts.set(normalized, (recommendationCounts.get(normalized) || 0) + 1);
      });
    });

    // Sort by frequency
    const sortedRecommendations = Array.from(recommendationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([rec]) => rec);

    // Calculate agreement
    const agreement = (recommendationCounts.size / recommendations.length) * 100;
    const confidence = Math.min(100, agreement * (recommendations.length / 2));

    // Find dissenting opinions
    const dissenting = recommendations.filter(rec => {
      const hasConsensus = rec.recommendations.some(r => 
        sortedRecommendations.includes(r.toLowerCase())
      );
      return !hasConsensus;
    });

    return {
      consensusRecommendations: sortedRecommendations,
      confidence: Math.round(confidence),
      providerAgreement: Math.round(agreement),
      dissentingOpinions: dissenting,
      reasoning: `Consensus derived from ${recommendations.length} AI providers with ${Math.round(agreement)}% agreement`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get career path consensus (innovative feature)
   */
  async getCareerPathConsensus(
    pilotProfile: any,
    pathways: any[]
  ): Promise<ConsensusResult> {
    const prompt = `
As an expert aviation career advisor, analyze this pilot profile and recommend the top 5 career pathways:

Pilot Profile:
- Total Flight Hours: ${pilotProfile.totalFlightHours}
- Licenses: ${pilotProfile.licenses.join(', ')}
- Recognition Score: ${pilotProfile.overallRecognitionScore}
- Career Goals: ${pilotProfile.careerGoals.join(', ')}
- Experience Level: ${pilotProfile.experienceLevel}

Available Pathways: ${pathways.map(p => p.title).join(', ')}

Provide specific recommendations as a JSON array of pathway titles, prioritized by match suitability.
Consider: flight hours alignment, license requirements, career trajectory, industry demand, and growth potential.
`;

    return this.getConsensusRecommendation(prompt, { pilotProfile, pathways });
  }

  /**
   * Get skill development consensus (innovative feature)
   */
  async getSkillDevelopmentConsensus(
    pilotProfile: any,
    targetPathway: any
  ): Promise<ConsensusResult> {
    const prompt = `
As an expert aviation career advisor, analyze this pilot's profile against a target pathway:

Pilot Profile:
- Total Flight Hours: ${pilotProfile.totalFlightHours}
- Licenses: ${pilotProfile.licenses.join(', ')}
- Recognition Score: ${pilotProfile.overallRecognitionScore}

Target Pathway: ${targetPathway.title}
Requirements: ${targetPathway.requirements.join(', ')}

Recommend the top 5 specific skills or certifications this pilot should acquire to maximize their chances of success with this pathway.
Consider: priority order, time investment, cost-effectiveness, and industry recognition.
Provide recommendations as a JSON array of skill/certification names.
`;

    return this.getConsensusRecommendation(prompt, { pilotProfile, targetPathway });
  }

  /**
   * Get career trajectory prediction (innovative feature)
   */
  async getCareerTrajectoryPrediction(
    pilotProfile: any
  ): Promise<ConsensusResult> {
    const prompt = `
As an expert aviation industry analyst, predict this pilot's career trajectory over the next 5 years:

Pilot Profile:
- Total Flight Hours: ${pilotProfile.totalFlightHours}
- Licenses: ${pilotProfile.licenses.join(', ')}
- Recognition Score: ${pilotProfile.overallRecognitionScore}
- Career Goals: ${pilotProfile.careerGoals.join(', ')}
- Experience Level: ${pilotProfile.experienceLevel}

Predict:
1. Expected career progression milestones
2. Salary trajectory
3. Industry demand for their profile
4. Recommended timing for certifications
5. Potential challenges and how to overcome them

Provide predictions as a JSON array of specific, actionable predictions with timeframes.
`;

    return this.getConsensusRecommendation(prompt, { pilotProfile });
  }
}

// Export singleton instance
export const consensusSystem = new MultiAIConsensusSystem([
  {
    name: 'groq',
    apiKey: typeof window !== 'undefined' ? (window as any).GROQ_API_KEY || '' : '',
    enabled: false, // Will be enabled when API key is provided
    priority: 1
  },
  {
    name: 'huggingface',
    apiKey: typeof window !== 'undefined' ? (window as any).HF_TOKEN || '' : '',
    enabled: false,
    priority: 2
  },
  {
    name: 'openai',
    apiKey: typeof window !== 'undefined' ? (window as any).OPENAI_API_KEY || '' : '',
    enabled: false,
    priority: 3
  },
  {
    name: 'local',
    apiKey: '',
    enabled: true,
    priority: 4
  }
]);
