import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Recipe } from "../types";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const AirFryerPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    document.title = "Receitas na Air Fryer | Receitas do Que Há";
    fetchRecipes();
  }, []);

 async function fetchRecipes() {
  const { data } = await supabase
    .from("recipes")
    .select("*");

  if (data) {
    const filtered = (data as Recipe[]).filter((recipe) =>
      recipe.tags?.some((tag) => tag.toLowerCase() === "airfryer")
    );

    setRecipes(filtered);
  }
}
  

  return (
    <div className="bg-beige min-h-screen text-charcoal">
      <Header onSelect={undefined as any} />

      <div className="px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif text-olive text-center mb-6">
          Receitas na Air Fryer
        </h1>

        <p className="text-center text-charcoal/80 mb-10">
          Descubra receitas simples e rápidas feitas na Air Fryer.
        </p>

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
      </div>
    </div>
  );
};

export default AirFryerPage;
