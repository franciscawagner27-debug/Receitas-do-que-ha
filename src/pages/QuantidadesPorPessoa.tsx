import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function QuantidadesPorPessoa() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Quantidades por pessoa";
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
            Quantidades por pessoa
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Quantidades aproximadas de ingredientes para calcular refeições
            de forma simples.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <p>
              Quando se cozinha para várias pessoas, pode ser difícil saber
              quanto preparar. Estas quantidades são apenas uma referência
              aproximada para refeições principais.
            </p>

            <h2 className="text-xl font-semibold">
              Quantidades médias por pessoa
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">

              <li>Arroz: cerca de 70–80 g cru</li>

              <li>Massa: cerca de 80–100 g</li>

              <li>Batatas: cerca de 200–250 g</li>

              <li>Carne: cerca de 150–200 g</li>

              <li>Peixe: cerca de 180–220 g</li>

              <li>Salada: cerca de 50–70 g</li>

              <li>Pão: cerca de 60–80 g</li>

            </ul>

            <h2 className="text-xl font-semibold">
              Exemplo para 4 pessoas
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">

              <li>Arroz: cerca de 300 g</li>

              <li>Massa: cerca de 350 g</li>

              <li>Batatas: cerca de 1 kg</li>

              <li>Carne: cerca de 700 g</li>

            </ul>

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
