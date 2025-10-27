import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddRecipe() {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [timeMinutes, setTimeMinutes] = useState<number | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ing = ingredients.split(',').map(s => s.trim()).filter(Boolean)
    const st = steps.split('\n').map(s => s.trim()).filter(Boolean)

    const { error } = await supabase.from('recipes').insert([
      { title, image, ingredients: ing, steps: st, time_minutes: timeMinutes || null }
    ])

    if (error) {
      alert('Erro a adicionar: ' + error.message)
    } else {
      alert('Receita adicionada! (actualiza a página)')
      setTitle('')
      setImage('')
      setIngredients('')
      setSteps('')
      setTimeMinutes('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="font-semibold mb-2">Adicionar receita (privado)</h3>
      <input className="w-full p-2 border rounded mb-2" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
      <input className="w-full p-2 border rounded mb-2" placeholder="URL da imagem" value={image} onChange={e => setImage(e.target.value)} />
      <textarea className="w-full p-2 border rounded mb-2" placeholder="Ingredientes (separados por vírgula)" value={ingredients} onChange={e => setIngredients(e.target.value)} />
      <textarea className="w-full p-2 border rounded mb-2" placeholder="Passos (cada passo em nova linha)" value={steps} onChange={e => setSteps(e.target.value)} />
      <input className="w-full p-2 border rounded mb-2" placeholder="Tempo (minutos)" type="number" value={timeMinutes as any} onChange={e => setTimeMinutes(Number(e.target.value) || '')} />
      <div className="flex gap-2 justify-end">
        <button type="submit" className="px-3 py-1 bg-slate-800 text-white rounded">Adicionar</button>
      </div>
    </form>
  )
}