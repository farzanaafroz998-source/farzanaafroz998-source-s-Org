
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartRecommendations = async (userInput: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user says: "${userInput}". Based on this context, suggest 3 specific food items or cuisines. Keep it under 20 words.`,
      config: { temperature: 0.7 }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Craving something good? Try our top-rated Burger Palace!";
  }
};

export const getOrderSummaryAI = async (items: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this food order for a receipt: ${items.join(", ")}. Mention why it's a great choice.`,
    });
    return response.text;
  } catch (error) {
    return "Great choice! Your delicious meal is being prepared.";
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these platform stats: ${JSON.stringify(stats)}. Give one high-level strategic recommendation for the delivery platform owner.`,
    });
    return response.text;
  } catch (error) {
    return "Consistently high order volume observed. Consider expanding rider pool.";
  }
};
