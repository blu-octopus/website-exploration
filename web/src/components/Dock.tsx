"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/src/data/projects";
import { usePortfolioStore } from "@/src/store/usePortfolioStore";

/**
 * macOS Tahoe-style Dock -- Liquid Glass tray + magnification hover,
 * patterned after the Tahoe-for-the-Web dock chrome.
 */
export function Dock() {
  const openProjectWindow = usePortfolioStore((s) => s.openProjectWindow);
  const clearStage = usePortfolioStore((s) => s.clearStage);
  const setActiveNav = usePortfolioStore((s) => s.setActiveNav);
  const activeWindows = usePortfolioStore((s) => s.activeWindows);
  const focusedWindowId = usePortfolioStore((s) => s.focusedWindowId);
  const [hover, setHover] = useState<number | null>(null);

  const focusedProjectId =
    activeWindows.find((w) => w.id === focusedWindowId)?.projectId ?? null;

  const items = [
    {
      id: "desktop",
      label: "Desktop",
      color: "#5eb0ef",
      glyph: "D",
      onClick: () => {
        clearStage();
        setActiveNav("projects");
      },
      active: !focusedProjectId,
    },
    ...PROJECTS.map((p) => ({
      id: p.id,
      label: p.title,
      color: p.color,
      glyph: p.title.slice(0, 1),
      onClick: () => openProjectWindow({ projectId: p.id, title: p.title }),
      active: focusedProjectId === p.id || activeWindows.some((w) => w.projectId === p.id),
    })),
  ];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[55] flex justify-center px-3">
      <motion.div
        initial={false}
        className="macos-dock pointer-events-auto flex h-[68px] items-end gap-1 px-2 pb-1.5 pt-1"
        onPointerLeave={() => setHover(null)}
      >
        {items.map((item, i) => {
          const dist = hover === null ? 0 : Math.abs(i - hover);
          const scale = hover === null ? 1 : Math.max(1, 1.45 - dist * 0.22);
          const y = hover === null ? 0 : Math.max(0, (scale - 1) * -18);

          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label}
              title={item.label}
              onPointerEnter={() => setHover(i)}
              onClick={item.onClick}
              animate={{ scale, y }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="relative flex w-14 flex-col items-center justify-end"
              style={{ transformOrigin: "bottom center" }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-[14px] text-lg font-bold text-white shadow-[0_6px_16px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]"
                style={{
                  background: `linear-gradient(145deg, ${item.color} 0%, ${item.color}cc 100%)`,
                }}
              >
                {item.glyph}
              </span>
              {item.active && (
                <span className="mt-1 h-[4px] w-[4px] rounded-full bg-white/90 shadow" />
              )}
              {!item.active && <span className="mt-1 h-[4px] w-[4px]" />}
            </motion.button>
          );
        })}

        <span className="macos-dock__divider self-center" aria-hidden />

        <DockUtility
          label="Explorations"
          onClick={() => {
            clearStage();
            setActiveNav("explorations");
          }}
          glyph="Ex"
          color="#7ec8e8"
        />
        <DockUtility
          label="About"
          onClick={() => {
            clearStage();
            setActiveNav("about");
          }}
          glyph="Ab"
          color="#e8d5c4"
        />
      </motion.div>
    </div>
  );
}

function DockUtility({
  label,
  onClick,
  glyph,
  color,
}: {
  label: string;
  onClick: () => void;
  glyph: string;
  color: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.28, y: -10 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      onClick={onClick}
      className="relative mb-0.5 flex w-14 flex-col items-center justify-end"
      style={{ transformOrigin: "bottom center" }}
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-[14px] text-base font-semibold text-[#1a1a1a]/80 shadow-[0_6px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.45)]"
        style={{
          background: `linear-gradient(145deg, ${color} 0%, ${color}aa 100%)`,
        }}
      >
        {glyph}
      </span>
      <span className="mt-1 h-[4px] w-[4px]" />
    </motion.button>
  );
}
