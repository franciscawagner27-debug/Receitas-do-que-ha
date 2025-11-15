import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        cache: "no-store",        // 👈 MUITO IMPORTANTE
        headers: {
          ...(options?.headers || {}),
          "cache-control": "no-store", // 👈 Força a ignorar caches externos
          "pragma": "no-cache"
        }
      })
    }
  }
})
