import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/styles.scss";
                @import "./src/context-menu.scss";`,
            },
        },
    },
    server: {
        hmr: true,
        watch: {
            usePolling: true,
        },
        proxy: {
            "/api": {
                target: "http://127.0.0.1:3000/api",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    build: {
        outDir: "../dist",
    },
});
