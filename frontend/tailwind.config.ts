/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ใส่ค่าสี Hex จาก Figma ของคุณที่นี่
        'spa-green': '#8FA68F', 
        'spa-beige': '#F5F5DC',
        'spa-brown': '#5C4033',
      },
    },
  },
  plugins: [],
}