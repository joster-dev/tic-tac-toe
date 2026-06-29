import { Component, HostListener, inject, signal } from '@angular/core';

import { Bot, Cell, Game } from '../models';
import { FormService } from './form/form.service';
import { LocalStorageService } from './local-storage.service';
import { FormComponent } from './form/form.component';
import { CellComponent } from './cell/cell.component';

@Component({
  selector: 'ttt-game',
  imports: [
    FormComponent,
    CellComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly formService = inject(FormService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly allowClicks = signal(true);
  // `game` is a signal so the board re-renders under zoneless change detection:
  // the live `Game` mutates its grid in place, so every move re-publishes a new
  // `Game` reference via `play()` to notify the template.
  readonly game = signal<Game>(new Game([], 'x'));
  bot = new Bot();

  constructor() {
    if (this.localStorageService.state)
      this.formService.model = this.localStorageService.state.form;
    this.newGame();
  }

  @HostListener('window:unload')
  onBeforeUnload(): void {
    this.localStorageService.unload(
      this.game().state,
      this.formService.model
    );
  }

  claim(cell: Cell): void {
    if (!this.allowClicks()) return;

    if (this.play(cell.x, cell.y)) {
      this.endGame();
      return;
    }

    if (this.game().areNoMovesRemaining) {
      this.newGame(true);
      return;
    }

    if (this.formService.model.botPlayer)
      this.botClaim();
  }

  newGame(reset = false): void {
    if (reset)
      this.localStorageService.removeGame();
    this.game.set(new Game(
      this.localStorageService.state?.game.grid || this.createGrid(),
      this.localStorageService.state?.game.turn || this.formService.model.goesFirst,
    ));
    if (!this.formService.model.botPlayer)
      return;
    this.bot = new Bot(this.formService.model.botFirstMove);
    if (this.game().moves.length !== 9 || this.formService.model.goesFirst !== this.formService.model.botPlayer)
      return;
    this.botClaim();
  }

  private async botClaim(): Promise<void> {
    this.allowClicks.set(false);
    const claim = await this.bot.getClaim(this.game());
    // Yield to a macrotask before committing the bot's move. Under zoneless
    // change detection, signal writes made in the microtask that resolves the
    // originating click are folded into that click's already-flushed tick and
    // never render; a fresh macrotask lets the scheduler run a new tick.
    await new Promise<void>(r => window.setTimeout(() => r()));
    this.allowClicks.set(true);

    if (this.play(claim.x, claim.y)) {
      this.endGame();
      return;
    }

    if (this.game().areNoMovesRemaining)
      this.newGame();
  }

  private async endGame(): Promise<void> {
    this.allowClicks.set(false);
    await new Promise<void>(r => window.setTimeout(() => r(), 2500));
    this.allowClicks.set(true);
    this.newGame(true);
  }

  // Plays a move on the live game and re-publishes it so the template updates.
  private play(x: number, y: number): boolean {
    const game = this.game();
    const won = game.win(x, y);
    this.game.set(new Game(game.grid, game.turn));
    return won;
  }

  private createGrid(): Cell[] {
    const temp = [];
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++)
        temp.push(new Cell(x, y));
    return temp;
  }
}
