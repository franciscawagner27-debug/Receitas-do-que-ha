import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { motion } from "framer-motion"
import Header from "./components/Header"
import RecipeDetail from "./components/RecipeDetail"
import type { Recipe } from "./types"

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("id", { ascending: false })
      if (!error && data) setRecipes(data)
      setLoading(false)
    }
    fetchRecipes()
  }, [])

  const filteredRecipes =
    selectedCategory === "Todas"
      ? recipes
      : recipes.filter((r) => r.category === selectedCategory)

  if (selectedRecipe) {
    return <RecipeDetail recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />
  }

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans">
      <Header onSelect={setSelectedCategory} />

      {/* HERO com imagem original */}
      <section
        className="relative h-[60vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 drop-shadow-lg">
            Receitas do que há
          </h1>
          <p className="text-lg text-white/90">
            Descubra o que pode cozinhar com o que tem em casa.
          </p>
        </div>
      </section>

      {/* LISTA DE RECEITAS */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif text-olive mb-8 text-center">
          🍲 {selectedCategory === "Todas" ? "Todas as Receitas" : selectedCategory}
        </h2>
        {loading ? (
          <p className="text-center text-stone">A carregar receitas...</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-center text-stone">Nenhuma receita nesta categoria.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((r) => (
              <motion.div
                key={r.id}
                onClick={() => setSelectedRecipe(r)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="cursor-pointer bg-white rounded-2xl shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-terracotta mb-2">
                    {r.title}
                  </h3>
                  {r.time_minutes && (
                    <p className="text-sm text-stone mb-2">
                      ⏱️ {r.time_minutes} min
                    </p>
                  )}
                  <p className="text-sm text-stone line-clamp-3 mb-3">
                    {r.ingredients.slice(0, 3).join(", ")}...
                  </p>
                  {r.tags && (
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-beige text-charcoal/80 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-sm text-stone">
        Feito com ❤️ por <span className="text-terracotta font-semibold">Francisca</span>
      </footer>
    </div>
  )
}
