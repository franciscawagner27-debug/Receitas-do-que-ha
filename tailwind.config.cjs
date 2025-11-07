
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        beige: "#f5e9dd",
        "beige-soft": "#f9f1e7",
        olive: "#7a8c5d",
        terracotta: "#c86c5d",
        charcoal: "#3d3a37",
        stone: "#8a817c",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}
