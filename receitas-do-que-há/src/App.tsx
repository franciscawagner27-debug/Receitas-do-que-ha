
import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import { useRecipes } from './hooks/useRecipes'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import RecipeCard from './components/RecipeCard'
import AddRecipe from './components/AddRecipe'

export default function App(): JSX.Element {
  const { recipes, loading } = useRecipes()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Recipe | null>(null)

  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  const userIngredients = useMemo(
    () =>
      query
        .split(',')
        .map((s) => normalize(s).trim())
        .filter(Boolean),
    [query]
  )

  const filtered = useMemo(() => {
    if (!recipes?.length) return []
    if (userIngredients.length === 0) return recipes
    return recipes.filter((r) => {
      const ing = (r.ingredients || []).map((i) => normalize(String(i)))
      return userIngredients.every((ui) => ing.some((i) => i.includes(ui)))
    })
  }, [recipes, userIngredients])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      alert('Erro ao enviar link: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Pesquisa central */}
      <section className="max-w-5xl mx-auto px-6 mt-4">
        <div className="card p-4 md:p-6">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-stone mb-2"
          >
            Escreve os ingredientes que tens (separa por vírgulas)
          </label>
          <div className="flex gap-3">
            <input
              id="search"
              aria-label="Procurar por ingredientes"
              placeholder="ex.: frango, arroz, tomate"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input"
            />
            <button onClick={() => setQuery('')} className="btn btn-ghost">
              Limpar
            </button>
          </div>
          {loading && <p className="mt-3 text-stone">A carregar receitas…</p>}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl">
              Receitas ({filtered.length})
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <RecipeCard
                key={r.id || r.title}
                r={r}
                onOpen={() => setSelected(r)}
              />
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="card p-6 mt-4 text-stone">
              Nenhuma receita encontrada. Experimenta “massa, tomate” ou “ovos,
              queijo”.
            </div>
          )}
        </section>

        <aside className="lg:col-span-1 space-y-6">
          <div className="card p-4">
            <h3 className="font-semibold">Receita</h3>
            {selected ? (
              <article className="mt-3">
                {selected.image && (
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={selected.image}
                      alt={selected.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h4 className="font-display text-lg mt-3">{selected.title}</h4>
                <p className="text-sm text-stone">
                  {(selected as any).time_minutes ??
                    (selected as any).timeMinutes ??
                    '-'}{' '}
                  min
                  {Array.isArray((selected as any).tags) &&
                    (selected as any).tags.length > 0 && (
                      <> • {(selected as any).tags.join(' • ')}</>
                    )}
                </p>

                <h5 className="font-semibold mt-3">Ingredientes</h5>
                <ul className="list-disc list-inside text-sm text-ink/90">
                  {(selected.ingredients || []).map((ing, i) => (
                    <li key={i}>{String(ing)}</li>
                  ))}
                </ul>

                <h5 className="font-semibold mt-3">Modo de preparação</h5>
                <ol className="list-decimal list-inside text-sm text-ink/90 space-y-1">
                  {(selected.steps || []).map((s, i) => (
                    <li key={i}>{String(s)}</li>
                  ))}
                </ol>

                <div className="mt-4">
                  <button onClick={() => setSelected(null)} className="btn btn-ghost">
                    Fechar
                  </button>
                </div>
              </article>
            ) : (
              <p className="text-stone mt-2">
                Seleciona uma receita para ver os detalhes.
              </p>
            )}
          </div>

          <div className="card p-4">
            <h3 className="font-semibold">Acesso (admin)</h3>
            {session ? (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-stone">Sessão iniciada</span>
                <button onClick={handleLogout} className="btn btn-ghost">
                  Terminar sessão
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="mt-2 space-y-2">
                <p className="text-sm text-stone">
                  Recebe um link no email para entrar.
                </p>
                <input
                  type="email"
                  required
                  placeholder="o.teu@email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
                <button disabled={sending || sent} className="btn btn-primary">
                  {sent
                    ? 'Link enviado ✉️'
                    : sending
                    ? 'A enviar…'
                    : 'Enviar link de acesso'}
                </button>
              </form>
            )}
          </div>

          {session && (
            <div className="card p-4">
              <h3 className="font-semibold mb-2">Adicionar receita</h3>
              <AddRecipe />
            </div>
          )}
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-10 mt-10 text-center text-sm text-stone">
        © {new Date().getFullYear()} ReceitasDoQueHá — feito com ❤️ em Portugal
      </footer>
    </div>
  )
}

