import React, { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSelect: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelect }) => {
 const categories = [
  { label: "Todas", value: "todas" },
  { label: "Favoritas", value: "favoritas" },
  { label: "Entradas", value: "entradas" },
  { label: "Sopas", value: "sopa" },
  { label: "Carne", value: "carne" },
  { label: "Peixe", value: "peixe" },
  { label: "Massas", value: "massas" },
  { label: "Vegetariano", value: "vegetariano" },
  { label: "Sobremesas", value: "sobremesas" },
  { label: "AirFryer", value: "airfryer" },
  { label: "Sem Glúten", value: "sem-gluten", route: "/sem-gluten" },
  { label: "Dias sem Tempo", value: "dias-sem-tempo", route: "/dias-sem-tempo" },
];

const [selected, setSelected] = useState("todas");

const handleClick = (item: any) => {
  setSelected(item.value);

  if (item.route) {
    window.location.href = item.route;
    return;
  }

  onSelect(item.value);
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
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain"
            />
          </button>

          {/* CATEGORIAS */}
          <nav className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 py-1">
             {categories.map((c) => (
  <button
    key={c.value}
    onClick={() => handleClick(c)}
  >
    {c.label}
  </button>
))}
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
