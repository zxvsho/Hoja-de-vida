import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true" ? "/Hoja-de-vida/" : "/",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
