# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `ng serve` — dev server at http://localhost:4200/
- `ng build` — production build; output goes to `docs/` (not `dist/`), so GitHub Pages can serve it
- `npm run pages` — build with the GitHub Pages base href
- `ng test` — run unit tests once via Vitest (`@angular/build:unit-test` builder, jsdom environment). Add `--watch` for watch mode
- `ng test --include='**/bot.spec.ts'` — run a single spec file
- `ng generate component game/foo` — scaffold (SCSS styles, `ttt` selector prefix are defaults)

## Architecture

A client-only Angular 22 tic-tac-toe PWA. Standalone components (no NgModules), bootstrapped in `src/main.ts` via `app.config.ts`. No router and no backend — all state lives in memory and `localStorage`.

### Two layers: framework-free models vs. Angular shell

`src/app/models/` is plain TypeScript with **no Angular imports** — re-exported through `models/index.ts`. The game rules and AI live here and are independently unit-tested:

- `Game` holds a flat `Cell[]` grid plus whose `turn` it is. `Game.win(x,y)` **mutates** `Cell.state` in place, flips the turn, and returns whether that move completed a line. Derived getters (`paths`, `winPath`, `moves`, `areNoMovesRemaining`) recompute from the grid each access.
- `Cell` is `{x, y, state?}` where `state` is `'x' | 'o' | undefined`.
- `Bot` implements minimax in `getClaim`. Opening moves (9/8 cells free) are special-cased by `botFirstMove` strategy (`center`/`adjacent`/`corner`, see `bot-first-moves.const.ts`); deeper positions run recursive `scores()` that **clones the grid with `JSON.parse(JSON.stringify(...))`** and plays out a fresh `Game`. Scores are depth-adjusted (`100 - depth`) so it prefers faster wins / slower losses.

The Angular layer (`src/app/game/`) is a thin shell over these models:

- `GameComponent` owns the live `Game` and `Bot`. `claim()` is the click handler; `allowClicks` gates input while the bot "thinks" (`getClaim` is async) and during the 2.5s end-of-game pause before auto-restart. When a bot player is configured, a human move triggers `botClaim()`.
- `FormComponent` / `FormService` hold game settings (`Form`: which side the bot plays, who goes first, X/O colors, player names). `FormService` exposes each setting as a **signal** (`player1`, `xColor`, `botPlayer`, …) plus a `model` getter/setter that materializes/loads a plain `Form` (used for persistence and imperative reads). The form template uses `[ngModel]="formService.x()"` + `(ngModelChange)="formService.x.set($event)"`, and cells read the signals so colors/names update live.
- `CellComponent` renders one square.
- `LocalStorageService` persists `{version, game, form}` under key `JosterDevTicTacToe`. It is saved on the `window:unload` host listener and reloaded in `GameComponent`'s constructor. **Bump `version` when the persisted shape changes** — a mismatch clears the saved game on load.

### Change detection

This app is **zoneless** (`provideZonelessChangeDetection`); zone.js is removed from `angular.json` polyfills and `package.json`. The mutation-based game core is kept, so reactivity lives at the Angular shell: `FormService` fields are signals, `GameComponent.game` is a signal re-published via `play()` after each in-place `Game.win()`, and the board `@for` tracks by `cell.state` so a moved cell's view recreates. The async bot move yields to a macrotask (`setTimeout`) before committing, because signal writes in the microtask right after a click's `await` don't schedule a tick. See the `zoneless-deferred` memory for the full rationale and gotchas — verify CD changes interactively, not just with `ng build`.

## Conventions

- Strict TypeScript is on, including `strictTemplates`, `noPropertyAccessFromIndexSignature`, and `strictInjectionParameters`. Use `inject()` over constructor injection (matches existing code).
- Keep game/AI logic inside `src/app/models/` free of Angular imports so it stays unit-testable in isolation; every model file has a co-located `.spec.ts`.
- Tests run on **Vitest** (jsdom env). `describe`/`it`/`expect` are configured as globals by the builder (typed via `vitest/globals` in `tsconfig.spec.json`), so specs don't import them. `src/test-setup.ts` (wired through the `setupFiles` builder option) polyfills `localStorage`, which jsdom doesn't provide but `LocalStorageService` needs.
- External UI comes from `@joster-dev/icon` and `@joster-dev/chaos-control`. The chaos-control standalone components use `cc-*` selectors (e.g. `cc-text`, `cc-choice`) and must be imported individually — there is no `ChaosControlModule`.
