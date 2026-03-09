import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ComoOrganizarJantar() {
  useEffect(() => {
    document.title =
      "Como organizar um jantar em casa – Receitas do Que Há";
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
            Como organizar um jantar em casa
          </h1>

          <p className="mt-3 max-w-2xl text-olive">
            Dicas simples para receber convidados com menos stress e preparar
            um jantar em casa de forma prática, organizada e agradável.
          </p>

          <img
            src="/images/jantar-em-casa-mesa.jpg"
            alt="Mesa posta para um jantar em casa"
            className="w-full rounded-xl shadow-sm mt-6 mb-8 object-cover max-h-[420px]"
          />
        </div>

        {/* Conteúdo */}
        <section className="bg-white/60 backdrop-blur rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
          <div className="space-y-8 leading-relaxed">
            <div>
              <p>
                Organizar um jantar em casa para amigos ou família não precisa
                de ser complicado. Com algum planeamento e preparação
                antecipada, é possível receber convidados com tranquilidade e
                aproveitar o momento à mesa.
              </p>

              <p className="mt-4">
                Preparar a mesa, escolher pratos que possam ser feitos com
                antecedência e organizar bebidas e sobremesas são alguns dos
                segredos para um jantar simples e agradável.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                O segredo está no planeamento
              </h2>
              <p>
                A melhor forma de evitar stress é preparar o máximo possível
                antes dos convidados chegarem. Assim, quando o jantar começar,
                já está tudo pronto e pode aproveitar a companhia.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Preparar a casa antes dos convidados chegarem
              </h2>
              <p>
                Arrumar e limpar as áreas principais da casa ajuda a criar um
                ambiente mais agradável para todos.
              </p>
              <p className="mt-4">
                Também é importante garantir que existe espaço confortável para
                todos à mesa.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Organizar a mesa com antecedência
              </h2>
              <p>
                Prepare tudo o que for necessário para a mesa antes da hora do
                jantar.
              </p>

              <ul className="mt-4 space-y-2 list-disc pl-5">
                <li>Engomar a toalha de mesa com antecedência</li>
                <li>Pratos, copos e talheres preparados</li>
                <li>Guardanapos prontos a usar</li>
              </ul>

              <p className="mt-4">
                O ideal é que a mesa esteja completamente posta quando os
                convidados chegarem, evitando trabalho de última hora.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Criar um ambiente acolhedor
              </h2>

              <ul className="space-y-2 list-disc pl-5">
                <li>Velas ou iluminação suave tornam o ambiente mais agradável</li>
                <li>Um pequeno ramo de flores na mesa pode dar um toque bonito</li>
                <li>
                  Música ambiente suave ajuda a criar uma atmosfera relaxante
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Escolher pratos que possam ser preparados antes
              </h2>
              <p>
                Sempre que possível, escolha pratos que possam ser preparados
                com antecedência.
              </p>
              <p className="mt-4">
                O ideal é que o prato principal já esteja pronto, sendo apenas
                necessário aquecer na hora de servir.
              </p>
              <p className="mt-4">
                Assim pode passar mais tempo com os convidados e menos tempo na
                cozinha.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Preparar entradas com antecedência
              </h2>
              <p>
                As entradas devem estar prontas antes dos convidados chegarem.
              </p>

              <p className="mt-4">Entradas simples funcionam muito bem, como:</p>

              <ul className="mt-4 space-y-2 list-disc pl-5">
                <li>pão</li>
                <li>queijo</li>
                <li>presunto</li>
                <li>azeitonas</li>
                <li>patês</li>
              </ul>

              <p className="mt-4">
                Assim os convidados podem petiscar enquanto todos chegam e o
                ambiente fica mais descontraído.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Preparar a sobremesa antes do jantar
              </h2>
              <p>
                Sempre que possível, a sobremesa deve estar preparada antes do
                jantar começar.
              </p>

              <p className="mt-4">
                Sobremesas como <strong>mousse</strong>, <strong>tiramisu</strong>,{" "}
                <strong>cheesecake</strong> ou <strong>bolo de bolacha</strong>{" "}
                podem ser feitas com antecedência e mantidas no frigorífico até
                à hora de servir.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Pensar nas bebidas
              </h2>
              <p>Prepare as bebidas antes dos convidados chegarem.</p>

              <ul className="mt-4 space-y-2 list-disc pl-5">
                <li>Ter água e outras bebidas já frescas</li>
                <li>Colocar vinho ou outras bebidas no frigorífico com antecedência</li>
                <li>Ter gelo disponível</li>
              </ul>

              <p className="mt-4">
                Ter tudo preparado evita interrupções durante o jantar.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Exemplo de menu simples para um jantar em casa
              </h2>

              <p>
                Se estiver sem ideias sobre o que servir, um menu simples pode
                funcionar muito bem:
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-charcoal">Entrada</h3>
                  <ul className="mt-2 space-y-1 list-disc pl-5">
                    <li>pão</li>
                    <li>queijo</li>
                    <li>presunto</li>
                    <li>azeitonas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-charcoal">Prato principal</h3>
                  <p className="mt-2">
                    Um prato que possa ser preparado antes, como lasanha,
                    empadão ou arroz de forno.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-charcoal">Acompanhamento</h3>
                  <p className="mt-2">Salada simples.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-charcoal">Sobremesa</h3>
                  <ul className="mt-2 space-y-1 list-disc pl-5">
                    <li>mousse de chocolate</li>
                    <li>tiramisu</li>
                    <li>cheesecake</li>
                    <li>bolo de bolacha</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4">
                Este tipo de menu é simples de preparar e funciona bem quando
                se recebe convidados em casa.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-serif text-charcoal mb-3">
                Mais ideias para jantares com várias pessoas
              </h2>

              <div className="mt-4 space-y-3">
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
                  to="/para-grupos/sobremesas-para-grupos"
                  className="block p-4 rounded-xl border border-neutral-200 hover:bg-olive/5 transition"
                >
                  Sobremesas para muitas pessoas
                </Link>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/para-grupos"
              className="inline-flex justify-center rounded-xl px-5 py-3 bg-olive text-white hover:opacity-90 transition"
            >
              Voltar à página de grupos
            </Link>

            <Link
              to="/?cat=sobremesas"
              className="inline-flex justify-center rounded-xl px-5 py-3 border border-olive text-olive hover:bg-olive/10 transition"
            >
              Ver receitas de sobremesas
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
