
import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import { useRecipes } from './hooks/useRecipes'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeCard from './components/RecipeCard'
// import AddRecipe from './components/AddRecipe'

export default function App() {
  const [search, setSearch] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const { recipes, fetchRecipes } = useRecipes()

  // 1) buscar receitas
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // 2) logar o que vem
  useEffect(() => {
    console.log('📦 receitas do Supabase:', recipes)
    if (recipes.length > 0) {
      console.log('📦 primeira receita:', recipes[0])
    }
  }, [recipes])

  // 3) filtro
  useEffect(() => {
    console.log('🟡 pesquisa mudou para:', search)

    // função de normalização
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[.,;:!?]/g, '')
        .trim()

    const term = normalize(search)

    // se não há pesquisa → mostra todas
    if (!term) {
      console.log('🔵 sem termo → mostrar todas')
      setFilteredRecipes(recipes)
      return
    }

    try {
      const matches = recipes.filter((r) => {
        // se a receita não tem ingredientes, não quebra
        if (!r || !('ingredients' in r)) {
          console.warn('⚠️ receita sem ingredients:', r)
          return false
        }

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

      // se não encontrou nada, mostra todas (por enquanto)
      if (matches.length === 0) {
        console.warn('⚠️ nenhuma receita bateu, a mostrar todas (por enquanto)')
        setFilteredRecipes(recipes)
      } else {
        setFilteredRecipes(matches)
      }
    } catch (err) {
      console.error('❌ erro no filtro:', err)
      // se der erro, não deixamos o site vazio
      setFilteredRecipes(recipes)
    }
  }, [search, recipes])

  // 4) ordenar
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

        {/* se não houver NADA MESMO */}
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
