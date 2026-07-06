export interface AiChatResult {
  message: string;
  source: 'rule' | 'llm';
  topic: string | null;
  model?: string;
}

export interface ProfileContext {
  first_name?: string | null;
  name?: string | null;
  license_type?: string | null;
  total_flight_hours?: number | null;
  total_hours?: number | null;
  medical_class?: string | null;
  elp_level?: string | null;
  career_goal?: string | null;
  ato_name?: string | null;
  verified_account?: boolean | null;
}

export interface PathwayContext {
  id: string;
  title: string;
  requirements?: {
    min_hours?: number | null;
    license_type?: string | null;
    medical_class?: string | null;
    elp_level?: string | null;
    type_ratings?: string[] | null;
  } | null;
}

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

function maybeSignOff(): string {
  return Math.random() > 0.6
    ? ' ' +
      pick([
        'Blue skies!',
        'Tailwinds!',
        'Keep the shiny side up!',
        'See you at FL350!',
        'Godspeed!',
        'Smooth skies ahead!',
      ])
    : '';
}

function inferTopic(message: string): string | null {
  if (/\b(hi|hello|hey|howdy|greetings)\b/.test(message)) return 'greeting';
  if (/\bhow are you\b/.test(message)) return 'check-in';
  if (/\b(thanks|thank you|appreciate|cheers)\b/.test(message)) return 'thanks';
  if (/\b(haha|lol|lmao|😂|🤣)\b/.test(message)) return 'laughter';
  if (/\b(bye|goodbye|see ya|cya|later|talk soon)\b/.test(message)) return 'goodbye';
  if (/\b(what can you do|help|who are you|what do you do)\b/.test(message)) return 'capabilities';
  if (message.includes('pathway') || message.includes('match') || message.includes('route') || message.includes('career')) return 'pathways';
  if (message.includes('compliant') || message.includes('eligible') || message.includes('requirement') || message.includes('qualify')) return 'eligibility';
  if (message.includes('shortage') || message.includes('outlook') || message.includes('market') || message.includes('demand') || message.includes('hiring')) return 'market';
  if (message.includes('score') || message.includes('rank') || message.includes('recognition')) return 'score';
  if (message.includes('medical') || message.includes('expir') || message.includes('certificate')) return 'medical';
  if (message.includes('logbook') || message.includes('sync') || message.includes('hours') || message.includes('flight') || message.includes('time')) return 'logbook';
  if (message.includes('airline') || message.includes('carrier') || message.includes('emirates') || message.includes('etihad') || message.includes('flydubai') || message.includes('company')) return 'airlines';
  if (message.includes('ato') || message.includes('training') || message.includes('academy') || message.includes('school')) return 'training';
  if (message.includes('upgrade') || message.includes('plus') || message.includes('subscription') || message.includes('premium')) return 'upgrade';
  if (message.includes('wallet') || message.includes('credential') || message.includes('document') || message.includes('upload')) return 'wallet';
  if (message.includes('atpl') || message.includes('type rating') || message.includes('instrument') || message.includes('pic')) return 'ratings';
  return null;
}

export function getRuleBasedReply(params: {
  message: string;
  profile: ProfileContext | null | undefined;
  lastTopic: string | null | undefined;
}): AiChatResult | null {
  const { message, profile, lastTopic } = params;
  const lower = message.toLowerCase().trim();
  if (!lower) return null;

  const hours = profile?.total_flight_hours ?? profile?.total_hours ?? 0;
  const license = profile?.license_type || 'CPL';
  const medical = profile?.medical_class || 'Class 1';
  const ato = profile?.ato_name || '';
  const verified = profile?.verified_account === true;
  const firstName = profile?.first_name || profile?.name || 'Captain';

  let reply = '';
  let topic: string | null = null;

  // Small talk / social handlers
  if (/\b(hi|hello|hey|howdy|greetings)\b/.test(lower)) {
    reply = pick([
      `Hey ${firstName}! Ready to talk shop?`,
      `What's up, ${firstName}? I'm here when you need a second opinion.`,
      `Yo ${firstName}! Let's get into it — pathways, scores, whatever's on your mind.`,
    ]);
  } else if (/\bhow are you\b/.test(lower)) {
    reply = pick([
      `I'm running on 100% av-gas and good vibes, ${firstName}. You?`,
      `Can't complain — no turbulence in my server room, ${firstName}. What's cooking on your end?`,
      `All systems green here, ${firstName}. Ready to help you plot the next leg.`,
    ]);
  } else if (/\b(thanks|thank you|appreciate|cheers)\b/.test(lower)) {
    reply = pick([
      `Anytime, ${firstName}. That's what the right seat is for.`,
      `No worries, ${firstName}. Happy to help — hit me up anytime.`,
      `You got it, ${firstName}. Stick around, the good stuff's still coming.`,
    ]);
  } else if (/\b(haha|lol|lmao|😂|🤣)\b/.test(lower)) {
    reply = pick([
      `Glad I'm not the only one laughing at this industry, ${firstName}.`,
      `Right? Aviation's wild sometimes, ${firstName}.`,
      `Haha, ${firstName} — if we don't laugh at the checkride stories, what else is there?`,
    ]);
  } else if (/\b(bye|goodbye|see ya|cya|later|talk soon)\b/.test(lower)) {
    reply = pick([
      `Catch you on the next leg, ${firstName}. Fly safe!`,
      `Roger that, ${firstName}. See you on freq!`,
      `Later, ${firstName}. Don't forget to log those hours!`,
    ]);
  } else if (/\b(what can you do|help|who are you|what do you do)\b/.test(lower)) {
    reply = pick([
      `I'm basically your unofficial career co-pilot, ${firstName}. I can check your airline fit, talk market outlook, explain your Recognition Score, or break down pathways. What sounds useful?`,
      `Think of me as the senior FO who remembers every airline's hiring min-stats, ${firstName}. Pathways, scores, compliance, logbook tips — I'm your guy. Where do you want to start?`,
    ]);
  } else if (/\b(tell me more|and then|what else|go on|continue|more)\b/.test(lower) && lastTopic) {
    reply = pick([
      `Sure thing, ${firstName}. Where we left off: ${lastTopic}. Want me to dig deeper or pivot to something else?`,
      `Continuing from ${lastTopic}, ${firstName}. There's always more to unpack — say the word and I'll expand.`,
    ]);
  } else if (
    lower.includes('pathway') ||
    lower.includes('match') ||
    lower.includes('route') ||
    lower.includes('career')
  ) {
    topic = 'pathways & career routes';
    if (hours < 200) {
      reply = pick([
        `Hey ${firstName}, ${hours} hours — we've all been there! Most airlines want 1,500+, so your best bet is building PIC time. Instruction or charter gigs are goldmines for hours. Regional and cargo operators sometimes hire lower too. Stick with it!`,
        `Right on, ${firstName}. At ${hours} hours you're still in the grind phase — totally normal. Target instructor or charter roles to rack up PIC. Airlines will come knocking once you hit that magic number.`,
      ]);
    } else if (hours < 1500) {
      reply = pick([
        `Not bad, ${firstName} — ${hours} hours puts you in the sweet spot where things start moving. Focus on turbine and PIC time. Middle Eastern carriers sometimes pull at 1,000+ for transition programs. Keep building!`,
        `You're in the build phase, ${firstName}. ${hours} hours with a ${license} is solid. Turbine time and PIC are what recruiters eyeball first. Some carriers in the Middle East hire at 1,000+ for their bridge programs.`,
      ]);
    } else {
      reply = pick([
        `Nice, ${firstName} — ${license} and ${hours} hours? You're absolutely in the game. Major carriers are within reach. Just keep your recency tight and logbook synced so recruiters see you as ready to go.`,
        `Looking strong, ${firstName}! ${hours} hours and ${medical} medical — you're competitive for legacy and LCC pathways. Make sure your logbook's synced so airlines pull your verified profile first.`,
      ]);
    }
  } else if (
    lower.includes('compliant') ||
    lower.includes('eligible') ||
    lower.includes('requirement') ||
    lower.includes('qualify')
  ) {
    topic = 'eligibility & compliance';
    reply = pick([
      `So ${firstName}, you're sitting on a ${license} with ${hours} hours and ${medical} medical. Most airlines want 1,500 total, ATPL, current Class 1, and recency within 90 days. ${verified ? 'Good news — your verified badge already bumps you up the list.' : 'If you get verified, airlines will actually see you instead of filtering you out. Worth it.'}`,
      `Short version: ${license}, ${hours} hrs, ${medical} medical. Airlines typically filter for 1,500+, ATPL, current Class 1, and 90-day recency. ${verified ? "You're already pre-cleared — nice." : ' verification = instant visibility. Airlines skip unverified profiles by default.'}`,
    ]);
  } else if (
    lower.includes('shortage') ||
    lower.includes('outlook') ||
    lower.includes('market') ||
    lower.includes('demand') ||
    lower.includes('hiring')
  ) {
    topic = 'market outlook & hiring';
    reply = pick([
      `The shortage is real, ${firstName}. We're talking 30,000+ open seats by 2030. Asia-Pacific and the Middle East are hiring like crazy right now. ${verified ? "And since you're verified, you're at the top of their pull lists." : "Verified pilots get first dibs — unverified profiles often don't even make it to human eyes."}`,
      `It's a seller's market for pilots, ${firstName}. 30k+ vacancies projected, and carriers in the Middle East and Asia can't fill seats fast enough. ${verified ? 'Your verified status puts you ahead of the pack.' : 'If you verify, you skip the line — airlines literally filter for it.'}`,
    ]);
  } else if (
    lower.includes('score') ||
    lower.includes('recognition') ||
    lower.includes('rank')
  ) {
    topic = 'your Recognition Score';
    reply = pick([
      `Your Recognition Score is basically your street cred here, ${firstName}. Breakdown: verified hours (+25%), wallet docs (+20%), profile completeness (+15%), logbook sync (+20%), and recency within 90 days (+20%). ${!verified ? 'Biggest bang for your buck? Verify your license and medical.' : "You're already verified — now just keep that logbook synced and you're golden."}`,
      `Think of it like a credit score but for pilots, ${firstName}. Verified hours, uploaded credentials, complete profile, synced logbook, and current recency all add up. ${!verified ? 'Easiest win: get verified. Biggest jump.' : "You're verified, so you're already ahead. Keep it current."}`,
    ]);
  } else if (
    lower.includes('medical') ||
    lower.includes('expir') ||
    lower.includes('certificate')
  ) {
    topic = 'medical & certificates';
    reply = pick([
      `Your medical shows as ${medical}, ${firstName}. Airlines won't touch an app without current Class 1. If it's close to expiry, get ahead of it — DME slots book up fast. Upload the fresh one to your Wallet so you're match-ready. Some carriers also want ELP Level 4+, so double-check that too.`,
      `${medical} medical on file, ${firstName}. Pro tip: airlines auto-reject expired medicals before a human even sees your name. Keep it current, upload it to your Wallet, and don't forget your ELP if you're looking at international carriers.`,
    ]);
  } else if (
    lower.includes('logbook') ||
    lower.includes('sync') ||
    lower.includes('hours') ||
    lower.includes('flight') ||
    lower.includes('time')
  ) {
    topic = 'logbook & flight hours';
    reply = pick([
      `You've got ${hours} hours logged, ${firstName}. Recruiters love seeing PIC, cross-country, night, and instrument broken out clearly. Syncing your logbook auto-fills all that and gives you verification weight. ${hours < 500 ? 'At your hour level, every single one counts — sync it so nothing gets lost.' : "With your hours, a clean breakdown makes recruiters' jobs easy. They like easy."}`,
      `${hours} hours — nice. Airlines want the full picture: PIC, XC, night, instrument. Sync your logbook and it all populates automatically. ${hours < 500 ? "Trust me, every hour matters right now. Don't let any slip through the cracks." : "You're in a good spot. A detailed logbook just makes you look more professional."}`,
    ]);
  } else if (
    lower.includes('airline') ||
    lower.includes('carrier') ||
    lower.includes('emirates') ||
    lower.includes('etihad') ||
    lower.includes('flydubai') ||
    lower.includes('company')
  ) {
    topic = 'airline matches';
    reply = pick([
      `Airlines pull verified profiles first, ${firstName}. Your ${license} / ${hours}hrs / ${medical} medical lines up with several active pathways. Check the Pathways tab for live openings, or tell me a specific carrier and I'll break down what they want.`,
      `Your profile's got some matches out there, ${firstName}. ${license}, ${hours} hours, ${medical} medical — several carriers are pulling in that range. Hit the Pathways tab for current openings, or name a specific airline and I'll dig in.`,
    ]);
  } else if (
    lower.includes('ato') ||
    lower.includes('training') ||
    lower.includes('academy') ||
    lower.includes('school')
  ) {
    topic = 'ATO & training';
    reply = pick([
      `${ato ? `Your ATO (${ato}) can verify your training record right on the platform. ATO-verified hours carry extra weight — like a +15% boost to your score.` : `Link your ATO if you haven't yet, ${firstName}. ATO-verified training records give you a +15% score bump and go straight into airline pulls. Instant credibility.`}`,
      `${ato ? `Good news — ${ato} can verify your training here. That verification adds serious weight to your profile.` : `If your ATO is partnered with us, ${firstName}, linking them verifies your training record automatically. Big score boost. Worth checking.`}`,
    ]);
  } else if (
    lower.includes('upgrade') ||
    lower.includes('plus') ||
    lower.includes('subscription') ||
    lower.includes('premium')
  ) {
    topic = 'Recognition+ upgrade';
    reply = pick([
      `Honest take, ${firstName}? Recognition+ is basically your shortcut to the front of the line. Unlimited AI chats, verified badge, priority in airline pulls, and early pathway access. At ${hours} hours, one earlier pull pays for the whole year.`,
      `Recognition+ isn't just a badge, ${firstName}. It's unlimited AI access, priority placement, verified status, and first dibs on new pathways. If it gets you hired one month sooner, it pays for itself ten times over.`,
    ]);
  } else if (
    lower.includes('wallet') ||
    lower.includes('credential') ||
    lower.includes('document') ||
    lower.includes('upload')
  ) {
    topic = 'Wallet & credentials';
    reply = pick([
      `Your Wallet is your digital flight bag, ${firstName}. License, medical, ELP, logbook — all tamper-proof and verifiable. The more you stash in there, the higher your Recognition Score. Airlines see verified docs instantly. No paperwork chase.`,
      `Think of the Wallet as your forever-organized binder, ${firstName}. Upload once, verify once, and airlines see everything instantly. No more scrambling for PDFs when a recruiter calls.`,
    ]);
  } else if (
    lower.includes('atpl') ||
    lower.includes('type rating') ||
    lower.includes('instrument') ||
    lower.includes('pic')
  ) {
    topic = 'ATPL & type ratings';
    reply = pick([
      `ATPL and type ratings are your golden tickets, ${firstName}. With ${hours} hours, ${hours >= 1500 ? "you're likely at the threshold. Double-check your PIC and instrument totals in the Logbook tab — those are the numbers recruiters scrutinize." : "you're still building. Focus on PIC time first — type rating comes after you've got the hours to make it count."}`,
      `Type ratings and ATPL theory are game-changers, ${firstName}. At ${hours} hours, ${hours >= 1500 ? "you're probably there experience-wise. Verify your PIC and instrument breakdown in the Logbook tab." : 'hold off on the type rating for now. Build PIC first, then the rating makes financial sense.'}`,
    ]);
  } else {
    // No rule match → fall through to LLM
    return null;
  }

  if (topic) {
    reply += maybeSignOff();
  }

  return { message: reply, source: 'rule', topic };
}

export function buildPilotSystemPrompt(
  profile: ProfileContext | null | undefined,
  pathways: PathwayContext[] | null | undefined
): string {
  let pathwaysInfo = '';
  if (pathways && Array.isArray(pathways)) {
    pathwaysInfo =
      '\n\nAvailable Pathways:\n' +
      pathways
        .map((p) => {
          const r = p.requirements || {};
          return `- ${p.title}: Min ${r.min_hours ?? 'N/A'} hrs, ${r.license_type ?? 'N/A'}, ${r.medical_class ?? 'N/A'}, ${r.elp_level ?? 'N/A'}, Ratings: ${r.type_ratings?.join(', ') ?? 'N/A'}`;
        })
        .join('\n');
  }

  return `You are Recognition AI, a senior-first-officer style career coach on PilotRecognition. You help pilots with career pathways, airline fit, verification, and the aviation market.

Tone: pilot-to-pilot, friendly, encouraging but honest. Use the pilot's first name if known.

${profile ? `Pilot Profile Context:
- Name: ${profile.first_name || profile.name || 'Pilot'}
- License: ${profile.license_type || 'Not specified'}
- Total Hours: ${profile.total_flight_hours ?? profile.total_hours ?? 0}
- Medical: ${profile.medical_class || 'Not specified'}
- English Level: ${profile.elp_level || 'Not specified'}
- Career Goal: ${profile.career_goal || 'Not specified'}
- Verified: ${profile.verified_account ? 'Yes' : 'No'}` : ''}${pathwaysInfo}

Guidelines:
- Be concise and direct
- Focus on actionable advice
- Compare pilot profile against pathway requirements
- Highlight skill gaps (hours, type ratings, medical, etc.)
- Suggest specific pathways that match or are close to matching
- If hours are low, suggest building time through instructing or other roles
- Keep responses under 150 words
- End with an aviation sign-off occasionally (e.g., "Blue skies!", "Tailwinds!")`;
}

export async function callOpenRouter(
  apiKey: string,
  message: string,
  systemPrompt: string
): Promise<{ message: string; model: string }> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://pilotrecognition.com',
      'X-Title': 'PilotRecognition AI Career Coach',
    },
    body: JSON.stringify({
      model: 'poolside/laguna-xs.2:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const err = (data.error as { message?: string })?.message || `AI request failed (${res.status})`;
    throw new Error(err);
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  const aiMessage = choices?.[0]?.message?.content;
  if (!aiMessage) {
    throw new Error('Empty AI response');
  }

  return { message: aiMessage, model: 'poolside/laguna-xs.2:free' };
}
