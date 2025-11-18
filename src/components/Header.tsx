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

    // Página especial "Dias sem Tempo"
    if (normalized === "dias sem tempo") {
      window.location.href = "/dias-sem-tempo";
      return;
    }

    // restantes categorias na homepage
    onSelect(normalized);
  };

  return (
   <header className="bg-beige border-b border-olive/20 py-3 px-2 sm:px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-5">
        {/* LOGO À ESQUERDA */}
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-3 cursor-pointer flex-shrink-0"
        >
          {/* 👇 LOGO EM DOBRO DE TAMANHO */}
          <img
            src="/icons/icon-512.png"
            alt="Receitas do Que Há"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />

          {/* Texto aparece só em ecrãs médios para cima, como tinhas */}
          <div className="leading-tight text-olive hidden md:block">
            <p className="font-serif text-base">Receitas</p>
            <p className="font-serif text-base tracking-wide">DO QUE HÁ</p>
          </div>
        </button>

        {/* CATEGORIAS */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 flex-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleClick(category)}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-200 text-sm sm:text-base
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
