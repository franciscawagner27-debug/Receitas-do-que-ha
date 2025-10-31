import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import { useRecipes } from './hooks/useRecipes'
import Header from './components/Header'
import Hero from './components/Hero'
import RecipeCard from './components/RecipeCard'

export default function App() {
  const [search, setSearch] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [selected, setSelected] = useState<Recipe | null>(null)
  const { recipes, fetchRecipes } = useRecipes()

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  useEffect(() => {
    const normalize = (text: string) =>
      text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const term = normalize(search)
    if (!term) {
      setFilteredRecipes(recipes)
      return
    }

    const matches = recipes.filter((r) => {
      const ing = Array.isArray(r.ingredients)
        ? r.ingredients.join(' ')
        : r.ingredients
      return ing && normalize(ing).includes(term)
    })
    setFilteredRecipes(matches)
  }, [search, recipes])

  const sortedRecipes = useMemo(
    () => [...filteredRecipes].sort((a, b) => a.title.localeCompare(b.title)),
    [filteredRecipes]
  )

  return (
    <div className="min-h-screen bg-beige text-charcoal font-sans relative">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRecipes.map((r) => (
              <RecipeCard key={r.id} r={r} onOpen={setSelected} />
            ))}
          </div>
        )}
      </main>

      {/* Modal de receita */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
            <div className="p-6">
              <h2 className="text-2xl font-serif text-olive mb-2">
                {selected.title}
              </h2>
              <p className="text-stone/80 text-sm mb-4">
                ⏱️ {selected.time_minutes} minutos
              </p>

              <h3 className="text-lg font-serif text-olive mb-2">Ingredientes</h3>
              <ul className="list-disc ml-5 mb-4 text-sm">
                {selected.ingredients?.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>

              <h3 className="text-lg font-serif text-olive mb-2">Preparação</h3>
              <ol className="list-decimal ml-5 mb-4 text-sm">
                {selected.steps?.map((s, idx) => (
                  <li key={idx} className="mb-1">
                    {s}
                  </li>
                ))}
              </ol>

              {selected.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selected.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-olive/10 text-olive"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-sm text-stone py-6 mt-10 border-t border-stone/20">
        © {new Date().getFullYear()} ReceitasDoQueHá — feito com ❤️ em Portugal
      </footer>
    </div>
  )
}
