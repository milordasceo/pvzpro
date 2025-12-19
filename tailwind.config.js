/** @type {import('tailwindcss').Config} */
// const { heroui } = require("heroui-native/tailwind"); // Temporary commented out due to export issue

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/heroui-native/lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006FEE',
        secondary: '#7828C8',
        success: '#17C964',
        warning: '#F5A524',
        danger: '#F31260',
      }
    },
  },
  plugins: [], // heroui()
};
