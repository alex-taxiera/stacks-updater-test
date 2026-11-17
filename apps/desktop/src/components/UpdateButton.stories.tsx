import type { Meta, StoryObj } from "@storybook/react-vite";
import { relaunch } from "@tauri-apps/plugin-process";
import { expect, fn } from "storybook/test";

import { type AvailableUpdate, UpdateOffer } from "./UpdateButton";

const update = (downloadAndInstall: AvailableUpdate["downloadAndInstall"]): AvailableUpdate => ({
  version: "1.2.0",
  downloadAndInstall,
});

const meta = {
  component: UpdateOffer,
  args: { update: update(fn(async () => {})) },
} satisfies Meta<typeof UpdateOffer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offered: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Update to 1.2.0" })).toBeEnabled();
  },
};

export const Installs: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Update to 1.2.0" }));
    await expect(args.update.downloadAndInstall).toHaveBeenCalled();
    await expect(relaunch).toHaveBeenCalled();
  },
};

export const Fails: Story = {
  args: {
    update: update(
      fn(async () => {
        throw new Error("The download was interrupted");
      }),
    ),
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Update to 1.2.0" }));
    const retry = await canvas.findByRole("button", { name: "Update failed. Try again" });
    await expect(retry).toHaveAttribute("title", "Error: The download was interrupted");
    await expect(relaunch).not.toHaveBeenCalled();
  },
};
