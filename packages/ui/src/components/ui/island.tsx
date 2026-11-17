import "../../fonts.css";
import { ChakraProvider, type SystemContext } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { system as sharedSystem } from "../../theme";
import { ColorModeProvider } from "./color-mode";

/**
 * For pages made of separate React roots (Astro's islands), where a `Provider` in each would put
 * Chakra's global CSS (the reset, the tokens for both color modes: tens of kilobytes) on the page
 * once per island. `ChakraStyles` puts it there once, and each island's `IslandProvider` leaves it
 * out.
 */
function withoutGlobalCss(system: SystemContext): SystemContext {
  return { ...system, _global: [] };
}

const sharedIslandSystem = withoutGlobalCss(sharedSystem);

interface SystemProps {
  /** The Chakra system: the shared one, unless an app adds a layer of its own to it. */
  system?: SystemContext;
}

/** Chakra's global CSS, once per page: render it in the layout's `<head>`, with no directive. */
export function ChakraStyles({ system = sharedSystem }: SystemProps) {
  return <ChakraProvider value={system}>{null}</ChakraProvider>;
}

/** Wraps one island: Chakra's system without its global CSS, and the color mode. */
export function IslandProvider({ system, children }: SystemProps & { children: ReactNode }) {
  return (
    <ChakraProvider value={system ? withoutGlobalCss(system) : sharedIslandSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
