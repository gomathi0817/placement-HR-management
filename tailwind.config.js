/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37",       // Primary Gold
        olive: "#BDB76B",         // Olive
        cream: "#FDFBD4",         // Cream Background
        accent: "#CE8946",        // Accent Gold / Orange
        darkText: "#3A2A16",      // Dark Brown Text
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card-custom': '0 4px 20px -2px rgba(58, 42, 22, 0.08), 0 2px 6px -1px rgba(58, 42, 22, 0.04)',
        'hover-custom': '0 10px 30px -4px rgba(212, 175, 55, 0.2), 0 4px 12px -2px rgba(58, 42, 22, 0.08)',
        'modal-custom': '0 20px 40px -8px rgba(58, 42, 22, 0.25)',
      }
    },
  },
  plugins: [],
}
