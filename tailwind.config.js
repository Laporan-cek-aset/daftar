/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pendidikan: {
          blue: '#1e3a8a',
          yellow: '#fbbf24',
          light: '#f0f9ff'
        }
      }
    },
  },
  plugins: [],
};
