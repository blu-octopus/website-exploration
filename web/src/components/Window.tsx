"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { ProjectWindow } from "@/src/store/usePortfolioStore";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { CaseStudyContent } from "@/src/components/CaseStudyContent";
import { getProject } from "@/src/data/projects";

const STAGE_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.9 };

/**
 * Center-stage app window. Shares layoutId with Stage Manager stack
 * for macOS-like morph transitions into a fixed stage frame.
 * position is a drag offset from center.
 */
export function Window({ win }: { win: ProjectWindow }) {
  const closeWindow = usePortfolioStore((s) => s.closeWindow);
  const bringToFront = usePortfolioStore((s) => s.bringToFront);
  const setWindowPosition = usePortfolioStore((s) => s.setWindowPosition);
  const clearStage = usePortfolioStore((s) => s.clearStage);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const project = getProject(win.projectId);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    bringToFront(win.id);
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    setWindowPosition(win.id, {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center pl-[130px] pr-6 pb-36 pt-16 sm:pl-[150px]">
      <motion.div
        data-stage-window={win.projectId}
        layoutId={`stage-${win.projectId}`}
        initial={false}
        animate={{
          opacity: 1,
          x: win.position.x,
          y: win.position.y,
        }}
        exit={{ opacity: 0 }}
        transition={STAGE_SPRING}
        className="liquid-glass-strong pointer-events-auto flex h-[min(580px,68vh)] w-[min(680px,72vw)] max-w-[720px] flex-col overflow-hidden rounded-[20px]"
        style={{ zIndex: win.zIndex }}
        onPointerDown={() => bringToFront(win.id)}
      >
        <div
          className="flex cursor-grab items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5 active:cursor-grabbing"
          style={{
            background: project
              ? `linear-gradient(180deg, ${project.color}22 0%, transparent 100%)`
              : undefined,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="flex items-center gap-[7px]" data-no-drag>
            <TrafficLight
              color="#FF5F57"
              label="Close window"
              onClick={() => closeWindow(win.id)}
            />
            <TrafficLight
              color="#FEBC2E"
              label="Minimize to Stage Manager"
              onClick={clearStage}
            />
            <TrafficLight color="#28C840" label="Zoom" onClick={() => undefined} />
          </div>
          <p className="flex-1 truncate text-center text-[13px] font-semibold tracking-tight text-[#1a1a1a]/90">
            {win.title}
          </p>
          <span className="w-12" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-white/45 p-5" data-no-drag>
          <CaseStudyContent projectId={win.projectId} />
        </div>
      </motion.div>
    </div>
  );
}

function TrafficLight({
  color,
  label,
  onClick,
}: {
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group relative h-3 w-3 rounded-full transition hover:brightness-95"
      style={{
        background: color,
        boxShadow: "inset 0 -0.5px 0 rgba(0,0,0,0.2), 0 0.5px 0 rgba(255,255,255,0.35)",
      }}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-70">
        <span className="h-[1.5px] w-[6px] rounded-full bg-black/50" />
      </span>
    </button>
  );
}
