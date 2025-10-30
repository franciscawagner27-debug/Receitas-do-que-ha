import React from "react"
import type { Recipe } from "../types"

interface RecipeCardProps {
  r: Recipe
  onOpen?: (recipe: Recipe) => void
}

export default function RecipeCard({ r, onOpen }: RecipeCardProps) {
  return (
    <article
      onClick={() => onOpen?.(r)}
      className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-stone/20 overflow-hidden transition hover:shadow-md hover:-translate-y-0.5"
    >
      {/* imagem */}
      <div className="relative h-40 w-full bg-beige">
        {r.image ? (
          <img
            src={r.image}
            alt={r.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone/60 text-sm">
            sem imagem
          </div>
        )}
      </div>

      {/* conteúdo */}
      <div className="p-4">
        <h2 className="text-lg font-serif text-olive mb-2 line-clamp-2">
          {r.title}
        </h2>

        {r.time_minutes && (
          <p className="text-xs text-stone/70 mb-1">
            ⏱️ {r.time_minutes} minutos
          </p>
        )}

        {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
          <p className="text-sm text-stone/80 line-clamp-2">
            {r.ingredients.slice(0, 4).join(", ")}
            {r.ingredients.length > 4 ? "..." : ""}
          </p>
        )}

        {Array.isArray(r.tags) && r.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {r.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full bg-olive/10 text-olive"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
