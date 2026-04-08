import { Router } from "express";
import { UniversityModel } from "../models/University.js";
import { NoticeModel } from "../models/Notice.js";

export function aiRouter(groqApiKey?: string) {
  const router = Router();

  // Keyword-based fallback for "Offline Mode"
  const getOfflineResponse = (message: string, userName?: string): string => {
    const msg = message.toLowerCase();
    const name = userName || "friend";

    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("how are you")) {
      return `Hello ${name}! ✨ My AI brain is taking a quick rest, but I'm still here to help! How can I guide you with your university admissions today? 🎓`;
    }
    if (msg.includes("admit") || msg.includes("admission") || msg.includes("university") || msg.includes("apply")) {
      return `I can definitely help with that! 🎓 You can find all the top universities, check fees, and see GPA requirements in our University Finder here: /universities. Which subject are you interested in?`;
    }
    if (msg.includes("notice") || msg.includes("circular") || msg.includes("update")) {
      return `Stay updated! 📢 You can check all the latest official admission notices and circulars right here: /notice. Is there a specific university you are looking for?`;
    }
    if (msg.includes("gpa") || msg.includes("result") || msg.includes("point")) {
      return `GPA is very important for admission! 📊 You can enter your GPA in our University Finder to see exactly which universities you qualify for. Check it out at /universities ✨`;
    }
    if (msg.includes("thank") || msg.includes("bye") || msg.includes("good")) {
      return `You're very welcome, ${name}! ✨ I'm always here to support your journey. Let me know if you need anything else! 🎓`;
    }

    return `Hello ${name}! ✨ I'm currently in basic mode, but you can explore all our universities and notices using the main menu above! How can I help you navigate the platform today? 🎓`;
  };

  router.post("/chat", async (req, res) => {
    const { message, history, userName } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Try Groq API first
    if (groqApiKey) {
      try {
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

        const systemPrompt = `You are "Admission AI Bondhu", the expert social assistant for the "Admission Bondhu" platform.
        Rules: Be warm, social, and helpful. If greeting, reply with "Hello ${userName || "friend"}! ✨ How are you? How can I help?". Use the knowledge base below.
        Data: ${JSON.stringify(uniContext)} | Notices: ${noticeContext.join(", ")}`;

        const formattedHistory = (history || []).map((h: any) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: h.parts ? h.parts[0].text : (h.content || "")
        }));

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedHistory,
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        });

        if (response.ok) {
          const data = await response.json();
          return res.json({ reply: data.choices[0].message.content });
        }
        
        console.warn("Groq API failed, falling back to offline mode.");
      } catch (error) {
        console.error("Groq AI Error, falling back:", error);
      }
    }

    // Fallback/Built-in mode if API fails or is missing
    const reply = getOfflineResponse(message, userName);
    res.json({ reply });
  });

  return router;
}

