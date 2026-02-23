import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/controleDeDividas/", // 🔹 base para GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      devOptions: {
        enabled: false, // ⚠️ desativa o service worker durante o desenvolvimento
      },
      manifest: {
        name: "Controle de Dívidas",
        short_name: "Dívidas",
        description: "Aplicativo para controlar suas dívidas e pagamentos",
        theme_color: "#18181b",
        background_color: "#18181b",
        display: "standalone",
        start_url: "/controleDeDividas/", // caminho do seu repo no GitHub Pages
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.github\.io\/.*/, // ⚡ caching para GitHub Pages
            handler: "NetworkFirst",
          },
        ],
      },
    }),
  ],
});