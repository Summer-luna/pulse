import DataLoader from 'dataloader';
import type { ProgressStats } from './loaders.js';

export function entityLoader<T extends { id: string }>(fetch: (ids: string[]) => Promise<T[]>): DataLoader<string, T | null> {
  return new DataLoader(async (ids) => {
    const byId = new Map((await fetch([...ids])).map((row) => [row.id, row]));
    return ids.map((id) => byId.get(id) ?? null);
  });
}

export function keyedLoader<T>(fetch: (keys: string[]) => Promise<T[]>, keyOf: (row: T) => string | null): DataLoader<string, T | null> {
  return new DataLoader(async (keys) => {
    const byKey = new Map<string, T>();
    for (const row of await fetch([...keys])) {
      const key = keyOf(row);
      if (key) {
        byKey.set(key, row);
      }
    }
    return keys.map((key) => byKey.get(key) ?? null);
  });
}

export function groupedLoader<T>(
  fetch: (keys: string[]) => Promise<T[]>,
  keyOf: (row: T) => string | null,
): DataLoader<string, T[]> {
  return new DataLoader(async (keys) => {
    const groups = new Map<string, T[]>();
    for (const row of await fetch([...keys])) {
      const key = keyOf(row);
      if (key) {
        groups.set(key, [...(groups.get(key) ?? []), row]);
      }
    }
    return keys.map((key) => groups.get(key) ?? []);
  });
}

export function groupedValueLoader<Row, Value>(
  fetch: (keys: string[]) => Promise<Row[]>,
  keyOf: (row: Row) => string,
  valueOf: (row: Row) => Value,
): DataLoader<string, Value[]> {
  return new DataLoader(async (keys) => {
    const groups = new Map<string, Value[]>();
    for (const row of await fetch([...keys])) {
      const key = keyOf(row);
      groups.set(key, [...(groups.get(key) ?? []), valueOf(row)]);
    }
    return keys.map((key) => groups.get(key) ?? []);
  });
}

export function progressLoader(fetch: (ids: string[]) => Promise<Map<string, ProgressStats>>): DataLoader<string, ProgressStats> {
  return new DataLoader(async (ids) => {
    const stats = await fetch([...ids]);
    return ids.map((id) => stats.get(id) ?? { total: 0, completed: 0 });
  });
}

export function countLoader(fetch: (ids: string[]) => Promise<Map<string, number>>): DataLoader<string, number> {
  return new DataLoader(async (ids) => {
    const counts = await fetch([...ids]);
    return ids.map((id) => counts.get(id) ?? 0);
  });
}
