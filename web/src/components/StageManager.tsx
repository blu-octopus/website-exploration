"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/src/data/projects";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";

const SPRING = { type: "spring" as const, stiffness: 420, damping: 30 };
const SOFT = { type: "spring" as const, stiffness: 280, damping: 26 };

/**
 * macOS Stage Manager strip -- stacks fan on hover, compress on press,
 * and morph into the center-stage window via shared layoutId.
 */
export function StageManager() {
  const openProjectWindow = usePortfolioStore((s) => s.openProjectWindow);
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const bringToFront = usePortfolioStore((s) => s.bringToFront);
  const clearStage = usePortfolioStore((s) => s.clearStage);

  const focusedProjectId =
    activeWindows.find((w) => w.id === focusedWindowId)?.projectId ?? null;
  const hasStage = Boolean(focusedProjectId);

  return (
    <aside className="pointer-events-none absolute bottom-36 left-0 top-14 z-40 flex w-[148px] sm:w-[168px]">
      <div className="stage-rail pointer-events-none absolute inset-y-0 left-0 w-full" />

      <div className="relative flex w-full flex-col items-start justify-center gap-5 py-4 pl-2.5 sm:pl-3.5">
        <DesktopTile active={hasStage} onClear={clearStage} />

        {PROJECTS.map((project) => {
          const openWin = activeWindows.find((w) => w.projectId === project.id);
          const isFocused = openWin?.id === focusedWindowId;

          return (
            <StackThumb
              key={project.id}
              project={project}
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
                openProjectWindow({ projectId: project.id, title: project.title });
              }}
            />
          );
        })}
      </div>
    </aside>
  );
}

function DesktopTile({ active, onClear }: { active: boolean; onClear: () => void }) {
  return (
    <motion.button
      type="button"
      initial={false}
      animate={{
        opacity: active ? 0.95 : 0.55,
        x: 0,
        scale: active ? 1 : 0.98,
      }}
      whileHover={{ opacity: 1, x: 8, scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      transition={SPRING}
      onClick={onClear}
      className="pointer-events-auto relative ml-0.5 h-[72px] w-[104px] overflow-hidden rounded-[18px] sm:w-[116px]"
      aria-label="Show desktop"
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #1a5f78 0%, #5ba8b0 45%, #e8d5c4 100%)",
        }}
      />
      <span className="absolute inset-0 liquid-glass opacity-40" />
      <span className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/40" />
      <span className="absolute bottom-2 left-2.5 text-[10px] font-semibold tracking-wide text-white drop-shadow">
        Desktop
      </span>
    </motion.button>
  );
}

function StackThumb({
  project,
  isOpen,
  isFocused,
  onActivate,
}: {
  project: Project;
  isOpen: boolean;
  isFocused: boolean;
  onActivate: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const layers = isOpen ? 3 : 2;
  const spread = pressed ? 0.15 : hovered ? 1 : isFocused ? 0.35 : 0.2;
  const scale = pressed ? 0.92 : hovered ? 1.04 : isFocused ? 1.02 : 1;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${isFocused ? "Return to desktop" : "Open"} ${project.title}`}
      initial={false}
      animate={{
        opacity: isFocused ? 0.45 : isOpen ? 0.92 : 0.78,
        x: isFocused ? 10 : hovered ? 12 : 0,
        scale,
      }}
      transition={SPRING}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => {
        setPressed(false);
        onActivate();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onActivate();
      }}
      className="pointer-events-auto relative block h-[118px] w-[124px] cursor-pointer select-none sm:h-[128px] sm:w-[136px]"
    >
      {/* Back cards -- fan */}
      {Array.from({ length: layers - 1 }).map((_, i) => {
        const depth = layers - 1 - i;
        const offset = 5 + spread * 7;
        return (
          <motion.span
            key={i}
            aria-hidden
            animate={{
              x: offset * depth,
              y: offset * depth * 0.7,
              rotate: spread * depth * 1.8,
            }}
            transition={SPRING}
            className="absolute inset-0 rounded-[18px] liquid-glass"
            style={{
              scale: 1 - depth * 0.035,
              opacity: 0.55 - depth * 0.12,
              zIndex: i,
            }}
          />
        );
      })}

      {/* Front card -- morphs to stage window when focused */}
      {!isFocused ? (
        <motion.span
          layoutId={`stage-${project.id}`}
          transition={SOFT}
          className="absolute inset-0 z-10 overflow-hidden rounded-[18px] liquid-glass-strong"
          style={{
            boxShadow: pressed
              ? "0 6px 18px rgba(0,0,0,0.14)"
              : "0 16px 36px rgba(0,0,0,0.16)",
          }}
        >
          <StackChrome project={project} isOpen={isOpen} />
        </motion.span>
      ) : (
        <span className="absolute inset-0 z-10 overflow-hidden rounded-[18px] border border-white/25 bg-white/20 backdrop-blur-md">
          <span className="flex h-full items-end p-2.5">
            <span className="truncate text-[10px] font-medium text-white/80 drop-shadow">
              {project.title}
            </span>
          </span>
        </span>
      )}
    </motion.div>
  );
}

function StackChrome({ project, isOpen }: { project: Project; isOpen: boolean }) {
  return (
    <>
      <span
        className="absolute inset-x-0 top-0 flex h-7 items-center gap-1.5 border-b border-black/5 px-2.5"
        style={{ background: `${project.color}30` }}
      >
        <span className="h-[7px] w-[7px] rounded-full bg-[#FF5F57] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.15)]" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#FEBC2E] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.15)]" />
        <span className="h-[7px] w-[7px] rounded-full bg-[#28C840] shadow-[inset_0_-0.5px_0_rgba(0,0,0,0.15)]" />
      </span>

      <span className="absolute inset-x-0 bottom-0 top-7 flex flex-col gap-2 p-2.5">
        <span
          className="min-h-0 flex-1 rounded-[12px]"
          style={{
            background: `linear-gradient(145deg, ${project.color}88 0%, ${project.color}28 55%, rgba(255,255,255,0.65) 100%)`,
          }}
        />
        <span>
          <span className="block truncate text-[11px] font-semibold tracking-tight text-[#1a1a1a]">
            {project.title}
          </span>
          <span className="block truncate text-[9px] text-[#6a6a6a]">
            {isOpen ? "In Stage Manager" : "Click to open"}
          </span>
        </span>
      </span>
    </>
  );
}
