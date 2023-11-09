export type SubscriptionCallback<T> = (oldValue: T, newValue: T) => void;

export interface StorageItem<T> {
  current: T;
  subscribe(callback: SubscriptionCallback<T>): void;
  unsubscribe(callback: SubscriptionCallback<T>): void;
}
