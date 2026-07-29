import { PROJECTS } from "@/src/data/projects";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_KNOWLEDGE = `
You are Daphne Cheng's portfolio assistant - a friendly, concrete design-engineer companion.
Answer questions about Daphne's background, skills, and projects.

Projects:
${PROJECTS.map(
  (p) =>
    `- ${p.title} (${p.id}): ${p.summary} Role: ${p.role}. Tools: ${p.tools.join(", ")}. Highlights: ${p.highlights.join("; ")}.`
).join("\n")}

Background:
- Design Engineer who makes complex design interactions feel natural through code and research.
- Speaks simply and directly. Professional but conversational.
- Skills: interaction design, front-end engineering (React), prototyping, design systems, research.

Response rules:
- Keep answers short (2-4 sentences) unless asked for detail.
- Append a tag block at the end like [[tags: proud]] or [[tags: thinking]] or [[tags: idle]].
- Use proud when discussing shipped work/projects, thinking when reasoning, idle otherwise.
- If the user asks to open/show a project, mention it clearly and include the project id in plain text.
`.trim();

function localReply(messages: ChatMessage[]): {
  text: string;
  openProjectId?: string;
  openProjectTitle?: string;
} {
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

export async function POST(req: Request) {
  const body = (await req.json()) as { messages?: ChatMessage[] };
  const messages = body.messages ?? [];

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(localReply(messages));
  }

  try {
    const { generateText } = await import("ai");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const openai = createOpenAI({ apiKey });

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_KNOWLEDGE,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const lower = text.toLowerCase();
    const matched = PROJECTS.find(
      (p) => lower.includes(p.id) || lower.includes(p.title.toLowerCase())
    );
    const wantsOpen = /open|show|launch/.test(
      messages[messages.length - 1]?.content?.toLowerCase() ?? ""
    );

    return Response.json({
      text,
      ...(matched && wantsOpen
        ? { openProjectId: matched.id, openProjectTitle: matched.title }
        : {}),
    });
  } catch {
    return Response.json(localReply(messages));
  }
}
