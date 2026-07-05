# Recognition AI

Recognition AI is the conversational copilot inside the Recognition+ platform. It sits in the right seat like a senior first officer who has already been through the hiring gauntlet — giving pilots friendly, contextual advice on career pathways, airline fit, verification, and the wider aviation market.

> **Current architecture:** Rule-based keyword matching with randomized, profile-aware responses. No LLM backend is connected yet.

---

## Tone & Voice

- **Pilot-to-pilot.** Speak like a knowledgeable colleague, not a help desk bot.
- **First-name friendly.** Uses the pilot's first name when available (`profile.first_name` or `profile.name`).
- **Conversational.** Handles small talk, thanks, jokes, and goodbyes naturally.
- **Encouraging but honest.** Celebrates progress, but doesn't sugarcoat hour requirements or medical currency.

---

## Conversational Features

### 1. Small Talk Handlers

The chat recognizes casual social cues and replies with varied, human-sounding responses.

| Trigger | Examples |
| --- | --- |
| Greetings | `hi`, `hello`, `hey`, `howdy` |
| `how are you` | General check-in |
| Thanks | `thanks`, `thank you`, `appreciate`, `cheers` |
| Laughter | `haha`, `lol`, `😂`, `🤣` |
| Goodbyes | `bye`, `goodbye`, `see ya`, `later`, `talk soon` |
| Capability | `what can you do`, `help`, `who are you` |

### 2. Context Memory (`lastTopic`)

When a reply belongs to a known topic (e.g., pathways, eligibility, score, medical), the chat stores the topic in `lastTopic`. If the user later says something like `tell me more`, `what else`, or `continue`, Recognition AI references the stored topic instead of starting over.

### 3. Pilot Sign-Offs

About 40% of assistant replies end with a random aviation sign-off:

- Blue skies!
- Tailwinds!
- Keep the shiny side up!
- See you at FL350!
- Godspeed!
- Smooth skies ahead!

### 4. Follow-Up Chips

After every assistant reply, a row of quick-reply chips appears so the user can keep the conversation flowing without typing:

- Which airlines fit me?
- How do I get verified?
- What's my score?
- Any good pathways right now?

---

## Career Advice Topics

Recognition AI covers the following domains with profile-aware, hour-based guidance:

- **Pathways & Career Routes** — advice based on total flight hours (`< 200`, `200–1500`, `1500+`).
- **Eligibility & Compliance** — 1,500-hour / ATPL / Class 1 / recency requirements.
- **Market Outlook & Hiring** — global shortage, regional demand, verified priority.
- **Recognition Score** — how verification, wallet docs, profile completeness, and recency affect ranking.
- **Medical & Certificates** — current Class 1 medical requirements and ELP reminders.
- **Logbook & Flight Hours** — PIC, XC, night, instrument breakdowns and sync tips.
- **Airline Matches** — which carriers align with the pilot's profile.
- **ATO & Training** — ATO verification and score weight.
- **Recognition+ Upgrade** — benefits of unlimited AI, priority pulls, and verified status.
- **Wallet & Credentials** — tamper-proof document storage and instant airline visibility.
- **ATPL & Type Ratings** — when to pursue type ratings and ATPL theory.

If no specific topic is detected, the chat falls back to a friendly, open-ended offer to help.

---

## Daily Free Limit

Non-Recognition+ users get **3 free questions per day**. The remaining count is shown in the header badge. When the limit is reached, the AI suggests upgrading to Recognition+ to continue the briefing.

---

## Extending Recognition AI

Because the current system is rule-based, improvements are straightforward:

1. Add new keyword branches in the `handleSend` function.
2. Add more variants to the `pick(...)` arrays for richer replies.
3. Add new sign-offs to `maybeSignOff()`.
4. Add new follow-up chips to `FOLLOW_UPS`.
5. Track more topics in `lastTopic` for deeper context memory.

Future upgrades may include:

- LLM backend (e.g., Cloudflare Workers AI) for open-ended answers.
- Streaming responses.
- Persistent chat history.
- Tool / function calling for profile actions.

---

## File Location

`components/website/components/unified-platform/RecognitionAIChat.tsx`
