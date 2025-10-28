import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Recipe } from '../types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('recipes').select('*')
    if (error) console.error('Erro ao buscar receitas:', error)
    else setRecipes(data || [])
    setLoading(false)
  }, [])

  const addRecipe = useCallback(async (recipe: Omit<Recipe, 'id'>) => {
    const { error } = await supabase.from('recipes').insert([recipe])
    if (error) console.error('Erro ao adicionar receita:', error)
    else fetchRecipes()
  }, [fetchRecipes])

  return { recipes, fetchRecipes, addRecipe, loading }
}
