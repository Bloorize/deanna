import { GoogleGenerativeAI } from "@google/generative-ai";
import { journalService } from "./journal";
import { familyService } from "./family";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const aiService = {
    askQuestion: async (question) => {
        if (!API_KEY) {
            console.error("Missing Gemini API Key");
            return "I'm sorry, my memory isn't working right now. (Missing Config)";
        }

        try {
            // 1. Fetch recent memories and family status
            const [memories, family] = await Promise.all([
                journalService.getRecentEntries(),
                familyService.getMembers()
            ]);

            const familyContext = family.length > 0
                ? "Family Status:\n" + family.map(m => `- ${m.name} is currently feeling: ${m.status}`).join('\n')
                : "Family Status: Unknown";

            const journalContext = memories.map(entry =>
                `- ${new Date(entry.created_at).toLocaleString()}: ${entry.content}`
            ).join('\n');

            const fullContext = `${familyContext}\n\nRecent Journal:\n${journalContext}`;

            // 2. prompt
            const prompt = `
        You are a helpful, gentle assistant for an elderly woman named Deanna who has dementia.
        She is asking: "${question}"
        
        Rules for interaction:
        1. Always address her as Deanna.
        2. Do NOT use pet names terms of endearment like 'sweetie', 'honey', 'dear', etc.
        
        Using the following journal of her recent activities, answer her question simply and reassuringly.
        If the answer isn't in the journal, give a kind, general answer or suggest she ask a family member, but do not make things up.
        
        Recent Journal & Family Context:
        ${fullContext || "No recent entries."}
        
        Keep the answer short, clear, and warm.
      `;

            // 3. Call Gemini
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("AI Error:", error);
            return "I'm having a little trouble thinking right now. Maybe try asking again?";
        }
    }
};
