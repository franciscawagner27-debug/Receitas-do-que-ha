import React from "react";
import type { Recipe } from "../types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white shadow-soft rounded-2xl overflow-hidden border border-beige hover:shadow-lg transition-all">
      <img
        src={recipe.image || "https://via.placeholder.com/400x250?text=Receita"}
        alt={recipe.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-5">
        <h2 className="text-2xl font-serif text-olive mb-2">{recipe.title}</h2>
        <p className="text-sm text-stone/80 mb-3 font-sans">
          Ingredientes: {recipe.ingredients.join(", ")}
        </p>
        <p className="text-sm text-stone/70 font-sans">
          {recipe.steps.slice(0, 2).join(". ")}...
        </p>
      </div>
    </div>
  );
}
