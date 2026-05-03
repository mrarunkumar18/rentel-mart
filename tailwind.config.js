/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rentify: {
          primary: '#1886FF',   // CTAs, nav
          secondary: '#62D0FF', // hover
          accent: '#E4F9FF',    // backgrounds
        }
      }
    },
  },
  plugins: [],
}
