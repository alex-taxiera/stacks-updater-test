import { Box, Button, Icon } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuSparkles } from "react-icons/lu";
import { expect } from "storybook/test";

import { Card } from "./card";

const meta = {
  component: Card,
  args: {
    maxW: "sm",
    title: "A feature worth a card",
    description: "A short description of what this card is about.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Its title is an `h3` unless `titleProps` says otherwise. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 3, name: "A feature worth a card" }),
    ).toBeVisible();
  },
};

/** An icon above the title, as a feature list has. */
export const WithIcon: Story = {
  args: {
    variant: "subtle",
    icon: <Icon as={LuSparkles} boxSize="6" color="accent.fg" aria-hidden />,
    titleProps: { as: "h2" },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 2 })).toBeVisible();
  },
};

/** A picture flush with its edges, and actions in the footer. */
export const WithMediaAndFooter: Story = {
  args: {
    size: "sm",
    title: "1920 × 1408",
    description: "cdna.artstation.com",
    media: <Box h="40" bg="bg.emphasized" />,
    footer: <Button size="sm">Save this one</Button>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Save this one" })).toBeVisible();
  },
};
