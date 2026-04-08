import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UniversityModel } from "../models/University.ts";
import { NoticeModel } from "../models/Notice.ts";

export function aiRouter(geminiApiKey?: string) {
  const router = Router();

  if (!geminiApiKey) {
    router.post("/chat", (_req, res) => {
      res.status(503).json({ error: "AI service not configured" });
    });
    return router;
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  router.post("/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Fetch all universities and notices to provide as context
      const [universities, notices] = await Promise.all([
        UniversityModel.find({}).lean(),
        NoticeModel.find({}).sort({ createdAt: -1 }).limit(10).lean()
      ]);
      
      const uniContext = universities.map(u => ({
        name: u.name,
        shortName: u.shortName,
        type: u.type,
        city: u.city,
        subjects: u.subjects,
        tuition: `${u.tuitionMin} - ${u.tuitionMax}`,
        admissionFee: u.admissionFee,
        rating: u.rating,
        website: u.website,
        gpaMin: u.gpaMin,
        details: u.description
      }));

      const noticeContext = notices.map(n => ({
        title: n.title,
        category: n.category,
        date: n.date,
        summary: n.description
      }));

      const systemPrompt = `You are "Admission AI", an extremely intelligent and autonomous admission assistant for "Admission Bondhu" in Bangladesh. 

You have direct access to our entire database of universities and the latest official notices. 

KNOWLEDGE BASE:
UNIVERSITIES:
${JSON.stringify(uniContext)}

LATEST NOTICES:
${JSON.stringify(noticeContext)}

YOUR ROLES & PERSONALITY:
1. You are an expert. You don't refer users to "external" help; YOU are the expert of this platform.
2. Be "cute", helpful, and friendly (Bondhu).
3. Always answer with precision. If a student asks about GPA, tell them exactly which universities they qualify for based on the KNOWLEDGE BASE.
4. If they ask about notices, tell them the latest Circular or Exam schedules from the LATEST NOTICES section.
5. Use golden emojis (✨, 🎓) to match the premium theme.
6. Format responses with clear headers and bullet points.`;

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "Hello! Who are you?" }] },
          { role: "model", parts: [{ text: "Hello! I am your Admission AI. I can help you find the perfect university in Bangladesh based on your requirements. How can I assist you today?" }] },
          ...(history || [])
        ],
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: `User request: ${message}` }
      ]);
      
      const response = await result.response;
      const text = response.text();

      res.json({ reply: text });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
