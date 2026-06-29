# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `ng serve` — dev server at http://localhost:4200/
- `ng build` — production build; output goes to `docs/` (not `dist/`), so GitHub Pages can serve it
- `npm run pages` — build with the GitHub Pages base href
- `ng test` — run unit tests once via Vitest (`@angular/build:unit-test` builder, jsdom environment). Add `--watch` for watch mode
- `ng test --include='**/ai.spec.ts'` — run a single spec file
- `ng generate component game/foo` — scaffold (SCSS styles, `ttt` selector prefix are defaults)

## Architecture

A client-only Angular 22 tic-tac-toe PWA. Standalone components (no NgModules), bootstrapped in `src/main.ts` via `app.config.ts`. No router and no backend — all state lives in memory and `localStorage`.

### Two layers: pure functional core vs. reactive Angular shell

`src/app/models/` is plain TypeScript with **no Angular imports** — re-exported through `models/index.ts`. It is a **pure, immutable** core: data + functions, no classes-with-behaviour, no mutation, no serialization tricks. This is the whole game/AI domain and is independently unit-tested:

- `board.ts` — `Mark` (`'x'|'o'`), `Cell` (`Mark | null`), `Board` (length-9 readonly array, index `i` ↔ `(x=i%3, y=i/3)`), the eight `LINES`, `legalMoves`.
- `game-state.ts` — immutable `GameState` (`{ board, turn, outcome }`) where `Outcome` is `playing | { win, mark, line } | draw`. `newGame(first)` and `play(state, i)` return **new** states; `outcomeOf(board)` derives the result. Plain data → structured-cloneable and directly persistable.
- `ai.ts` — `bestMove(state, opening)`: depth-adjusted minimax (`100 - depth`, prefers faster wins / slower losses), pure and **synchronous**, recursing through `play()` (no grid cloning). `opening.ts` holds the first-move flavour (`center`/`adjacent`/`corner`).

The Angular layer (`src/app/game/`) is a reactive shell of signals/computed/effect over that core:

- `GameStore` (root service) owns `signal<GameState>`; every transition is `state.set(play(...))`, so the whole board re-renders. Exposes `cells`/`turn`/`outcome`/`winningLine` computeds and `busy`. `play(i)`, `newGame()`, the bot loop, and the 2.5s end-game pause + auto-restart live here. An `effect` auto-persists state+settings on every change.
- `AiService` runs `bestMove` in a **Web Worker** (`ai.worker.ts`); its result returns via a `message` event (a macrotask), so the store's write lands in a fresh task and renders under zoneless CD. Falls back to synchronous `bestMove` where `Worker` is unavailable (tests).
- `SettingsStore` (replaces the old `FormService`) holds each setting as a signal plus `snapshot()`/`restore()` to a plain `Settings` for persistence. The form binds `[ngModel]="settings.x()"` + `(ngModelChange)="settings.x.set($event)"`.
- `GameComponent` is a thin view over `GameStore`; `CellComponent` renders one square from a primitive `mark` input and reads `SettingsStore` for colors/names.
- `LocalStorageService` persists `{version, state, settings}` under `JosterDevTicTacToe` via `load`/`save`/`clear`. **Bump `version` when the persisted shape changes** — a mismatch clears the save.

### Change detection

This app is **zoneless** (`provideZonelessChangeDetection`); zone.js is removed from `angular.json` polyfills and `package.json`. Because the core is immutable and all live state is signals/computed, zoneless "just works": a move is one `signal.set` of a new `GameState`, cells take a primitive `mark` input (so `@for` tracks by `$index`), and the only async (bot via Worker, end-game pause) resolves in macrotasks. The earlier mutation-based design needed workarounds (track-by-state, a `setTimeout` before the bot's move, signalizing a plain `Form`) — those are gone. See the `zoneless-deferred` memory for the history; still verify CD changes interactively, not just with `ng build`.

## Conventions

- Strict TypeScript is on, including `strictTemplates`, `noPropertyAccessFromIndexSignature`, and `strictInjectionParameters`. Use `inject()` over constructor injection (matches existing code).
- Keep game/AI logic inside `src/app/models/` pure and free of Angular imports so it stays unit-testable in isolation (`game-state.spec.ts`, `ai.spec.ts`). All mutation/reactivity/async belongs in the `src/app/game/` shell.
- Tests run on **Vitest** (jsdom env). `describe`/`it`/`expect` are configured as globals by the builder (typed via `vitest/globals` in `tsconfig.spec.json`), so specs don't import them. `src/test-setup.ts` (wired through the `setupFiles` builder option) polyfills `localStorage`, which jsdom doesn't provide but `LocalStorageService` needs.
- External UI comes from `@joster-dev/icon` and `@joster-dev/chaos-control`. The chaos-control standalone components use `cc-*` selectors (e.g. `cc-text`, `cc-choice`) and must be imported individually — there is no `ChaosControlModule`.
