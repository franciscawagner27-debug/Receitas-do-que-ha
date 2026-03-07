import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Refeicoes10Pessoas() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Refeições para 10 pessoas";
  }, []);

  return (
    <div className="bg-beige text-charcoal">
      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Topo com logo */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/icons/icon-180.png"
              alt="Receitas do Que Há"
              className="w-[120px] h-[120px] rounded-full shadow-md"
            />
          </Link>

          <h1 className="mt-5 text-3xl md:text-4xl font-serif text-charcoal">
            Refeições para 10 pessoas
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Ideias simples para cozinhar para 10 pessoas com pratos que
            funcionam bem em quantidade.
          </p>
        </div>

        {/* Conteúdo */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-5 leading-relaxed">

            <p>
              Quando se cozinha para várias pessoas, o mais importante é escolher
              pratos que sejam fáceis de preparar em quantidade e que funcionem
              bem em travessas grandes ou panelas grandes.
            </p>

            <p>
              Pratos de forno, receitas de arroz ou pratos de panela costumam
              ser boas opções porque são fáceis de preparar e agradam à maioria
              das pessoas.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              Tipos de pratos que funcionam bem para grupos
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Pratos de massa no forno</li>
              <li>Receitas de arroz de forno</li>
              <li>Frango assado com batatas</li>
              <li>Pratos de bacalhau no forno</li>
              <li>Receitas de panela grande como feijoada</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Quantidades aproximadas para 10 pessoas
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Arroz: cerca de 700–800 g</li>
              <li>Massa: cerca de 900 g</li>
              <li>Batatas: cerca de 2 kg</li>
              <li>Carne: cerca de 1.5 a 2 kg</li>
              <li>Peixe: cerca de 2 kg</li>
            </ul>

          </div>

          {/* Botões */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Link
              to="/para-grupos"
              className="inline-flex justify-center rounded-xl px-5 py-3 bg-olive text-white hover:opacity-90 transition"
            >
              Ver mais ideias para grupos
            </Link>

            <Link
              to="/"
              className="inline-flex justify-center rounded-xl px-5 py-3 border border-olive text-olive hover:bg-olive/10 transition"
            >
              Pesquisar receitas
            </Link>

          </div>

        </section>
      </main>
    </div>
  );
}
