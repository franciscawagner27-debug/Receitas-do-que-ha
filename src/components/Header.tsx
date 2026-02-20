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
    <header className="bg-beige border-b border-olive/20 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-2 sm:px-4 py-3">
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <button
            onClick={() => (window.location.href = "/")}
           className="flex items-center flex-shrink-0 mr-4 sm:mr-6"
            aria-label="Ir para a página inicial"
          >
            <img
              src="/icons/icon-512.png"
              alt="Receitas do Que Há"
              className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain"
            />
          </button>

          {/* CATEGORIAS */}
          <nav className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 py-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleClick(category)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200",
                    selected === category
                      ? "bg-olive text-white shadow-sm"
                      : "bg-white/50 text-olive hover:bg-white/70 hover:text-terracotta",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
