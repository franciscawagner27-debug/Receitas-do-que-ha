import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dicas() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Dicas de Cozinha";
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
            Dicas de Cozinha
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Sugestões úteis para cozinhar melhor e organizar refeições no dia a dia.
          </p>
        </div>

        {/* Conteúdo em card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
        <div className="space-y-5 leading-relaxed">

<p>
Nesta secção encontra pequenas dicas que ajudam no dia a dia na cozinha —
desde quantidades por pessoa até truques simples que facilitam a preparação
das refeições.
</p>

<p>
São sugestões práticas para cozinhar melhor, evitar desperdício e
organizar refeições com ingredientes comuns.
</p>

<h2 className="text-xl font-semibold mt-6">
Quantidades e organização
</h2>

<ul className="list-disc ml-6 space-y-2 text-olive">

<li>
<Link to="/dicas/quantidades-por-pessoa" className="underline hover:text-terra">
Quantidades por pessoa
</Link>
</li>

<li>
<Link to="/dicas/como-organizar-jantar" className="underline hover:text-terra">
Como organizar um jantar em casa
</Link>
</li>

<li>
<Link to="/dicas/ingredientes-despensa" className="underline hover:text-terra">
Ingredientes que vale a pena ter sempre na despensa
</Link>
</li>

</ul>

<h2 className="text-xl font-semibold mt-6">
Truques úteis na cozinha
</h2>

<ul className="list-disc ml-6 space-y-2 text-olive">

<li>
<Link to="/dicas/truques-de-cozinha" className="underline hover:text-terra">
Truques simples que facilitam cozinhar
</Link>
</li>

<li>Como descascar alho rapidamente</li>
<li>Como evitar que a cebola faça chorar</li>
<li>Como corrigir um prato demasiado salgado</li>

</ul>

</div>
          </div>

          {/* Botões */}
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
              Pesquisar receitas por ingredientes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
