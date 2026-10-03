"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAiIntro, getAiResponse } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const STORAGE_KEY = "sman1kraksaan-ai-chat";
const MAX_MESSAGES_TO_AI = 8;
const MAX_MESSAGES_TO_STORE = 20;

function renderAssistantText(text: string): ReactNode {
  return text.split("\n").map((line, lineIndex, lines) => {
    const content = line.startsWith("- ") ? `• ${line.slice(2)}` : line;
    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    return (
      <span key={`${line}-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return <code key={partIndex} className="rounded bg-bg px-1 py-0.5 text-xs">{part.slice(1, -1)}</code>;
          }
          return part;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function AiChatThread({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [intro, setIntro] = useState({ welcome: "", questions: [] as string[] });
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAiIntro().then(({ welcome, questions }) => setIntro({ welcome, questions })).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setMessages(parsed.slice(-MAX_MESSAGES_TO_STORE));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    if (messages.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES_TO_STORE)));
  }, [messages, storageReady]);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function clearChat() {
    setMessages([]);
    setInput("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function handleSend(preset?: string) {
    const text = (preset ?? input).trim();
    if (!text || thinking) return;
    const history = messages.slice(-(MAX_MESSAGES_TO_AI - 1)).map((message) => ({
      role: message.role,
      content: message.text,
    }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    try {
      const answer = await getAiResponse(text, history);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "Asisten sedang tidak tersedia.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex justify-end border-b border-border px-4 py-2">
        <button
          type="button"
          onClick={clearChat}
          disabled={!messages.length && !input}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-surface-alt hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" />
          Bersihkan
        </button>
      </div>
      <div ref={threadRef} className={cn("min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4", compact ? "text-sm" : "text-sm")}>
        {!messages.length && !thinking && (
          <div className="space-y-3 py-6 text-center">
            <p className="text-xs text-muted">
              {intro.welcome || "Belum ada percakapan. Tanyakan sesuatu tentang sekolah."}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {intro.questions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-ink transition-colors hover:bg-surface-alt"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
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
              {m.role === "assistant" ? renderAssistantText(m.text) : m.text}
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
