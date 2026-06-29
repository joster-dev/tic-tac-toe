import { TestBed } from '@angular/core/testing';

import { SettingsStore } from './settings.store';

describe('SettingsStore', () => {
  let store: SettingsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(SettingsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('snapshot/restore round-trips the settings', () => {
    store.player1.set('Ann');
    store.botPlayer.set('o');
    const snapshot = store.snapshot();

    store.player1.set('changed');
    store.botPlayer.set(null);
    store.restore(snapshot);

    expect(store.player1()).toBe('Ann');
    expect(store.botPlayer()).toBe('o');
  });
});
