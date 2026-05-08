/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A3717",
        'sidebar-bg': "#1e293b",
        'navbar-bg': "#1e293b",
        'content-bg': "#f1f5f9",
      },
    },
  },
  plugins: [],
}
