"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { Mascot } from "@/src/components/Mascot";
import { Window } from "@/src/components/Window";

const ExplorationsPanel = dynamic(
  () => import("@/src/components/ExplorationsPanel").then((m) => m.ExplorationsPanel),
  { ssr: false }
);
const AboutPanel = dynamic(
  () => import("@/src/components/AboutPanel").then((m) => m.AboutPanel),
  { ssr: false }
);

export function CenterStage() {
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const activeNav = usePortfolioStore((s) => s.activeNav);

  const focusedWindow =
    activeWindows.find((w) => w.id === focusedWindowId) ?? null;

  const showOverlay = !focusedWindow;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <KnowledgeGraphBg />

      {/* Mascot fades back when a window is on stage */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pb-24 pt-24"
        animate={{
          opacity: focusedWindow ? 0.3 : 1,
          scale: focusedWindow ? 0.9 : 1,
          x: focusedWindow ? 52 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <Mascot />
      </motion.div>

      {/* Nav-specific overlays (only when no window is focused) */}
      <AnimatePresence mode="wait">
        {showOverlay && activeNav === "explorations" && (
          <ExplorationsPanel key="explorations" />
        )}
        {showOverlay && activeNav === "about" && (
          <AboutPanel key="about" />
        )}
      </AnimatePresence>

      {/* Focused Stage Manager window */}
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
