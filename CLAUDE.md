# opus-observatory

Vite + Bun + Vue 3 + TypeScript. `VISION.md` is the brief; read it before touching pages.

- `bun run check` (vue-tsc + oxlint) must pass before a commit.
- Views read only through `src/api/observatory.ts`. Mock data lives in `src/data/`; replace it there, not in components.
- Plots are hand-written SVG in `src/components/plots/`. No chart library.
- Comments are a code smell. Write code that needs none; delete any you find that a name or a type could replace.
- No em dashes.
