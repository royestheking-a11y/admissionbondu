import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Bot, Sparkles, Terminal, GraduationCap, X, 
  MessageSquare, Search, CheckCircle, Clock, Shield, 
  ArrowRight, Users, Award, Zap, Phone, Info
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Seo } from "../components/Seo";

interface Message {
  role: "user" | "model";
  content: string;
}

function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 10); // Slightly faster
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [index, text, onComplete]);

  return <p className="whitespace-pre-wrap leading-relaxed">{displayedText}</p>;
}

export default function AdmissionBondu() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const data = await apiFetch<{ reply: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ 
          message: userMessage, 
          history,
          userName: user?.name 
        }),
      });

      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "I'm having a bit of trouble connecting right now. Please try again in a moment!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#FFF8F0] flex flex-col lg:flex-row overflow-hidden">
      <Seo 
        title="Bondu – Your Smart Admission Specialist"
        description="Connect with Bondu for personalized university guidance, application support, and professional advice."
      />

      {/* ── LEFT PANEL: How it helps ────────────────────────── */}
      <div className="lg:w-[380px] xl:w-[420px] bg-[#1A0A02] relative p-8 flex flex-col overflow-y-auto custom-scrollbar shadow-2xl z-20">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L100 100M100 0L0 100" stroke="#D4A857" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="40" stroke="#D4A857" strokeWidth="0.05" />
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <h2 className="text-[#D4A857] text-2xl font-black mb-4 leading-tight">Your Smart Partner for University Success</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Bondu is designed to remove the stress and confusion from your university journey. From finding the perfect match to handling complex paperwork, we make it easy.
          </p>

          <div className="space-y-8">
            {[
              { 
                icon: Search, 
                title: "University Finder", 
                desc: "We analyze your GPA and budget to suggest the absolute best universities for your profile.",
                color: "text-blue-400"
              },
              { 
                icon: Zap, 
                title: "Application Ease", 
                desc: "Forget the pain of long forms. We handle the submission and document processing for you.",
                color: "text-yellow-400"
              },
              { 
                icon: Shield, 
                title: "Verified Support", 
                desc: "Every recommendation is backed by up-to-date data from official university records.",
                color: "text-green-400"
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.1) }}
                className="flex gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 transition-colors group-hover:bg-[#D4A857]/10 group-hover:border-[#D4A857]/20">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h4 className="text-[#D4A857] text-sm font-bold mb-1">{item.title}</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed italic">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
          <div className="bg-[#D4A857]/5 rounded-2xl p-5 border border-[#D4A857]/10">
             <div className="flex items-center gap-2 mb-2">
               <Users className="w-4 h-4 text-[#D4A857]" />
               <span className="text-white text-xs font-bold uppercase tracking-wider">Community Trusted</span>
             </div>
             <p className="text-white/40 text-[10px] leading-relaxed">
               Hundreds of students have already used Bondu to find their dream campus this year.
             </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Messaging System ────────────────────── */}
      <div className="flex-1 flex flex-col relative bg-[#FFF8F0]">
        {/* Header / Status */}
        <div className="bg-white/80 backdrop-blur-md border-b border-[#D4A857]/20 p-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A0A02] to-[#3B1A0A] rounded-full flex items-center justify-center border border-[#D4A857]/30 shadow-md">
                <GraduationCap className="w-5 h-5 text-[#D4A857]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-[#1A0A02] text-sm font-black leading-none">Bondu</h3>
              <p className="text-[#A8742C] text-[10px] font-bold uppercase tracking-widest mt-1">Specialist Online</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[#1A0A02]/40 text-[9px] uppercase font-black tracking-widest">Status</p>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <p className="text-[#1A0A02] text-[11px] font-bold">Encrypted & Secure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Console */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 flex flex-col custom-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(212,168,87,0.05)_0%,_transparent_40%)]"
        >
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 border border-[#D4A857]/20 shadow-xl shadow-[#D4A857]/5"
              >
                <Sparkles className="w-10 h-10 text-[#D4A857]" />
              </motion.div>
              <h2 className="text-[#1A0A02] text-3xl font-black mb-3 italic tracking-tight underline decoration-[#D4A857]/30">Hello {user?.name ? user.name.split(" ")[0] : "Student"}!</h2>
              <p className="text-[#1A0A02]/60 text-sm leading-relaxed mb-10 font-medium">
                I'm **Bondu**, your smart partner for university success. I'm here to handle the "pain" of admissions for you. What's on your mind today?
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {[
                  "Which universities match my GPA?",
                  "Tell me about NSU admission",
                  "What are the best private universities?",
                  "How to apply for support?"
                ].map((q) => (
                  <button 
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="px-5 py-4 bg-white border border-[#D4A857]/20 rounded-2xl text-[#1A0A02]/70 text-xs font-bold shadow-sm hover:shadow-md hover:border-[#D4A857] hover:bg-[#D4A857]/5 transition-all text-left flex items-center justify-between group"
                  >
                    {q}
                    <ArrowRight className="w-4 h-4 text-[#D4A857] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {m.role === "model" && (
                  <div className="w-9 h-9 rounded-full bg-[#1A0A02] flex items-center justify-center flex-shrink-0 border border-[#D4A857]/30 shadow-lg">
                    <GraduationCap className="w-5 h-5 text-[#D4A857]" />
                  </div>
                )}
                <div className={`rounded-2xl px-6 py-4 shadow-sm border ${
                  m.role === "user"
                    ? "bg-[#1A0A02] border-[#D4A857]/20 text-white font-bold rounded-tr-none"
                    : "bg-white border-[#D4A857]/15 text-[#1A0A02]/90 rounded-tl-none leading-relaxed shadow-lg shadow-[#D4A857]/5"
                }`}>
                  {m.role === "model" && i === messages.length - 1 && !isLoading ? (
                    <Typewriter text={m.content} onComplete={scrollToBottom} />
                  ) : (
                    <p className={`text-sm whitespace-pre-wrap ${m.role === "user" ? "text-white/90" : "text-[#1A0A02]/80 font-medium"}`}>{m.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1A0A02] flex items-center justify-center border border-[#D4A857]/30 shadow-lg">
                <GraduationCap className="w-5 h-5 text-[#D4A857]" />
              </div>
              <div className="bg-white border border-[#D4A857]/15 rounded-2xl rounded-tl-none px-6 py-4 shadow-lg shadow-[#D4A857]/5">
                <div className="flex gap-2 items-center">
                  <div className="h-1.5 w-1.5 bg-[#D4A857] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 bg-[#D4A857] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 bg-[#D4A857] rounded-full animate-bounce" />
                  <span className="text-[10px] ml-3 text-[#A8742C] font-black uppercase tracking-[0.2em]">Bondu is Writing</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 md:p-10 bg-gradient-to-t from-white to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A857]/20 to-[#A8742C]/20 rounded-[28px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative">
              <input
                type="text"
                placeholder="Ask Bondu anything about your admission..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full bg-white border-2 border-[#D4A857]/20 rounded-2xl py-5 pl-7 pr-16 text-[#1A0A02] font-semibold placeholder:text-[#1A0A02]/30 focus:outline-none focus:border-[#D4A857] transition-all shadow-xl shadow-[#D4A857]/5"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-2 bottom-2 aspect-square rounded-xl bg-[#1A0A02] text-[#D4A857] flex items-center justify-center shadow-lg disabled:opacity-20 transition-all hover:scale-105 active:scale-95 border border-[#D4A857]/20"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-center mt-6 text-[10px] text-[#1A0A02]/30 font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
            <Terminal className="w-3.5 h-3.5 text-[#D4A857]/50" /> 
            Bondu Expert Admission Engine
          </p>
        </div>
      </div>
    </div>
  );
}
