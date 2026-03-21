import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        cogu: {
          cream: "#f9f5e9",
          yellow: "#f9f539",
          sage: "#bec1ac",
          "blue-gray": "#9ab5c7",
          brown: "#633b21",
          green: "#2c5f34",
          blue: "#043a5f",
          red: "#910d16",
        },
      },
      fontFamily: {
        display: ['"MAK"', "Georgia", "serif"],
        sans: ['"Montserrat"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
