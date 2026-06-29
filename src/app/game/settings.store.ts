import { Injectable, signal } from '@angular/core';
import { Mark, Opening } from '../models';

/** Plain, serialisable snapshot of all game settings. */
export interface Settings {
  botPlayer: Mark | null;
  goesFirst: Mark;
  opening: Opening;
  xColor: string | null;
  oColor: string | null;
  player1: string | null;
  player2: string | null;
}

export const defaultSettings = (): Settings => ({
  botPlayer: null,
  goesFirst: 'x',
  opening: 'center',
  xColor: '702400',
  oColor: '002470',
  player1: null,
  player2: null,
});

/**
 * UI/game settings as signals. Lives in the Angular layer (not the framework-free
 * core). `snapshot()`/`restore()` bridge to a plain `Settings` for persistence.
 */
@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly defaults = defaultSettings();

  readonly botPlayer = signal(this.defaults.botPlayer);
  readonly goesFirst = signal(this.defaults.goesFirst);
  readonly opening = signal(this.defaults.opening);
  readonly xColor = signal(this.defaults.xColor);
  readonly oColor = signal(this.defaults.oColor);
  readonly player1 = signal(this.defaults.player1);
  readonly player2 = signal(this.defaults.player2);

  snapshot(): Settings {
    return {
      botPlayer: this.botPlayer(),
      goesFirst: this.goesFirst(),
      opening: this.opening(),
      xColor: this.xColor(),
      oColor: this.oColor(),
      player1: this.player1(),
      player2: this.player2(),
    };
  }

  restore(settings: Settings): void {
    this.botPlayer.set(settings.botPlayer);
    this.goesFirst.set(settings.goesFirst);
    this.opening.set(settings.opening);
    this.xColor.set(settings.xColor);
    this.oColor.set(settings.oColor);
    this.player1.set(settings.player1);
    this.player2.set(settings.player2);
  }
}
