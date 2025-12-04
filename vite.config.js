import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "f2f82de9-49e9-47ea-9724-fa415947c78e-00-1ecoeyzx160fq.janeway.replit.dev"
    ]
  }
});
