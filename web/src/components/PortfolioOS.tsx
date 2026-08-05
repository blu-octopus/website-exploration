"use client";

import { LayoutGroup } from "framer-motion";
import { DesktopWallpaper } from "@/src/components/DesktopWallpaper";
import { GlassDistortionFilter } from "@/src/components/GlassDistortionFilter";
import { MenuBar } from "@/src/components/MenuBar";
import { StageManager } from "@/src/components/StageManager";
import { CenterStage } from "@/src/components/CenterStage";
import { ChatDock } from "@/src/components/ChatDock";
import { Dock } from "@/src/components/Dock";

export function PortfolioOS() {
  return (
    <LayoutGroup id="portfolio-os">
      <div className="portfolio-os relative h-dvh w-full overflow-hidden">
        <GlassDistortionFilter />
        <DesktopWallpaper />
        <MenuBar />
        <StageManager />
        <CenterStage />
        <ChatDock />
        <Dock />
      </div>
    </LayoutGroup>
  );
}
