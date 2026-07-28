# Development Roadmap

## Phase 1: MVP Layout and Architecture
- [ ] Initialize repository and install core dependencies.
- [ ] Set up global Zustand store for `activeWindows` and `chatHistory`.
- [ ] Build the Top HUD navigation (Projects, Explorations, About).
- [ ] Build the basic Stage Manager left sidebar container.
- [ ] Build the empty Window component and wire it to the Zustand store (open/close logic).

## Phase 2: Core UI and Content Integration
- [ ] Design the Window content templates for case studies (Chipotle Redesign, Capy Tab Manager).
- [ ] Implement Rive animations for folder icons in the Stage Manager.
- [ ] Build the bottom chat input component.
- [ ] Apply glassmorphism styling to all UI containers.

## Phase 3: 3D and AI Integration
- [ ] Import and render the initial Spline 3D character in the center stage.
- [ ] Set up the Vercel AI SDK and connect it to the chat input.
- [ ] Build the floating chat bubble component to display LLM responses.
- [ ] Map LLM response tags (e.g., "thinking", "proud") to Spline animation states.

## Phase 4: Polish and Sprinkles
- [ ] Add draggable functionality to the project windows.
- [ ] Refine the window scale-up and scale-down transitions.
- [ ] Audit performance and clean up code.