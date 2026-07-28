/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#0f1117',
          secondary: '#181c24',
          card: '#20242d',
          'card-hover': '#262c37',
          border: '#2b313d',
          accent: '#8b5cf6',
          'accent-hover': '#a78bfa',
          text: '#f8fafc',
          'text-muted': '#9ca3af',
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '200': '200ms',
      },
      minHeight: {
        'card': '170px',
      }
    },
  },
  plugins: [],
}
