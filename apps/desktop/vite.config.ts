/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";

import babel from "@rolldown/plugin-babel";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

// Tauri loads the dev build from a fixed port, and watches src-tauri itself.
// https://v2.tauri.app/start/frontend/vite/
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  resolve: {
    // `#/*` imports, from tsconfig.json's `paths`.
    tsconfigPaths: true,
    // One copy of each, for this app and the UI package's source alike. pnpm can install two
    // copies when their optional peers differ, and two Chakras or Reacts don't share a context.
    dedupe: ["@chakra-ui/react", "@emotion/react", "next-themes", "react", "react-dom"],
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  clearScreen: false,
  server: {
    port: 3000,
    // Tauri needs exactly this port. Vitest's browser mode reuses this config, so a test run
    // picks another port rather than failing next to a running app.
    strictPort: !process.env.VITEST,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 3000 + 1 } : undefined,
    watch: { ignored: ["**/src-tauri/**"] },
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target: "es2022",
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    // The app reads its bundle from disk, never downloads it, so one larger chunk costs nothing.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    // Until the app has logic of its own to unit-test; its stories are tests from the start.
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: { name: "unit", environment: "node", include: ["src/**/*.test.ts"] },
      },
      {
        // Every story is a test: it must render, its play function must pass,
        // and the a11y addon reports what axe finds.
        extends: true,
        plugins: [
          storybookTest({
            configDir: fileURLToPath(new URL("./.storybook", import.meta.url)),
            storybookUrl: "http://localhost:6009",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
