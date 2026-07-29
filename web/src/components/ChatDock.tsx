"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import {
  inferTagsFromText,
  parseResponseTags,
  pickMascotState,
} from "@/src/lib/mascotTags";

const SUGGESTIONS = [
  "What is Capy Tab Manager?",
  "Open Chipotle Redesign",
  "What are Daphne's skills?",
];

export function ChatDock() {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addChatMessage = usePortfolioStore((s) => s.addChatMessage);
  const setMascotState = usePortfolioStore((s) => s.setMascotState);
  const chatHistory = usePortfolioStore((s) => s.chatHistory);
  const openProjectWindow = usePortfolioStore((s) => s.openProjectWindow);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-show history when there are messages
  useEffect(() => {
    if (chatHistory.length > 0) setShowHistory(true);
  }, [chatHistory.length]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory.length]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    setInput("");
    addChatMessage({ role: "user", content: trimmed });
    setMascotState("thinking");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: trimmed },
          ],
        }),
      });

      const data = (await res.json()) as {
        text?: string;
        openProjectId?: string;
        openProjectTitle?: string;
      };

      const raw = data.text ?? "I can tell you about Daphne's projects and skills.";
      const parsed = parseResponseTags(raw);
      const tags =
        parsed.tags.length > 0 ? parsed.tags : inferTagsFromText(parsed.cleanText);

      addChatMessage({ role: "assistant", content: parsed.cleanText, tags });
      setMascotState(pickMascotState(tags));

      if (data.openProjectId && data.openProjectTitle) {
        openProjectWindow({ projectId: data.openProjectId, title: data.openProjectTitle });
        setMascotState("proud");
      }
    } catch {
      addChatMessage({
        role: "assistant",
        content: "Something went wrong. Try asking about Capy Tab Manager or the Chipotle redesign.",
        tags: ["idle"],
      });
      setMascotState("idle");
    } finally {
      setPending(false);
      window.setTimeout(() => {
        const s = usePortfolioStore.getState().mascotState;
        if (s === "thinking" || s === "proud") {
          usePortfolioStore.getState().setMascotState("idle");
        }
      }, 2800);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-5">

      {/* Chat thread - slides up when messages exist */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="thread"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="pointer-events-auto w-full max-w-[560px]"
          >
            <div
              ref={scrollRef}
              className="glass-panel mb-1 max-h-52 overflow-y-auto rounded-[20px] px-4 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.09)]"
            >
              <div className="flex flex-col gap-2">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <span
                      className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] leading-snug ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-[#1f1f1f] text-white"
                          : "rounded-bl-sm bg-white/80 text-[#2a2a2a]"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                {pending && (
                  <div className="flex justify-start">
                    <span className="rounded-2xl rounded-bl-sm bg-white/80 px-3 py-1.5 text-[13px] text-[#8a8a8a]">
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="pointer-events-auto mb-1 ml-auto block text-[10px] text-[#aaa] transition hover:text-[#555]"
            >
              hide
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion chips - only before first message */}
      {chatHistory.length === 0 && (
        <div className="pointer-events-auto flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="glass-panel rounded-full px-3 py-1.5 text-xs text-[#3a3a3a] shadow-sm transition hover:bg-white/80"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <motion.form
        onSubmit={(e) => { e.preventDefault(); void send(input); }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.15 }}
        className="pointer-events-auto glass-panel flex w-full max-w-[560px] items-center gap-2 rounded-full p-1.5 pl-5 shadow-[0_16px_50px_rgba(0,0,0,0.1)]"
      >
        {chatHistory.length > 0 && !showHistory && (
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="mr-1 shrink-0 text-[11px] text-[#4C8BF5] transition hover:underline"
          >
            Chat
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Daphne's AI about projects, skills, process..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[#1f1f1f] outline-none placeholder:text-[#9a9a9a]"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-full bg-[#1f1f1f] px-4 py-2.5 text-sm font-medium text-white transition enabled:hover:bg-[#333] disabled:opacity-40"
        >
          {pending ? "..." : "Send"}
        </button>
      </motion.form>
    </div>
  );
}
