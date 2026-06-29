import { Injectable } from '@angular/core';
import { GameState } from '../models';
import { Settings } from './settings.store';

interface Persisted {
  version: string;
  state: GameState;
  settings: Settings;
}

/**
 * Persists the immutable game state + settings snapshot. Both are plain data, so
 * there is no class-shape to reconstruct — bump `version` if the shape changes.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly version = '003';
  private readonly key = 'JosterDevTicTacToe';

  load(): { state: GameState; settings: Settings } | null {
    const raw = window.localStorage.getItem(this.key);
    if (raw === null)
      return null;
    try {
      const parsed = JSON.parse(raw) as Persisted;
      if (parsed.version !== this.version) {
        this.clear();
        return null;
      }
      return { state: parsed.state, settings: parsed.settings };
    } catch {
      this.clear();
      return null;
    }
  }

  save(state: GameState, settings: Settings): void {
    const data: Persisted = { version: this.version, state, settings };
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear(): void {
    window.localStorage.removeItem(this.key);
  }
}
