export type SubscriptionCallback<T> = (oldValue: T, newValue: T) => void;

export interface StorageItem<T> {
  current: T;
  subscribe(callback: SubscriptionCallback<T>): void;
  unsubscribe(callback: SubscriptionCallback<T>): void;
}

export interface Store {
  get(key: string, fallback: any): any;
  set(key: string, value: any): void;
  subscribe(key: string, callback: SubscriptionCallback<any>): void;
  unsubscribe(key: string, callback: SubscriptionCallback<any>): void;
}
