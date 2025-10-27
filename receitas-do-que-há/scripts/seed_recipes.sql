insert into public.recipes (title, image, ingredients, time_minutes, tags, steps) values
(
  'Arroz de Frango Simples',
  'https://images.unsplash.com/photo-1604908177522-5fdf7a3a9aef?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['arroz','frango','cebola','alho','tomate','azeite','sal','pimenta'],
  45,
  ARRAY['prático','conforto'],
  ARRAY[
    'Refoga a cebola e o alho no azeite até ficarem translúcidos.',
    'Adiciona o frango cortado em pedaços e sela até dourar.',
    'Junta o tomate picado e deixa cozinhar 5 minutos.',
    'Adiciona o arroz, água quente (o dobro do volume do arroz), tempera com sal e pimenta.',
    'Cozinha em lume médio-baixo até o arroz estar pronto.'
  ]
),
(
  'Massa Rápida com Molho de Tomate',
  'https://images.unsplash.com/photo-1604908177542-6b9f0c1a2d9b?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['massa','tomate','alho','manjericão','azeite','sal'],
  20,
  ARRAY['rápido','vegetariano'],
  ARRAY[
    'Coze a massa conforme as instruções da embalagem.',
    'Refoga o alho no azeite, adiciona o tomate picado e reduz o molho.',
    'Envolve a massa no molho e junta manjericão fresco.'
  ]
),
(
  'Omelete Simples',
  'https://images.unsplash.com/photo-1584270354949-5a6b3f0d2b7d?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['ovos','sal','pimenta','azeite','queijo'],
  10,
  ARRAY['rápido','pequeno-almoço'],
  ARRAY[
    'Bate os ovos com sal e pimenta.',
    'Aquece uma frigideira com um fio de azeite e verte os ovos.',
    'Quando estiver quase firme, adiciona o queijo e dobra a omelete.'
  ]
),
(
  'Salada de Grão com Atum',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['grão','atum','cebola','azeite','limão','sal','pimenta'],
  15,
  ARRAY['frio','leve'],
  ARRAY[
    'Escorre o grão e o atum.',
    'Pica a cebola e mistura com o grão e o atum.',
    'Tempere com azeite, sumo de limão, sal e pimenta.'
  ]
),
(
  'Sopa de Legumes Caseira',
  'https://images.unsplash.com/photo-1512058564366-7a1a5b3e9b78?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['batata','cenoura','cebola','aipo','água','sal','azeite'],
  40,
  ARRAY['comfort','vegetariano'],
  ARRAY[
    'Refoga a cebola no azeite.',
    'Adiciona os restantes legumes cortados e água até cobrir.',
    'Cozinha até os legumes estarem macios e tritura se preferires uma sopa cremosa.'
  ]
),
(
  'Panquecas Simples',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop&crop=entropy',
  ARRAY['farinha','leite','ovos','sal','açúcar','manteiga'],
  25,
  ARRAY['doce','pequeno-almoço'],
  ARRAY[
    'Mistura farinha, ovos, leite e uma pitada de sal até obteres uma massa lisa.',
    'Frita pequenas porções numa frigideira com manteiga até dourar.'
  ]
);