"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { Mascot } from "@/src/components/Mascot";
import { Window } from "@/src/components/Window";

const ExplorationsPanel = dynamic(
  () => import("@/src/components/ExplorationsPanel").then((m) => m.ExplorationsPanel),
  { ssr: false },
);
const AboutPanel = dynamic(
  () => import("@/src/components/AboutPanel").then((m) => m.AboutPanel),
  { ssr: false },
);

export function CenterStage() {
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const activeNav = usePortfolioStore((s) => s.activeNav);

  const focusedWindow =
    activeWindows.find((w) => w.id === focusedWindowId) ?? null;

  const showOverlay = !focusedWindow;
  const onStage = Boolean(focusedWindow);

  return (
    <section className="relative h-full w-full overflow-hidden">
      {/* Stage dim -- macOS dims wallpaper when Stage Manager has focus */}
      <AnimatePresence>
        {onStage && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="stage-dim pointer-events-none absolute inset-0 z-[5]"
          />
        )}
      </AnimatePresence>

      {/* Desktop companion -- slides aside when a window takes the stage */}
      <motion.div
        className="absolute inset-0 z-[6] flex items-center justify-center pb-40 pt-20"
        animate={{
          opacity: onStage ? 0 : 1,
          scale: onStage ? 0.88 : 1,
          x: onStage ? 72 : 0,
          filter: onStage ? "blur(8px)" : "blur(0px)",
        }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
      >
        <Mascot />
      </motion.div>

      <AnimatePresence mode="wait">
        {showOverlay && activeNav === "explorations" && (
          <ExplorationsPanel key="explorations" />
        )}
        {showOverlay && activeNav === "about" && <AboutPanel key="about" />}
      </AnimatePresence>

      {/* Focused Stage Manager window -- shared layout morph from strip */}
      <AnimatePresence mode="sync">
        {focusedWindow && <Window key={focusedWindow.id} win={focusedWindow} />}
      </AnimatePresence>
    </section>
  );
}
