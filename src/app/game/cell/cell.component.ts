import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormService } from '../form/form.service';
import { Cell } from '../../models';
import { IconModule } from '@joster-dev/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttt-cell[cell]',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
  ],
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() cell!: Cell;
  @Input() gameTurn: 'x' | 'o' = 'x';
  @Input() highlight = false;
  @Input() disabled = false;

  @Output() claim = new EventEmitter<Cell>();

  constructor(public formService: FormService) { }

  get isBot(): boolean {
    if (!this.formService.model.botPlayer)
      return false;
    return this.cell.state === this.formService.model.botPlayer;
  }

  get label(): string | null {
    if (this.isBot)
      return 'Bot';
    if (this.cell.state === 'x')
      return this.formService.model.player1;
    if (this.cell.state === 'o')
      return this.formService.model.player2;
    return null;
  }
}
