import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TruquesCozinha() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Truques simples de cozinha";
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
            Truques simples que facilitam cozinhar
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Pequenos truques de cozinha que ajudam no dia a dia e tornam a
            preparação das refeições mais fácil.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <h2 className="text-xl font-semibold">
              Como descascar alho rapidamente
            </h2>

            <p>
              Coloque os dentes de alho numa tábua e pressione ligeiramente com
              a lâmina de uma faca larga. A casca solta-se facilmente e o alho
              fica pronto a usar.
            </p>

            <h2 className="text-xl font-semibold">
              Como evitar que a cebola faça chorar
            </h2>

            <p>
              Corte a cebola perto de uma fonte de água ou coloque-a alguns
              minutos no frigorífico antes de cortar. Isso reduz a libertação
              de vapores que irritam os olhos.
            </p>

            <h2 className="text-xl font-semibold">
              Como corrigir um prato demasiado salgado
            </h2>

            <p>
              Se um prato ficar demasiado salgado, pode equilibrar o sabor
              adicionando um pouco de água, mais legumes ou um ingrediente
              neutro como batata ou arroz.
            </p>

            <h2 className="text-xl font-semibold">
              Como cozinhar massa no ponto certo
            </h2>

            <p>
              Use sempre bastante água e sal na cozedura da massa. Prove alguns
              minutos antes do tempo indicado na embalagem para garantir que
              fica al dente.
            </p>

            <h2 className="text-xl font-semibold">
              Como aproveitar melhor ervas frescas
            </h2>

            <p>
              Para conservar ervas frescas por mais tempo, guarde-as no
              frigorífico envolvidas num papel de cozinha ligeiramente húmido.
            </p>

          </div>

          {/* Botões */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">

            <Link
              to="/dicas"
              className="inline-flex justify-center rounded-xl px-5 py-3 bg-olive text-white hover:opacity-90 transition"
            >
              Ver mais dicas
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
