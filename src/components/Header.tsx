import React, { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSelect: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSelect }) => {
  
function changeLanguage(lang: string) {
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
  if (!select) return;

  select.value = lang;
  select.dispatchEvent(new Event("change"));
}  
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
  "Sem Glúten",
  "Dias sem Tempo",
];

const [selected, setSelected] = useState("Todas");

const handleClick = (category: string) => {
  setSelected(category);

  const normalized = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (normalized === "dias sem tempo") {
    window.location.href = "/dias-sem-tempo";
    return;
  }

  if (normalized === "sem glúten") {
    window.location.href = "/sem-gluten";
    return;
  }

  onSelect(normalized);
};

  return (
    <header className="bg-beige border-b border-olive/20 sticky top-0 z-50">
     <div className="w-full px-0 py-3">
        <div className="flex items-center gap-3">

  {/* LOGO */}
  <button
    onClick={() => (window.location.href = "/")}
    className="flex items-center flex-shrink-0 ml-8 mr-2"
    aria-label="Ir para a página inicial"
  >
    <img
      src="/icons/icon-512.png"
      alt="Receitas do Que Há"
      className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain notranslate"
    />
  </button>



  {/* CATEGORIAS */}
<nav className="flex-1 max-w-3xl overflow-x-auto no-scrollbar ml-16">
 <div className="flex gap-2 py-1 min-w-max">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => handleClick(category)}
      className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition
        ${
          selected === category
            ? "bg-olive text-white border-olive"
            : "bg-white text-olive border-olive/40 hover:bg-olive/10"
        }`}
    >
      {category}
    </button>
  ))}
</div>
         </nav>

          <Link
  to="/sobre"
  className="ml-4 mr-20 px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition
bg-white text-olive border-olive/40 hover:bg-olive/10"
>
  Sobre
</Link>
          
<div className="flex items-center gap-2 absolute right-4 top-4">
  <button onClick={() => changeLanguage("pt")}>🇵🇹</button>
  <button onClick={() => changeLanguage("en")}>🇬🇧</button>
</div>

<div id="google_translate_element" style={{ display: "none" }}></div>

</div>
</div>
</header>
  );
};

export default Header;
