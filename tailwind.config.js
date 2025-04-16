/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#0c0f13',
        'blue-accent': '#3b82f6',
        'blue-dark': '#1e3a8a',
        'blue-light': '#60a5fa',
        'purple-accent': '#8b5cf6',
        'indigo-accent': '#6366f1',
        'gray-dark': '#111827',
        'gray-light': '#e5e7eb',
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
      },
      boxShadow: {
        'custom': '0 0 15px 0 rgba(59, 130, 246, 0.3)',
        'glow': '0 0 20px 5px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
