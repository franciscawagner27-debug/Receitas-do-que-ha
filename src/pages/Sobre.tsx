import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Sobre() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Sobre o Projeto";
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
       className="w-26 h-26 rounded-full shadow-md"
            />
          </Link>

          <h1 className="mt-5 text-3xl md:text-4xl font-serif text-charcoal">
            Sobre o Receitas do Que Há
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Um projeto português para cozinhar com os ingredientes que já tem em casa.
          </p>
        </div>

        {/* Conteúdo em “card” */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
          <div className="space-y-4 leading-relaxed">
            <p>
              O <strong>Receitas do Que Há</strong> nasceu para facilitar o dia a dia:
              pesquisar por ingredientes e encontrar ideias práticas, com sabores portugueses e
              ingredientes comuns.
            </p>

            <p>
              A ideia é simples: reduzir desperdício, poupar tempo e transformar o que existe na
              despensa em refeições que funcionam.
            </p>

            <p>
              No site pode pesquisar por ingredientes, explorar categorias e descobrir sugestões
              adaptadas a diferentes rotinas — desde refeições rápidas a opções mais completas.
            </p>

            <p className="text-olive">
              Para sugestões, parcerias ou feedback:{" "}
              <a
                href="mailto:contacto@receitasdoqueha.pt"
                className="underline hover:text-terra transition"
              >
                contacto@receitasdoqueha.pt
              </a>
              .
            </p>
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
              Pesquisar receitas por ingredientes
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
