"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/src/data/projects";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";

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
      <DesktopTile active={Boolean(focusedProjectId)} onClear={clearStage} />

      {PROJECTS.map((project, index) => {
        const openWin = activeWindows.find((w) => w.projectId === project.id);
        const isFocused = openWin?.id === focusedWindowId;

        return (
          <StackThumb
            key={project.id}
            project={project}
            delay={index * 0.06}
            isOpen={Boolean(openWin)}
            isFocused={isFocused}
            onActivate={() => {
              if (openWin) {
                if (isFocused) { clearStage(); return; }
                bringToFront(openWin.id);
                return;
              }
              openProjectWindow({ projectId: project.id, title: project.title });
            }}
          />
        );
      })}
    </aside>
  );
}

function DesktopTile({ active, onClear }: { active: boolean; onClear: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: active ? 0.6 : 0.38, x: 0 }}
      whileHover={{ opacity: 0.92, x: 6, scale: 1.02 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      onClick={onClear}
      className="pointer-events-auto ml-1 h-14 w-[100px] overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white/50 to-white/20 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:w-[112px]"
      aria-label="Show desktop"
    >
      <span className="flex h-full items-end p-2 text-[10px] font-medium text-[#6b6b6b]">
        Desktop
      </span>
    </motion.button>
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
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const layers = isOpen ? 3 : 2;

  // Fan spread: 0 = compressed, 1 = fully fanned
  const spread = pressed ? 0.25 : hovered ? 1 : 0;
  // Overall scale compresses on press
  const scale = pressed ? 0.93 : hovered ? 1.03 : isFocused ? 1.05 : 1;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${isFocused ? "Minimize" : "Open"} ${project.title}`}
      initial={{ opacity: 0, x: -28 }}
      animate={{
        opacity: isFocused ? 1 : isOpen ? 0.88 : 0.72,
        x: isFocused ? 14 : 0,
        scale,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 28, delay }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onActivate(); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onActivate(); }}
      className="pointer-events-auto relative block h-[108px] w-[118px] cursor-pointer select-none sm:h-[118px] sm:w-[128px]"
    >
      {/* Back cards - fan out on hover, compress inward on press */}
      {Array.from({ length: layers - 1 }).map((_, i) => {
        const depth = layers - 1 - i;
        const offset = 4 + spread * 5;
        return (
          <motion.span
            key={i}
            aria-hidden
            animate={{
              x: offset * depth,
              y: offset * depth * 0.85,
            }}
            transition={{ type: "spring", stiffness: 460, damping: 30 }}
            className="absolute inset-0 rounded-2xl border border-black/6 bg-white/65 shadow-[0_8px_20px_rgba(0,0,0,0.09)] backdrop-blur-md"
            style={{
              scale: 1 - depth * 0.03,
              opacity: 1 - depth * 0.2,
              zIndex: i,
            }}
          />
        );
      })}

      {/* Front card */}
      <span
        className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-white/80 bg-white/88 backdrop-blur-xl"
        style={{
          boxShadow: isFocused
            ? "0 18px 44px rgba(0,0,0,0.2), 0 0 0 2px rgba(76,139,245,0.4)"
            : pressed
            ? "0 6px 18px rgba(0,0,0,0.12)"
            : "0 14px 32px rgba(0,0,0,0.14)",
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
              background: `linear-gradient(145deg, ${project.color}70 0%, ${project.color}22 60%, rgba(255,255,255,0.5) 100%)`,
            }}
          />
          <span>
            <span className="block truncate text-[11px] font-semibold tracking-tight text-[#1f1f1f]">
              {project.title}
            </span>
            <span className="block truncate text-[9px] text-[#8a8a8a]">
              {isFocused ? "On Stage" : isOpen ? "Open" : "Click to open"}
            </span>
          </span>
        </span>
      </span>
    </motion.div>
  );
}
