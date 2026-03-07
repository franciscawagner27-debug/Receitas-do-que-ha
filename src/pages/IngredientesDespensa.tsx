import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function IngredientesDespensa() {
  useEffect(() => {
    document.title =
      "Receitas do Que Há – Ingredientes que vale a pena ter sempre na despensa";
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
            Ingredientes que vale a pena ter sempre na despensa
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Alguns ingredientes simples que ajudam a preparar refeições rápidas
            com o que já existe em casa.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <p>
              Ter alguns ingredientes básicos sempre disponíveis na despensa
              facilita muito o dia a dia na cozinha. Com alguns produtos simples
              é possível preparar refeições rápidas sem precisar de ir ao
              supermercado.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              Ingredientes secos essenciais
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Arroz</li>
              <li>Massa</li>
              <li>Batatas</li>
              <li>Farinha</li>
              <li>Açúcar</li>
              <li>Aveia</li>
              <li>Pão ralado</li>
              <li>Leguminosas secas (grão, feijão ou lentilhas)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Conservas úteis
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Atum em lata</li>
              <li>Tomate pelado ou polpa de tomate</li>
              <li>Grão-de-bico</li>
              <li>Feijão (preto, encarnado ou branco)</li>
              <li>Milho</li>
              <li>Sardinhas ou cavala em lata</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Básicos de cozinha
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Azeite</li>
              <li>Vinagre</li>
              <li>Sal</li>
              <li>Pimenta</li>
              <li>Alho</li>
              <li>Cebola</li>
              <li>Louro</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Ingredientes úteis no congelador
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Legumes congelados</li>
              <li>Ervilhas</li>
              <li>Espinafres</li>
              <li>Frango</li>
              <li>Peixe</li>
              <li>Pão</li>
            </ul>

            <p className="text-olive mt-6">
              Com estes ingredientes simples é possível preparar muitas
              refeições rápidas utilizando apenas o que já existe em casa.
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
