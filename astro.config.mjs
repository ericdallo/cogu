import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://ericdallo.github.io",
  base: "/cogu",
  output: "static",
  integrations: [
    react(),
    tailwind(),
  ],
  image: {
    domains: [],
  },
});
