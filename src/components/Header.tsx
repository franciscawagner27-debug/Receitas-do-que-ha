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
   <header className="bg-beige border-b border-olive/20 py-2 px-4 sticky top-0 z-50">
  <div className="max-w-6xl mx-auto flex flex-col gap-2">

    {/* LOGO — agora fica no topo no telemóvel */}
    <div className="flex items-center justify-start">
      <button
        onClick={() => (window.location.href = "/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src="/icons/icon-512.png"
          alt="Receitas do Que Há"
          className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
        />

        {/* texto só no desktop */}
        <div className="leading-tight text-olive hidden md:block">
          <p className="font-serif text-base">Receitas</p>
          <p className="font-serif text-base tracking-wide">DO QUE HÁ</p>
        </div>
      </button>
    </div>

    {/* CATEGORIAS — Mobile muito mais compacto e organizado */}
    <div className="flex flex-wrap justify-center gap-1 sm:gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleClick(category)}
          className={`
            px-2 py-1 rounded-full font-medium transition-all duration-200
            text-[13px] sm:text-base
            ${
              selected === category
                ? "bg-olive text-white shadow-sm"
                : "text-olive hover:text-terracotta"
            }
          `}
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
