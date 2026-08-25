/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#141414",
        "surface-2": "#1F1F1F",
        "surface-border": "#262626",
        "text-primary": "#F3F2EF",
        "text-muted": "#8E8E93",
        accent: "#FFB020",        // attention / money / amber
        "accent-whatsapp": "#25D366",
        success: "#10B981",       // emerald — won deals
        danger: "#EF4444",        // lost / cancel
        primary: "#0A3828",       // legacy deep green (kept for gradients)
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
