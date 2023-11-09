import { tryParse } from '../helpers.js';
import { Store, SubscriptionCallback } from '../types.js';

const subscriptions: Map<string, Set<SubscriptionCallback<any>>> = new Map();

export const localStorageStore: Store = {
  get: function (key: string, fallback: any) {
    return tryParse(localStorage.getItem(key), fallback);
  },
  set: function (key: string, value: any): void {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        oldValue: localStorage.getItem(key),
        newValue: data,
      }),
    );
  },
  subscribe: function (key: string, callback: SubscriptionCallback<any>): void {
    const callbacks = subscriptions.get(key);
    if (callbacks) {
      callbacks.add(callback);
    } else {
      subscriptions.set(key, new Set([callback]));
    }
  },
  unsubscribe: function (
    key: string,
    callback: SubscriptionCallback<any>,
  ): void {
    const callbacks = subscriptions.get(key);
    if (callbacks) {
      callbacks.delete(callback);
    }
  },
};

window.addEventListener('storage', e => {
  if (!e.key) {
    return;
  }

  const callbacks = subscriptions.get(e.key);
  if (callbacks && callbacks.size > 0) {
    for (const callback of callbacks) {
      callback(tryParse(e.oldValue), tryParse(e.newValue));
    }
  }
});
