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
   className="w-[120px] h-[120px] rounded-full shadow-md"
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
            <div className="mt-10 text-center">
  <p className="text-olive mb-4">
    Siga o Receitas do Que Há nas redes sociais
  </p>

  <div className="flex justify-center gap-6">
    {/* Instagram */}
    <a
      href="https://www.instagram.com/receitasdoqueha/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram Receitas do Que Há"
      className="text-olive hover:text-terra transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.75 1.5a.75.75 0 100 1.5.75.75 0 000-1.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
      </svg>
    </a>

    {/* Facebook */}
    <a
      href="https://www.facebook.com/receitasdoqueha/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook Receitas do Que Há"
      className="text-olive hover:text-terra transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 10-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.88h-2.34v6.99A10 10 0022 12z"/>
      </svg>
    </a>
  </div>
</div>          </div>

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
