import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Call or Fall",
        short_name: "Call or Fall",
        description: "A thrilling card game of bluff and prediction",
        start_url: ".",
        display: "standalone",
        background_color: "#52b85d",
        theme_color: "#52b85d",
        orientation: "portrait",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: process.env.SW_DEV === "true",
        /* when using generateSW the PWA plugin will switch to classic */
        type: "module",
        navigateFallback: "index.html",
      },
      includeAssets: [
        "resources/cards/**/*.webp",
        "locales/**/*.json",
        "apple-touch-icon.png",
        "favicon.ico",
        "favicon.svg",
        "favicon-96x96.png",
        "web-app-manifest-192x192.png",
        "web-app-manifest-512x512.png",
        "CallOrFall-Logo.webp",
      ],
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "/",
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\.(js|css|png|jpg|svg|webp|woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    allowedHosts: true,
  },
});
