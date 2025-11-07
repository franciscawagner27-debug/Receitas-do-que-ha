/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#f5e9dd',
        'beige-soft': '#f9f1e7',
        olive: '#7A8C5D',
        terracotta: '#C86C5D',
        charcoal: '#3D3A37',
        stone: '#8a817c',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
