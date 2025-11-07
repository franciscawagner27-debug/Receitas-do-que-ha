import React from "react";

interface HeaderProps {
  onSelect: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelect }) => {
  const categories = [
    "Todas",
    "Entradas",
    "Sopas",
    "Carne",
    "Peixe",
    "Massas",
    "Vegetariano",
    "Sobremesas",
  ];

  return (
    <header className="bg-beige border-b border-olive/20 py-4 px-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3 sm:gap-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              console.log("Categoria clicada:", category); // 👈 para ver na consola
              onSelect(category);
            }}
            className="
              text-charcoal hover:text-terracotta font-medium
              transition-colors duration-200
              px-3 py-1 rounded-lg
              focus:outline-none
            "
          >
            {category}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header; 
