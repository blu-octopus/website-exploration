# Cursor IDE Rules

## Project Context
This is a web-based portfolio built to mimic a futuristic macOS desktop interface. The application acts as an interactive knowledge base featuring a 3D AI assistant, a Stage Manager sidebar, and window-based project displays.

## Tech Stack
*   **Core:** React (Next.js or Vite)
*   **State Management:** Zustand (for global window and Stage Manager states)
*   **3D Rendering:** Spline (`@splinetool/react-spline`)
*   **Micro-animations:** Rive (`@rive-app/react-canvas`)
*   **AI Integration:** Vercel AI SDK
*   **Styling:** Tailwind CSS (preferred for rapid glassmorphism UI) or CSS Modules

## Coding Guidelines
*   Write functional React components using hooks.
*   Keep files small and modular. One primary component per file.
*   Use simple, direct variable and function names (e.g., `openProjectWindow`, `activeWindows`).
*   Avoid complex abstractions. Write straightforward, readable logic.
*   Manage complex state (like open windows and AI chat history) globally via Zustand rather than prop-drilling.