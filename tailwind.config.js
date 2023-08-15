/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "320px",
        // => @media (min-width: 576px) { ... }

        md: "768px",
        // => @media (min-width: 960px) { ... }

        lg: "1080px",
        // => @media (min-width: 1440px) { ... }
      },
      fontFamily: {
        'custom': ['Open Sans', "sans-serif"],
      },
    }

  },
  plugins: [],
};
