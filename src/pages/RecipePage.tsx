import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RecipeDetail from "../components/RecipeDetail";
import type { Recipe } from "../types";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setRecipe(data as Recipe);
      }
      setLoading(false);
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <p className="p-6">A carregar receita...</p>;
  if (!recipe) return <p className="p-6">Receita não encontrada.</p>;

  return (
    <div className="min-h-screen bg-beige p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-6">
        <RecipeDetail
          recipe={recipe}
          onBack={() => window.history.back()}
          favorites={[]}
          toggleFavorite={() => {}}
        />
      </div>
    </div>
  );
}
