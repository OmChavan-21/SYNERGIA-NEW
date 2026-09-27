import { GoogleGenAI } from '@google/genai';
import { matchmakerPrompt, generateTasksPrompt, checkInFeedbackPrompt } from './ai-prompts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTeamsWithAI(project: any, students: any[]) {
  const prompt = matchmakerPrompt(project, students);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response for teams", e);
    return null;
  }
}

export async function generateTasksWithAI(project: any, roles: string[]) {
  const prompt = generateTasksPrompt(project, roles);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response for tasks", e);
    return null;
  }
}

export async function generateFeedbackWithAI(checkIn: any) {
  const prompt = checkInFeedbackPrompt(checkIn);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response for feedback", e);
    return null;
  }
}
