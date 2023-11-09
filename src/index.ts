type SubscriptionCallback<T> = (oldValue: T, newValue: T) => void;

interface StorageItem<T> {
  current: T;
  subscribe(callback: SubscriptionCallback<T>): void;
  unsubscribe(callback: SubscriptionCallback<T>): void;
}

interface LsRx {
  use<T>(key: string, initialValue: T): StorageItem<T>;
  use<T>(key: string, initialValue?: T): StorageItem<T | undefined>;
}

function tryParse<T>(data: string | null, fallback?: T): T | undefined {
  if (!data) {
    return fallback;
  }

  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

const subscriptions: Map<string, Set<SubscriptionCallback<any>>> = new Map();

export function lsrx(): LsRx {
  return {
    use<T>(key: string, initialValue?: T) {
      const callbacks: Set<SubscriptionCallback<T>> = new Set();
      subscriptions.set(key, callbacks);

      return {
        get current() {
          return tryParse(localStorage.getItem(key), initialValue) as T;
        },
        set current(value: T) {
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
        subscribe(callback: SubscriptionCallback<T>) {
          callbacks.add(callback);
        },
        unsubscribe(callback: SubscriptionCallback<T>) {
          callbacks.delete(callback);
        },
      };
    },
  };
}

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

export default lsrx;
