"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
const CapybaraMascot = dynamic(
  () =>
    import("@/src/components/CapybaraMascot").then((m) => m.CapybaraMascot),
  { ssr: false, loading: () => null },
);

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

/**
 * Center-stage mascot: animated capybara SVG (Bezier head/body idle).
 * Optional Spline scene via NEXT_PUBLIC_SPLINE_SCENE when provided.
 */
export function Mascot() {
  const mascotState = usePortfolioStore((s) => s.mascotState);
  const chatHistory = usePortfolioStore((s) => s.chatHistory);
  const latestAssistant = [...chatHistory]
    .reverse()
    .find((m) => m.role === "assistant");
  const splineScene = process.env.NEXT_PUBLIC_SPLINE_SCENE;

  const bubbleText =
    mascotState === "thinking"
      ? "I'm working on it.."
      : mascotState === "typing"
        ? "Typing that up.."
        : mascotState === "proud"
          ? "Opened a project for you."
          : latestAssistant?.content.slice(0, 120) ||
            "Ask me about Daphne's work.";

  const showBubble = true;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <AnimatePresence>
        {showBubble && (
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="absolute -top-2 z-20 max-w-[260px] rounded-[22px] rounded-bl-md bg-[#0a84ff]/92 px-4 py-3 text-sm font-medium leading-snug text-white shadow-[0_12px_36px_rgba(10,132,255,0.4)] backdrop-blur-md"
          >
            {bubbleText}
            {bubbleText.length >= 120 ? "..." : ""}
          </motion.div>
        )}
      </AnimatePresence>

      {splineScene ? (
        <div className="absolute inset-0 z-10">
          <Spline scene={splineScene} />
        </div>
      ) : (
        <div className="relative z-10 mt-8 h-[260px] w-[145px] sm:mt-10 sm:h-[320px] sm:w-[178px]">
          <CapybaraMascot state={mascotState} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
