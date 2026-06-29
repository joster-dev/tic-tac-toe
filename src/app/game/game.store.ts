import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { GameState, newGame, play } from '../models';
import { AiService } from './ai.service';
import { LocalStorageService } from './local-storage.service';
import { SettingsStore } from './settings.store';

const END_GAME_PAUSE_MS = 2500;

const delay = (ms: number) => new Promise<void>(resolve => window.setTimeout(() => resolve(), ms));

/**
 * Owns the live game and orchestrates turns. The state is a single signal of the
 * immutable core `GameState`; every transition is `signal.set(play(...))`, so the
 * whole board re-renders reactively under zoneless change detection. Async work
 * (bot move via Web Worker, end-of-game pause) happens here, never in the core.
 */
@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly settings = inject(SettingsStore);
  private readonly ai = inject(AiService);
  private readonly storage = inject(LocalStorageService);

  private readonly state = signal<GameState>(newGame());

  readonly turn = computed(() => this.state().turn);
  readonly outcome = computed(() => this.state().outcome);
  readonly winningLine = computed(() => {
    const outcome = this.outcome();
    return outcome.kind === 'win' ? outcome.line : [];
  });
  readonly cells = computed(() => this.state().board.map((mark, index) => ({
    mark,
    index,
    column: (index % 3) + 1,
    row: Math.floor(index / 3) + 1,
  })));

  /** Blocks input while the bot is thinking or during the end-of-game pause. */
  readonly busy = signal(false);

  constructor() {
    const saved = this.storage.load();
    if (saved !== null) {
      this.settings.restore(saved.settings);
      this.state.set(saved.state);
    } else {
      this.state.set(newGame(this.settings.goesFirst()));
    }
    effect(() => this.storage.save(this.state(), this.settings.snapshot()));
    void this.continueWithBot();
  }

  async play(index: number): Promise<void> {
    if (this.busy() || this.state().outcome.kind !== 'playing' || this.state().board[index] !== null)
      return;
    this.state.set(play(this.state(), index));
    await this.continueWithBot();
  }

  newGame(): void {
    this.storage.clear();
    this.state.set(newGame(this.settings.goesFirst()));
    void this.continueWithBot();
  }

  private async continueWithBot(): Promise<void> {
    while (this.state().outcome.kind === 'playing' && this.settings.botPlayer() === this.state().turn) {
      this.busy.set(true);
      const move = await this.ai.bestMove(this.state(), this.settings.opening());
      this.busy.set(false);
      this.state.set(play(this.state(), move));
    }
    await this.settle();
  }

  private async settle(): Promise<void> {
    const outcome = this.state().outcome;
    if (outcome.kind === 'playing')
      return;
    if (outcome.kind === 'win') {
      this.busy.set(true);
      await delay(END_GAME_PAUSE_MS);
      this.busy.set(false);
    }
    this.newGame();
  }
}
