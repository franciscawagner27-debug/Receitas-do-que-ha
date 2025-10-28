/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "#8A9A5B",
        beige: "#EADDC7",
        terracotta: "#B5651D",
        stone: "#3E3E3E",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['Inter', "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
}
