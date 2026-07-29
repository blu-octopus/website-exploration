"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/src/data/projects";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";

/**
 * macOS Stage Manager rail:
 * - Project stacks sit on the left edge as overlapping window thumbnails
 * - Clicking a stack brings that project to center stage
 * - The focused stack nudges forward; others stay recessed
 */
export function StageManager() {
  const openProjectWindow = usePortfolioStore((s) => s.openProjectWindow);
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const bringToFront = usePortfolioStore((s) => s.bringToFront);
  const clearStage = usePortfolioStore((s) => s.clearStage);

  const focusedProjectId =
    activeWindows.find((w) => w.id === focusedWindowId)?.projectId ?? null;

  return (
    <aside className="pointer-events-none absolute bottom-24 left-0 top-16 z-40 flex w-[140px] flex-col items-start justify-center gap-4 pl-2 sm:w-[160px] sm:pl-3">
      {/* Desktop / clear stage control, like returning to wallpaper */}
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: focusedProjectId ? 0.55 : 0.35, x: 0 }}
        whileHover={{ opacity: 0.9, x: 6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={clearStage}
        className="pointer-events-auto ml-1 h-14 w-[100px] overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white/50 to-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:w-[112px]"
        aria-label="Show desktop"
      >
        <span className="flex h-full items-end p-2 text-[10px] font-medium text-[#6b6b6b]">
          Desktop
        </span>
      </motion.button>

      {PROJECTS.map((project, index) => {
        const openWin = activeWindows.find((w) => w.projectId === project.id);
        const isFocused = openWin?.id === focusedWindowId;

        return (
          <StackThumb
            key={project.id}
            project={project}
            delay={index * 0.05}
            isOpen={Boolean(openWin)}
            isFocused={isFocused}
            onActivate={() => {
              if (openWin) {
                if (isFocused) {
                  clearStage();
                  return;
                }
                bringToFront(openWin.id);
                return;
              }
              openProjectWindow({
                projectId: project.id,
                title: project.title,
              });
            }}
          />
        );
      })}
    </aside>
  );
}

function StackThumb({
  project,
  delay,
  isOpen,
  isFocused,
  onActivate,
}: {
  project: Project;
  delay: number;
  isOpen: boolean;
  isFocused: boolean;
  onActivate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const layers = isOpen ? 3 : 2;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -28 }}
      animate={{
        opacity: isFocused ? 1 : isOpen ? 0.88 : 0.7,
        x: isFocused ? 14 : hovered ? 10 : 0,
        scale: isFocused ? 1.05 : hovered ? 1.03 : 1,
      }}
      transition={{ type: "spring", stiffness: 340, damping: 26, delay }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onActivate}
      className="pointer-events-auto relative block h-[108px] w-[118px] text-left sm:h-[118px] sm:w-[128px]"
      aria-label={`${isFocused ? "Hide" : "Open"} ${project.title}`}
    >
      {Array.from({ length: layers }).map((_, i) => {
        const depth = layers - 1 - i;
        return (
          <span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-2xl border border-black/6 bg-white/70 shadow-[0_10px_28px_rgba(0,0,0,0.1)] backdrop-blur-md"
            style={{
              transform: `translate(${depth * (hovered ? 7 : 5)}px, ${depth * (hovered ? 6 : 4)}px) scale(${1 - depth * 0.03})`,
              opacity: 1 - depth * 0.18,
              zIndex: i,
            }}
          />
        );
      })}

      <span
        className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_14px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl"
        style={{
          boxShadow: isFocused
            ? "0 18px 40px rgba(0,0,0,0.18), 0 0 0 2px rgba(76,139,245,0.35)"
            : undefined,
        }}
      >
        <span
          className="absolute inset-x-0 top-0 flex h-6 items-center border-b border-black/5 px-2"
          style={{ background: `${project.color}28` }}
        >
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
          </span>
        </span>

        <span className="absolute inset-x-0 bottom-0 top-6 flex flex-col gap-2 p-2.5">
          <span
            className="h-10 flex-1 rounded-lg"
            style={{
              background: `linear-gradient(145deg, ${project.color}66 0%, ${project.color}22 55%, rgba(255,255,255,0.5) 100%)`,
            }}
          />
          <span>
            <span className="block truncate text-[11px] font-semibold tracking-tight text-[#1f1f1f]">
              {project.title}
            </span>
            <span className="block truncate text-[9px] text-[#8a8a8a]">
              {isFocused ? "On Stage" : isOpen ? "In Stage Manager" : "Stack"}
            </span>
          </span>
        </span>
      </span>
    </motion.button>
  );
}
