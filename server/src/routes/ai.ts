import { Router } from "express";
import { UniversityModel } from "../models/University.js";
import { NoticeModel } from "../models/Notice.js";

export function aiRouter(groqApiKey?: string) {
  const router = Router();

  if (!groqApiKey) {
    router.post("/chat", (_req, res) => {
      res.status(503).json({ error: "AI service not configured. Please add GROQ_API_KEY in Render." });
    });
    return router;
  }

  router.post("/chat", async (req, res) => {
    try {
      const { message, history, userName } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Fetch context from database
      const [universities, notices] = await Promise.all([
        UniversityModel.find({}).lean(),
        NoticeModel.find({}).sort({ createdAt: -1 }).limit(10).lean()
      ]);
      
      const uniContext = universities.map(u => ({
        name: u.name,
        details: `${u.type} in ${u.city}. Tuition: ${u.tuitionMin}-${u.tuitionMax}. GPA: ${u.gpaMin}. Subjects: ${u.subjects?.join(", ")}`
      }));

      const noticeContext = notices.map(n => n.title);

      const systemPrompt = `You are "Admission AI Bondhu", the expert social assistant for the "Admission Bondhu" platform in Bangladesh.

CONVERSATIONAL RULES:
- If the user says "Hi", "Hello", "How are you", or "Good morning", ALWAYS reply with a very warm greeting: "Hello ${userName || "friend"}! ✨ I'm doing great, thank you! How can I help you with your university admissions journey today? 🎓"
- Always be social first. If the user is just greeting, ask "How can I help you?".
- Be polite, enthusiastic, and use emojis to stay premium.

KNOWLEDGE BASE:
UNIVERSITY DATA: ${JSON.stringify(uniContext)}
LATEST NOTICES: ${noticeContext.join(", ")}

ADMISSION EXPERTISE:
- When asked about admission, analyze the GPA and Tuition in the data above.
- Suggest the best universities from the list. 
- Use bold text for **University Names**.
- You are an expert of THIS platform. Do not suggest external websites.`;

      // Transform history to OpenAI/Groq format
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.parts[0].text
      }));

      const messages = [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: message }
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      res.json({ reply });
    } catch (error: any) {
      console.error("Groq AI Error:", error);
      
      if (error.message?.includes("401")) {
        return res.status(401).json({ error: "Invalid Groq API Key. Please update Render env." });
      }
      
      if (error.message?.includes("429")) {
        return res.status(429).json({ error: "Groq speed limit reached. Please wait a moment! ✨" });
      }

      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
