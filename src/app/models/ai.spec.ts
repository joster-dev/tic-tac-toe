import { newGame, play } from './game-state';
import { bestMove } from './ai';

describe('ai', () => {
  it('opens in the center when configured', () => {
    expect(bestMove(newGame('x'), 'center')).toBe(4);
  });

  it('takes an immediate winning move', () => {
    let game = newGame('x');
    for (const move of [0, 4, 1, 5]) // x: 0,1 ; o: 4,5 — x to move, wins at 2
      game = play(game, move);
    expect(bestMove(game, 'center')).toBe(2);
  });

  it('blocks the opponent winning move', () => {
    let game = newGame('x');
    for (const move of [0, 3, 1]) // x threatens 0,1,2 ; o to move must block at 2
      game = play(game, move);
    expect(bestMove(game, 'center')).toBe(2);
  });

  it('never loses: optimal vs optimal is a draw', () => {
    let game = newGame('x');
    while (game.outcome.kind === 'playing')
      game = play(game, bestMove(game, 'center'));
    expect(game.outcome.kind).toBe('draw');
  });
});
