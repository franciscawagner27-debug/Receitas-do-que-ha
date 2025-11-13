
import React from "react";
import type { Recipe } from "../types";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}


const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, favorites, toggleFavorite }) => {

  // 🔹 Normalizar ingredientes
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
        .flatMap((item) =>
          item
            .toString()
            .split(/\n+/) // divide por quebras de linha dentro de cada item
            .map((i) => i.trim())
            .filter((i) => i.length > 0)
        )
    : typeof recipe.ingredients === "string"
    ? recipe.ingredients
        .split(/\n+/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
    : [];

  // 🔹 Normalizar passos
  const steps = Array.isArray(recipe.steps)
    ? recipe.steps.flatMap((item) =>
        item
          .toString()
          .split(/\n+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )
    : typeof recipe.steps === "string"
    ? recipe.steps
        .split(/\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="p-6 sm:p-8 text-charcoal">
      {recipe.image && (
       <img
  src={recipe.image}
  alt={recipe.title}
  loading="lazy"
  className="w-full h-64 object-cover rounded-xl mb-6"
/>

      )}
<h2 className="text-2xl md:text-3xl font-semibold text-olive mb-6 text-center">
  {recipe.title}
</h2>






      {recipe.time_minutes && (
        <p className="text-stone mb-4">⏱️ {recipe.time_minutes} min</p>
      )}

      {/* INGREDIENTES */}
      <h3 className="text-xl font-semibold text-olive mt-6 mb-2">
        Ingredientes
      </h3>
      <ul className="list-disc list-inside space-y-1 mb-6">
        {ingredients.length > 0 ? (
          ingredients.map((ing, i) => <li key={i}>{ing}</li>)
        ) : (
          <li>Sem ingredientes registados.</li>
        )}
      </ul>

      {/* PASSOS */}
      <h3 className="text-xl font-semibold text-olive mb-2">Passos</h3>
      <ol className="list-decimal list-inside space-y-2 mb-6">
        {steps.length > 0 ? (
          steps.map((step, i) => <li key={i}>{step}</li>)
        ) : (
          <li>Sem passos registados.</li>
        )}
      </ol>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-beige text-charcoal/80 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* ❤️ Guardar ou remover dos favoritos */}
      <button
        onClick={() => toggleFavorite(recipe.id)}
        className="mb-6 px-4 py-2 bg-olive text-white rounded-lg hover:bg-terracotta transition flex items-center gap-2"
      >
        {favorites.includes(recipe.id)
          ? "❤️ Remover dos favoritos"
          : "❤️ Guardar esta receita"}
      </button>
      <div className="text-right">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-xl border border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail; 
