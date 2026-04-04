/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6D28D9",
        secondary: "#10B981",
        accent: "#F59E0B",
        camel: {
          DEFAULT: "#C19A6B",
          light: "#D8BC9D",
          dark: "#8B6D43",
        },
        background: {
          light: "#C19A6B", // Camel Color for light mode
          dark: "#111827", // Dark Color for dark mode
        },
        text: {
          light: "#111827", // Black for light mode
          dark: "#FFFFFF", // White for dark mode
        }
      },
      fontFamily: {
        arabic: ["System", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
