import { Component, inject, input, output } from '@angular/core';

import { FormService } from '../form/form.service';
import { Cell } from '../../models';
import { IconComponent } from '@joster-dev/icon';

@Component({
  selector: 'ttt-cell[cell]',
  imports: [
    IconComponent,
  ],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  protected readonly formService = inject(FormService);

  readonly cell = input.required<Cell>();
  readonly gameTurn = input<'x' | 'o'>('x');
  readonly highlight = input(false);
  readonly disabled = input(false);

  readonly claim = output<Cell>();

  get isBot(): boolean {
    if (!this.formService.model.botPlayer)
      return false;
    return this.cell().state === this.formService.model.botPlayer;
  }

  get label(): string | null {
    if (this.isBot)
      return 'Bot';
    if (this.cell().state === 'x')
      return this.formService.model.player1;
    if (this.cell().state === 'o')
      return this.formService.model.player2;
    return null;
  }
}
