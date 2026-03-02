import { useEffect } from "react";

export default function Sobre() {
  // SEO básico sem dependências (funciona bem)
  useEffect(() => {
    document.title = "Receitas do Que Há – Sobre o Projeto";
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif text-charcoal mb-6">
        Sobre o Receitas do Que Há
      </h1>

      <div className="space-y-4 text-charcoal leading-relaxed">
        <p>
          O <strong>Receitas do Que Há</strong> é um projeto português criado
          para ajudar a cozinhar com os ingredientes que já tem em casa.
        </p>

        <p>
          A ideia é simples: facilitar o dia a dia, reduzir desperdício e
          transformar o que existe na despensa em refeições práticas, saborosas
          e com ingredientes comuns.
        </p>

        <p>
          Pode pesquisar por ingredientes, explorar categorias e descobrir
          sugestões pensadas para diferentes rotinas — desde refeições rápidas a
          opções mais completas.
        </p>

        <p>
          Se tiver sugestões, parcerias ou feedback, pode contactar:
          {" "}
          <a
            href="mailto:contacto@receitasdoqueha.pt"
            className="underline hover:text-terra transition"
          >
            contacto@receitasdoqueha.pt
          </a>
          .
        </p>
      </div>
    </main>
  );
}
