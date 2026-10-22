import { supabase } from './supabase';
import type { Recipe } from '../types';
import { CATALOGUE_KEY, createCatalogueCache } from './catalogueCache';
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* Private mode can disable storage. */ }
const cache = createCatalogueCache({
  storage,
  readPage: async (from, to) => {
    const { data, error } = await supabase.from('recipes').select('*')
      .order('priority', { ascending: true }).order('id', { ascending: false }).range(from, to);
    if (error) throw error;
    if (!Array.isArray(data)) throw new Error('Catálogo indisponível.');
    return data as Recipe[];
  },
});
window.addEventListener('storage', event => {
  if (event.key === CATALOGUE_KEY || event.key === null) cache.externalChange();
});
export async function getRecipes(): Promise<{ data: Recipe[] | null; error: unknown }> {
  try { return { data: await cache.read(), error: null }; }
  catch (error) { return { data: null, error }; }
}
export const invalidateRecipeCatalogue = cache.invalidate;
