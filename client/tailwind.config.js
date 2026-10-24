/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "surface-border": "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-whatsapp": "var(--color-whatsapp)",
        "accent-forest": "var(--color-forest)",
        gold: "var(--color-gold)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        primary: "var(--color-primary)",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Georgia', 'serif'],
        sans: ['"General Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['"General Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}
