export function tryParse<T>(data: string | null, fallback?: T): T | undefined {
  if (!data) {
    return fallback;
  }

  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}
