import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        safari: {
          gold: "#C99A2E",
          orange: "#E96B2C",
          forest: "#1F5B3B",
          cream: "#FFF4DF",
          ink: "#233126"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 91, 59, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
