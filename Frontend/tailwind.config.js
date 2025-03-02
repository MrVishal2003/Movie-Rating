/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow_default: "#F5C518",
        // yellow_default: "#ffff00",
        gray_default: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
