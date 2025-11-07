import React from "react"

const categories = [
  "Todas",
  "Entradas",
  "Sopas",
  "Carne",
  "Peixe",
  "Massas",
  "Vegetariano",
  "Sobremesas"
]

export default function Header({ onSelect }: { onSelect: (cat: string) => void }) {
  return (
    <header className="bg-beige py-3 shadow-sm sticky top-0 z-50">
      <nav className="flex flex-wrap justify-center gap-4 md:gap-8 text-olive font-medium text-lg">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="hover:text-terracotta transition-colors"
          >
            {cat}
          </button>
        ))}
      </nav>
    </header>
  )
}
