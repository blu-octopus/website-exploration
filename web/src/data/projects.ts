export type Project = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  role: string;
  tools: string[];
  highlights: string[];
  color: string;
};

export const PROJECTS: Project[] = [
  {
    id: "capy-tab-manager",
    title: "Capy Tab Manager",
    subtitle: "Browser productivity, redesigned",
    summary:
      "A calm tab manager that groups chaos into living folders. Built as a Chrome extension with spatial memory and soft motion cues.",
    role: "Design Engineer",
    tools: ["React", "Chrome APIs", "Framer Motion"],
    highlights: [
      "Saved users ~40% tab switching time in early tests",
      "Folder metaphors with tactile press feedback",
      "Keyboard-first navigation with spatial recall",
    ],
    color: "#7EB8DA",
  },
  {
    id: "chipotle-redesign",
    title: "Chipotle Redesign",
    subtitle: "Ordering flow, rethought",
    summary:
      "A speculative redesign of Chipotle's digital ordering experience focused on clarity, speed, and appetite-driven visuals.",
    role: "Product Designer",
    tools: ["Figma", "Prototyping", "User Research"],
    highlights: [
      "Reduced order path from 7 taps to 4",
      "Customizable bowl builder with live preview",
      "Accessibility-first type and contrast system",
    ],
    color: "#C45C26",
  },
  {
    id: "portfolio-os",
    title: "Portfolio OS",
    subtitle: "This spatial interface",
    summary:
      "A futuristic desktop shell that turns case studies into windows, folders into Stage Manager stacks, and AI into a reactive companion.",
    role: "Design Engineer",
    tools: ["Next.js", "Zustand", "Spline", "AI SDK"],
    highlights: [
      "Windowed case studies with drag + stacking",
      "Reactive mascot driven by chat intent",
      "Glass HUD inspired by spatial OS patterns",
    ],
    color: "#6B8F71",
  },
];

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
