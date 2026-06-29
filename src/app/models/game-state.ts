import { Board, LINES, Mark, other } from './board';

export type Outcome =
  | { readonly kind: 'playing' }
  | { readonly kind: 'win'; readonly mark: Mark; readonly line: readonly number[] }
  | { readonly kind: 'draw' };

/** Immutable snapshot of a game. Plain data — safe to structured-clone and persist. */
export interface GameState {
  readonly board: Board;
  readonly turn: Mark;
  readonly outcome: Outcome;
}

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

export const newGame = (first: Mark = 'x'): GameState =>
  ({ board: EMPTY_BOARD, turn: first, outcome: { kind: 'playing' } });

export function outcomeOf(board: Board): Outcome {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark !== null && board[b] === mark && board[c] === mark)
      return { kind: 'win', mark, line };
  }
  return board.every(cell => cell !== null) ? { kind: 'draw' } : { kind: 'playing' };
}

/** Plays `index` for the current turn and returns a new state (the input is untouched). */
export function play(state: GameState, index: number): GameState {
  if (state.outcome.kind !== 'playing')
    throw new Error('the game is over');
  if (state.board[index] !== null)
    throw new Error('can not play an occupied cell');
  const board = state.board.map((cell, i) => (i === index ? state.turn : cell));
  return { board, turn: other(state.turn), outcome: outcomeOf(board) };
}
