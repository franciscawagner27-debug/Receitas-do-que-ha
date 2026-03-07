
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Refeicoes20Pessoas() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Refeições para 20 pessoas";
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
            Refeições para 20 pessoas
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Ideias de refeições que funcionam bem quando se cozinha para
            grupos grandes.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <p>
              Quando se cozinha para muitas pessoas, o ideal é escolher
              pratos que possam ser preparados em quantidade e que sejam
              fáceis de servir.
            </p>

          <h2 className="text-xl font-semibold">
Exemplo de menu para 20 pessoas
</h2>

<h3 className="font-semibold mt-4">Entradas</h3>

<ul className="list-disc ml-6 space-y-2 text-olive">
<li>Pão e tostinhas variados</li>
<li>Focaccia caseira simples</li>
<li>Tábua de queijos e enchidos</li>
<li>Cogumelos salteados</li>
</ul>

<h3 className="font-semibold mt-4">Prato principal</h3>

<ul className="list-disc ml-6 space-y-2 text-olive">
<li>Feijoada à portuguesa</li>
</ul>

<h3 className="font-semibold mt-4">Sobremesas</h3>

<ul className="list-disc ml-6 space-y-2 text-olive">
<li>Crumble de maçã</li>
<li>Mousse de limão</li>
</ul>

            <p className="text-olive mt-6">
              Para organizar melhor a refeição e preparar a casa antes
              dos convidados chegarem, veja também as nossas
              <Link
                to="/dicas/como-organizar-jantar"
                className="underline hover:text-terra ml-1"
              >
                dicas para organizar um jantar em casa
              </Link>.
            </p>

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
