import { GoogleGenAI } from "@google/genai";

export const askWingman = async (prompt: string, history: string[] = []): Promise<string> => {
  // Initialize the Gemini client using Google Cloud Platform credentials
  // For production with GCP, use GOOGLE_APPLICATION_CREDENTIALS environment variable
  // or service account authentication
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API key not configured");
    return "Wingman AI services are not configured. Please contact support.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a context-aware prompt
    const contextPrompt = `
      You are "Wingman", an AI aviation assistant for the PilotRecognition platform.
      Your goal is to assist student pilots and instructors with aviation knowledge, 
      regulations (FAA/EASA), weather interpretation, and flight planning.
      
      Maintain a professional, safety-oriented, yet encouraging tone.
      Always prioritize safety. If a question is critical to immediate flight safety, 
      remind the user to consult their official Flight Operations Manual or instructor.
      
      Current User Query: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contextPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    return response.text || "I copy, but I couldn't process that request. Please say again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Communication failure. Unable to reach Wingman AI services at this time.";
  }
};