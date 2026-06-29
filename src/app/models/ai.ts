import { Mark, legalMoves } from './board';
import { GameState, play } from './game-state';
import { Opening, openingMove } from './opening';

/**
 * Optimal move for the side to play, chosen at random among equally-good moves.
 * Pure and synchronous — the game tree is tiny. The Angular layer runs it in a
 * Web Worker, but it has no framework or environment dependencies of its own.
 */
export function bestMove(state: GameState, opening: Opening): number {
  const moves = legalMoves(state.board);
  if (moves.length === 9)
    return openingMove(opening);

  const scored = moves.map(move => ({ move, score: minimax(play(state, move), state.turn, 1) }));
  const best = Math.max(...scored.map(s => s.score));
  const optimal = scored.filter(s => s.score === best).map(s => s.move);
  return optimal[Math.floor(Math.random() * optimal.length)];
}

/** Depth-adjusted minimax: prefers faster wins and slower losses. */
function minimax(state: GameState, me: Mark, depth: number): number {
  if (state.outcome.kind === 'win')
    return state.outcome.mark === me ? 100 - depth : depth - 100;
  if (state.outcome.kind === 'draw')
    return 0;

  const scores = legalMoves(state.board).map(move => minimax(play(state, move), me, depth + 1));
  return state.turn === me ? Math.max(...scores) : Math.min(...scores);
}
