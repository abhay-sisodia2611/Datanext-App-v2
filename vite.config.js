import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "4a5dbe52-a634-4327-b720-1193ba8ee920-00-3r5pcnc0raih5.kirk.replit.dev"
    ]
  }
});
