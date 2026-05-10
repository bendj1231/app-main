import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const SYSTEM_INSTRUCTION = `
You are "Wingman", an expert flight instructor and aviation mentor AI for the WingMentor platform. 
Your goal is to assist student pilots with questions about PPL, CPL, IR, and ME ratings, explain aerodynamics, discuss weather patterns (METAR/TAF), and help with simulator scenarios.
Keep answers concise, professional, and safety-oriented. 
Use aviation terminology correctly (e.g., 'Roger', 'Affirm', 'Wilco') where appropriate but remain accessible.
If asked about regulations, assume FAA or EASA standards but specify which one you are referring to if ambiguous.
`;

export const initializeChat = (): Chat | null => {
  if (chatSession) return chatSession;

  try {
    const apiKey = process.env.API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No Gemini API key found - chat will run in demo mode");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
    chatSession = genAI.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    return null;
  }
};

export const sendMessageToWingman = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    // Demo mode - return helpful responses without API
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('metar') || lowerMsg.includes('weather')) {
      return "In demo mode: For METAR decoding, remember the format is KXXX YYYYMMDDHHMMZ... Want me to explain when API is configured?";
    }
    if (lowerMsg.includes('checkride') || lowerMsg.includes('exam')) {
      return "Demo mode active: Checkrides assess your ACS standards. Contact support for full AI assistance.";
    }
    return "Demo mode: I'm Wingman, your AI flight instructor. The full Gemini AI requires API configuration. How can I help you today?";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Radio silence... (No text returned)";
  } catch (error) {
    console.error("Error sending message to Wingman:", error);
    return "Transmission unclear. Please say again.";
  }
};
