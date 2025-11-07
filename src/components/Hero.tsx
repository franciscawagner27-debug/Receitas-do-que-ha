import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-beige overflow-hidden">
      <div className="relative mx-auto w-full h-[70vh] sm:h-[80vh] overflow-hidden">
        {/* Imagem de fundo */}
        <img
          src="/mesa-ingredientes.jpg"
          alt="Mesa rústica com ingredientes de cozinha"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Sombra suave para legibilidade */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Texto centralizado */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="font-serif font-bold leading-tight drop-shadow-2xl text-5xl sm:text-6xl md:text-7xl">
            <span className="block">Receitas</span>
            <span className="block mt-1">DO QUE HÁ</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-100 drop-shadow-md">
            Descubra o que pode cozinhar com o que tem em casa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
