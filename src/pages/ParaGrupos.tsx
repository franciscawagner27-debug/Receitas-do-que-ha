import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ParaGrupos() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Cozinhar para Grupos";
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
            Cozinhar para Grupos
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Ideias e sugestões para cozinhar para várias pessoas — almoços,
            jantares, festas ou reuniões em casa.
          </p>
          <img
  src="/images/jantar-em-grupo.jpg"
  alt="Jantar em grupo à mesa com amigos"
  className="w-full rounded-xl shadow-sm mt-6 mb-8 object-cover max-h-[420px]"
/>  
        </div>
     

        {/* Conteúdo em card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
          <div className="space-y-4 leading-relaxed">

            <p>
              Quando se cozinha para várias pessoas, o mais importante é escolher
              pratos que funcionem bem em quantidade e que possam ser preparados
              com alguma antecedência.
            </p>

            <p>
              Nesta secção encontra sugestões de refeições e ideias de menus que
              funcionam bem para grupos.
            </p>

    {/* Links */}
<div className="mt-6 space-y-3">

  <Link
    to="/para-grupos/refeicoes-10-pessoas"
    className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
  >
    Refeições para 10 pessoas
  </Link>

  <Link
    to="/para-grupos/refeicoes-20-pessoas"
    className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
  >
    Refeições para 20 pessoas
  </Link>

  <Link
    to="/para-grupos/pratos-que-rendem"
    className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
  >
    Pratos que rendem para muitas pessoas
  </Link>

  <Link
    to="/para-grupos/sobremesas-para-grupos"
    className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
  >
    Sobremesas para muitas pessoas
  </Link>

  <Link
    to="/dicas/como-organizar-jantar"
    className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
  >
    Como organizar um jantar em casa
  </Link>

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
