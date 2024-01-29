import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/",
    server: {
        // Rewrite rule to serve /index.html for / requests
        rewrite: (path) => (path === "/" ? "/index.html" : path),
    },
});
