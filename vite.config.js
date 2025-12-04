import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "c1f2eaae-2a42-4df8-adf0-6b4b13261916-00-2s68rw7phl4x6.riker.replit.dev"
    ]
  }
});
