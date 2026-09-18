# Game Forge

A small **web-based Phaser game studio** you can run locally and extend. It is a starter app, not a full engine competitor: a studio frame (toolbar, hierarchy, inspector) with a live Phaser game view in the middle.

This project is independent of Gameforge AG / Gameforge 4D GmbH.

## Stack

- [Phaser](https://phaser.io/) 4 (game runtime)
- [Vite](https://vite.dev/) 6 (dev server and bundler)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) + [ESLint](https://eslint.org/)

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default [http://localhost:5173](http://localhost:5173)).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the studio |
| `npm run build` | Typecheck and production build |
| `npm test` | Run unit tests |
| `npm run lint` | Lint TypeScript |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run preview` | Serve the production build |

## What you get

- Studio chrome: play/pause, scene list, object hierarchy, inspector, status bar
- Phaser **Playground** scene hosted in `#game-container`
- WASD / arrow keys to move the player; click empty space to spawn tokens; click a shape to inspect it

## Layout

```
src/
  main.ts                 # entry point
  studio/                 # UI chrome (no Phaser runtime required)
  game/                   # Phaser config + Playground scene
  styles/studio.css
tests/                    # happy-path unit tests
.github/workflows/ci.yml  # lint, typecheck, test, build on PRs
```

Extend the studio by adding scenes under `src/game/scenes/` and wiring them in `src/game/createGame.ts`.

## Branch protection (GitHub settings)

This repo cannot set branch rules from application code. For `main`, recommended GitHub settings:

- Require a pull request before merging
- Require status checks to pass: **CI** (`lint, typecheck, test, build`)
- Do not allow force pushes
- Do not allow deletions

## License

[MIT](LICENSE)
