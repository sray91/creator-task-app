module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Include the app directory
    './Components/**/*.{js,ts,jsx,tsx}', // Include Components folder
    './pages/**/*.{js,ts,jsx,tsx}', // Include any other pages
    './public/**/*.html',
  ],
  theme: {
    extend: { 
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        lexend: ['Lexend Deca', 'sans-serif'],
      },
    },
  },
  plugins: [],
};