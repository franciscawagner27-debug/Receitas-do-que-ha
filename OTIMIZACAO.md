# Otimização do site — 22 de outubro de 2026

Versão isolada de `franciscawagner27-debug/Receitas-do-que-ha`, baseada em
`1736267bd974478f8cab1f81939e3a1912e13fb8`. Não contém alterações da aplicação móvel.

## Implementação

- Catálogo completo partilhado entre Home, Dias sem Tempo, AirFryer, Sem Glúten e ambas as famílias de páginas por ingrediente. Cache em memória e localStorage durante cinco minutos, pedidos simultâneos reunidos e paginação da API sem truncar o catálogo. A paginação visual de 30 cartões na Home mantém-se.
- Cada página conserva os seus filtros, pesquisa e normalização de etiquetas. Recebe uma cópia independente do catálogo. Alterações bem-sucedidas no Admin invalidam a cache; sessões e favoritos são preservados.
- Fotografias dos cartões e detalhes só recebem um URL de rede quando entram no ecrã. Os banners visíveis carregam imediatamente.
- Variantes WebP estáticas, sem cortes adicionais nem ampliação, até 480/960/1600 px, limitadas pelas dimensões originais. `srcset` permite escolher o tamanho conforme o ecrã. São incluídas 334 variantes para 116 imagens, totalizando 47,87 MB.
- Os ficheiros são servidos pelo próprio site em `/optimized-recipes/`, com nomes derivados do conteúdo e cache imutável. Não se usa transformação de imagens do Supabase nem um novo serviço pago. O tráfego otimizado passa para a hospedagem Vercel existente e continua sujeito às quotas desse plano.
- Se faltar uma variante ou aparecer um URL novo, o original continua disponível com carregamento diferido. Receitas novas não ficam ocultas. Para também otimizar imagens novas, voltar a gerar as variantes numa versão de preparação. Se uma imagem for substituída mantendo exatamente o mesmo URL, regenerar as variantes nessa publicação ou usar um novo URL; a cópia estática não deteta substituições remotas automaticamente.

## Verificação local

```sh
npm ci
npm test
npm run build
```

Os testes unitários não contactam o Supabase. A comparação no navegador está em `../evidence/benchmark.mjs`: usa os 112 registos e os originais guardados localmente, servidores de teste em 4310–4312, e bloqueia pedidos externos, Auth, escrita e IA. As compilações de teste em `../evidence/dist-before` e `dist-after` usam um endpoint local. Não publicar essas compilações. A pasta `site/dist` foi compilada separadamente com as variáveis públicas do projeto; para publicar, construir novamente no Vercel com as configurações já existentes.

O TypeScript global do projeto já apresenta erros anteriores; os mesmos diagnósticos permanecem antes e depois. Os novos módulos passam a verificação estrita isolada. O build Vite passa, incluindo numa cópia onde foi aplicado o patch futuro da IA sem o modificar.

Para regenerar variantes a partir do backup local, executar na pasta deste site:

```sh
npm run images:generate -- ../evidence/originals.json ../originals
```

Esse comando é inteiramente local. O inventário deve ser atualizado com os originais das imagens novas antes de uma regeneração posterior. Não carrega nem altera ficheiros no Storage.

## Publicação e reversão — ainda não executadas

1. Obter autorização para sincronizar/publicar. Confirmar o HEAD atual do repositório e integrar apenas estes ficheiros numa versão separada, preservando trabalho entretanto realizado e o patch da IA. Incluir o manifesto e todos os novos ficheiros WebP; excluir `.env.local`, backups, ferramentas e fixtures.
2. Manter as variáveis Vercel existentes e criar uma Preview autorizada. Confirmar que os WebP devolvem imagens com o cabeçalho de cache esperado; verificar em Safari/iPhone e desktop o aspeto, a pesquisa, todas as categorias, favoritos e detalhe. Confirmar as quotas atuais da hospedagem Vercel.
3. Validar o acesso Admin por Magic Link no domínio autorizado. A lógica de autenticação não foi alterada. Não mudar Auth, tabelas, funções nem Storage para esta otimização.
4. Após aprovação da Preview, publicar apenas o site. Registar a publicação anterior para reversão imediata e observar transferências no navegador e relatórios de egress em visitas reais. A poupança mensal depende da navegação e do tráfego reais; o consumo mensal já contabilizado não é apagado.
5. A ativação da IA permanece uma operação separada. O patch preparado continua aplicável sobre esta versão e foi compilado em conjunto numa cópia descartável; não foi aplicado ao site entregue.

Se houver falha, promover novamente a publicação anterior na Vercel. Não é necessária reversão de base de dados ou Storage: nenhum deles é alterado por esta entrega. Manter os originais no Storage permite que páginas antigas abertas continuem a apresentar fotografias.
