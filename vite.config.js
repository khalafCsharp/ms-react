import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3500, 
  },
  resolve: {
    alias: {
      // 2. Map the root '/' to your 'src' folder
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
