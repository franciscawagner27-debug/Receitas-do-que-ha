import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { motion } from "framer-motion";
import Header from "./components/Header";
import RecipeDetail from "./components/RecipeDetail";
import type { Recipe } from "./types";
import AdminPage from "./pages/Admin";

/* -------------------------------------------------------------------------- */
/*                                 APP ROOT                                   */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <Routes>
      {/* Página pública */}
      <Route path="/" element={<HomePage />} />

      {/* Página privada /admin */}
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

/* -------------------------------------------------------------------------- */
/*                              HOMEPAGE COMPLETA                              */
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

  /* --------------------------- SEO JSON-LD --------------------------- */

  useEffect(() => {
    if (!recipes || recipes.length === 0) return;

    document.querySelectorAll("script[data-recipe-json]").forEach((el) => el.remove());

    recipes.forEach((recipe) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-recipe-json", "true");

      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.title,
        "image": recipe.image || "",
        "description": `Receita de ${recipe.title} do site Receitas do Que Há.`,
        "author": {
          "@type": "Person",
          "name": "Francisca Menezes"
        },
        "recipeIngredient": recipe.ingredients || [],
        "recipeInstructions": Array.isArray(recipe.steps)
          ? recipe.steps.map((s) => ({ "@type": "HowToStep", text: s }))
          : [],
        "totalTime": recipe.time_minutes
          ? `PT${recipe.time_minutes}M`
          : undefined,
        "keywords": recipe.tags ? recipe.tags.join(", ") : ""
      };

      script.textContent = JSON.stringify(jsonLD);
      document.head.appendChild(script);
    });
  }, [recipes]);

  /* --------------------------- CATEGORIAS + PESQUISA ----------------------- */

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
  };

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
    (document.activeElement as HTMLElement)?.blur();
    const list = document.getElementById("recipe-list");
    if (list) list.scrollIntoView({ behavior: "smooth" });
  };

  /* ----------------------------- FETCH RECEITAS ---------------------------- */

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        const cleaned = data.map((r: any) => {
          let tags: string[] = [];

          if (Array.isArray(r.tags)) {
            tags = r.tags
              .flatMap((t: any) =>
                t
                  .toString()
                  .split(/[#\[\]",;]+/)
                  .map((s) => s.trim().toLowerCase())
              )
              .filter((t) => t.length > 0);
          } else if (typeof r.tags === "string") {
            tags = r.tags
              .replace(/[#\[\]"]/g, " ")
              .split(/[\s,;]+/)
              .map((t) => t.trim().toLowerCase())
              .filter((t) => t.length > 0);
          }

          return { ...r, tags };
        });

        setRecipes(cleaned as Recipe[]);
      }
      setLoading(false);
    }

    fetchRecipes();
  }, []);

  /* ------------------------------ MAPA DE TAGS ----------------------------- */

  const categoryMap: Record<string, string[]> = {
    entradas: ["entrada", "entradas", "aperitivo", "petisco", "petiscos"],
    sopas: ["sopa", "sopas", "caldo", "caldos"],
    carne: ["carne", "carnes", "frango", "porco", "bife", "vaca"],
    peixe: ["peixe", "peixes", "bacalhau", "atum", "marisco", "mariscos"],
    massas: ["massa", "massas", "pasta", "esparguete", "macarrão", "tagliatelle"],
    vegetariano: ["vegetariano", "vegetariana", "vegan", "salada", "legumes", "legume"],
    sobremesas: [
      "doce", "doces", "sobremesa", "sobremesas",
      "bolo", "bolos", "tarte", "tartes",
      "pudim", "pudins", "mousse", "mousses",
    ],
  };

  /* ------------------------------- FILTRO GERAL ---------------------------- */

  const filteredRecipes = recipes.filter((r) => {
    const selected = selectedCategory.trim().toLowerCase();
    const validTags = categoryMap[selected] || [];

    let matchesCategory = true;

    if (selected === "favoritas") {
      matchesCategory = favorites.includes(r.id);
    } else if (selected !== "todas") {
      matchesCategory =
        Array.isArray(r.tags) && r.tags.some((tag) => validTags.includes(tag));
    }

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const matchesSearch =
      searchTerm.trim() === ""
        ? true
        : (() => {
            const terms = normalize(searchTerm)
              .split(/[\s,;]+/)
              .filter((t) => t.length > 0);

            return terms.every(
              (term) =>
                r.ingredients.some((ing) => normalize(ing).includes(term)) ||
                normalize(r.title).includes(term)
            );
          })();

    return matchesCategory && matchesSearch;
  });

  /* ----------------------------------------------------------------------- */
  /* -------------------------- RENDER UI COMPLETO ------------------------- */
  /* ----------------------------------------------------------------------- */

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

      {/* LINHA */}
      <div className="h-px bg-olive/50 w-3/4 mx-auto my-0"></div>

      {/* -------------------------------------------------------------------- */}
      {/* ------------------------- VERSÃO ANTIGA (SEGURA) ------------------- */}
      {/* -------------------------------------------------------------------- */}

      {/*
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
            placeholder="Procure por ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="w-full max-w-md p-3 rounded-lg border border-olive/30 focus:outline-none focus:ring-2 focus:ring-olive/50"
          />

          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-olive hover:text-terracotta"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              strokeWidth={2} stroke="currentColor"
              className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
            </svg>
          </button>
        </div>
      </section>
      */}

      {/* -------------------------------------------------------------------- */}
      {/* ------------------------- NOVA SECÇÃO MODERNA ---------------------- */}
      {/* -------------------------------------------------------------------- */}

      <section className="bg-beige py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">

          <h2 className="text-4xl font-serif font-bold text-olive mb-3">
            O que tem na sua cozinha?
          </h2>

          <p className="text-charcoal/80 text-lg mb-10">
            Escreva um ou mais ingredientes e descubra receitas perfeitas para si.
          </p>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Ex: frango, massa, tomate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full p-4 rounded-xl border border-olive/40 shadow-md bg-white
                         focus:ring-2 focus:ring-olive/40 focus:border-olive
                         transition-all duration-200 text-lg"
            />

            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-olive hover:text-terracotta transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth={2} stroke="currentColor"
                className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
              </svg>
            </button>
          </div>

          {/* SUGESTÕES RÁPIDAS */}
          <p className="text-charcoal/70 mb-3 font-medium">Sugestões rápidas:</p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {["frango", "massa", "atum", "arroz", "ovo"].map((ing) => (
              <button
                key={ing}
                onClick={() => {
                  setSearchTerm(ing);
                  setTimeout(() => handleSearch(), 50);
                }}
                className="px-4 py-2 bg-olive/10 text-olive rounded-full text-sm
                           hover:bg-olive/20 transition shadow-sm"
              >
                {ing}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* ------------------------- ÂNCORA + LISTA --------------------------- */}
      {/* -------------------------------------------------------------------- */}

      <div id="recipe-list"></div>

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

                  {/* ❤️ FAVORITO */}
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

                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag: string, i: number) => (
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

      {/* -------------------------------------------------------------------- */}
      {/* ------------------------------- MODAL ------------------------------- */}
      {/* -------------------------------------------------------------------- */}

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

      {/* -------------------------------------------------------------------- */}
      {/* ------------------------------- FOOTER ------------------------------ */}
      {/* -------------------------------------------------------------------- */}

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
