import { create } from "zustand";

export type ChatRole = "user" | "assistant";
export type MascotState = "idle" | "thinking" | "proud" | "typing";
export type NavSection = "projects" | "explorations" | "about";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  tags?: string[];
};

export type WindowPosition = { x: number; y: number };

export type ProjectWindow = {
  id: string;
  projectId: string;
  title: string;
  position: WindowPosition;
  zIndex: number;
};

type PortfolioState = {
  activeWindows: ProjectWindow[];
  focusedWindowId: string | null;
  chatHistory: ChatMessage[];
  mascotState: MascotState;
  activeNav: NavSection;
  _zCounter: number;

  setActiveNav: (nav: NavSection) => void;
  setMascotState: (state: MascotState) => void;

  openProjectWindow: (args: {
    projectId: string;
    title: string;
    position?: Partial<WindowPosition>;
  }) => void;
  closeWindow: (windowId: string) => void;
  bringToFront: (windowId: string) => void;
  setWindowPosition: (windowId: string, position: WindowPosition) => void;
  clearStage: () => void;

  addChatMessage: (message: Omit<ChatMessage, "id">) => void;
  clearChatHistory: () => void;
};

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}`;

/** Centered stage frame, accounting for Stage Manager rail + chat dock. */
function stagePosition(): WindowPosition {
  if (typeof window === "undefined") return { x: 200, y: 88 };
  const width = Math.min(640, window.innerWidth * 0.72);
  const x = Math.max(160, (window.innerWidth - width) / 2 + 40);
  const y = Math.max(72, window.innerHeight * 0.1);
  return { x, y };
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  activeWindows: [],
  focusedWindowId: null,
  chatHistory: [],
  mascotState: "idle",
  activeNav: "projects",
  _zCounter: 10,

  setActiveNav: (nav) => set({ activeNav: nav }),
  setMascotState: (state) => set({ mascotState: state }),

  openProjectWindow: ({ projectId, title, position }) => {
    const existing = get().activeWindows.find((w) => w.projectId === projectId);
    if (existing) {
      get().bringToFront(existing.id);
      return;
    }

    const { _zCounter, activeWindows } = get();
    const id = uid();
    const pos = position?.x != null && position?.y != null
      ? { x: position.x, y: position.y }
      : stagePosition();

    set({
      activeWindows: [
        ...activeWindows,
        {
          id,
          projectId,
          title,
          position: pos,
          zIndex: _zCounter,
        },
      ],
      focusedWindowId: id,
      _zCounter: _zCounter + 1,
      mascotState: "proud",
    });
  },

  closeWindow: (windowId) => {
    const remaining = get().activeWindows.filter((w) => w.id !== windowId);
    const nextFocus =
      get().focusedWindowId === windowId
        ? remaining.sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
        : get().focusedWindowId;

    set({
      activeWindows: remaining,
      focusedWindowId: nextFocus,
      mascotState: remaining.length === 0 ? "idle" : get().mascotState,
    });
  },

  bringToFront: (windowId) => {
    const { _zCounter, activeWindows } = get();
    set({
      activeWindows: activeWindows.map((w) =>
        w.id === windowId
          ? { ...w, zIndex: _zCounter, position: stagePosition() }
          : w
      ),
      focusedWindowId: windowId,
      _zCounter: _zCounter + 1,
    });
  },

  setWindowPosition: (windowId, position) => {
    set({
      activeWindows: get().activeWindows.map((w) =>
        w.id === windowId ? { ...w, position } : w
      ),
    });
  },

  clearStage: () => {
    set({ focusedWindowId: null, mascotState: "idle" });
  },

  addChatMessage: (message) => {
    set({
      chatHistory: [...get().chatHistory, { id: uid(), ...message }],
    });
  },

  clearChatHistory: () => set({ chatHistory: [] }),
}));
