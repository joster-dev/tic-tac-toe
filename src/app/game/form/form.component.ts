import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { botFirstMoves } from '../../models';

import { FormService } from './form.service';

import { IconComponent } from '@joster-dev/icon';
import { ChoiceComponent, ColorComponent, TextComponent } from '@joster-dev/chaos-control';

@Component({
  selector: 'ttt-form',
  imports: [
    FormsModule,
    IconComponent,
    TextComponent,
    ColorComponent,
    ChoiceComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  protected readonly formService = inject(FormService);

  readonly botPlayers = [
    { key: 'x', value: 'X' },
    { key: 'o', value: 'O' },
  ];
  readonly botFirstMoves = botFirstMoves.map(move => ({
    key: move,
    value: move.charAt(0).toUpperCase() + move.slice(1)
  }));

  readonly disabled = input(false);

  readonly restart = output();
}
