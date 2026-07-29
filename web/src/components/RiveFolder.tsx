"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { FolderIcon } from "@/src/components/FolderIcon";

/**
 * Rive-powered folder when /assets/folder.riv is present.
 * Falls back to CSS FolderIcon with tactile spring feedback otherwise.
 */
export function RiveFolder({
  color,
  active,
  pressed,
}: {
  color: string;
  active?: boolean;
  pressed?: boolean;
}) {
  const [hasRive, setHasRive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/assets/folder.riv", { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setHasRive(res.ok);
      })
      .catch(() => {
        if (!cancelled) setHasRive(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasRive) {
    return <FolderIcon color={color} active={active} />;
  }

  return <RiveFolderCanvas pressed={pressed} />;
}

function RiveFolderCanvas({ pressed }: { pressed?: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: "/assets/folder.riv",
    stateMachines: "Folder",
    autoplay: true,
  });

  const pressInput = useStateMachineInput(rive, "Folder", "pressed");

  useEffect(() => {
    if (!pressInput) return;
    pressInput.value = Boolean(pressed);
  }, [pressInput, pressed]);

  return (
    <div className="h-9 w-10 shrink-0 overflow-hidden">
      <RiveComponent className="h-full w-full" />
    </div>
  );
}
