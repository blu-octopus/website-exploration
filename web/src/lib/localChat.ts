import { PROJECTS } from "@/src/data/projects";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatReply = {
  text: string;
  openProjectId?: string;
  openProjectTitle?: string;
};

/**
 * Offline knowledge-base replies. Works on static hosts (GitHub Pages, etc.)
 * with no server / API key required.
 */
export function localChatReply(messages: ChatMessage[]): ChatReply {
  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? "";

  const matched = PROJECTS.find(
    (p) =>
      last.includes(p.id) ||
      last.includes(p.title.toLowerCase()) ||
      (p.id === "capy-tab-manager" && last.includes("capy")) ||
      (p.id === "chipotle-redesign" && last.includes("chipotle"))
  );

  const wantsOpen = /open|show|launch|view/.test(last);

  if (matched && wantsOpen) {
    return {
      text: `Opening ${matched.title}. ${matched.summary} [[tags: proud]]`,
      openProjectId: matched.id,
      openProjectTitle: matched.title,
    };
  }

  if (matched) {
    return {
      text: `${matched.title}: ${matched.summary} Highlights include ${matched.highlights[0]}. [[tags: proud]]`,
    };
  }

  if (/skill|stack|tool|what can|background|about|who/.test(last)) {
    return {
      text: "Daphne is a Design Engineer focused on making complex interactions feel natural through code and research - React, prototyping, design systems, and product thinking. [[tags: idle]]",
    };
  }

  if (/hello|hi|hey/.test(last)) {
    return {
      text: "Hey - ask me about Capy Tab Manager, the Chipotle redesign, or Daphne's design-engineering approach. [[tags: idle]]",
    };
  }

  return {
    text: "I can talk through Daphne's projects (Capy Tab Manager, Chipotle Redesign, Portfolio OS), skills, and process. What do you want to explore? [[tags: thinking]]",
  };
}
