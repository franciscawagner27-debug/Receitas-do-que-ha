import React from 'react'
import type { Recipe } from '../types'

export default function RecipeCard({ r, onOpen }: { r: Recipe, onOpen: () => void }) {
  return (
    <article className="card card-hover overflow-hidden">
      {r.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={r.image}
            alt={r.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{r.title}</h3>
        <p className="text-sm text-stone mt-1">
          {(r as any).timeMinutes ?? (r as any).time_minutes ?? '-'} min
          {Array.isArray((r as any).tags) && (r as any).tags.length > 0 && (
            <> • {(r as any).tags.slice(0, 2).join(' • ')}</>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(r.ingredients || []).slice(0, 4).map((i, idx) => (
            <span key={idx} className="badge">
              {String(i)}
            </span>
          ))}
          {(r.ingredients || []).length > 4 && (
            <span className="badge">+{(r.ingredients || []).length - 4}</span>
          )}
        </div>
        <div className="mt-4">
          <button onClick={onOpen} className="btn btn-ghost">
            Ver receita
          </button>
        </div>
      </div>
    </article>
  )
}
