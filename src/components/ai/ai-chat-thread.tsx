"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMockAiResponse } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const initialMessages: Message[] = [
  {
    role: "user",
    text: "Apa saja ekstrakurikuler yang tersedia?",
  },
  {
    role: "assistant",
    text: "SMAN 1 Kraksaan menawarkan berbagai ekstrakurikuler mulai dari Robotik, Teknologi Informasi, Debat Bahasa Inggris, hingga Atletik dan Seni Lukis...",
  },
];

export function AiChatThread({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: getMockAiResponse(text) }]);
      setThinking(false);
    }, 650);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className={cn("flex-1 space-y-3 overflow-y-auto px-4 py-4", compact ? "text-sm" : "text-sm")}>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed",
                m.role === "user"
                  ? "rounded-br-sm bg-orange text-white"
                  : "rounded-bl-sm bg-surface-alt text-ink"
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface-alt px-3.5 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu tentang sekolah..."
          className="h-10 flex-1 rounded-full border border-border bg-bg px-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
        />
        <button
          type="submit"
          aria-label="Kirim pesan"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-white transition-transform active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
