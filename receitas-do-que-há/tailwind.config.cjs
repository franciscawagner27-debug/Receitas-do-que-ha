/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f7f3ee',        // fundo “farinha”
        olive: '#6b7d57',       // acentos (azeitona)
        terracotta: '#c76b3c',  // detalhes quentes (cerâmica)
        ink: '#2e2a27',         // texto principal
        stone: '#8b857e'        // texto secundário
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46,42,39,0.08)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
