// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generateDailyPrompts(count: number = 5): Promise<any[]> {
  const prompt = `
Generate ${count} unique daily journal prompts.

Return ONLY valid JSON in this exact format:
[
  {
    "id": 1,
    "category": "Growth",
    "question": "What limiting belief are you ready to let go of?",
    "color": "#FFE5B4",
    "categoryColor": "#FF8C42"
  }
]

Rules:
- id must start at 1 and increment
- category must be one of:
  Emotional, Growth, Gratitude, Reflection, Purpose, Relationships
- question must be short and thoughtful
- color and categoryColor must be valid hex colors
- NO markdown
- NO explanation
`;

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const text = result.text;
  console.log(text);
  if (!text) {
    throw new Error("ads");
  }
  return JSON.parse(text);
}
// utils/geminiCache.ts

const STORAGE_KEY = "dailyPrompts";
const DATE_KEY = "dailyPromptsDate";

export async function getDailyPrompts(count = 5) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const cachedDate = localStorage.getItem(DATE_KEY);
  const cachedData = localStorage.getItem(STORAGE_KEY);

  if (cachedDate === today && cachedData) {
    // Return cached prompts
    return JSON.parse(cachedData);
  }

  // Generate new prompts
  const prompts = await generateDailyPrompts(count);

  // Cache them
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  localStorage.setItem(DATE_KEY, today);

  return prompts;
}
