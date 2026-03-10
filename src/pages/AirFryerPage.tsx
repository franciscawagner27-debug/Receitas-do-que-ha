import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Recipe } from "../types";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AirFryerPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  function handleHeaderSelect(category: string) {
    const c = category.toLowerCase().trim();

    const routes: Record<string, string> = {
      "sem glúten": "/sem-gluten",
      "sem gluten": "/sem-gluten",
      "dias sem tempo": "/dias-sem-tempo",
      "air fryer": "/airfryer",
      "airfryer": "/airfryer",
      "sobre": "/sobre",
    };

    if (routes[c]) {
      navigate(routes[c]);
      return;
    }

    // corrigir caso das sopas
    if (c.includes("sopa")) {
    navigate("/?cat=sopa");
      return;
    }

    navigate(`/?cat=${encodeURIComponent(category)}`);
  }

  useEffect(() => {
    document.title = "Receitas na Air Fryer | Receitas do Que Há";
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    const { data } = await supabase.from("recipes").select("*");

    if (data) {
      const filtered = (data as Recipe[]).filter((recipe) =>
        recipe.tags?.some((tag) => tag.toLowerCase() === "airfryer")
      );

      setRecipes(filtered);
    }
  }

  return (
    <div className="bg-beige min-h-screen text-charcoal">
      <Header onSelect={handleHeaderSelect} />

   {/* HERO */}
<section
  className="relative h-[40vh] sm:h-[45vh] flex flex-col justify-center items-center text-center bg-cover bg-[center_60%]"
  style={{
    backgroundImage: "url('/images/airfryer-hero.jpg')",
  }}
>
  {/* overlay */}
  <div className="absolute inset-0 bg-black/40" />

  <div className="relative z-10 max-w-xl px-6">
    <h1 className="text-3xl sm:text-4xl font-serif text-white mb-3">
      Receitas na Air Fryer
    </h1>

    <p className="text-white/90 text-sm sm:text-base">
      Descubra receitas simples, rápidas e crocantes feitas na Air Fryer.
      Ideias práticas para o dia a dia com menos gordura e muito sabor.
    </p>
  </div>
</section>
<div className="px-6 py-12 max-w-5xl mx-auto">

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
