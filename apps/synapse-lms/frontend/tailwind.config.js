/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'neon-primary': 'var(--neon-primary)',
        'neon-secondary': 'var(--neon-secondary)',
        'neon-accent': 'var(--neon-accent)',
        'cyber-deep': 'var(--bg-deep)',
        'cyber-panel': 'var(--bg-panel)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
}
