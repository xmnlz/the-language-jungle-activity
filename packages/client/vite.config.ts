import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default {
  base: "./",
  envDir: "../../",
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
};
