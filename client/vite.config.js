import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Set the base path to the root of your project
  plugins: [react()],
});
