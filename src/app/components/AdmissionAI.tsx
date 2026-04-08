import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, Terminal, GraduationCap } from "lucide-react";
import { apiFetch } from "../lib/api";

interface Message {
  role: "user" | "model";
  content: string;
}

export function AdmissionAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        body: JSON.stringify({ message: userMessage, history }),
      });

      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "I'm sorry, I'm having a bit of trouble connecting to my brain right now. Please try again later!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[380px] overflow-hidden rounded-2xl border border-[#D4A857]/20 bg-[#1A0A02]/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#1E0C03] p-4 text-white border-b border-[#D4A857]/10">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A857] to-[#A8742C] shadow-lg shadow-[#D4A857]/10">
                  <GraduationCap size={20} className="text-[#1A0A02]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none tracking-tight">Admission Bondhu AI</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#D4A857] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-[#D4A857]/80 font-bold">Expert Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/5 text-[#D4A857]/60 hover:text-[#D4A857] transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth bg-gradient-to-b from-transparent to-[#1E0C03]/20"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-80">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-14 w-14 rounded-2xl bg-[#D4A857]/10 flex items-center justify-center mb-2 border border-[#D4A857]/20"
                  >
                    <Sparkles className="text-[#D4A857]" size={28} />
                  </motion.div>
                  <p className="text-sm font-bold text-white">Hello! I'm your Admission Bondhu</p>
                  <p className="text-xs text-white/50 px-8 leading-relaxed">I have deep database knowledge about courses, tuition, and latest notices. How can I help?</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      m.role === "user" 
                        ? "bg-[#D4A857] text-[#1A0A02] rounded-tr-none font-medium" 
                        : "bg-white/5 border border-[#D4A857]/10 text-white/90 rounded-tl-none leading-relaxed"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-[#D4A857]/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-1.5 bg-[#D4A857]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 bg-[#D4A857]/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 bg-[#D4A857]/40 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-[#1E0C03]/50 border-t border-[#D4A857]/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask me about universities or notices..."
                  className="w-full rounded-xl bg-white/5 border border-[#D4A857]/20 py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4A857]/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 top-1.5 rounded-lg bg-gradient-to-br from-[#D4A857] to-[#A8742C] p-2 text-[#1A0A02] shadow-lg disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-3 text-[10px] text-center text-[#D4A857]/40 font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Terminal size={10} /> Admission Intelligent Engine
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E0C03] to-[#1A0A02] border border-[#D4A857]/30 text-[#D4A857] shadow-2xl transition-all relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A857]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X size={24} className="relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <GraduationCap size={28} className="drop-shadow-glow" />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={14} className="text-[#D4A857]" />
            </motion.div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
