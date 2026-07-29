export type MascotTag = "thinking" | "proud" | "typing" | "idle";

const TAG_PATTERN = /\[\[tags?:\s*([a-z,\s]+)\]\]/i;

/** Extract tags like [[tags: thinking, proud]] from model output. */
export function parseResponseTags(text: string): {
  cleanText: string;
  tags: MascotTag[];
} {
  const match = text.match(TAG_PATTERN);
  if (!match) {
    return { cleanText: text.trim(), tags: [] };
  }

  const tags = match[1]
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t): t is MascotTag =>
      ["thinking", "proud", "typing", "idle"].includes(t)
    );

  return {
    cleanText: text.replace(TAG_PATTERN, "").trim(),
    tags,
  };
}

export function pickMascotState(tags: MascotTag[]): MascotTag {
  if (tags.includes("thinking")) return "thinking";
  if (tags.includes("typing")) return "typing";
  if (tags.includes("proud")) return "proud";
  if (tags.includes("idle")) return "idle";
  return "idle";
}

/** Heuristic fallback when the model omits tags. */
export function inferTagsFromText(text: string): MascotTag[] {
  const lower = text.toLowerCase();
  if (/capy|chipotle|project|case study|built|designed/.test(lower)) {
    return ["proud"];
  }
  if (/think|hmm|let me|looking|retriev/.test(lower)) {
    return ["thinking"];
  }
  return ["idle"];
}
