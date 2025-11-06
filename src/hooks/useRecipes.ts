import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase.from('recipes').select('*').order('title', { ascending: true }).then(({ data, error }) => {
      if (error) {
        console.error(error)
      } else if (data) {
        setRecipes(data as any)
      }
    }).finally(() => setLoading(false))
  }, [])

  return { recipes, loading }
}