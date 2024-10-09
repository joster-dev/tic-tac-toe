import { Component, HostListener } from '@angular/core';

import { Bot, Cell, Game } from '../models';
import { FormService } from './form/form.service';
import { LocalStorageService } from './local-storage.service';
import { FormComponent } from './form/form.component';
import { CellComponent } from './cell/cell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttt-game',
  standalone: true,
  imports: [
    CommonModule,
    FormComponent,
    CellComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: [
    '../../../node_modules/@joster-dev/chaos-control/src/lib/atomic.scss',
    '../../../node_modules/@joster-dev/chaos-control/src/lib/styles.scss',
    './game.component.scss',
  ],
})
export class GameComponent {
  allowClicks = true;
  game!: Game;
  bot = new Bot();

  constructor(
    private formService: FormService,
    private localStorageService: LocalStorageService
  ) {
    if (this.localStorageService.state)
      this.formService.model = this.localStorageService.state.form;
    this.newGame();
  }

  @HostListener('window:unload')
  onBeforeUnload(): void {
    this.localStorageService.unload(
      this.game.state,
      this.formService.model
    );
  }

  claim(cell: Cell): void {
    if (!this.allowClicks) return;

    if (this.game.win(cell.x, cell.y)) {
      this.endGame();
      return;
    }

    if (this.game.areNoMovesRemaining) {
      this.newGame(true);
      return;
    }

    if (this.formService.model.botPlayer)
      this.botClaim();
  }

  newGame(reset = false): void {
    if (reset)
      this.localStorageService.removeGame();
    this.game = new Game(
      this.localStorageService.state?.game.grid || this.createGrid(),
      this.localStorageService.state?.game.turn || this.formService.model.goesFirst,
    );
    if (!this.formService.model.botPlayer)
      return;
    this.bot = new Bot(this.formService.model.botFirstMove);
    if (this.game.moves.length !== 9 || this.formService.model.goesFirst !== this.formService.model.botPlayer)
      return;
    this.botClaim();
  }

  private async botClaim(): Promise<void> {
    this.allowClicks = false;
    const claim = await this.bot.getClaim(this.game);
    this.allowClicks = true;

    if (this.game.win(claim.x, claim.y)) {
      this.endGame();
      return;
    }

    if (this.game.areNoMovesRemaining)
      this.newGame();
  }

  private async endGame(): Promise<void> {
    this.allowClicks = false;
    await new Promise<void>(r => window.setTimeout(() => r(), 2500));
    this.allowClicks = true;
    this.newGame(true);
  }

  private createGrid(): Cell[] {
    const temp = [];
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++)
        temp.push(new Cell(x, y));
    return temp;
  }
}
