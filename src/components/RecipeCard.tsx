
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
      className="group cursor-pointer bg-white text-charcoal rounded-2xl shadow-md border border-stone/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-beige/40 relative z-10 min-h-[280px]"
    >
      {/* imagem */}
      <div className="relative h-40 w-full bg-stone/10">
        {r.image ? (
          <img
            src={r.image}
            alt={r.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone/60 text-sm italic">
            (sem imagem)
          </div>
        )}
      </div>

      {/* conteúdo */}
      <div className="p-4">
        <h2 className="text-lg font-serif text-olive mb-2 leading-snug line-clamp-2">
          {r.title}
        </h2>

        {r.time_minutes && (
          <p className="text-xs text-stone/80 mb-2">
            ⏱️ {r.time_minutes} minutos
          </p>
        )}

        {Array.isArray(r.ingredients) && r.ingredients.length > 0 && (
          <p className="text-sm text-stone/90 line-clamp-2 mb-3">
            {r.ingredients.slice(0, 5).join(", ")}
            {r.ingredients.length > 5 ? "..." : ""}
          </p>
        )}

        {Array.isArray(r.tags) && r.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
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
