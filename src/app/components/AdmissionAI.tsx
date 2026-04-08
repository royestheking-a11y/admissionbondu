import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, Terminal } from "lucide-react";
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
            className="mb-4 w-[380px] overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl dark:bg-black/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none">Admission AI</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-white/60 font-semibold italic">Premium Assistant</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-60">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <p className="text-sm font-medium">Hello there! I'm your AI assistant.</p>
                  <p className="text-xs">Ask me anything about universities, GPA requirements, or tuition fees!</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      m.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/50 dark:bg-black/10 border-t border-black/5 dark:border-white/5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 top-1.5 rounded-lg bg-primary p-1.5 text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-muted-foreground font-medium flex items-center justify-center gap-1">
                <Terminal size={10} /> Powered by Admission AI Engine
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/30 transition-all relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X size={24} className="relative z-10" />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <Bot size={28} />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={14} className="text-yellow-400" />
            </motion.div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
