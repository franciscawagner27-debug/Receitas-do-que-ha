import React from "react"
import type { Recipe } from "../types"

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-8 animate-fade-up">
      <button
        onClick={onBack}
        className="mb-4 text-olive hover:text-terracotta font-medium"
      >
        ← Voltar
      </button>

      <h2 className="text-3xl font-serif text-terracotta mb-4">{recipe.title}</h2>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {recipe.time_minutes && (
        <p className="text-stone mb-2">⏱️ {recipe.time_minutes} minutos</p>
      )}

      <h3 className="font-semibold text-olive mb-2">Ingredientes</h3>
      <ul className="list-disc list-inside mb-4 text-stone">
        {recipe.ingredients.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>

      <h3 className="font-semibold text-olive mb-2">Modo de preparação</h3>
      <ol className="list-decimal list-inside text-stone space-y-1">
        {recipe.steps.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ol>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {recipe.tags.map((t, i) => (
            <span
              key={i}
              className="bg-beige text-charcoal/80 px-2 py-1 rounded-full text-xs"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
