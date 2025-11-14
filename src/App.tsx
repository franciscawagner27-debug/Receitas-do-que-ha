import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { motion } from "framer-motion";
import Header from "./components/Header";
import RecipeDetail from "./components/RecipeDetail";
import type { Recipe } from "./types";
import AdminPage from "./pages/Admin";

/* -------------------------------------------------------------------------- */
/*                                   ROOT                                     */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/" element={<HomePage />} />

      {/* Página privada */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HOME PAGE                                   */
/* -------------------------------------------------------------------------- */

function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ------------------------------- FAVORITOS ------------------------------- */

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  /* ------------------------------ FETCH DATA ------------------------------ */

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setRecipes(data as Recipe[]);
      }
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  /* ----------------------------- CATEGORIAS ----------------------------- */

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
  };

  /* ----------------------------- PESQUISA ----------------------------- */

  const handleSearch = () => {
    const finalTerm = searchTerm.trim();
    setSearchTerm(finalTerm);

    const list = document.getElementById("recipe-list");
    if (list) list.scrollIntoView({ behavior: "smooth" });
  };

  /* ----------------------------- FILTROS ----------------------------- */

  const filteredRecipes = recipes.filter((r) => {
    const normalize = (str: string) =>
      str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const matchesSearch =
      searchTerm.trim() === ""
        ? true
        : (() => {
            const terms = normalize(searchTerm)
              .split(/[\s,;]+/)
              .filter((t) => t);

            return terms.every(
              (term) =>
                r.ingredients.some((ing) => normalize(ing).includes(term)) ||
                normalize(r.title).includes(term)
            );
          })();

    return matchesSearch;
  });

  /* ----------------------------- UI -------------------------------- */

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans relative">
      <Header onSelect={handleCategorySelect} />

      {/* HERO */}
      <section
        className="relative h-[40vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://receitas-do-que-ha.vercel.app/mesa-ingredientes.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg leading-tight">
            <span className="block tracking-wide">Receitas</span>
            <span className="block mt-1 tracking-widest text-6xl md:text-7xl uppercase">
              DO QUE HÁ
            </span>
          </h1>
          <p className="text-lg text-white/90">
            Descubra o que pode cozinhar com o que tem em casa.
          </p>
        </div>
      </section>

      {/* PESQUISA */}
      <section className="bg-beige text-center py-10 px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-olive mb-3">
          O que tem na sua cozinha?
        </h2>

        <p className="text-charcoal/80 mb-6">
          Escreva um ou mais ingredientes para descobrir receitas
        </p>

        <div className="max-w-md mx-auto relative">
          <input
            id="search-box"
            type="text"
            placeholder="Procure por ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full max-w-md p-3 rounded-lg border border-olive/30 focus:outline-none focus:ring-2 focus:ring-olive/50"
          />

          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-olive hover:text-terracotta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
              />
            </svg>
          </button>
        </div>
      </section>

      <div id="recipe-list"></div>

      {/* LISTA */}
      <main className="max-w-5xl mx-auto px-6 py-12">
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
                <div className="relative">
                  {r.image && (
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(r.id);
                    }}
                    className="absolute top-2 right-2 text-2xl drop-shadow-md"
                  >
                    {favorites.includes(r.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-olive mb-2">
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

     {/* LUPA NO TELEMÓVEL */}
<button
  onClick={() => {
    const el = document.getElementById("search-box");
    if (el) {
      const y =
  el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }}
  className="
    md:hidden
    fixed bottom-6 right-6
    bg-white
    text-olive
    border border-olive
    p-4 rounded-full shadow-lg
    hover:bg-olive hover:text-white
    transition
  "
>
  🔍
</button>

      {/* MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-3 right-3 text-terracotta text-lg hover:scale-110 transition"
            >
              ✕
            </button>

            <RecipeDetail
              recipe={selectedRecipe}
              onBack={() => setSelectedRecipe(null)}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-8 text-sm text-olive">
        <p>Feito com ❤️ em Portugal</p>
        <p>© 2025 Receitas do Que Há — Todos os direitos reservados</p>
        <p>
          <a
            href="mailto:contacto@receitasdoqueha.pt"
            className="underline hover:text-terra transition"
          >
            contacto@receitasdoqueha.pt
          </a>
        </p>
      </footer>
    </div>
  );
}
