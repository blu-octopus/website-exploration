"use client";

import { useEffect, useRef, useState } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import type { MascotState } from "@/src/store/usePortfolioStore";
import { withBasePath } from "@/src/lib/basePath";

/** Soft Bezier curves for organic head/body motion. */
const BODY_EASE: [number, number, number, number] = [0.45, 0.05, 0.55, 0.95];
const HEAD_EASE: [number, number, number, number] = [0.37, 0, 0.63, 1];

type Props = {
  state: MascotState;
  className?: string;
};

/**
 * Capybara SVG with independent head/body Bezier idle animation.
 * Markup stays in /public/assets/mascot.svg; we inline so transforms apply.
 * Client-only to avoid hydration mismatches from dynamic SVG markup.
 */
export function CapybaraMascot({ state, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [markup, setMarkup] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(withBasePath("/assets/mascot.svg"))
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        // Drop embedded CSS keyframes; Framer drives motion instead.
        setMarkup(text.replace(/<style>[\s\S]*?<\/style>/, ""));
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !markup) return;

    const head = host.querySelector<SVGGElement>("#capy-head");
    const body = host.querySelector<SVGGElement>("#capy-body");
    const shadow = host.querySelector<SVGGElement>("#capy-shadow");
    if (!head || !body) return;

    for (const el of [head, body, shadow]) {
      if (!el) continue;
      el.style.transformBox = "fill-box";
      el.style.willChange = "transform";
    }
    head.style.transformOrigin = "50% 85%";
    body.style.transformOrigin = "50% 100%";
    if (shadow) shadow.style.transformOrigin = "50% 50%";

    const isThinking = state === "thinking" || state === "typing";
    const isProud = state === "proud";

    const bodyAmp = isThinking ? 4 : isProud ? 6 : 2.5;
    const headAmp = isThinking ? 6 : isProud ? 9 : 4.5;
    const headRot = isThinking ? 2.2 : isProud ? 1.6 : 1.1;
    const duration = isThinking ? 1.5 : isProud ? 1.9 : 3.2;

    // SVG <g> responds more reliably to explicit transform strings than { y }.
    const controls: AnimationPlaybackControls[] = [
      animate(
        body,
        {
          transform: [
            "translateY(0px)",
            `translateY(-${bodyAmp}px)`,
            "translateY(0px)",
          ],
        },
        { duration, repeat: Infinity, ease: BODY_EASE },
      ),
      animate(
        head,
        {
          transform: [
            "translateY(0px) rotate(0deg)",
            `translateY(-${headAmp}px) rotate(${headRot}deg)`,
            "translateY(0px) rotate(0deg)",
          ],
        },
        { duration, repeat: Infinity, ease: HEAD_EASE },
      ),
    ];

    if (shadow) {
      controls.push(
        animate(
          shadow,
          {
            transform: ["scaleX(1)", "scaleX(0.9)", "scaleX(1)"],
            opacity: [1, 0.8, 1],
          },
          { duration, repeat: Infinity, ease: BODY_EASE },
        ),
      );
    }

    return () => {
      for (const c of controls) c.stop();
    };
  }, [markup, state]);

  if (!ready) {
    return <div className={className} aria-hidden />;
  }

  if (!markup) {
    return (
      <div className={className} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/assets/mascot.svg")}
          alt=""
          className="h-full w-full object-contain opacity-90"
        />
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={`flex items-center justify-center overflow-visible [&_svg]:h-full [&_svg]:w-auto [&_svg]:max-h-full [&_svg]:drop-shadow-[0_24px_48px_rgba(130,61,0,0.18)] ${className ?? ""}`}
      role="img"
      aria-label="Capybara mascot"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
