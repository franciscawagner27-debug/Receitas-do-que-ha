# receitas-do-que-ha

## 1) Preparar projecto local
```
npm install
cp .env.example .env
# Preenche VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

## 2) Supabase
- Cria um projecto em https://app.supabase.com
- Cria a tabela:
```
create table public.recipes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image text,
  ingredients text[] not null,
  time_minutes int,
  tags text[],
  steps text[]
);
```
- Ativa RLS e policies (SQL):
```
alter table public.recipes enable row level security;

create policy "Public read" on public.recipes
for select using (true);

create policy "Authenticated insert" on public.recipes
for insert with check (auth.role() = 'authenticated');
```
- No SQL Editor, corre também `scripts/seed_recipes.sql` para dados de exemplo.

## 3) Correr localmente
```
npm run dev
# Abre o URL mostrado (ex.: http://localhost:5173)
```

## 4) Deploy na Vercel
- Importa o repositório do GitHub
- Em Settings → Environment Variables, adiciona:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Build Command: `npm run build`
- Output Directory: `dist`

## 5) Autenticação (Magic Link)
- Em Supabase → Authentication → Providers → Email: ON
- No site, mete o teu email e carrega em "Enviar link de acesso"