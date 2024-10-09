import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'ttt-root',
  standalone: true,
  imports: [
    GameComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor() { }
}
