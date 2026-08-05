"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import {
  inferTagsFromText,
  parseResponseTags,
  pickMascotState,
} from "@/src/lib/mascotTags";
import { localChatReply } from "@/src/lib/localChat";

const SUGGESTIONS = [
  "What is Capy Tab Manager?",
  "Open Chipotle Redesign",
  "What are Daphne's skills?",
];

async function getChatReply(
  messages: { role: "user" | "assistant"; content: string }[],
) {
  const remote = process.env.NEXT_PUBLIC_CHAT_API_URL;
  if (remote) {
    try {
      const res = await fetch(remote, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      if (res.ok) {
        return (await res.json()) as {
          text?: string;
          openProjectId?: string;
          openProjectTitle?: string;
        };
      }
    } catch {
      // Fall through to local knowledge base.
    }
  }

  // Tiny delay so thinking state is perceptible on static hosts.
  await new Promise((r) => window.setTimeout(r, 280));
  return localChatReply(messages);
}

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
      const data = await getChatReply([
        ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: trimmed },
      ]);

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
    <div className="pointer-events-none absolute inset-x-0 bottom-[78px] z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {showHistory && (
          <motion.div
            key="thread"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="pointer-events-auto w-full max-w-[560px]"
          >
            <div
              ref={scrollRef}
              className="liquid-glass mb-1 max-h-52 overflow-y-auto rounded-[22px] px-4 py-3"
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
                          ? "rounded-br-sm bg-[#0a84ff] text-white"
                          : "rounded-bl-sm bg-white/75 text-[#2a2a2a]"
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
                {pending && (
                  <div className="flex justify-start">
                    <span className="rounded-2xl rounded-bl-sm bg-white/75 px-3 py-1.5 text-[13px] text-[#8a8a8a]">
                      ...
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="pointer-events-auto mb-1 ml-auto block text-[10px] text-white/70 transition hover:text-white"
            >
              hide
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s}
            type="button"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => send(s)}
            disabled={pending}
            className="liquid-glass rounded-full px-3.5 py-1.5 text-xs font-medium text-[#2a2a2a] disabled:opacity-40"
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Spotlight-style dock input */}
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.12 }}
        className="pointer-events-auto liquid-glass-strong flex w-full max-w-[580px] items-center gap-2 rounded-full p-1.5 pl-5"
      >
        <SpotlightGlyph />
        {chatHistory.length > 0 && !showHistory && (
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="mr-0.5 shrink-0 text-[11px] font-medium text-[#0a84ff] transition hover:underline"
          >
            Chat
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Daphne's AI about projects, skills, process..."
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#1a1a1a] outline-none placeholder:text-[#8a8a8a]"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="rounded-full bg-[#0a84ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(10,132,255,0.35)] transition enabled:hover:brightness-110 disabled:opacity-40"
        >
          {pending ? "..." : "Send"}
        </button>
      </motion.form>
    </div>
  );
}

function SpotlightGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-[#6a6a6a]"
      aria-hidden
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
