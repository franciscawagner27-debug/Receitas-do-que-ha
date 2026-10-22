import type { Recipe } from '../types';
export const CATALOGUE_KEY = 'recipes:catalogue:v1';
export const CATALOGUE_TTL = 5 * 60 * 1000;
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
type Entry = { version: 1; savedAt: number; rows: Recipe[] };
export function createCatalogueCache(options: {
  readPage: (from: number, to: number) => Promise<Recipe[]>;
  storage?: StorageLike;
  now?: () => number;
  pageSize?: number;
}) {
  const now = options.now || Date.now;
  const pageSize = options.pageSize || 1000;
  let memory: Entry | undefined;
  let generation = 0;
  let pending: { generation: number; promise: Promise<Recipe[]> } | undefined;
  const clone = (rows: Recipe[]): Recipe[] => JSON.parse(JSON.stringify(rows));
  const fresh = (entry: Entry | undefined): entry is Entry => !!entry && entry.version === 1 &&
    Array.isArray(entry.rows) && entry.savedAt <= now() && now() - entry.savedAt < CATALOGUE_TTL;
  function invalidate() {
    generation++;
    memory = undefined;
    try { options.storage?.removeItem(CATALOGUE_KEY); options.storage?.removeItem('recipes'); options.storage?.removeItem('recipes_time'); } catch { /* Memory/network still work. */ }
  }
  async function read(): Promise<Recipe[]> {
    if (fresh(memory)) return clone(memory.rows);
    try {
      const stored = options.storage?.getItem(CATALOGUE_KEY);
      const entry = stored ? JSON.parse(stored) as Entry : undefined;
      if (fresh(entry)) { memory = entry; return clone(entry.rows); }
    } catch { /* Corrupt/disabled storage must not hide recipes. */ }
    if (pending?.generation === generation) return clone(await pending.promise);
    const startedAt = generation;
    const promise = (async () => {
      const rows: Recipe[] = [];
      // Fetch the complete catalogue even after it grows beyond the API row limit.
      for (let from = 0; ; from += pageSize) {
        const page = await options.readPage(from, from + pageSize - 1);
        rows.push(...page);
        if (page.length < pageSize) break;
      }
      if (startedAt === generation) {
        memory = { version: 1, savedAt: now(), rows };
        try { options.storage?.setItem(CATALOGUE_KEY, JSON.stringify(memory)); } catch { /* Use memory cache if disk quota is exhausted. */ }
      }
      return rows;
    })();
    const task = { generation: startedAt, promise };
    pending = task;
    try { return clone(await promise); }
    finally { if (pending === task) pending = undefined; }
  }
  // Storage events are emitted in other tabs; don't remove the entry just written there.
  function externalChange() { generation++; memory = undefined; }
  return { read, invalidate, externalChange };
}
