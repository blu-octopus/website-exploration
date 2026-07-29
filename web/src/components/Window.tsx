"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { ProjectWindow } from "@/src/store/usePortfolioStore";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";
import { CaseStudyContent } from "@/src/components/CaseStudyContent";

export function Window({ win }: { win: ProjectWindow }) {
  const closeWindow = usePortfolioStore((s) => s.closeWindow);
  const bringToFront = usePortfolioStore((s) => s.bringToFront);
  const setWindowPosition = usePortfolioStore((s) => s.setWindowPosition);
  const clearStage = usePortfolioStore((s) => s.clearStage);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

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
      x: Math.max(8, e.clientX - dragOffset.current.x),
      y: Math.max(64, e.clientY - dragOffset.current.y),
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.86, x: -80 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -60 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="glass-panel absolute flex h-[min(560px,72vh)] w-[min(640px,70vw)] flex-col overflow-hidden rounded-[22px] shadow-[0_28px_90px_rgba(0,0,0,0.18)]"
      style={{
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
      }}
      onPointerDown={() => bringToFront(win.id)}
    >
      <div
        className="flex cursor-grab items-center gap-2 border-b border-black/6 px-3 py-2.5 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="flex items-center gap-1.5" data-no-drag>
          <button
            type="button"
            aria-label="Close window"
            onClick={() => closeWindow(win.id)}
            className="h-3 w-3 rounded-full bg-[#FF5F57] transition hover:brightness-95"
          />
          <button
            type="button"
            aria-label="Minimize to Stage Manager"
            onClick={clearStage}
            className="h-3 w-3 rounded-full bg-[#FEBC2E] transition hover:brightness-95"
          />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <p className="flex-1 truncate text-center text-[13px] font-medium text-[#1f1f1f]">
          {win.title}
        </p>
        <span className="w-10" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5" data-no-drag>
        <CaseStudyContent projectId={win.projectId} />
      </div>
    </motion.div>
  );
}
