import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { openings } from '../../models';

import { SettingsStore } from '../settings.store';

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
  protected readonly settings = inject(SettingsStore);

  readonly players = [
    { key: 'x', value: 'X' },
    { key: 'o', value: 'O' },
  ];
  readonly openings = openings.map(opening => ({
    key: opening,
    value: opening.charAt(0).toUpperCase() + opening.slice(1)
  }));

  readonly disabled = input(false);

  readonly restart = output();
}
