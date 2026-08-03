# Portfolio OS

Futuristic macOS-style portfolio for Daphne Cheng (Design Engineer).

Static export (`output: "export"`) ¡X deploy `out/` to GitHub Pages, Netlify, Cloudflare Pages, etc.

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
| `npm run build` | Encoding check + static export to `out/` |
| `npm run check-encoding` | Reject smart Unicode that breaks builds |
| `npm run lint` | ESLint |

Preview the static build:

```bash
npm run build
npx serve out
```

## Hosting

See the [root README](../README.md#hosting) for GitHub Pages / Netlify / Cloudflare setup.

For a project Pages URL like `username.github.io/website-exploration`:

```bash
NEXT_PUBLIC_BASE_PATH=/website-exploration npm run build
```

## Optional env

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_BASE_PATH=              # e.g. /website-exploration for GH project Pages
NEXT_PUBLIC_CHAT_API_URL=           # optional remote chat; else offline KB
NEXT_PUBLIC_SPLINE_SCENE=https://...  # optional Spline mascot
```

## Layout

- **HUD** - top pill nav (Projects / Explorations / About)
- **Stage Manager** - left stacked window thumbnails
- **Center Stage** - mascot + focused project window
- **Chat Dock** - bottom AI input with suggestion chips
