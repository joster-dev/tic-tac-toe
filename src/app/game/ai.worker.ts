/// <reference lib="webworker" />
import { bestMove, GameState, Opening } from '../models';

addEventListener('message', ({ data }: MessageEvent<{ state: GameState; opening: Opening }>) => {
  postMessage(bestMove(data.state, data.opening));
});
