import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./src",
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
});
