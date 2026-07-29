"use client";

import { motion } from "framer-motion";

const LINKS = [
  { label: "Email", href: "mailto:hello@daphnecheng.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/daphnecheng" },
  { label: "Resume", href: "#" },
];

export function AboutPanel() {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="pointer-events-auto absolute inset-x-0 top-24 z-20 mx-auto max-w-sm px-4"
    >
      <div className="glass-panel rounded-[22px] px-6 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f1f1f] text-sm font-bold text-white">
            DC
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1f1f1f]">Daphne Cheng</p>
            <p className="text-xs text-[#8a8a8a]">Design Engineer</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[#2a2a2a]">
          I make{" "}
          <em className="not-italic font-semibold">complex</em> design interactions feel
          natural through <span className="font-mono text-[#1f1f1f]">code</span> and
          research.
        </p>

        <div className="mb-5 space-y-1.5">
          {[
            "Interaction design & prototyping",
            "React / Next.js / TypeScript",
            "Design systems & tokens",
            "User research & synthesis",
          ].map((skill) => (
            <div key={skill} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#8a8a8a]" />
              <span className="text-xs text-[#3a3a3a]">{skill}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="rounded-full border border-black/8 bg-white/60 px-3 py-1.5 text-xs font-medium text-[#3a3a3a] transition hover:bg-white/90"
            >
              {link.label} &nearr;
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
