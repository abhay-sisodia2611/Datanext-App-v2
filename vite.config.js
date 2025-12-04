import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "14e0cb77-0caf-4917-ae09-24ae50ec542e-00-aymx7w93d2i4.sisko.replit.dev",
      ".replit.dev"
    ]
  }
});
