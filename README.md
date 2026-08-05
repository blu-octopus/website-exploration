# website-exploration

Personal portfolio OS for Daphne Cheng (Design Engineer).

## App

The Next.js app lives in [`web/`](web/). It builds as a **static export** so it runs on GitHub Pages, Netlify, Cloudflare Pages, and similar free hosts (no Node server required).

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production / static preview

```bash
cd web
npm run build
npx serve out
```

Output is `web/out/`.

### Hosting

**GitHub Pages (recommended)**

1. In the repo: **Settings ¡÷ Pages ¡÷ Build and deployment ¡÷ Source: Deploy from a branch**
2. Branch: **`gh-pages`** / folder: **`/`** (root)
3. Push to `main`. The workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) builds `web/` and publishes to the `gh-pages` branch.
4. Project sites get base path `/<repo-name>` automatically (e.g. `https://<user>.github.io/website-exploration/`). User sites (`<user>.github.io` repo) use root.

Live demo: https://blu-octopus.github.io/website-exploration/

**Netlify / Cloudflare Pages**

- Build command: `cd web && npm ci && npm run build`
- Publish directory: `web/out`
- Leave `NEXT_PUBLIC_BASE_PATH` empty unless the site is under a subpath.

### Optional env

Copy `web/.env.example` to `web/.env.local`:

- `NEXT_PUBLIC_BASE_PATH` ¡X subpath for project Pages (CI sets this for you)
- `NEXT_PUBLIC_CHAT_API_URL` ¡X optional remote chat endpoint; otherwise offline knowledge-base replies
- `NEXT_PUBLIC_SPLINE_SCENE` ¡X Spline scene URL (otherwise SVG mascot)

### Specs

- [`cursorrule.md`](cursorrule.md)
- [`src/design.md`](src/design.md)
- [`src/taste.md`](src/taste.md)
- [`src/project_roadmap.md`](src/project_roadmap.md)
