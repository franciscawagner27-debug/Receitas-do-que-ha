import React from "react";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="bg-olive/10 border-b border-olive/30 py-6 mb-10 shadow-soft">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        <Logo />
        <h1 className="text-4xl font-serif text-olive mb-2">
          Receitas do que há
        </h1>
        <p className="text-stone/80 font-sans max-w-xl">
          Inspiração culinária com o que tens em casa 🍲
        </p>
      </div>
    </header>
  );
}
