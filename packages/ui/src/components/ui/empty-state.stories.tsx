import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuInbox } from "react-icons/lu";
import { expect } from "storybook/test";

import { EmptyState } from "./empty-state";

const meta = {
  component: EmptyState,
  args: {
    icon: <LuInbox />,
    title: "No items yet",
    description: "Nothing here yet. Add something to get started.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No items yet")).toBeVisible();
  },
};

export const TitleOnly: Story = { args: { description: undefined } };
