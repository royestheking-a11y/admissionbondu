import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UniversityModel } from "../models/University.ts";

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

      // Fetch all universities to provide as context
      const universities = await UniversityModel.find({}).lean();
      
      const context = universities.map(u => ({
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

      const systemPrompt = `You are "Admission AI", a professional and friendly admission assistant for "Admission Bondhu" (an admission support platform in Bangladesh). 
Your goal is to help students find the best universities based on their preferences, GPA, and budget.
You have access to the following university database:
${JSON.stringify(context)}

Rules:
1. Provide accurate information based on the database above.
2. If data is missing, be honest and suggest visiting the university website.
3. Keep your tone helpful, "cute" but premium, and professional.
4. Use clear formatting (bullet points) for university comparisons.
5. Focus on the user's specific needs (e.g., location, budget, GPA).`;

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
