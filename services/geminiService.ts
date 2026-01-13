
import { GoogleGenAI } from "@google/genai";

export const getMovieAIInsight = async (movieTitle: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, 2-sentence fascinating fact about the movie "${movieTitle}". Keep it engaging for a streaming platform audience.`,
    });
    return response.text || "AI insight currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The stars are currently aligned elsewhere. AI insight is offline.";
  }
};

export const getAIPersonalizedRecommendations = async (userHistory: string[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const historyText = userHistory.length > 0 ? userHistory.join(", ") : "Action and Sci-Fi masterpieces";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user has recently watched or expressed interest in: ${historyText}. 
      Based on this specific taste, suggest exactly ONE movie title they should watch next that is NOT in the provided list.
      Provide the response in this format: 
      "Title: [Movie Name] | Genre: [Genre] | Why: [One concise sentence explaining why this fits their specific taste profile]."`,
    });
    
    return response.text || "Adventure awaits! Check out our top trending picks today.";
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return "Explore our latest trending titles to find your next favorite!";
  }
};
