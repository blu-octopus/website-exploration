"use client";

import { usePortfolioStore, type NavSection } from "@/src/store/usePortfolioStore";

const NAV: { id: NavSection; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "explorations", label: "Explorations" },
  { id: "about", label: "About" },
];

export function HUD() {
  const activeNav = usePortfolioStore((s) => s.activeNav);
  const setActiveNav = usePortfolioStore((s) => s.setActiveNav);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <div className="pointer-events-auto glass-panel flex h-12 items-center gap-2 rounded-full px-2 pl-4 pr-3 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="mr-2 flex items-center gap-2 pr-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1f1f1f] text-[11px] font-semibold text-white">
            DC
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-[#1f1f1f] sm:inline">
            Daphne Cheng
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-[#1f1f1f] font-medium text-white shadow-sm"
                    : "text-[#5c5c5c] hover:bg-black/5 hover:text-[#1f1f1f]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-2 flex items-center gap-1 border-l border-black/8 pl-2">
          <IconButton label="Profile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 19c1.8-3.2 4.2-4.5 7-4.5s5.2 1.3 7 4.5" />
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c5c5c] transition hover:bg-black/5 hover:text-[#1f1f1f]"
    >
      {children}
    </button>
  );
}
