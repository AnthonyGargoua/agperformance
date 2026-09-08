/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171223",
        paper: "#FFF6EA",
        violet: "#6C3CFF",
        pink: "#FF3D8A",
        amber: "#FFC02E",
        lime: "#22CC7A",
        sky: "#12C2E9",
      },
      boxShadow: {
        pop: "0 4px 0 0 #171223",
        popLg: "0 7px 0 0 #171223",
        popSm: "0 2px 0 0 #171223",
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      keyframes: {
        popIn: { "0%": { transform: "scale(.85)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } },
        rise: { "0%": { transform: "translateY(0)", opacity: 1 }, "100%": { transform: "translateY(-42px)", opacity: 0 } },
        shine: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        wiggle: { "0%,100%": { transform: "rotate(-4deg)" }, "50%": { transform: "rotate(4deg)" } },
      },
      animation: {
        popIn: "popIn .25s cubic-bezier(.34,1.56,.64,1)",
        rise: "rise .9s ease-out forwards",
        shine: "shine 2.5s linear infinite",
        wiggle: "wiggle 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
