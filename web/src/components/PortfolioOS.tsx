"use client";

import { HUD } from "@/src/components/HUD";
import { StageManager } from "@/src/components/StageManager";
import { CenterStage } from "@/src/components/CenterStage";
import { ChatDock } from "@/src/components/ChatDock";

export function PortfolioOS() {
  return (
    <div className="portfolio-os relative h-dvh w-full overflow-hidden">
      <HUD />
      <StageManager />
      <CenterStage />
      <ChatDock />
    </div>
  );
}
