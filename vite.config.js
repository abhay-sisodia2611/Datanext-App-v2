import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "042bb4d5-5fd1-4338-a1e8-ca9cf3b3ca95-00-2yvkqevovdvxf.kirk.replit.dev"
    ]
  }
});
