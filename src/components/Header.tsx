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
    "AirFryer",
    "Dias sem Tempo",
  ];

  const [selected, setSelected] = useState("Todas");

  const handleClick = (category: string) => {
    setSelected(category);

    const normalized = category.toLowerCase();

    if (normalized === "dias sem tempo") {
      window.location.href = "/dias-sem-tempo";
      return;
    }

    onSelect(normalized);
  };

  return (
    <header className="bg-beige border-b border-olive/20 py-4 px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-6">

        {/* LOGO NO CANTO ESQUERDO */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <img
            src="/icons/icon-512.png"
            alt="Receitas do Que Há"
            className="w-10 h-10 object-contain"
          />
          <div className="leading-tight text-olive hidden sm:block">
            <p className="font-serif text-sm">Receitas</p>
            <p className="font-serif text-sm tracking-wide">DO QUE HÁ</p>
          </div>
        </button>

        {/* CATEGORIAS */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 flex-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleClick(category)}
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

      </div>
    </header>
  );
};

export default Header;
