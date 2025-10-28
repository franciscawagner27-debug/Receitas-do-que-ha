import React from 'react'
import Logo from './Logo'

export default function Header() {
  return (
    <header className="relative">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="h-48 bg-gradient-to-r from-terracotta/10 via-transparent to-olive/10" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Logo />
        </div>

        <p className="mt-4 text-stone max-w-2xl">
          Pesquisa receitas pelos ingredientes que tens em casa — simples, saboroso e sem desperdício.
        </p>
      </div>
    </header>
  )
}
