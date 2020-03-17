import { Component } from '@angular/core';

import { Game } from './game';
import { Bot } from './bot';
import { Cell } from './cell/cell';
import { Form } from './form/form';

@Component({
  selector: 'ttt-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  allowClicks = true;
  game!: Game;
  bot = new Bot();
  form = new Form();

  constructor() {
    this.newGame();
  }

  claim(cell: Cell) {
    if (!this.allowClicks) return;

    if (this.game.win(cell.x, cell.y)) {
      this.endGame(this.game.turn === 'o' ? 'O Wins' : 'X Wins');
      return;
    }

    if (this.game.areNoMovesRemaining) {
      this.newGame();
      return;
    }

    if (this.form.isBotEnabled)
      this.botClaim();
  }

  newGame() {
    this.game = new Game(this.createGrid());
    if (!this.form.isBotEnabled) return;
    this.bot = new Bot(this.form.isBotCenterFirst);
    if (!this.form.isBotFirst) return;
    this.botClaim();
  }

  private async botClaim() {
    this.allowClicks = false;
    const claim = await this.bot.getClaim(this.game);
    this.allowClicks = true;

    if (this.game.win(claim.x, claim.y)) {
      this.endGame(this.game.turn === 'o' ? 'Bot O Wins' : 'Bot X Wins');
      return;
    }

    if (this.game.areNoMovesRemaining)
      this.newGame();
  }

  private async endGame(message: string) {
    this.allowClicks = false;
    await new Promise(r => window.setTimeout(() => r(), 1000));
    alert(message);
    this.allowClicks = true;
    this.newGame();
  }

  private createGrid() {
    const temp = [];
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++)
        temp.push(new Cell(x, y));
    return temp;
  }
}