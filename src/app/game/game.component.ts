import { Component, inject } from '@angular/core';

import { GameStore } from './game.store';
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
  protected readonly store = inject(GameStore);
}
