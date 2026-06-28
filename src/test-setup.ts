// Test environment setup, loaded via the `setupFiles` option of @angular/build:unit-test.
//
// The jsdom environment Vitest runs under does not provide a Storage implementation,
// but LocalStorageService reads/writes `window.localStorage`. Provide a minimal
// in-memory polyfill so those code paths work under test.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
}

// Start every test from a clean slate.
beforeEach(() => storage.clear());
