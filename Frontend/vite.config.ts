import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    base: "./",
    build: {
        outDir: "dist",
        target: "es2019",
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name]-[hash]-v2.js`,
                chunkFileNames: `assets/[name]-[hash]-v2.js`,
            }
        }
    },
});