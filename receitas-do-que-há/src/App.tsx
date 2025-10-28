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

  // auth para “admin”
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
              placeholder="ex.: fr
