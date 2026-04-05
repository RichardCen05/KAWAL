/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#e8f2ff',
          100: '#cce5ff',
          200: '#99ccff',
          300: '#66aaee',
          400: '#3388dd',
          500: '#0066cc',
          600: '#00509d',
          700: '#004080',
          800: '#003366',
          900: '#001a33',
        },
        surface: {
          DEFAULT: '#f0f4f8',
          dark: '#e2e8f0',
          card: '#ffffff',
        },
        terminal: {
          bg: '#0a0e17',
          text: '#a3e635',
          dim: '#4b5563',
          border: '#1e293b',
        },
        banding: {
          DEFAULT: '#059669',
          light: '#d1fae5',
          bg: '#ecfdf5',
        },
        recovery: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          bg: '#fffbeb',
        },
        redirect: {
          DEFAULT: '#2563eb',
          light: '#dbeafe',
          bg: '#eff6ff',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 80, 157, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(0, 80, 157, 0)' },
        },
      },
    },
  },
  plugins: [],
}
