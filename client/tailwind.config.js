/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A3828", // deep forest green
        accent: "#25D366", // WhatsApp green
        hot: "#FF6B35", // orange
        background: "#0D0D0D", // near-black
        surface: "#161616",
        "surface-2": "#1F1F1F",
        "text-primary": "#F0F0F0",
        "text-muted": "#7A7A7A",
        success: "#4CAF50",
        gold: "#D4A843", // market stall gold
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
