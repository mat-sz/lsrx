import { localStorageStore } from './stores/localStorage.js';
import { StorageItem, Store, SubscriptionCallback } from './types.js';

interface LsRx {
  use<T>(key: string, initialValue: T): StorageItem<T>;
  use<T>(key: string, initialValue?: T): StorageItem<T | undefined>;
}

export function lsrx(store: Store = localStorageStore): LsRx {
  return {
    use<T>(key: string, initialValue?: T) {
      return {
        get current() {
          return store.get(key, initialValue);
        },
        set current(value: T) {
          store.set(key, value);
        },
        subscribe(callback: SubscriptionCallback<T>) {
          store.subscribe(key, callback);
        },
        unsubscribe(callback: SubscriptionCallback<T>) {
          store.unsubscribe(key, callback);
        },
      };
    },
  };
}

export default lsrx;
