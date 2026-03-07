import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ComoOrganizarJantar() {
  useEffect(() => {
    document.title = "Receitas do Que Há – Como organizar um jantar em casa";
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
            Como organizar um jantar em casa
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Algumas dicas simples para receber amigos ou família em casa de forma
            organizada e criar um ambiente acolhedor.
          </p>
        </div>

        {/* Card */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">

          <div className="space-y-6 leading-relaxed">

            <p>
              Receber amigos ou família em casa não precisa de ser complicado.
              Um pouco de organização antecipada ajuda a criar um ambiente
              acolhedor e a aproveitar melhor o momento com os convidados.
            </p>

            <img
              src="/images/jantar-em-casa-mesa.jpg"
              alt="Mesa preparada para jantar em casa com flores e velas"
              className="w-full rounded-xl shadow-sm mt-6 mb-8 object-cover max-h-[420px]"
            />

            <h2 className="text-xl font-semibold mt-6">
              Preparar a casa antes dos convidados chegarem
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Arrumar e limpar as áreas principais da casa</li>
              <li>Preparar a mesa com antecedência</li>
              <li>Garantir que há espaço confortável para todos à mesa</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Organizar a mesa
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Toalha de mesa limpa e, se possível, já engomada</li>
              <li>Pratos, copos e talheres preparados antes</li>
              <li>Guardanapos prontos para usar</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Criar um ambiente acolhedor
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Velas ou iluminação suave tornam o ambiente mais agradável</li>
              <li>Um pequeno ramo de flores na mesa pode dar um toque bonito</li>
              <li>Música ambiente suave pode ajudar a criar uma atmosfera relaxante</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Preparar algumas coisas antes
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Sobremesas podem ser feitas antes do jantar</li>
              <li>Entradas simples podem ficar prontas no frigorífico</li>
              <li>Alguns ingredientes podem ser preparados com antecedência</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">
              Pensar nas bebidas
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-olive">
              <li>Ter água e outras bebidas já frescas</li>
              <li>Colocar vinho ou bebidas no frigorífico com antecedência</li>
              <li>Ter copos preparados antes dos convidados chegarem</li>
            </ul>

            <p className="text-olive mt-6">
              Se estiver a planear um jantar para várias pessoas, veja também as
              nossas
              <Link
                to="/para-grupos"
                className="underline hover:text-terra ml-1"
              >
                ideias de refeições para grupos
              </Link>.
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
