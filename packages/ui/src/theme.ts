import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { button } from "./recipes/button.recipe";

/** Chakra's own fallbacks, for the moment before Inter loads. */
const FALLBACK_FONTS = `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

/** The palette `accent` points at. Any of Chakra's palettes, or one defined under `colors`. */
const ACCENT = "teal";

const accentShade = (shade: number | string) => ({ value: `{colors.${ACCENT}.${shade}}` });

/**
 * The shared Chakra system. Tokens and semantic tokens go in this config; recipes and slot
 * recipes live in `./recipes`, one file each, and only add to Chakra's own. Run
 * `pnpm --filter @stacks-updater-test/ui typegen` after changing any of them so their props are typed.
 *
 * Every app uses it. An app that needs more of its own builds its system from this config and a
 * layer of its own (`createSystem(defaultConfig, config, appLayer)`), and hands that to the
 * provider and its Storybook (`previewFor`).
 */
export const config = defineConfig({
  globalCss: {
    // Every component reads `accent` unless it names a palette.
    html: { colorPalette: "accent" },
  },
  theme: {
    tokens: {
      // `./fonts.css`, which the provider and the Storybook preview import, declares it.
      fonts: {
        heading: { value: `"Inter Variable", ${FALLBACK_FONTS}` },
        body: { value: `"Inter Variable", ${FALLBACK_FONTS}` },
      },
    },
    semanticTokens: {
      colors: {
        // Chakra's 500 and 600 are under 4.5:1 on white for small error and warning text; 700
        // reads. Dark mode keeps Chakra's.
        fg: {
          error: { value: { _light: "{colors.red.700}", _dark: "{colors.red.400}" } },
          warning: { value: { _light: "{colors.orange.700}", _dark: "{colors.orange.300}" } },
        },
        // What `colorPalette="accent"` reads.
        accent: {
          solid: accentShade(600),
          contrast: { value: "white" },
          fg: { value: { _light: `{colors.${ACCENT}.700}`, _dark: `{colors.${ACCENT}.300}` } },
          muted: { value: { _light: `{colors.${ACCENT}.200}`, _dark: `{colors.${ACCENT}.800}` } },
          subtle: { value: { _light: `{colors.${ACCENT}.100}`, _dark: `{colors.${ACCENT}.900}` } },
          emphasized: {
            value: { _light: `{colors.${ACCENT}.300}`, _dark: `{colors.${ACCENT}.700}` },
          },
          focusRing: accentShade(500),
          border: { value: { _light: `{colors.${ACCENT}.500}`, _dark: `{colors.${ACCENT}.400}` } },
        },
      },
    },
    recipes: { button },
  },
});

export const system = createSystem(defaultConfig, config);
