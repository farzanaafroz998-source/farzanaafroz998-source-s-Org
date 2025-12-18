
import { GoogleGenAI } from "@google/genai";

// API Key is injected via Vite's define in vite.config.ts
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing. Please set it in Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

export const getSmartRecommendations = async (userInput: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user says: "${userInput}". Based on this context, suggest 3 specific food items or cuisines. Keep it under 20 words.`,
      config: { 
        temperature: 0.7,
        topP: 0.95,
        topK: 40
      }
    });
    
    // .text is a property, not a method
    return response.text || "Craving something good? Try our top-rated Burger Palace!";
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return "Try our special Chef's choice today!";
  }
};

export const getOrderSummaryAI = async (items: string[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this food order for a receipt: ${items.join(", ")}. Mention why it's a great choice. Keep it friendly and concise.`,
    });
    return response.text || "Great choice! Your meal is being prepared.";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Your delicious meal is being prepared with care.";
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex analytics
      contents: `Analyze these platform stats: ${JSON.stringify(stats)}. Give one high-level strategic recommendation for the delivery platform owner.`,
    });
    return response.text || "Consistently high order volume observed. Consider expanding rider pool.";
  } catch (error) {
    console.error("AI Admin Insights Error:", error);
    return "System performing optimally. Maintain current growth strategy.";
  }
};
