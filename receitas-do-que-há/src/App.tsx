import React, { useEffect, useMemo, useState } from 'react'
import type { Recipe } from './types'
import AddRecipe from './components/AddRecipe'
import { useRecipes } from './hooks/useRecipes'
import { supabase } from './lib/supabase'

export default function App(): JSX.Element {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const { recipes, loading } = useRecipes()
  const [session, setSession] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  const userIngredients = useMemo(() => query
    .split(',')
    .map(s => normalize(s).trim())
    .filter(Boolean), [query])

  const filtered = useMemo(() => {
    if (!recipes?.length) return []
    if (userIngredients.length === 0) return recipes
    return recipes.filter(r => {
      const ing = (r.ingredients || []).map(i => normalize(String(i)))
      return userIngredients.every(ui => ing.some(i => i.includes(ui)))
    })
  }, [recipes, userIngredients])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      alert('Erro ao enviar link: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut() }

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold">ReceitasDoQueHá</h1>
        <p className="mt-1 text-slate-600">Escreve os ingredientes que tens (separa por vírgulas) e encontra receitas.</p>

        <div className="mt-6 flex gap-3">
          <input
            aria-label="Procurar por ingredientes"
            placeholder="ex.: frango, arroz, tomate"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 rounded-md border border-slate-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button onClick={() => setQuery('')} className="rounded-md px-4 py-2 bg-slate-800 text-white">Limpar</button>
        </div>

        {loading && <p className="mt-3 text-slate-500">A carregar receitas…</p>}
      </header>

      <main className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold">Receitas encontradas ({filtered.length})</h2>

          <div className="mt-4 space-y-4">
            {filtered.map(r => (
              <article key={r.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                {r.image && <img src={r.image} alt={r.title} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />}
                <div className="flex-1">
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-slate-500">{(r as any).timeMinutes ?? (r as any).time_minutes ?? '-'} min • {(r as any).tags?.join?.(' • ')}</p>
                  <p className="mt-2 text-sm text-slate-700">{(r.ingredients || []).slice(0,4).join(', ')}{(r.ingredients || []).length>4? '…': ''}</p>
                  <div className="mt-3">
                    <button onClick={() => setSelected(r)} className="text-sm px-3 py-1 rounded-md border">Ver receita</button>
                  </div>
                </div>
              </article>
            ))}

            {!loading && filtered.length === 0 && (
              <div className="text-slate-600">Nenhuma receita encontrada. Executaste o script de seed no Supabase?</div>
            )}
          </div>
        </section>

        <aside>
          <div className="sticky top-6 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">Acesso (admin)</h2>
              {session ? (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-600">Sessão iniciada</span>
                  <button onClick={handleLogout} className="px-3 py-1 border rounded-md">Terminar sessão</button>
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="mt-2 space-y-2">
                  <p className="text-sm text-slate-600">Introduz o teu email para receberes um link de acesso.</p>
                  <input type="email" required placeholder="o.teu@email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
                  <button disabled={sending || sent} className="px-3 py-1 bg-slate-800 text-white rounded">
                    {sent ? 'Link enviado ✉️' : sending ? 'A enviar…' : 'Enviar link de acesso'}
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">Receita</h2>
              {selected ? (
                <article className="mt-4 bg-white rounded-lg shadow-sm p-4">
                  {selected.image && <img src={selected.image} alt={selected.title} className="w-full h-44 object-cover rounded-md" />}
                  <h3 className="mt-3 text-lg font-bold">{selected.title}</h3>
                  <p className="text-sm text-slate-500">{(selected as any).time_minutes ?? (selected as any).timeMinutes ?? '-'} min • {(selected as any).tags?.join?.(' • ')}</p>
                  <h4 className="mt-3 font-semibold">Ingredientes</h4>
                  <ul className="list-disc list-inside text-sm">{(selected.ingredients || []).map((ing, i) => <li key={i}>{String(ing)}</li>)}</ul>
                  <h4 className="mt-3 font-semibold">Modo de preparação</h4>
                  <ol className="list-decimal list-inside text-sm space-y-2">{(selected.steps || []).map((s, i) => <li key={i}>{String(s)}</li>)}</ol>
                  <div className="mt-4 flex gap-2"><button onClick={() => setSelected(null)} className="px-3 py-1 border rounded-md">Fechar</button></div>
                </article>
              ) : (
                <div className="mt-4 text-slate-600">Seleciona uma receita para ver os detalhes.</div>
              )}
            </div>

            <div className="bg-white p-3 rounded-lg shadow-sm">
              <h4 className="font-semibold">Dica</h4>
              <p className="text-sm text-slate-600 mt-2">Executa o script de seed no Supabase para veres receitas de exemplo imediatamente.</p>
            </div>

            {session ? (
              <div><AddRecipe /></div>
            ) : (
              <div className="text-sm text-slate-600">Inicia sessão para adicionar receitas.</div>
            )}
          </div>
        </aside>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 p-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} ReceitasDoQueHá</footer>
    </div>
  )
}