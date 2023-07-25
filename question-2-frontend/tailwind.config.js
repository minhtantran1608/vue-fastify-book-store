/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-3rem) translateX(-50%)" },
          "100%": { transform: "translateY(0) translateX(-50%)" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.2s ease-out",
      },
    },
    plugins: [],
  },
};
