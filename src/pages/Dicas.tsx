import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dicas() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Dicas de Cozinha";
  }, []);

  return (
    <div className="bg-beige text-charcoal">
      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Topo */}
        <div className="flex flex-col items-center text-center mb-10">

          <h1 className="mt-5 text-3xl md:text-4xl font-serif text-charcoal">
            Dicas de Cozinha
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Sugestões úteis para cozinhar melhor, organizar refeições e evitar desperdício.
          </p>
        </div>

        {/* Conteúdo */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-5 leading-relaxed">

            <p>
              Nesta secção encontra pequenas sugestões que ajudam no dia a dia na cozinha —
              desde quantidades por pessoa até truques simples que facilitam a preparação das refeições.
            </p>

            <p>
              São dicas pensadas para cozinhar de forma prática, com ingredientes comuns
              e com resultados que funcionam.
            </p>

            {/* Lista de páginas */}
            <div className="mt-6 space-y-3">

              <Link
                to="/dicas/quantidades-por-pessoa"
                className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
              >
                Quantidades por pessoa
              </Link>

              <Link
                to="/dicas/truques-de-cozinha"
                className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
              >
                Truques de cozinha
              </Link>

              <Link
                to="/dicas/organizar-jantar"
                className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
              >
                Como organizar um jantar em casa
              </Link>

            </div>
          </div>

          {/* Ações */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Link
              to="/"
              className="inline-flex justify-center rounded-xl px-5 py-3 bg-olive text-white hover:opacity-90 transition"
            >
              Voltar à página inicial
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
