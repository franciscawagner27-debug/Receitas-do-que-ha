import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RecipeDetail from "../components/RecipeDetail";
import Header from "../components/Header"; 
import type { Recipe } from "../types";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Favoritos (para manter o comportamento igual ao da HomePage)
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
    <div className="min-h-screen bg-beige text-charcoal font-sans">
      <Header onSelect={() => {}} />

      <main className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-6 mt-10 mb-16">
        <RecipeDetail
          recipe={recipe}
          onBack={() => window.history.back()}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </main>

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
      </footer>
    </div>
  );
}
