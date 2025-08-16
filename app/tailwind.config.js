/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        nano: {
          blue: '#195BA6',
          softblue: '#F5F9FC',
          gray: '#7B8A99',
          slate: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
