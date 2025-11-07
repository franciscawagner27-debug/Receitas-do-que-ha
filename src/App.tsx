
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import RecipeDetail from "./components/RecipeDetail";
import type { Recipe } from "./types";

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Buscar receitas do Supabase
  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("id", { ascending: false });
      if (!error && data) setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  // 🔹 Filtrar receitas por categoria e pesquisa
  const filteredRecipes = recipes.filter((r) => {
    const recipeCategory = r.category?.trim().toLowerCase();
    const selected = selectedCategory.trim().toLowerCase();

    const matchesCategory = selected === "todas" || recipeCategory === selected;

    const matchesSearch =
      searchTerm === "" ||
      r.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 🔹 Se uma receita estiver selecionada, mostrar detalhe
  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans">
      {/* Cabeçalho com categorias */}
      <Header onSelect={setSelectedCategory} />

      {/* HERO restaurado com imagem e título original */}
      <Hero />

      {/* BLOCO DE PESQUISA */}
      <section className="bg-beige text-center py-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-olive mb-3">
          O que tem na sua cozinha?
        </h2>
        <p className="text-charcoal/80 mb-6">
          Escreva um ou mais ingredientes para descobrir receitas
        </p>

        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Exemplo: frango, arroz, tomate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-5 py-3 text-charcoal placeholder-stone shadow-sm focus:outline-none focus:ring-2 focus:ring-olive/40"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-terracotta text-xl">
            🔍
          </span>
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
          <p className="text-center text-stone">Nenhuma receita encontrada.</p>
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
        Feito com ❤️ por{" "}
        <span className="text-terracotta font-semibold">Francisca</span>
      </footer>
    </div>
  );
}
