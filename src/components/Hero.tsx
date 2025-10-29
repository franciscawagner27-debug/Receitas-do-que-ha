import React from "react"

export default function Hero() {
  return (
    <section className="relative w-full h-[420px] overflow-hidden mb-8 rounded-2xl shadow-md">
      <img
        src="/images/mesa-ingredientes.jpg"
        alt="Mesa rústica com ingredientes de cozinha"
        className="w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-beige/80 to-transparent flex flex-col items-center justify-end pb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-olive mb-3 drop-shadow">
          Receitas do que há
        </h1>
        <p className="text-lg md:text-xl text-stone/90 max-w-xl text-center">
          Descobre o que podes cozinhar com o que tens em casa.
        </p>
      </div>
    </section>
  )
}
