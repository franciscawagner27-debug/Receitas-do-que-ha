import React from "react";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="relative w-full h-[420px] overflow-hidden mb-8 rounded-2xl shadow-md">
      <img
        src="/images/mesa-ingredientes.jpg"
        alt="Mesa rústica com ingredientes de cozinha"
        className="w-full h-full object-cover brightness-95 saturate-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-beige/50 to-transparent flex flex-col items-center justify-end pb-10 px-4">
        <Logo />
        <h1 className="text-4xl md:text-5xl font-serif text-olive drop-shadow-[0_3px_6px_rgba(255,255,255,0.7)] mb-3">
          Receitas do que há
        </h1>
        <p className="text-lg md:text-xl text-stone/90 max-w-xl text-center">
          Descobre o que podes cozinhar com o que tens em casa.
        </p>
      </div>
    </section>
  );
}
