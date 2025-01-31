/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ App Router pages
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ Components
    "./pages/**/*.{js,ts,jsx,tsx}", // ✅ If using pages directory
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Any other source folders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
