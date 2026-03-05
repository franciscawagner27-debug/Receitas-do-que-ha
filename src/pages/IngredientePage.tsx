import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { smartSearch } from "../utils/smartSearch";
import type { Recipe } from "../types";
import Header from "../components/Header";

const IngredientePage: React.FC = () => {
  const { nome } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // transformar frango-arroz -> frango arroz
  const searchTerm = (nome || "").replace(/-/g, " ");

  // título bonito
  const title =
    searchTerm
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  useEffect(() => {
    document.title = `Receitas com ${title} | Receitas do Que Há`;
    fetchRecipes();
  }, [nome]);

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      const filtered = (data as Recipe[]).filter((recipe) => {
        const result = smartSearch(recipe, searchTerm);
        return result.matches;
      });

      setRecipes(filtered);
    }

    setLoading(false);
  }

  return (
    <div className="bg-beige min-h-screen text-charcoal font-sans">
      <Header onSelect={() => {}} />

      <div className="px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif text-olive text-center mb-6">
          Receitas com {title}
        </h1>
        <p className="text-charcoal/80 text-center max-w-2xl mx-auto mb-10">
  Descubra várias receitas com {title.toLowerCase()} que pode preparar com ingredientes simples que já tem em casa. Ideias práticas para o dia-a-dia na cozinha.
</p>
        {loading ? (
          <p className="text-center">A carregar receitas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-stone">
            Não encontrámos receitas com este ingrediente.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((r) => (
              <Link key={r.id} to={`/receita/${r.id}`}>
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientePage;
