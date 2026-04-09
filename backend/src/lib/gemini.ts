import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

let genAI: GoogleGenerativeAI | null = null;

export const getGeminiClient = (): GoogleGenerativeAI | null => {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] No GEMINI_API_KEY found in env. Gemini AI features disabled.');
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
};
