import { TestBed } from '@angular/core/testing';

import { GameStore } from './game.store';
import { SettingsStore } from './settings.store';

describe('GameStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(TestBed.inject(GameStore)).toBeTruthy();
  });

  it('places the current mark on play', async () => {
    const store = TestBed.inject(GameStore);
    await store.play(0);
    expect(store.cells()[0].mark).toBe('x');
    expect(store.turn()).toBe('o');
  });

  it('lets the bot respond to a human move', async () => {
    const settings = TestBed.inject(SettingsStore);
    settings.botPlayer.set('o');           // bot plays O; human (X) moves first
    const store = TestBed.inject(GameStore);
    store.newGame();

    await store.play(0);                    // human X, then bot O responds (sync in tests)

    const marks = store.cells().map(c => c.mark);
    expect(marks.filter(m => m === 'x').length).toBe(1);
    expect(marks.filter(m => m === 'o').length).toBe(1);
  });
});
