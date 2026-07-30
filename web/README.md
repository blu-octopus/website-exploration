# Portfolio OS

Futuristic macOS-style portfolio for Daphne Cheng (Design Engineer).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Encoding check + production build |
| `npm run check-encoding` | Reject smart Unicode that breaks builds |
| `npm run lint` | ESLint |

## Optional env

Copy `.env.example` to `.env.local`:

```
OPENAI_API_KEY=sk-...              # live LLM (falls back to local knowledge base)
NEXT_PUBLIC_SPLINE_SCENE=https://...  # Spline 3D mascot (falls back to PNG)
```

## Layout

- **HUD** - top pill nav (Projects / Explorations / About)
- **Stage Manager** - left stacked window thumbnails
- **Center Stage** - mascot + focused project window
- **Chat Dock** - bottom AI input with suggestion chips
