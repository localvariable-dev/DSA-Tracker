import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mobileDir = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.resolve(mobileDir, "..");

export default defineConfig({
  root: webDir,
  base: "./",
  publicDir: false,
  build: {
    outDir: path.resolve(mobileDir, "dist"),
    emptyOutDir: true,
    sourcemap: true,
  },
});
