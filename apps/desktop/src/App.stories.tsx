import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, mocked } from "storybook/test";

import { api } from "#/api";

import { App } from "./App";

const meta = {
  component: App,
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Greets: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Your name" }), "Ada");
    await userEvent.click(canvas.getByRole("button", { name: "Greet me" }));
    await expect(await canvas.findByText("Hello, Ada!")).toBeVisible();
    await expect(api.greet).toHaveBeenCalledWith("Ada");
  },
};

export const ChoosesAFile: Story = {
  beforeEach: () => {
    mocked(api.chooseFile).mockResolvedValue("C:\\Users\\ada\\notes.txt");
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Choose a file" }));
    await expect(await canvas.findByText(/You chose C:\\Users\\ada\\notes\.txt/)).toBeVisible();
  },
};

export const WhenRustFails: Story = {
  beforeEach: () => {
    mocked(api.greet).mockRejectedValue(new Error("The core is unreachable"));
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Greet me" }));
    await expect(await canvas.findByText(/the core is unreachable/i)).toBeVisible();
  },
};
