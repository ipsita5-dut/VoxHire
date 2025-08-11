// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//      "./src/app/**/*.{js,ts,jsx,tsx}",
//     "./src/components/**/*.{js,ts,jsx,tsx}",
     
//     // Or if using `src` directory:
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//     sans: ['Poppins', 'sans-serif'],
//   },
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        success: {
          100: '#49de50',
          200: '#42c748',
        },
        destructive: {
          100: '#f75353',
          200: '#c44141',
        },
        primary: {
          100: '#dddfff',
          200: '#cac5fe',
        },
        light: {
          100: '#d6e0ff',
          400: '#6870a6',
          600: '#4f557d',
          800: '#24273a',
        },
        dark: {
          100: '#020408',
          200: '#27282f',
          300: '#242633',
        },
      },
      fontFamily: {
        sans: ['"Mona Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.625rem',
      },
      backgroundImage: {
        pattern: "url('/pattern.png')",
        'blue-gradient': 'linear-gradient(to left, #FFFFFF, #CAC5FE)',
        'blue-gradient-dark': 'linear-gradient(to bottom, #171532, #08090D)',
        'dark-gradient': 'linear-gradient(to bottom, #1A1C20, #08090D)',
        'border-gradient': 'linear-gradient(to bottom, #4B4D4F, #4B4D4F33)',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(5px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
