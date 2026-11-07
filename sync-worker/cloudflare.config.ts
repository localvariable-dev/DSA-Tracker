import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  accountId: "2fc0fdb48563a4de366588e455d1d3d2",
  worker: {
    name: "tracebook-progress-sync",
    entrypoint: "./src/index.js",
    compatibilityDate: "2026-11-07",
    env: {
      PROGRESS: bindings.r2({ name: "dsa-progress" }),
      SYNC_TOKEN: bindings.secret(),
      OTTER_SYNC_TOKEN: bindings.secret(),
      ALLOWED_ORIGIN: bindings.text("https://localvariable-dev.github.io,https://kimick.in,https://localhost"),
    },
  },
});
