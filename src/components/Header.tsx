import React from 'react'
import Logo from './Logo'

export default function Header() {
  return (
    <header className="text-center py-10">
      <Logo />
      <p className="text-stone mt-2 text-lg">
        Encontra receitas deliciosas com o que tens em casa 🍲
      </p>
    </header>
  )
}
