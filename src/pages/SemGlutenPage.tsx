import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import type { Recipe } from "../types";
import Header from "../components/Header";

const SemGlutenPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // SEO da página
  document.title = "Receitas Sem Glúten | Receitas do Que Há";

  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute(
      "content",
      "Receitas sem glúten simples e saborosas. Ideais para intolerância ao glúten ou para quem procura opções gluten-free fáceis para o dia a dia."
    );
  }

  fetchRecipes();
}, []);

async function fetchRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("id", { ascending: false });

  if (!error && data) {
    const filtered = (data as any[]).filter((recipe) => {
      const tags = Array.isArray(recipe.tags) ? recipe.tags : [];

      return tags.some((t: string) =>
        t.toString().toLowerCase().includes("semgluten")
      );
    });

    setRecipes(filtered);
  }

  setLoading(false);
}

return (
  <div className="bg-beige min-h-screen text-charcoal font-sans relative">

    <Header onSelect={() => {}} />

    <div className="px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-olive text-center mb-6">
          Receitas Sem Glúten
        </h1>

        <p className="text-center text-charcoal/80 max-w-3xl mx-auto mb-12">
          Descubra receitas sem glúten simples e saborosas, ideais para quem
          tem intolerância ao glúten, doença celíaca ou prefere uma alimentação
          gluten-free. Confirme sempre os rótulos dos ingredientes utilizados.
        </p>

        {loading ? (
          <p className="text-center text-stone">A carregar receitas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-stone">
            Ainda não existem receitas marcadas como sem glúten.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
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
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default SemGlutenPage;
