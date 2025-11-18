import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import RecipeDetail from "../components/RecipeDetail";
import type { Recipe } from "../types";


export default function DiasSemTempoPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Favoritos (igual ao resto do site)
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

  // Buscar apenas receitas Dias Sem Tempo (tag "diassemtempo")
  useEffect(() => {
    async function fetchDiasSemTempo() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*");

      if (!error && data) {
        const filtered = (data as any[]).filter((recipe) => {
          const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
          return tags.some((t: string) =>
            t.toString().toLowerCase().includes("diassemtempo")
          );
        });

        setRecipes(filtered as Recipe[]);
      }
      setLoading(false);
    }

    fetchDiasSemTempo();
  }, []);

  // Filtro de pesquisa simples (título + ingredientes)
  const filteredRecipes = recipes.filter((r: any) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    const inTitle = r.title?.toLowerCase().includes(term);

    const inIngredients =
      Array.isArray(r.ingredients) &&
      r.ingredients.some((ing: string) =>
        ing.toLowerCase().includes(term)
      );

    return inTitle || inIngredients;
  });

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans">
      {/* HEADER — usa a lógica normal, mas o Header trata do "Dias sem Tempo" */}
      <Header
        onSelect={(category) => {
          // aqui delegamos a navegação ao Header no resto do site
          // nesta página, se clicarem noutra categoria, mandamos para a homepage
          if (category.toLowerCase() === "dias sem tempo") {
            // já estamos aqui, não fazemos nada
            return;
          }
          window.location.href = "/";
        }}
      />

{/* HERO */}
<section
  className="relative h-[40vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://ejnzzxrfqkfxglnmkkyl.supabase.co/storage/v1/object/public/recipe-images/dias-sem-tempo-hero.png')",
  }}
>
  {/* overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* LOGO — canto superior esquerdo */}
  <div className="absolute top-4 left-4 z-20">
    <img
      src="/Icons/icon-512.png"
      alt="Receitas do Que Há"
      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg object-contain"
    />
  </div>

  {/* TEXTO CENTRADO */}
  <div className="relative z-10 px-4 max-w-2xl mx-auto text-center">
    <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 drop-shadow">
      Dias Sem Tempo
    </h1>

    <p className="text-white/90 max-w-xl mx-auto text-lg drop-shadow">
      Porque nem todos os dias há tempo para cozinhar, reunimos aqui soluções rápidas
      e produtos que já experimentámos e recomendamos. São opções práticas para dias
      apressados — pensadas para ajudar, não para substituir as refeições caseiras do
      dia a dia.
    </p>
  </div>
</section>




      {/* LINHA */}
      <div className="h-px bg-olive/40 w-3/4 mx-auto my-0"></div>

      {/* PESQUISA */}
      <section className="bg-beige py-10 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-charcoal/80 text-lg mb-6">
            Encontre rapidamente opções práticas e saborosas para aqueles dias
            em que o tempo não chega para tudo.
          </p>

          <input
            type="text"
            placeholder="Ex: croquetes, batatas assadas, folhado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-xl border border-olive/40 shadow bg-white 
              focus:ring-2 focus:ring-olive/40 focus:border-olive transition text-lg"
          />
        </div>
      </section>

      {/* LISTA DE RECEITAS */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-stone">A carregar receitas...</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-center text-stone">Nenhuma receita encontrada.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((r: any) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecipe(r)}
                className="cursor-pointer bg-white rounded-2xl shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition duration-300"
              >
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-olive mb-2">
                    {r.title}
                  </h3>

                  {r.time_minutes && (
                    <p className="text-sm text-stone mb-2">
                      ⏱️ {r.time_minutes} min
                    </p>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(r.id);
                    }}
                    className="text-2xl"
                  >
                    {favorites.includes(r.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DETALHE */}
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
      </footer>
    </div>
  );
}
