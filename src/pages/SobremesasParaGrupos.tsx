import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SobremesasParaGrupos() {
  useEffect(() => {
    document.title = "Sobremesas para muitas pessoas – Receitas do Que Há";
  }, []);

  return (
    <div className="bg-beige text-charcoal">
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Topo */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src="/icons/icon-180.png"
              alt="Receitas do Que Há"
              className="w-[120px] h-[120px] rounded-full shadow-md"
            />
          </Link>

          <h1 className="mt-5 text-3xl md:text-4xl font-serif text-charcoal">
            Sobremesas para muitas pessoas
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Quando se organiza um jantar ou uma festa com muitos convidados,
            é importante escolher sobremesas que rendam bem e que sejam fáceis
            de preparar em quantidade. Estas ideias funcionam bem para grupos
            grandes e podem muitas vezes ser feitas de véspera.
          </p>
        </div>

        {/* Conteúdo */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          {/* Sobremesas de travessa */}
          <h2 className="text-xl font-semibold mb-4">
            Sobremesas de travessa
          </h2>

          <ul className="space-y-3 mb-8 list-disc pl-5">
            <li>Tiramisu de travessa (ideal para 10–12 pessoas)</li>
            <li>Cheesecake sem forno de frutos vermelhos (10 pessoas)</li>
            <li>Mousse de chocolate em taça grande (10–12 pessoas)</li>
            <li>Bolo de bolacha tradicional (10 pessoas)</li>
            <li>Leite-creme de travessa (10–12 pessoas)</li>
          </ul>

          {/* Sobremesas de tabuleiro */}
          <h2 className="text-xl font-semibold mb-4">
            Sobremesas de tabuleiro
          </h2>

          <ul className="space-y-3 mb-8 list-disc pl-5">
            <li>Bolo de chocolate de tabuleiro (15–20 pessoas)</li>
            <li>Brownies de tabuleiro (15 pessoas)</li>
            <li>Bolo de iogurte de tabuleiro (12–15 pessoas)</li>
            <li>Crumble de maçã grande (10–12 pessoas)</li>
          </ul>

          {/* Sobremesas frescas */}
          <h2 className="text-xl font-semibold mb-4">
            Sobremesas frescas para grupos
          </h2>

          <ul className="space-y-3 mb-8 list-disc pl-5">
            <li>Salada de fruta grande (15–20 pessoas)</li>
            <li>Pavlova grande com fruta (10–12 pessoas)</li>
            <li>Mousse de maracujá grande (10–12 pessoas)</li>
            <li>Gelatina com fruta e natas (15 pessoas)</li>
          </ul>

          {/* Botões */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Link
              to="/para-grupos"
              className="inline-flex justify-center rounded-xl px-5 py-3 bg-olive text-white hover:opacity-90 transition"
            >
              Voltar à página de grupos
            </Link>

            <Link
              to="/"
              className="inline-flex justify-center rounded-xl px-5 py-3 border border-olive text-olive hover:bg-olive/10 transition"
            >
              Ver receitas
            </Link>

          </div>

        </section>
      </main>
    </div>
  );
}
