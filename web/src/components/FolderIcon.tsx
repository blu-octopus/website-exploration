"use client";

import { motion } from "framer-motion";

/** CSS/Rive-style tactile folder - compresses on press via parent whileTap. */
export function FolderIcon({
  color,
  active,
}: {
  color: string;
  active?: boolean;
}) {
  return (
    <motion.div
      className="relative h-9 w-10 shrink-0"
      animate={active ? { y: -1 } : { y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <svg viewBox="0 0 40 36" className="h-full w-full drop-shadow-sm">
        <path
          d="M3 10.5C3 8.015 5.015 6 7.5 6H14l3.2 3.2H32.5C34.985 9.2 37 11.215 37 13.7V27.5C37 29.985 34.985 32 32.5 32H7.5C5.015 32 3 29.985 3 27.5V10.5Z"
          fill={color}
          opacity={0.95}
        />
        <path
          d="M3 14H37V27.5C37 29.985 34.985 32 32.5 32H7.5C5.015 32 3 29.985 3 27.5V14Z"
          fill="white"
          opacity={0.22}
        />
        <rect x="8" y="17" width="16" height="2.2" rx="1.1" fill="white" opacity={0.45} />
      </svg>
    </motion.div>
  );
}
