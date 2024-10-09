import { botFirstMove } from './bot-first-move.type';

export class Form {
  botPlayer?: 'x' | 'o';
  goesFirst: 'x' | 'o' = 'x';
  botFirstMove: botFirstMove = 'center';
  xColor: string | null = '702400';
  oColor: string | null = '002470';
  player1: string | null = null;
  player2: string | null = null;
}
