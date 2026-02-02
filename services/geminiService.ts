
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AIAnalysisResult } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeProfileAndRecommend(profile: UserProfile): Promise<AIAnalysisResult> {
    const prompt = `
      Act as an expert Indian SEBI-registered financial advisor. 
      Analyze the following user profile:
      Name: ${profile.name}
      Age: ${profile.age}
      Occupation: ${profile.occupation}
      Monthly Income: ₹${profile.monthlyIncome}
      Risk Tolerance: ${profile.riskTolerance}

      Based on current Indian market conditions (Sensex, Nifty 50), provide:
      1. A short summary of their risk profile and investment strategy.
      2. A list of exactly 5 top Indian stocks (NSE/BSE) that suit them right now.
      
      For each stock, include a target price, 2-3 recent news highlights, and 2-3 key financial metrics (like P/E ratio, Market Cap, or YoY Growth).

      Format your response as a JSON object strictly following this structure:
      {
        "riskProfile": "string explaining their profile",
        "marketSummary": "Current Indian market outlook for this user",
        "recommendations": [
          {
            "symbol": "NSE/BSE Symbol",
            "companyName": "Full Name",
            "reason": "Detailed reasoning based on profile and market",
            "sector": "Sector Name",
            "confidence": 1-100,
            "targetPrice": "Estimated price with currency",
            "newsHighlights": ["Recent headline 1", "Recent headline 2"],
            "keyMetrics": ["Metric 1: Value", "Metric 2: Value"]
          }
        ]
      }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Market Source',
        uri: chunk.web?.uri || ''
      }))
      .filter((s: any) => s.uri) || [];

    return {
      ...result,
      sources
    };
  }

  async chat(message: string, history: { role: 'user' | 'model', text: string }[], profile: UserProfile) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are ArthaAI, a specialized Indian Stock Market expert. User: ${profile.name}, Age: ${profile.age}, Occupation: ${profile.occupation}. Always focus on the Indian market (NSE, BSE). Be helpful, accurate, but include a financial disclaimer. Use Google Search for real-time data.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }
}

export const geminiService = new GeminiService();
