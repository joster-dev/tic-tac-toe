import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { botFirstMoves } from '../../models';

import { FormService } from './form.service';

import { IconModule } from '@joster-dev/icon';
import { ChaosControlModule } from '@joster-dev/chaos-control';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ttt-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconModule,
    ChaosControlModule,
  ],
  templateUrl: './form.component.html',
  styleUrls: [
    "../../../../node_modules/@joster-dev/chaos-control/src/lib/variables.scss",
    "../../../../node_modules/@joster-dev/chaos-control/src/lib/styles.scss",
    "../../../../node_modules/@joster-dev/chaos-control/src/lib/atomic.scss",
    './form.component.scss',
  ]
})
export class FormComponent {
  botPlayers = [
    { key: 'x', value: 'X' },
    { key: 'o', value: 'O' },
  ];
  botFirstMoves = botFirstMoves.map(move => ({
    key: move,
    value: move.charAt(0).toUpperCase() + move.slice(1)
  }));

  @Input() disabled = false;

  @Output() restart = new EventEmitter();

  constructor(public formService: FormService) { }
}
