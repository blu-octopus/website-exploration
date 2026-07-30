# Development Roadmap

## Phase 1: MVP Layout and Architecture
- [x] Initialize repository and install core dependencies.
- [x] Set up global Zustand store for `activeWindows` and `chatHistory`.
- [x] Build the Top HUD navigation (Projects, Explorations, About).
- [x] Build the Stage Manager left sidebar container (macOS stacked thumbnails).
- [x] Build the Window component and wire it to the Zustand store (open/close logic).

## Phase 2: Core UI and Content Integration
- [x] Design the Window content templates for case studies (Chipotle Redesign, Capy Tab Manager).
- [x] Implement tactile spring-compress animations for Stage Manager stacks (Rive-ready fallback).
- [x] Build the bottom chat input component.
- [x] Apply glassmorphism styling to all UI containers.

## Phase 3: 3D and AI Integration
- [x] Import mascot image to center stage with idle breathing animation.
- [x] Set up the Vercel AI SDK and connect it to the chat input.
- [x] Build the floating chat bubble component to display LLM responses.
- [x] Map LLM response tags (e.g., "thinking", "proud") to mascot animation states.

## Phase 4: Polish and Sprinkles
- [x] Add draggable functionality to the project windows.
- [x] Refine the window scale-up and scale-down transitions.
- [x] Add Explorations section content.
- [ ] Wire Spline 3D scene (requires NEXT_PUBLIC_SPLINE_SCENE env var).
- [ ] Audit performance and clean up code.
