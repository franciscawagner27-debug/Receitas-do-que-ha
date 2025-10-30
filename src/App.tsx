
import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import { useRecipes } from './hooks/useRecipes'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeCard from './components/RecipeCard'
// import AddRecipe from './components/AddRecipe'

export default function App() {
  const [search, setSearch] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const { recipes, fetchRecipes } = useRecipes()

  useEffect(() => {
    console.log('Receitas carregadas:', recipes)
    if (recipes.length > 0) {
      console.log('Exemplo de receita:', recipes[0])
    }
  }, [recipes])

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // 🔎 Filtro de pesquisa aprimorado
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRecipes(recipes)
    } else {
      const lower = search
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos

      setFilteredRecipes(
        recipes.filter((r) => {
          const ingredients = Array.isArray(r.ingredients)
            ? r.ingredients.join(' ').toLowerCase()
            : String(r.ingredients || '').toLowerCase()

          const normalizedIngredients = ingredients
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

          return normalizedIngredients.includes(lower)
        })
      )
    }
  }, [search, recipes])

  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
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
        </div>

        {sortedRecipes.length === 0 ? (
          <p className="text-center text-stone">
            Nenhuma receita encontrada.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRecipes.map((r) => (
              <RecipeCard key={r.id} r={r} onOpen={() => {}} />
            ))}
          </div>
        )}
      </main>

      {/* <AddRecipe /> */}

      <footer className="text-center text-sm text-stone py-6 mt-10 border-t border-stone/20">
        © {new Date().getFullYear()} ReceitasDoQueHá — feito com ❤️ em Portugal
      </footer>
    </div>
  )
}
