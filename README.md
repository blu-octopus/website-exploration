# website-exploration

Personal portfolio OS for Daphne Cheng (Design Engineer).

## App

The Next.js app lives in [`web/`](web/).

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional env

Copy `web/.env.example` to `web/.env.local`:

- `OPENAI_API_KEY` - live LLM replies (otherwise local knowledge-base replies)
- `NEXT_PUBLIC_SPLINE_SCENE` - Spline scene URL (otherwise reference mascot image)

### Specs

- [`cursorrule.md`](cursorrule.md)
- [`src/design.md`](src/design.md)
- [`src/taste.md`](src/taste.md)
- [`src/project_roadmap.md`](src/project_roadmap.md)
