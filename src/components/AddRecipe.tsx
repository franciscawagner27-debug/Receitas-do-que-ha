import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddRecipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !ingredients || !steps) return alert('Preenche todos os campos!')

    const { error } = await supabase.from('recipes').insert([
      {
        title,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('.').map(s => s.trim()),
      },
    ])

    if (error) alert('Erro ao guardar receita.')
    else {
      alert('Receita adicionada com sucesso!')
      setTitle('')
      setIngredients('')
      setSteps('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <h2 className="text-xl font-bold mb-4 text-terracotta">Adicionar Receita</h2>

      <input
        type="text"
        placeholder="Título da receita"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 rounded border"
      />

      <textarea
        placeholder="Ingredientes (separa por vírgulas)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full p-2 mb-3 rounded border"
      />

      <textarea
        placeholder="Passos (separa por pontos)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        className="w-full p-2 mb-3 rounded border"
      />

     <button
  type="submit"
  className="bg-olive hover:bg-terracotta text-white font-semibold py-2 px-5 rounded-xl shadow-soft transition-all"
>
  Guardar Receita
</button>

    </form>
  )
}
