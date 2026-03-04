import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Recipe } from "../types";
import { Link } from "react-router-dom";

export default function RecipesWithIngredient({ ingredient }: { ingredient: string }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const { data } = await supabase
        .from("recipes")
        .select("*");

      if (data) {
        const filtered = data.filter((recipe: Recipe) =>
          recipe.ingredients?.join(" ").toLowerCase().includes(ingredient)
        );

        setRecipes(filtered);
      }
    }

    fetchRecipes();
  }, [ingredient]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      <h1 className="text-3xl font-bold mb-4">
        Receitas com {ingredient}
      </h1>

      <p className="text-gray-600 mb-8">
        Descubra receitas simples com {ingredient} que pode preparar com ingredientes que já tem em casa.
      </p>

     <div className="grid md:grid-cols-3 gap-6">
  {recipes.map((recipe) => (
    <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
        
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-40 object-cover"
          />
        )}

        <div className="p-4">
          <h3 className="font-semibold text-lg">
            {recipe.title}
          </h3>
        </div>

      </div>
    </Link>
  ))}
</div>
    </div>
  );
}
