"use client";

import { motion } from "framer-motion";

/**
 * Tahoe-sky wallpaper -- vivid blue field with soft cloud orbs
 * (aligned with macOS Tahoe web desktop reference aesthetics).
 */
export function DesktopWallpaper() {
  return (
    <div className="macos-wallpaper pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <motion.div
        className="macos-wallpaper__orb"
        style={{
          width: 560,
          height: 360,
          left: "10%",
          top: "8%",
          background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 30, -10, 0], y: [0, 18, -12, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="macos-wallpaper__orb"
        style={{
          width: 480,
          height: 320,
          right: "5%",
          top: "18%",
          background: "radial-gradient(circle, rgba(180,230,255,0.65) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -40, 20, 0], y: [0, 25, -8, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="macos-wallpaper__orb"
        style={{
          width: 700,
          height: 280,
          left: "20%",
          bottom: "-8%",
          background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
          opacity: 0.5,
        }}
        animate={{ scale: [1, 1.08, 0.97, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="macos-wallpaper__sheen" />
      <div className="macos-wallpaper__noise" />
    </div>
  );
}
