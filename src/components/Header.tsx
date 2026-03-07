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
    <div className="w-full px-0 pt-6 pb-2">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mr-0 md:mr-24">

  {/* LOGO */}
 <button
  onClick={() => (window.location.href = "/")}
  className="flex items-center flex-shrink-0 ml-0 md:ml-8 justify-center w-full md:w-auto"
  aria-label="Ir para a página inicial"
>
<img
  src="/icons/icon-512.png"
  alt="Receitas do Que Há"
 className="h-48 w-48 md:h-32 md:w-32 object-contain notranslate md:translate-x-10"
/>
  </button>



  {/* CATEGORIAS */}
<nav className="hidden md:block md:flex-1 md:min-w-0 md:overflow-x-auto md:no-scrollbar md:ml-28">
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
         
<div className="flex items-center justify-between w-full px-6 md:px-0 md:w-auto md:mr-8">
<Link
  to="/sobre"
className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition
bg-olive text-white border border-olive
md:bg-olive/10 md:text-olive md:border-olive/30 md:hover:bg-olive/20"
>
  Sobre
</Link>

 <div className="flex gap-3 ml-2">
  <button onClick={() => changeLanguage("pt")}>🇵🇹</button>
  <button onClick={() => changeLanguage("en")}>🇬🇧</button>
</div>
</div>

<div id="google_translate_element" style={{ display: "none" }}></div>

</div>
</div>

{/* MOBILE BOTTOM NAV */}
<div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-beige/95 backdrop-blur rounded-2xl border border-olive/20 z-50 shadow-lg">
  <div className="flex overflow-x-auto gap-2 px-3 py-2 whitespace-nowrap">
    
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => handleClick(category)}
       className={`px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition
        ${
          selected === category
            ? "bg-olive text-white border-olive"
            : "bg-white text-olive border-olive/40"
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
