import React, { useState } from "react";

interface HeaderProps {
  onSelect: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelect }) => {
  const categories = [
    "Todas",
    "Favoritas",
    "Entradas",
    "Sopas",
    "Carne",
    "Peixe",
    "Massas",
    "Vegetariano",
    "Sobremesas",
    "AirFryer",        // ⭐ NOVA CATEGORIA
    "Dias sem Tempo",  // ⭐ NOVA CATEGORIA
  ];

  const [selected, setSelected] = useState("Todas");

  return (
    <header className="bg-beige border-b border-olive/20 py-4 px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3 sm:gap-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelected(category);
              onSelect(category.toLowerCase()); // 🔥 mantém a lógica original
            }}
            className={`px-3 py-1 rounded-full font-medium transition-all duration-200
              ${
                selected === category
                  ? "bg-olive text-white shadow-sm"
                  : "text-olive hover:text-terracotta"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
