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

  // Favoritos (mantém a lógica igual ao site principal)
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

  // Carregar apenas receitas que têm tag "diassemtempo"
  useEffect(() => {
    async function fetchDiasSemTempo() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*");

      if (!error && data) {
        const filtered = data.filter((recipe: any) =>
          recipe.tags?.includes("diassemtempo")
        );
        setRecipes(filtered as Recipe[]);
      }
      setLoading(false);
    }

    fetchDiasSemTempo();
  }, []);

  // Filtro de pesquisa (apenas dentro das receitas Dias Sem Tempo)
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(r.ingredients) &&
      r.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchTerm.toLowerCase())
      ))
  );

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans">
      <Header onSelect={(category) => {
        // botão Dias Sem Tempo redireciona aqui
        if (category.toLowerCase() === "dias sem tempo") {
          window.location.href = "/dias-sem-tempo";
        } else {
          window.location.href = "/";
        }
      }}/>

      {/* HERO */}
      <section
        className="relative h-[40vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://ejnzzxrfqkfxglnmkkyl.supabase.co/storage/v1/object/public/recipe-images/dias-sem-tempo-hero.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-4">
          
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 drop-shadow">
            Dias Sem Tempo
          </h1>

          <p className="text-white/90 max-w-lg mx-auto text-lg drop-shadow">
            Receitas DO QUE HÁ — soluções práticas para dias apressados.
          </p>
        </div>
      </section>

      {/* Linha */}
      <div className="h-px bg-olive/40 w-3/4 mx-auto my-0"></div>

      {/* Pesquisa */}
      <section className="bg-beige py-10 px-6">
        <div className="max-w-xl mx-auto text-center">

          <p className="text-charcoal/80 text-lg mb-6">
            Encontre rapidamente opções práticas e saborosas para aqueles dias em que o tempo não chega para tudo.
          </p>

          <input
            type="text"
            placeholder="Pesquisar nas receitas rápidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-xl border border-olive/40 shadow bg-white 
            focus:ring-2 focus:ring-olive/40 focus:border-olive transition text-lg"
          />
        </div>
      </section>

      {/* Lista de receitas */}
      <main className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-stone">A carregar receitas...</p>
        ) : filteredRecipes.length === 0 ? (
          <p className="text-center text-stone">Nenhuma receita encontrada.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((r) => (
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

      {/* Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
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

      <footer className="text-center py-8 text-sm text-olive">
        <p>Feito com ❤️ em Portugal</p>
        <p>© 2025 Receitas do Que Há — Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
