import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true,
  baseURL: "https://api.groq.com/openai/v1",
});

const openRouter = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "",
  dangerouslyAllowBrowser: true,
  baseURL: "https://openrouter.ai/api/v1",
});

export type AIProvider = "google" | "groq" | "openrouter";

export async function generateContent(prompt: string, initialProvider: AIProvider = "groq") {
  const providers: AIProvider[] = ["groq", "google", "openrouter"];
  // Move initial provider to front
  const sessionProviders = [
    initialProvider,
    ...providers.filter(p => p !== initialProvider)
  ];

  let lastError = null;

  for (const provider of sessionProviders) {
    try {
      if (provider === "google") {
        const key = import.meta.env.VITE_GOOGLE_AI_KEY;
        if (!key) {
           console.error("Google AI Key missing. Restart dev server if newly added to .env");
           continue;
        }
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }

      console.log(`Attempting AI call with ${provider}...`);
      
      if (provider === "groq") {
        const response = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
      }

      if (provider === "openrouter") {
        const response = await openRouter.chat.completions.create({
          model: import.meta.env.VITE_AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
          messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
      }
    } catch (error) {
      console.warn(`${provider} failed, trying next...`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All AI providers failed.", lastError);
  throw lastError;
}

export async function refineGoal(goal: string) {
  const prompt = `You are a world-class strategic planner. Analyze the following goal and provide a comprehensive refinement:
  
  Goal: "${goal}"
  
  Please provide:
  1. A professional, high-impact "Strategic Objective" title.
  2. A "Tactical Breakdown" of 5-6 granular, actionable milestones.
  3. A brief "Strategic Context" (1-2 sentences) explaining why this goal is important and what the primary focus should be.
  
  Format response as JSON: 
  { 
    "title": "Refined Goal", 
    "milestones": ["Milestone 1", "Milestone 2", ...],
    "context": "Strategic insight here..."
  }
  
  Return ONLY the JSON.`;
  
  const result = await generateContent(prompt, "groq");
  try {
    return JSON.parse(result || "{}");
  } catch (e) {
    return { title: result, milestones: [], context: "" };
  }
}

export async function getDailyMission(goals: string[], notes: string[], customInstructions?: string) {
  const prompt = `You are an elite Mission Control AI. Conduct a full analysis of the current tactical landscape and provide a highly detailed "Strategic Briefing".
  
  Current Objectives: ${goals.length > 0 ? goals.join(", ") : "None established."}
  Recent Intelligence (Notes): ${notes.length > 0 ? notes.join(" | ") : "No recent intel."}
  ${customInstructions ? `Special Command: "${customInstructions}". Prioritize this instruction in your analysis.` : ""}
  
  Provide a 3-paragraph briefing:
  - Paragraph 1: "Situational Awareness" - A summary of the current state and overall progress. Include a "Mission Morale" percentage (0-100%) based on the tone of recent notes.
  - Paragraph 2: "Priority Alpha" - The single most important task to focus on right now based on the data.
  - Paragraph 3: "Tactical Foresight" - A brief look ahead at potential obstacles or upcoming opportunities.
  
  Tone: Professional, authoritative, and sharp. Total length: ~150-200 words.`;

  return await generateContent(prompt, "google");
}
