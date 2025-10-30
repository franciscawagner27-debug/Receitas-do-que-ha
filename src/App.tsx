
import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import { useRecipes } from './hooks/useRecipes'
import Header from './components/Header'
import Hero from './components/Hero'
// import RecipeCard from './components/RecipeCard'
// import AddRecipe from './components/AddRecipe'

export default function App() {
  const [search, setSearch] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const { recipes, fetchRecipes } = useRecipes()

  // Buscar receitas ao montar
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // Ver o que vem do Supabase
  useEffect(() => {
    console.log('📦 receitas do Supabase:', recipes)
    if (recipes.length > 0) {
      console.log('📦 primeira receita:', recipes[0])
    }
  }, [recipes])

  // Filtro de pesquisa robusto
  useEffect(() => {
    console.log('🟡 pesquisa mudou para:', search)

    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,;:!?]/g, '')
        .trim()

    const term = normalize(search)

    if (!term) {
      console.log('🔵 sem termo → mostrar todas')
      setFilteredRecipes(recipes)
      return
    }

    try {
      const matches = recipes.filter((r) => {
        if (!r || !('ingredients' in r)) return false

        const ingArray = Array.isArray(r.ingredients)
          ? r.ingredients
          : typeof r.ingredients === 'string'
            ? r.ingredients.split(',')
            : []

        const text = normalize(ingArray.join(' '))
        const found = text.includes(term)

        console.log('→', r.title, '| texto:', text, '| procura:', term, '| encontrou?', found)
        return found
      })

      setFilteredRecipes(matches)
    } catch (err) {
      console.error('❌ erro no filtro:', err)
      setFilteredRecipes(recipes)
    }
  }, [search, recipes])

  // Ordenar
  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title))
  }, [filteredRecipes])

  return (
    <div className="min-h-screen bg-beige text-charcoal font-sans">
      <Header />
      <Hero />

      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Procurar por ingredientes..."
            className="w-full p-3 border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
          />
          <p className="text-xs text-stone mt-2">
            A pesquisar por: <strong>{search || '— (tudo)'}</strong>
          </p>
        </div>

        {sortedRecipes.length === 0 ? (
          <p className="text-center text-stone">Nenhuma receita encontrada.</p>
        ) : (
          <div className="g
