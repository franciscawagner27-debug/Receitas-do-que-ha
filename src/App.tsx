import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { motion } from "framer-motion";
import Header from "./components/Header";
import RecipeDetail from "./components/RecipeDetail";
import type { Recipe } from "./types";
import AdminPage from "./pages/Admin";
import EditRecipe from "./pages/EditRecipe";
import { smartSearch } from "./utils/smartSearch";
import RecipePage from "./pages/RecipePage";
import DiasSemTempoPage from "./pages/DiasSemTempoPage";
import CozinharPage from "./pages/cozinhar";
import Sobre from "./pages/Sobre";
import SemGlutenPage from "./pages/SemGlutenPage";
import IngredientePage from "./pages/IngredientePage";
import RecipesWithIngredient from "./pages/RecipesWithIngredient";
import { Link } from "react-router-dom";
import AirFryerPage from "./pages/AirFryerPage";

// URL da função de IA no Supabase
const AI_FUNCTION_URL =
  "https://ejnzzxrfqkfxglnmkkyl.supabase.co/functions/v1/ai2";

/* -------------------------------------------------------------------------- */
/*                                   ROOT                                     */
/* -------------------------------------------------------------------------- */

export default function App() {
  const location = useLocation();

  return (
    <Routes>
      {/* Página pública — agora recarrega quando voltas do admin */}
      <Route path="/" element={<HomePage key={location.pathname} />} />

      {/* Página privada /admin */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Página de edição */}
      <Route path="/admin/edit/:id" element={<EditRecipe />} />
      <Route path="/receita/:id" element={<RecipePage />} />
      <Route path="/dias-sem-tempo" element={<DiasSemTempoPage />} />
      <Route path="/cozinhar/:id" element={<CozinharPage />} />
      <Route path="/sobre" element={<Sobre />} /> 
      <Route path="/sem-gluten" element={<SemGlutenPage />} />  
      <Route path="/ingrediente/:nome" element={<IngredientePage />} /> 
      <Route path="/receitas-com-frango" element={<RecipesWithIngredient ingredient="frango" />} /> 
      <Route path="/airfryer" element={<AirFryerPage />} /> 
      <Route
  path="/receitas-com-ovos"
  element={<RecipesWithIngredient ingredient="ovos" />}
/>

<Route
  path="/receitas-com-atum"
  element={<RecipesWithIngredient ingredient="atum" />}
/>

<Route
  path="/receitas-com-arroz"
  element={<RecipesWithIngredient ingredient="arroz" />}
/>

<Route
  path="/receitas-com-batata"
  element={<RecipesWithIngredient ingredient="batata" />}
/>

<Route
  path="/receitas-com-massa"
  element={<RecipesWithIngredient ingredient="massa" />}
/>    
    </Routes>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HOME PAGE                                   */
/* -------------------------------------------------------------------------- */

function HomePage() {
  const location = useLocation(); 
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // IA – receita gerada
  const [aiRecipe, setAiRecipe] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Ler categoria via URL (?cat=carne)
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");

  if (cat && cat !== selectedCategory) {
    handleCategorySelect(cat);
  }
}, [location.search]);

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

  /* --------------------------- SEO JSON-LD -------------------------------- */

  useEffect(() => {
    if (!recipes || recipes.length === 0) return;

    document
      .querySelectorAll("script[data-recipe-json]")
      .forEach((el) => el.remove());

    recipes.forEach((recipe) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-recipe-json", "true");

      const jsonLD = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.title,
        image: (recipe as any).image || "",
        description: `Receita de ${recipe.title} do site Receitas do Que Há.`,
        author: {
          "@type": "Person",
          name: "Francisca Menezes",
        },
        recipeIngredient: (recipe as any).ingredients || [],
        recipeInstructions: Array.isArray((recipe as any).steps)
          ? (recipe as any).steps.map((s: string) => ({
              "@type": "HowToStep",
              text: s,
            }))
          : [],
        totalTime: (recipe as any).time_minutes
          ? `PT${(recipe as any).time_minutes}M`
          : undefined,
        keywords: (recipe as any).tags
          ? (recipe as any).tags.join(", ")
          : "",
      };

      script.textContent = JSON.stringify(jsonLD);
      document.head.appendChild(script);
    });
  }, [recipes]);

/* ----------------------------- FETCH RECEITAS ---------------------------- */

useEffect(() => {
  fetchRecipes();
}, [page, searchTerm]);

async function fetchRecipes() {
  setLoading(true);

  let query = supabase
    .from("recipes")
    .select("*")
    .order("priority", { ascending: true })
    .order("id", { ascending: false });

  // Se NÃO houver pesquisa → usar paginação
  if (!searchTerm.trim()) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;

  if (!error && data) {
    // Se estamos em paginação, verificar se ainda há mais receitas
    if (!searchTerm.trim() && data.length < PAGE_SIZE) {
      setHasMore(false);
    }

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

    // Se há pesquisa substitui resultados, se não adiciona (paginação)
    if (searchTerm.trim()) {
      setRecipes(cleaned as Recipe[]);
    } else {
      setRecipes((prev) => [...prev, ...cleaned] as Recipe[]);
    }
  }

  setLoading(false);
}
  /* ----------------------- ⭐ ORDENAR RECEITAS (DESTAQUES) ----------------- */

  const sortedRecipes = [...recipes].sort((a, b) => {
    const aFeatured = a.tags?.includes("destaque");
    const bFeatured = b.tags?.includes("destaque");

    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;

    return b.id - a.id;
  });

  /* --------------------------- CATEGORIAS + PESQUISA ----------------------- */

 const handleCategorySelect = (category: string) => {
  const normalized = category.toLowerCase().trim();

  // corrigir "Sopas" → tag real "sopa"
  if (normalized === "sopas") {
    setSelectedCategory("sopa");
  } else {
    setSelectedCategory(normalized);
  }

  setSearchTerm("");
};

  const handleSearch = (term?: string) => {
    const finalTerm = (term ?? searchTerm).trim();
    setSearchTerm(finalTerm);

    const el = document.getElementById("recipe-list");
    if (el) {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      window.scrollTo({
        top: scrollTop + rect.top - 40,
        behavior: "smooth",
      });
    }
  };

  /* --------------------- GERAR RECEITA COM IA (BOTÃO) --------------------- */

  async function handleGenerateAiRecipe() {
    console.log("🍳 [IA] Botão clicado");

    const term = searchTerm.trim();
    console.log("📝 [IA] Ingredientes introduzidos:", term);

    if (!term) {
      setAiError(
        "Escreva pelo menos um ingrediente para gerar a receita com IA."
      );
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      console.log("📡 [IA] A enviar pedido para:", AI_FUNCTION_URL);

      const res = await fetch(AI_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: term }),
      });

      console.log("📦 [IA] Resposta recebida. Status:", res.status);

      const data = await res.json().catch((err) => {
        console.error("❌ [IA] Erro ao fazer res.json():", err);
        return null;
      });

      console.log("🔍 [IA] Data recebida:", data);

      if (!res.ok || !data || !data.recipe) {
        console.warn("⚠️ [IA] Erro devolvido pela função:", data?.error);

        setAiError(
          data?.error ||
            "Não foi possível gerar a receita. Tente novamente dentro de alguns segundos."
        );
        setAiRecipe(null);
        return;
      }

      console.log("✅ [IA] Receita gerada com sucesso!");
      setAiRecipe(data.recipe);
    } catch (err) {
      console.error("🔥 [IA] Erro no fetch:", err);

      setAiError(
        "Não foi possível contactar o servidor de receitas. Verifique a ligação e tente novamente."
      );
    } finally {
      console.log("⏹️ [IA] Processo terminado");
      setAiLoading(false);
    }
  }/* --------------------------- FILTRO GERAL ---------------------------- */

// ❌ EXCLUIR SEMPRE as receitas dos Dias Sem Tempo da Homepage
const recipesWithoutDST = sortedRecipes.filter(
  (r) => !(r.tags && r.tags.includes("diassemtempo"))
);

const hasSearch = searchTerm.trim() !== "";

// Normalizador (remove acentos + espaços + lowercase)
const normalize = (s: string = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// 1) Filtrar por categoria + pesquisa (mas ainda sem dividir secções)
let filteredRecipes = recipesWithoutDST.filter((r: any) => {
  const selected = normalize(selectedCategory);

  const categoryMap: Record<string, string[]> = {
    entradas: ["entrada", "entradas", "aperitivo", "petisco", "petiscos"],

    // ✅ aceitar "sopa" e "sopas"
    sopa: ["sopa", "sopas", "caldo", "caldos", "creme", "cremes"],
    sopas: ["sopa", "sopas", "caldo", "caldos", "creme", "cremes"],

    carne: ["carne", "carnes", "frango", "porco", "bife", "vaca"],
    peixe: ["peixe", "peixes", "bacalhau", "atum", "marisco", "mariscos"],
    massas: ["massa", "massas", "pasta", "esparguete", "macarrao", "tagliatelle"],
    vegetariano: ["vegetariano", "vegetariana", "vegan", "salada", "legumes", "legume"],
    sobremesas: [
      "doce",
      "doces",
      "sobremesa",
      "sobremesas",
      "bolo",
      "bolos",
      "tarte",
      "tartes",
      "pudim",
      "pudins",
      "mousse",
      "mousses",
    ],
    airfryer: ["airfryer", "air fryer", "fritadeira", "fritadeira sem oleo"],
  };

  let matchesCategory = true;

  if (selected === "favoritas") {
    matchesCategory = favorites.includes(r.id);
  } else if (selected !== "todas") {
    const valid = categoryMap[selected] || [];

    // junta onde a categoria pode estar: tags + category + title
    const haystack = normalize(
      [
        r.category ?? "",
        Array.isArray(r.tags) ? r.tags.join(" ") : (r.tags ?? ""),
        r.title ?? "",
      ].join(" ")
    );

    // match por "conter" (mais robusto do que match exacto)
    matchesCategory = valid.some((v) => haystack.includes(normalize(v)));
  }

  // NOVA PESQUISA INTELIGENTE
  const { matches, score, isExactMatch, extraCount, matchedIngredientCount } =
    smartSearch(r, searchTerm);

  // guardar no objeto (para ordenação)
  (r as any)._searchScore = score;
  (r as any)._isExactMatch = isExactMatch;
  (r as any)._extraCount = extraCount;
  (r as any)._matchedIngredientCount = matchedIngredientCount;

  const matchesSearch = !hasSearch ? true : matches;

  return matchesCategory && matchesSearch;
});

  // Função de ordenação comum
  function sortByRelevance(a: any, b: any) {
    const scoreA = a._searchScore ?? 0;
    const scoreB = b._searchScore ?? 0;

    if (scoreB !== scoreA) return scoreB - scoreA;

    const aFeatured = a.tags?.includes("destaque");
    const bFeatured = b.tags?.includes("destaque");

    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;

    return b.id - a.id;
  }

  // 2) Criar as duas listas quando há pesquisa
  let exactMatches: any[] = [];
  let extendedMatches: any[] = [];
  let finalRecipes: any[] = [];

  if (hasSearch) {
    // contar quantos termos "a sério" a pessoa escreveu (massa, tomate, carne, etc.)
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const termCount = normalizedSearch
      .split(/[\s,;]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1).length;

    // se só escreveu 1 ingrediente → basta 1 match
    // se escreveu 2 ou mais → pedimos pelo menos 2 matches
    const minMatchCount = termCount <= 1 ? 1 : 2;

    filteredRecipes.forEach((r: any) => {
      if (r._isExactMatch) {
        exactMatches.push(r);
      } else if (r._matchedIngredientCount >= minMatchCount) {
        extendedMatches.push(r);
      }
    });

    exactMatches = exactMatches.sort(sortByRelevance);
    extendedMatches = extendedMatches.sort(sortByRelevance);
  } else {
    // sem pesquisa: comportamento antigo
    finalRecipes = [...filteredRecipes].sort(sortByRelevance);
  }

  /* ------------------------------- UI / RENDER ----------------------------- */

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

      {/* PESQUISA */}
      <section className="bg-beige py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-olive mb-3">
            O que tem na sua cozinha?
          </h2>

          <p className="text-charcoal/80 text-lg mb-10">
            Encontre receitas com os ingredientes que já tem em casa.
            <br className="hidden md:block" />
 {" "}Ou crie uma nova receita.
          </p>

          {/* Caixa de pesquisa (sem botão IA dentro) */}
          <div className="relative mb-4">
            <input
              id="search-box"
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
              className="w-full p-4 pr-12 pl-12 rounded-xl border border-olive/40 shadow-md bg-white
                focus:ring-2 focus:ring-olive/40 focus:border-olive transition-all duration-200 text-lg"
            />

            {/* Lupa à esquerda */}
            <button
              type="button"
              onClick={() => handleSearch()}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-olive hover:text-terracotta transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
            </button>
          </div>

          {/* Linha abaixo da caixa: texto + botão IA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-2">
          <span className="text-charcoal/80 text-lg">
          Não encontrou o que procura?
           </span>

            <button
              type="button"
              onClick={handleGenerateAiRecipe}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl 
                         bg-[#F7D983] text-charcoal shadow-md
                         hover:bg-[#f4d16a] disabled:opacity-60 disabled:cursor-not-allowed
                         transition"
            >
              <span className="text-lg">💡</span>
              <span className="text-sm md:text-base">Criar receita</span>
            </button>
          </div>

          {/* Mensagens IA */}
          {aiLoading && (
            <p className="text-sm text-stone mt-1">A gerar a sua receita...</p>
          )}

          {aiError && (
            <p className="text-sm text-terracotta mt-1">{aiError}</p>
          )}
        </div>
      </section>
      {/* IDEIAS COM INGREDIENTES */}
<section className="bg-beige pb-14 px-4">
  <div className="max-w-3xl mx-auto text-center">

  

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

      <Link
        to="/receitas-com-frango"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🍗 Receitas com Frango
      </Link>

      <Link
        to="/receitas-com-ovos"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🥚 Receitas com Ovos
      </Link>

      <Link
        to="/receitas-com-atum"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🐟 Receitas com Atum
      </Link>

      <Link
        to="/receitas-com-arroz"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🍚 Receitas com Arroz
      </Link>

      <Link
        to="/receitas-com-batata"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🥔 Receitas com Batata
      </Link>

      <Link
        to="/receitas-com-massa"
        className="bg-white border border-olive/30 rounded-xl py-3 px-4 shadow-sm hover:shadow-md hover:border-olive transition"
      >
        🍝 Receitas com Massa
      </Link>

    </div>

  </div>
</section>      

      {/* LISTA */}
      <div id="recipe-list"></div>

      {/* TEXTO DESCRITIVO DA CATEGORIA */}
      {selectedCategory.toLowerCase() === "dias sem tempo" && (
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-charcoal/80 text-lg leading-relaxed">
            Porque nem todos os dias há tempo para cozinhar, reunimos aqui
            soluções rápidas e produtos que já experimentámos e recomendamos.
            São opções práticas para dias apressados — pensadas para ajudar, não
            para substituir as refeições caseiras do dia a dia.
          </p>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-stone">A carregar receitas...</p>
        ) : !hasSearch ? (
          // ✅ Sem pesquisa: lista única como antes
          finalRecipes.length === 0 ? (
            <p className="text-center text-stone">Nenhuma receita encontrada.</p>
          ) : (
   <>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {finalRecipes.map((r: any) => (
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
            {Array.isArray(r.ingredients)
              ? r.ingredients.slice(0, 3).join(", ")
              : ""}
            ...
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

  {hasMore && !hasSearch && (
    <div className="text-center mt-10">
      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="px-6 py-3 bg-olive text-white rounded-xl hover:bg-terracotta transition"
      >
        Carregar mais receitas
      </button>
    </div>
  )}
</>        )
        ) : exactMatches.length === 0 && extendedMatches.length === 0 ? (
          <p className="text-center text-stone">Nenhuma receita encontrada.</p>
        ) : (
          <div className="space-y-14">
            {exactMatches.length > 0 && (
              <section>
                <h3 className="text-2xl font-serif text-olive mb-6 text-center">
                  Receitas com os ingredientes que tem:
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {exactMatches.map((r: any) => (
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
                          {Array.isArray(r.ingredients)
                            ? r.ingredients.slice(0, 3).join(", ")
                            : ""}
                          ...
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
              </section>
            )}

            {extendedMatches.length > 0 && (
              <section>
                <h3 className="text-2xl font-serif text-olive mb-6 text-center">
                  Receitas que também incluem os ingredientes que tem:
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {extendedMatches.map((r: any) => (
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
                          {Array.isArray(r.ingredients)
                            ? r.ingredients.slice(0, 3).join(", ")
                            : ""}
                          ...
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
              </section>
            )}
          </div>
        )}
      </main>

      {/* MODAL RECEITA GERADA PELA IA */}
      {aiRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setAiRecipe(null)}
              className="absolute top-3 right-3 text-terracotta text-lg hover:scale-110 transition"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 text-charcoal">
              <h2 className="text-2xl md:text-3xl font-semibold text-olive mb-4 text-center">
                {aiRecipe.title || "Receita sugerida"}
              </h2>

              {aiRecipe.time_minutes && (
                <p className="text-stone mb-4 text-center">
                  ⏱️ {aiRecipe.time_minutes} min
                </p>
              )}

              {/* Ingredientes */}
              <h3 className="text-xl font-semibold text-olive mt-4 mb-2">
                Ingredientes
              </h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                {(Array.isArray(aiRecipe.ingredients)
                  ? aiRecipe.ingredients
                  : typeof aiRecipe.ingredients === "string"
                  ? aiRecipe.ingredients
                      .split(/\n+/)
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : []
                ).map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              {/* Passos */}
              <h3 className="text-xl font-semibold text-olive mt-4 mb-2">
                Passos
              </h3>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                {(Array.isArray(aiRecipe.steps)
                  ? aiRecipe.steps
                  : typeof aiRecipe.steps === "string"
                  ? aiRecipe.steps
                      .split(/\n+/)
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : []
                ).map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              <p className="text-xs text-center text-stone mt-4">
                Receita gerada automaticamente por Inteligência Artificial.
                Confirme sempre as quantidades e tempos de confeção.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RECIPE DETAIL */}
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

  <p>
    <a
      href="/sobre"
      className="underline hover:text-terra transition"
    >
      Sobre o Receitas do Que Há
    </a>
  </p>
  <div className="flex justify-center gap-6 mt-4">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/receitasdoqueha/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram Receitas do Que Há"
    className="text-olive hover:text-terra transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.75 1.5a.75.75 0 100 1.5.75.75 0 000-1.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
    </svg>
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com/receitasdoqueha/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook Receitas do Que Há"
    className="text-olive hover:text-terra transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22 12a10 10 0 10-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v6.99A10 10 0 0022 12z"/>
    </svg>
  </a>
</div>
</footer>
      </div> 
  );
}      
