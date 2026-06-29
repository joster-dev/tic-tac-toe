import { Component, computed, inject, input, output } from '@angular/core';

import { Cell, Mark } from '../../models';
import { SettingsStore } from '../settings.store';
import { IconComponent } from '@joster-dev/icon';

@Component({
  selector: 'ttt-cell',
  imports: [
    IconComponent,
  ],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  protected readonly settings = inject(SettingsStore);

  readonly mark = input<Cell>(null);
  readonly index = input.required<number>();
  readonly turn = input<Mark>('x');
  readonly highlight = input(false);
  readonly disabled = input(false);

  readonly claim = output<number>();

  protected readonly isBot = computed(() =>
    this.settings.botPlayer() !== null && this.mark() === this.settings.botPlayer());

  protected readonly label = computed(() => {
    if (this.isBot())
      return '🤖';
    if (this.mark() === 'x')
      return this.settings.player1();
    if (this.mark() === 'o')
      return this.settings.player2();
    return null;
  });
}
