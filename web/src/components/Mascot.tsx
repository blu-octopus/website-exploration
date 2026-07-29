"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

/**
 * Primary mascot matches reference picture 2 (big-eyed designer character).
 * Optional Spline scene via NEXT_PUBLIC_SPLINE_SCENE overlays when provided.
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
            className="absolute top-[8%] z-20 max-w-[260px] rounded-[22px] rounded-bl-md bg-[#4C8BF5] px-4 py-3 text-sm font-medium leading-snug text-white shadow-[0_12px_30px_rgba(76,139,245,0.35)]"
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
        <motion.div
          className="relative z-10"
          animate={
            mascotState === "thinking"
              ? { y: [0, -6, 0], rotate: [0, -1.5, 1.5, 0] }
              : mascotState === "proud"
                ? { y: [0, -10, 0], scale: [1, 1.04, 1] }
                : { y: [0, -5, 0] }
          }
          transition={
            mascotState === "idle"
              ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <div className="relative h-[340px] w-[280px] sm:h-[420px] sm:w-[340px]">
            <Image
              src="/assets/mascot.png"
              alt="Daphne portfolio mascot"
              fill
              priority
              className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
              sizes="340px"
            />
          </div>

          <motion.span
            className="absolute right-[18%] top-[22%] text-white drop-shadow"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            ?
          </motion.span>
          <motion.span
            className="absolute left-[12%] top-[38%] text-white/90 drop-shadow"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.4 }}
          >
            ?
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}
