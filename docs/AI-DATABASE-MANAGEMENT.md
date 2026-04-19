# AI-Powered Database Management Setup

This document explains how to set up an AI system to automatically manage your Supabase database using free API keys.

## Free AI API Options

### 1. Groq API (Recommended - Fastest Free Option)
- **Cost:** Completely free
- **Speed:** Extremely fast (up to 500 tokens/second)
- **Models:** Llama 3, Mixtral, Gemma
- **Rate Limit:** Generous free tier
- **Setup:** https://console.groq.com/

**Get API Key:**
1. Go to https://console.groq.com/
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy key to use in environment variables

### 2. Hugging Face Inference API
- **Cost:** Free for inference
- **Models:** Thousands of open-source models
- **Rate Limit:** Free tier available
- **Setup:** https://huggingface.co/settings/tokens

**Get API Key:**
1. Go to https://huggingface.co/
2. Sign up for free account
3. Go to Settings → Access Tokens
4. Create new token
5. Copy token to use in environment variables

### 3. OpenAI API
- **Cost:** Limited free tier ($5 credit)
- **Models:** GPT-3.5, GPT-4
- **Rate Limit:** Limited on free tier
- **Setup:** https://platform.openai.com/api-keys

**Get API Key:**
1. Go to https://platform.openai.com/
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy key to use in environment variables

### 4. Local AI (Ollama) - Completely Free
- **Cost:** Completely free (runs locally)
- **Models:** Llama 3, Mistral, and more
- **Rate Limit:** Unlimited (local)
- **Setup:** https://ollama.com/

**Installation:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download model
ollama pull llama3

# Run locally (no API key needed)
ollama run llama3
```

## Setup Instructions

### Option 1: Using Groq API (Recommended)

1. **Get Groq API Key:**
   ```bash
   # Sign up at https://console.groq.com/
   # Create API key and copy it
   ```

2. **Set Environment Variables:**
   ```bash
   # Add to your .env file or GitHub Secrets
   GROQ_API_KEY=gsk_your_key_here
   AI_PROVIDER=groq
   SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Run AI Manager:**
   ```bash
   node scripts/ai-database-manager.js
   ```

### Option 2: Using Hugging Face API

1. **Get Hugging Face Token:**
   ```bash
   # Sign up at https://huggingface.co/
   # Create access token and copy it
   ```

2. **Set Environment Variables:**
   ```bash
   HF_TOKEN=hf_your_token_here
   AI_PROVIDER=huggingface
   SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Run AI Manager:**
   ```bash
   node scripts/ai-database-manager.js
   ```

### Option 3: Using OpenAI API

1. **Get OpenAI API Key:**
   ```bash
   # Sign up at https://platform.openai.com/
   # Create API key and copy it
   ```

2. **Set Environment Variables:**
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   AI_PROVIDER=openai
   SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Run AI Manager:**
   ```bash
   node scripts/ai-database-manager.js
   ```

### Option 4: Using Local AI (Ollama) - Completely Free

1. **Install Ollama:**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Download Model:**
   ```bash
   ollama pull llama3
   ```

3. **Set Environment Variables:**
   ```bash
   AI_PROVIDER=local
   SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Run AI Manager:**
   ```bash
   node scripts/ai-database-manager.js
   ```

## GitHub Actions Setup

### Add Secrets to GitHub Repository

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `GROQ_API_KEY`: Your Groq API key (or other AI provider)
   - `AI_PROVIDER`: `groq` (or `openai`, `huggingface`, `local`)

### Workflow Schedule

The GitHub Actions workflow is configured to run:
- **Every 6 hours** automatically
- **On manual trigger** (via workflow_dispatch)
- **When pathways.json changes**

### Workflow Actions

The AI manager will:
1. Analyze database health
2. Identify issues and anomalies
3. Get AI-powered recommendations
4. Execute optimizations automatically
5. Create GitHub issues if critical errors occur

## What the AI Manager Does

### Database Health Monitoring
- Checks pathway activation rates
- Monitors calculation error rates
- Analyzes recent calculation volume
- Identifies performance bottlenecks

### AI-Powered Recommendations
- Suggests cache refresh strategies
- Recommends index optimizations
- Identifies inactive pathways
- Proposes partitioning strategies for large datasets

### Automated Actions
- Refreshes materialized view caches
- Reviews inactive pathways
- Optimizes database indexes
- Generates health reports

## Customization

### Modify Health Checks
Edit `getDatabaseHealth()` in `scripts/ai-database-manager.ts` to add custom health checks.

### Modify Recommendations
Edit `getRuleBasedRecommendations()` to add custom rule-based recommendations.

### Modify AI Prompts
Edit the prompt in `getAIRecommendations()` to customize AI behavior.

## Cost Analysis

### Free Tier Options
- **Groq:** $0/month (recommended)
- **Hugging Face:** $0/month
- **Ollama:** $0/month (local)
- **OpenAI:** $5 free credit (limited)

### Usage Estimates
- **Daily AI calls:** 4 (every 6 hours)
- **Tokens per call:** ~500 tokens
- **Monthly tokens:** ~60,000 tokens
- **Cost:** $0/month on free tiers

## Troubleshooting

### AI API Errors
If AI API fails, the system automatically falls back to rule-based recommendations.

### No API Key
If no API key is provided, the system uses rule-based recommendations (no AI needed).

### GitHub Actions Failures
Check the Actions tab for detailed logs. The workflow will create a GitHub issue if it fails.

### Local AI Not Running
Ensure Ollama is installed and running: `ollama serve`

## Security

### API Key Storage
- Store API keys in GitHub Secrets (never in code)
- Use environment variables locally
- Never commit API keys to repository

### Access Control
- GitHub Actions uses repository secrets
- AI manager only has read access to database
- No write operations without explicit authorization

## Monitoring

### AI Manager Logs
- Console output during execution
- GitHub Actions logs
- Database logs in Supabase

### Health Reports
- AI manager generates health reports
- Stored in `match_calculation_logs` table
- Accessible via Supabase dashboard

## Advanced Features

### Custom AI Models
You can use any model from:
- Groq: https://groq.com/docs/models
- Hugging Face: https://huggingface.co/models
- Ollama: https://ollama.com/library

### Multi-Provider Setup
Configure multiple AI providers for redundancy:
```bash
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk_...
AI_PROVIDER=groq  # Primary
AI_BACKUP_PROVIDER=openai  # Fallback
```

### Custom Workflows
Create custom GitHub Actions workflows for specific tasks:
- Daily backups
- Weekly health reports
- Monthly optimization reviews

## Support

For issues with:
- **Groq API:** https://console.groq.com/docs
- **Hugging Face:** https://huggingface.co/docs
- **OpenAI:** https://platform.openai.com/docs
- **Ollama:** https://ollama.com/docs

## Summary

**Recommended Setup:**
1. Use Groq API (free, fast, generous limits)
2. Set up GitHub Actions for automation
3. Run every 6 hours for optimal monitoring
4. Fallback to rule-based if AI unavailable

**Total Cost:** $0/month
