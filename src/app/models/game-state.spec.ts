import { newGame, play } from './game-state';

describe('game-state', () => {
  it('starts empty, playing, with the given first turn', () => {
    const game = newGame('o');
    expect(game.board.every(cell => cell === null)).toBe(true);
    expect(game.turn).toBe('o');
    expect(game.outcome.kind).toBe('playing');
  });

  it('play is immutable and flips the turn', () => {
    const game = newGame('x');
    const next = play(game, 0);
    expect(game.board[0]).toBeNull();   // original untouched
    expect(next.board[0]).toBe('x');
    expect(next.turn).toBe('o');
  });

  it('detects a winning line', () => {
    let game = newGame('x');
    for (const move of [0, 3, 1, 4, 2]) // x: 0,1,2 (top row); o: 3,4
      game = play(game, move);
    expect(game.outcome).toEqual({ kind: 'win', mark: 'x', line: [0, 1, 2] });
  });

  it('detects a draw', () => {
    let game = newGame('x');
    for (const move of [0, 1, 2, 4, 3, 5, 7, 6, 8])
      game = play(game, move);
    expect(game.outcome.kind).toBe('draw');
  });

  it('rejects occupied cells and finished games', () => {
    const game = play(newGame('x'), 0);
    expect(() => play(game, 0)).toThrow();
  });
});
