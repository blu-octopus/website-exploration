"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolioStore, type NavSection } from "@/src/store/usePortfolioStore";

const NAV: { id: NavSection; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "explorations", label: "Explorations" },
  { id: "about", label: "About" },
];

/**
 * Transparent Tahoe-style menu bar (like the reference navbar)
 * + floating Liquid Glass section switcher.
 */
export function MenuBar() {
  const activeNav = usePortfolioStore((s) => s.activeNav);
  const setActiveNav = usePortfolioStore((s) => s.setActiveNav);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <header className="macos-menubar pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[28px] items-center justify-between px-3 text-[13px] font-medium tracking-tight">
        <div className="pointer-events-auto flex items-center gap-0.5">
          <span className="mr-1 flex h-[16px] w-[16px] items-center justify-center rounded-[4px] bg-white text-[8px] font-bold text-[#1a6bb5]">
            DC
          </span>
          <MenuItem bold>Portfolio OS</MenuItem>
          <MenuItem className="hidden sm:inline-flex">File</MenuItem>
          <MenuItem className="hidden sm:inline-flex">Edit</MenuItem>
          <MenuItem className="hidden sm:inline-flex">View</MenuItem>
          <MenuItem className="hidden md:inline-flex">Window</MenuItem>
          <MenuItem className="hidden md:inline-flex">Help</MenuItem>
        </div>
        <div className="pointer-events-none flex items-center gap-3 text-[12px]">
          <WifiIcon />
          <BatteryIcon />
          <span className="tabular-nums tracking-tight">{clock || " "}</span>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-8 z-50 flex justify-center px-4 pt-2">
        <motion.div
          initial={false}
          className="pointer-events-auto liquid-glass flex h-10 items-center gap-0.5 rounded-full px-1.5 pl-3"
        >
          <span className="mr-1 hidden text-[12px] font-semibold tracking-tight text-white/95 sm:inline">
            Daphne Cheng
          </span>
          <nav className="relative flex items-center">
            {NAV.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className="relative rounded-full px-3 py-1.5 text-[12px]"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_8px_rgba(0,0,0,0.08)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${
                      active
                        ? "font-semibold text-[#111]"
                        : "font-medium text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </motion.div>
      </div>
    </>
  );
}

function MenuItem({
  children,
  bold,
  className = "",
}: {
  children: React.ReactNode;
  bold?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`rounded-[6px] px-1.5 py-0.5 transition hover:bg-white/20 ${
        bold ? "font-semibold" : "font-normal opacity-90"
      } ${className}`}
    >
      {children}
    </span>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path
        d="M8.5 14.2a5.5 5.5 0 0 1 7 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.5 11a9.5 9.5 0 0 1 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 28 14" fill="none" aria-hidden>
      <rect
        x="0.75"
        y="1.75"
        width="22.5"
        height="10.5"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="2.5" y="3.5" width="16" height="7" rx="1.2" fill="currentColor" />
      <path d="M24.5 5v4a2 2 0 0 0 0-4Z" fill="currentColor" />
    </svg>
  );
}
