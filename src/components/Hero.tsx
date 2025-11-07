import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-beige overflow-hidden">
      {/* Cartão com a imagem e o título por cima */}
      <div className="relative mx-4 mt-6 mb-10 rounded-3xl shadow-xl overflow-hidden">
        {/* Imagem de fundo */}
        <img
          src="/mesa-ingredientes.jpg"
          alt="Mesa rústica com ingredientes de cozinha"
          className="w-full h-[260px] sm:h-[340px] object-cover"
        />

        {/* Leve escurecimento para o texto ler bem */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Texto por cima da imagem */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1
            className="
              font-serif font-bold leading-none drop-shadow-xl
              text-white whitespace-normal
              text-5xl sm:text-6xl md:text-7xl
            "
          >
            {/* Linha 1 */}
            Receitas
            <br />
            {/* Linha 2 */}
            <span className="text-5xl sm:text-6xl md:text-7xl">
              DO QUE HÁ
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-100 drop-shadow-md">
            Descubra o que pode cozinhar com o que tem em casa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
