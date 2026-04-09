import { GoogleGenAI } from "@google/genai";

export const askWingman = async (prompt: string, history: string[] = []): Promise<string> => {
  // Initialize the Gemini client using the API key from the environment variables directly.
  // As per guidelines, we assume process.env.API_KEY is pre-configured and valid.
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Construct a context-aware prompt
    const contextPrompt = `
      You are "Wingman", an AI aviation assistant for the WingMentor platform.
      Your goal is to assist student pilots and instructors with aviation knowledge, 
      regulations (FAA/EASA), weather interpretation, and flight planning.
      
      Maintain a professional, safety-oriented, yet encouraging tone.
      Always prioritize safety. If a question is critical to immediate flight safety, 
      remind the user to consult their official Flight Operations Manual or instructor.
      
      Current User Query: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Low latency for chat
      }
    });

    return response.text || "I copy, but I couldn't process that request. Please say again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Communication failure. Unable to reach Wingman AI services at this time.";
  }
};