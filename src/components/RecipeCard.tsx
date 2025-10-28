import React from 'react'
import type { Recipe } from '../types'

interface RecipeCardProps {
  r: Recipe
  onOpen: (recipe: Recipe) => void
}

export default function RecipeCard({ r, onOpen }: RecipeCardProps) {
  return (
    <div
      className="card cursor-pointer p-4 card-hover"
      onClick={() => onOpen(r)}
    >
      {r.image && (
        <img
          src={r.image}
          alt={r.title}
          className="rounded-xl mb-3 w-full h-48 object-cover"
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{r.title}</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {r.tags?.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-stone">
        {r.ingredients.slice(0, 3).join(', ')}...
      </p>
    </div>
  )
}
