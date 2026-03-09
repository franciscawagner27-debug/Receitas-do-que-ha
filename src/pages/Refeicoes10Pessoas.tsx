import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Refeicoes10Pessoas() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Refeições para 10 pessoas";
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
            Refeições para 10 pessoas
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Ideias simples para cozinhar para 10 pessoas com pratos que
            funcionam bem em quantidade.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <p>
              Cozinhar para 10 pessoas não precisa de ser complicado. O segredo
              é escolher pratos que possam ser preparados em quantidade,
              de preferência no forno ou numa panela grande, e que sejam
              fáceis de servir.
            </p>

            <p>
              Receitas de forno, pratos de arroz e algumas receitas tradicionais
              portuguesas são ideais porque rendem bem e normalmente agradam à
              maioria das pessoas.
            </p>

            <h2 className="text-xl font-semibold mt-6">
              Exemplo de refeição para 10 pessoas
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Cesto de pão variado e tostinhas</li>

              <li>Tábua de queijos</li>

              <li>
                <Link
                  to="/receita/e8c435e4-f7aa-4252-90f0-b1b797f451b3"
                  className="underline hover:text-terra"
                >
                  Guacamole
                </Link>
              </li>

              <li>
                <Link
                  to="/receita/b5a3affa-92f4-488c-be19-4efa4df7cd74"
                  className="underline hover:text-terra"
                >
                  Húmus
                </Link>
              </li>

              <li>
                <Link
                  to="/receita/38efddee-7a90-4c0c-8f32-89723baf94a9"
                  className="underline hover:text-terra"
                >
                  Arroz de frango no forno
                </Link>
              </li>

              <li>Salada simples (alface, tomate e azeite)</li>

              <li>
                <Link
                  to="/receita/fc236f3a-b6d0-4afa-8720-06cb7f36186b"
                  className="underline hover:text-terra"
                >
                  Bolo de chocolate com cobertura
                </Link>
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Outras ideias de pratos principais
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
           
              <li>Bacalhau com natas</li>
              <li>Frango assado com batatas</li>
              <li>Rosbife</li>             
              <li>Lasanha de carne ou de legumes</li>
              <li>Caril de frango</li>
              <li>Arroz de pato</li>
              <li>Massada de peixe</li>
              <li>Lombinhos de porco</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Quantidades aproximadas para 10 pessoas
            </h2>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border border-neutral-200 rounded-xl overflow-hidden">

                <thead className="bg-olive/10 text-charcoal">
                  <tr>
                    <th className="px-4 py-3">Ingrediente</th>
                    <th className="px-4 py-3">Quantidade para 10 pessoas</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-200">

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Arroz</td>
                    <td className="px-4 py-3">700 – 800 g</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Massa</td>
                    <td className="px-4 py-3">800 – 900 g</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Batatas</td>
                    <td className="px-4 py-3">2 – 2,5 kg</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Carne</td>
                    <td className="px-4 py-3">1,5 – 2 kg</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Peixe</td>
                    <td className="px-4 py-3">2 – 2,5 kg</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Salada</td>
                    <td className="px-4 py-3">2 – 3 alfaces grandes</td>
                  </tr>

                  <tr className="bg-white/70">
                    <td className="px-4 py-3">Pão</td>
                    <td className="px-4 py-3">600 – 800 g</td>
                  </tr>

                </tbody>
              </table>
            </div>

            <p className="text-olive mt-6">
              Sempre que possível prepare parte da refeição com antecedência.
              Pratos de forno e sobremesas frias podem ser feitos antes e
              finalizados perto da hora de servir.
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
