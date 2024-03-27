/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
        '202': '38rem',
      }
    }
  },
  plugins: [
  ],
}

