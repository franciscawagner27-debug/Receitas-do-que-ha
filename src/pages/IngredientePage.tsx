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

  useEffect(() => {
    document.title = `Receitas com ${nome} | Receitas do Que Há`;
    fetchRecipes();
  }, [nome]);

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      const filtered = (data as Recipe[]).filter((recipe) => {
        const result = smartSearch(recipe, nome || "");
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
          Receitas com {nome}
        </h1>

        {loading ? (
          <p className="text-center">A carregar receitas...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((r) => (
              <Link key={r.id} to={`/receita/${r.id}`}>
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
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
