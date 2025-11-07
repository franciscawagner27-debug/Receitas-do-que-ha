/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#f5f0e6",
        olive: "#708d81",
        terracotta: "#d77a61",
        charcoal: "#3a3a3a",
        stone: "#a39f8b",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
