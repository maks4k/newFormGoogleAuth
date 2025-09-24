import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTSConfigPaths from "vite-tsconfig-paths";
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTSConfigPaths(),tailwindcss()],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"./src")
    }
  }
});
