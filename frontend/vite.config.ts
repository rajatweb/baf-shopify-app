import "dotenv/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Only expose what you need, not all process.env
export default defineConfig({
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.WS_PORT": JSON.stringify(process.env.WS_PORT),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.TAWK_TO_SCRIPT_URL": JSON.stringify(process.env.TAWK_TO_SCRIPT_URL),
    "process.env.SHOPIFY_APP_URL": JSON.stringify(process.env.SHOPIFY_APP_URL),
    "process.env.SHOPIFY_MUSIC_PLAYER_EXTENSION_ID": JSON.stringify(process.env.SHOPIFY_MUSIC_PLAYER_EXTENSION_ID),
  },
  plugins: [
    react(),
    {
      name: "html-transform",
      transformIndexHtml: {
        order: "pre",
        handler(html: string) {
          return html.replace("%SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "");
        },
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  root: dirname(fileURLToPath(import.meta.url)),
  build: {
    sourcemap: process.env.NODE_ENV === "development",
    outDir: "../dist",
    emptyOutDir: true,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          polaris: ['@shopify/polaris'],
          styles: ['@shopify/polaris/build/esm/styles.css']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@shopify/app-bridge-react']
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@shopify/polaris/build/esm/styles.css";`
      }
    }
  }
});


