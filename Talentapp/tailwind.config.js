/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors
        primary: {
          DEFAULT: '#321B15',  // Dark brown (previously body bg)
          light: '#4A2B22',   // Optional lighter variant
        },
        secondary: {
          DEFAULT: '#ECE5D8',  // Cream (previously text color)
          dark: '#D8D0C0',     // Optional darker variant
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "1rem",
          xl: "2rem",
          "2xl": "4rem",
        }
      }
    },
  },
  plugins: [],
}