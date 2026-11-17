/**
 * Every call into the Rust side. Components import `api`, never `invoke` or a plugin, so Storybook
 * can mock this one module (`.storybook/preview.tsx`) and the stories run without a Tauri backend.
 */
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openUrl } from "@tauri-apps/plugin-opener";

import type { Greeting } from "#/bindings/Greeting";

export const api = {
  /** `greet` in `src-tauri/src/lib.rs`. */
  greet: (name: string) => invoke<Greeting>("greet", { name }),
  /** Asks the user for one file with the system's picker: its path, or null if they cancel. */
  chooseFile: () => open({ multiple: false, directory: false }),
  /** Opens a web page in the user's browser, not the app's window. */
  openInBrowser: (url: string) => openUrl(url),
};
