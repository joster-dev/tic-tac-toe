export type Mark = 'x' | 'o';

/** A single square: a mark, or `null` when empty. */
export type Cell = Mark | null;

/** A 3x3 board flattened row-major; index `i` maps to `(x = i % 3, y = i / 3)`. */
export type Board = readonly Cell[];

/** The eight winning lines as board indices. */
export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export const other = (mark: Mark): Mark => (mark === 'x' ? 'o' : 'x');

export function legalMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++)
    if (board[i] === null)
      moves.push(i);
  return moves;
}
