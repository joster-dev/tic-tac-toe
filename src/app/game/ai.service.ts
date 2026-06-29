import { Injectable } from '@angular/core';
import { GameState, Opening, bestMove } from '../models';

/**
 * Runs the (pure) AI off the main thread. The result arrives via a `message`
 * event — a macrotask — so the store's signal write lands in a fresh task and
 * zoneless change detection renders it. Falls back to running synchronously
 * where `Worker` is unavailable (e.g. unit tests / SSR).
 */
@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly worker = this.createWorker();

  bestMove(state: GameState, opening: Opening): Promise<number> {
    const worker = this.worker;
    if (worker === null)
      return Promise.resolve(bestMove(state, opening));

    return new Promise<number>(resolve => {
      const onMessage = ({ data }: MessageEvent<number>) => {
        worker.removeEventListener('message', onMessage);
        resolve(data);
      };
      worker.addEventListener('message', onMessage);
      worker.postMessage({ state, opening });
    });
  }

  private createWorker(): Worker | null {
    if (typeof Worker === 'undefined')
      return null;
    try {
      return new Worker(new URL('./ai.worker', import.meta.url), { type: 'module' });
    } catch {
      return null;
    }
  }
}
