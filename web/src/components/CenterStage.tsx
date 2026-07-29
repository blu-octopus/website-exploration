"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { Mascot } from "@/src/components/Mascot";
import { Window } from "@/src/components/Window";

export function CenterStage() {
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const activeNav = usePortfolioStore((s) => s.activeNav);

  const focusedWindow =
    activeWindows.find((w) => w.id === focusedWindowId) ?? null;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <KnowledgeGraphBg />

      {/* Mascot stays visible behind / beside the stage window */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pb-16 pt-10"
        animate={{
          opacity: focusedWindow ? 0.35 : 1,
          scale: focusedWindow ? 0.92 : 1,
          x: focusedWindow ? 48 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <Mascot />
      </motion.div>

      {activeNav === "about" && !focusedWindow && (
        <div className="pointer-events-none absolute inset-x-0 top-28 z-20 flex justify-center px-4">
          <div className="glass-panel max-w-md rounded-[22px] px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <p className="text-sm leading-relaxed text-[#2a2a2a]">
              Daphne Cheng is a Design Engineer who makes complex interactions feel
              natural through code and research.
            </p>
          </div>
        </div>
      )}

      {/* Stage Manager: only the focused stack occupies center stage */}
      <AnimatePresence mode="wait">
        {focusedWindow && <Window key={focusedWindow.id} win={focusedWindow} />}
      </AnimatePresence>
    </section>
  );
}

function KnowledgeGraphBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,120,120,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,120,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
        <defs>
          <radialGradient id="fade" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#f2f2f2" stopOpacity="1" />
          </radialGradient>
        </defs>
        <circle cx="22%" cy="40%" r="3" fill="#bdbdbd" />
        <circle cx="78%" cy="32%" r="2.5" fill="#c7c7c7" />
        <circle cx="68%" cy="62%" r="2" fill="#bcbcbc" />
        <circle cx="30%" cy="68%" r="2.5" fill="#c4c4c4" />
        <circle cx="50%" cy="28%" r="2" fill="#cdcdcd" />
        <line x1="22%" y1="40%" x2="50%" y2="28%" stroke="#c9c9c9" strokeWidth="1" />
        <line x1="50%" y1="28%" x2="78%" y2="32%" stroke="#c9c9c9" strokeWidth="1" />
        <line x1="78%" y1="32%" x2="68%" y2="62%" stroke="#c9c9c9" strokeWidth="1" />
        <line x1="68%" y1="62%" x2="30%" y2="68%" stroke="#c9c9c9" strokeWidth="1" />
        <line x1="30%" y1="68%" x2="22%" y2="40%" stroke="#c9c9c9" strokeWidth="1" />
        <rect width="100%" height="100%" fill="url(#fade)" />
      </svg>
    </div>
  );
}
