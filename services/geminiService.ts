
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMovieAIInsight = async (movieTitle: string): Promise<string> => {
  try {
    const ai = getAI();
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
    const ai = getAI();
    const historyText = userHistory.length > 0 ? userHistory.join(", ") : "Action and Sci-Fi";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on a user who likes these movies: ${historyText}, what genre should they explore next? Give a 1-word genre and a 1-sentence explanation why.`,
    });
    return response.text || "Adventure awaits!";
  } catch (error) {
    return "Check out our latest trending titles!";
  }
};
