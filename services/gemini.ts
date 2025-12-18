
import { GoogleGenAI } from "@google/genai";

// Declare process for TypeScript as we are using it via Vite's define
declare var process: {
  env: {
    API_KEY: string;
  };
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API_KEY is not defined. Please check your Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getSmartRecommendations = async (userInput: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user says: "${userInput}". Suggest 3 food items. Max 15 words.`,
    });
    return response.text || "Try our Burger Palace!";
  } catch (error) {
    console.error("AI Error:", error);
    return "Chef's special recommended!";
  }
};

export const getOrderSummaryAI = async (items: string[]) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize order: ${items.join(", ")}. Short and sweet.`,
    });
    return response.text || "Your meal is on the way!";
  } catch (error) {
    return "Order confirmed!";
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze stats: ${JSON.stringify(stats)}. Give one business tip.`,
    });
    return response.text || "Operations normal.";
  } catch (error) {
    return "Maintain growth strategy.";
  }
};
