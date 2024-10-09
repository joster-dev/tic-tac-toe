import { Cell } from './cell';

export interface GameState {
  grid: Cell[];
  turn: 'x' | 'o';
}
