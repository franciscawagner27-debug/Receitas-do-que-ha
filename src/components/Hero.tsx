import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      className="relative w-full h-[70vh] bg-beige overflow-hidden flex items-center justify-center"
    >
      {/* Imagem de fundo */}
      <img
        src="/mesa-ingredientes.jpg"
        alt="Mesa rústica com ingredientes de cozinha"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Camada de sombra leve sobre a imagem */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Conteúdo do hero */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-tight drop-shadow-lg">
          <span className="block">Receitas</span>
          <span className="block">DO QUE HÁ</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-100 drop-shadow-md">
          Descubra o que pode cozinhar com o que tem em casa.
        </p>
      </div>
    </section>
  );
};

export default Hero;
