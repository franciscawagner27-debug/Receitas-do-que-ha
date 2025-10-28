import React from 'react'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span aria-hidden className="text-terracotta text-2xl">🍲</span>
      <div>
        <div className="font-display text-2xl leading-none">ReceitasDoQueHá</div>
        <div className="text-xs text-stone leading-none mt-1">cozinhar com o que há</div>
      </div>
    </div>
  )
}
