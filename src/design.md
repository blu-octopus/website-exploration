# Design System

## Core Interface Elements
*   **Background:** Clean, abstract gradient or subtle spatial mesh to give a sense of depth.
*   **Containers (Windows, HUD, Chat):** Frost glass effect (Glassmorphism). White or light gray backgrounds with high transparency and heavy background blur.
*   **Borders:** 1px solid borders with very low opacity to define edges clearly without adding visual weight.
*   **Typography:** System fonts (San Francisco/Inter). Clear hierarchy. Heavy use of varied font weights rather than multiple colors.

## Layout Structure
*   **HUD (Top):** Pill-shaped, floating navigation bar.
*   **Stage Manager (Left):** Vertical stack of window thumbnails (macOS Stage Manager style). Stacks group by project and fan into the active center window.
*   **Center Stage:** The primary interaction zone. Holds the 3D character when idle. Holds the active project windows when a folder is opened.
*   **Command Line (Bottom):** A spotlight-style search/chat input field locked to the bottom center.

## Interactive States
*   **Hover:** UI elements should respond with subtle scale increases and increased opacity.
*   **Active:** Open windows cast a broad, soft drop shadow to separate them from the background and the Stage Manager.