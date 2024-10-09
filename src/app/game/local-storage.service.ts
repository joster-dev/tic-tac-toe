import { Injectable } from '@angular/core';
import { Form, GameState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  readonly version = '002';
  readonly key = 'JosterDevTicTacToe';
  state?: {
    version: string,
    game: GameState,
    form: Form
  };

  constructor() {
    const item = window.localStorage.getItem(this.key);
    if (item)
      this.state = JSON.parse(item);
    if (item && this.state?.version === this.version)
      return;
    this.removeGame();
  }

  removeGame(): void {
    window.localStorage.removeItem(this.key);
    this.state = undefined;
  }

  unload(game: GameState, form: Form): void {
    window.localStorage.setItem(this.key, JSON.stringify({
      version: this.version,
      game,
      form,
    }))
  }
}
