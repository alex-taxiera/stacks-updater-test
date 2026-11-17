import { defineRecipe } from "@chakra-ui/react";

/**
 * Filled buttons take the accent; outline, ghost and plain ones stay gray, so secondary actions
 * and icon buttons don't all turn the accent colour.
 */
export const button = defineRecipe({
  variants: {
    variant: {
      outline: { colorPalette: "gray" },
      ghost: { colorPalette: "gray" },
      plain: { colorPalette: "gray" },
    },
  },
});
