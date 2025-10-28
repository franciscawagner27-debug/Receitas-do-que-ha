import React from "react";
import type { Recipe } from "../types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  if (!recipe) return null; // se recipe for undefined, não tenta renderizar

  return (
    <div className="bg-white shadow-soft rounded-2xl overflow-hidden border border-beige hover:shadow-lg transition-all">
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.title || "Receita"}
          className="w-full h-56 object-cover"
        />
      ) : (
        <div className="w-full h-56 bg-beige flex items-center justify-center text-olive font-sans">
          📷 Sem imagem
        </div>
      )}

      <div className="p-5">
        <h2 className="text-2xl font-serif text-olive mb-2">
          {recipe.title || "Receita sem título"}
        </h2>

        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <p className="text-sm text-stone/80 mb-3 font-sans">
            Ingredientes: {recipe.ingredients.join(", ")}
          </p>
        ) : (
          <p className="text-sm text-stone/60 mb-3 font-sans italic">
            Ingredientes não especificados.
          </p>
        )}

        {recipe.steps && recipe.steps.length > 0 ? (
          <p className="text-sm text-stone/70 font-sans">
            {recipe.steps.slice(0, 2).join(". ")}...
          </p>
        ) : (
          <p className="text-sm text-stone/60 font-sans italic">
            Passos não disponíveis.
          </p>
        )}
      </div>
    </div>
  );
}
