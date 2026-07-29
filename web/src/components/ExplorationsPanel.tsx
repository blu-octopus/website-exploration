"use client";

import { motion } from "framer-motion";

const EXPLORATIONS = [
  {
    id: "spring-physics",
    title: "Spring Physics Playground",
    desc: "Interactive demo of spring stiffness and damping curves.",
    tag: "Interaction",
    color: "#7EB8DA",
  },
  {
    id: "glassmorphism",
    title: "Glassmorphism System",
    desc: "A reusable token set for layered glass surfaces.",
    tag: "Design System",
    color: "#9B8EC4",
  },
  {
    id: "ai-personas",
    title: "AI Persona Sketches",
    desc: "Explorations in giving AI interfaces a distinct voice.",
    tag: "AI / UX",
    color: "#6B8F71",
  },
  {
    id: "motion-tokens",
    title: "Motion Token Library",
    desc: "Duration, easing, and spring presets as design tokens.",
    tag: "Design System",
    color: "#C45C26",
  },
];

export function ExplorationsPanel() {
  return (
    <motion.div
      key="explorations"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="pointer-events-auto absolute inset-x-0 top-24 z-20 mx-auto max-w-2xl px-4"
    >
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.16em] text-[#8a8a8a]">
        Explorations
      </p>
      <div className="grid grid-cols-2 gap-3">
        {EXPLORATIONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: i * 0.06 }}
            className="glass-panel group cursor-default rounded-[18px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
          >
            <div
              className="mb-3 h-12 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${item.color}55, ${item.color}18)`,
              }}
            />
            <span
              className="mb-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ background: item.color }}
            >
              {item.tag}
            </span>
            <p className="text-[13px] font-semibold text-[#1f1f1f]">{item.title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#6b6b6b]">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
