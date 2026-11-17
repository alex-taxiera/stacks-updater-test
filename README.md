# Updater Test

A pnpm workspace made with [stacks](https://github.com/alex-taxiera/stacks).

## Getting started

```sh
corepack enable   # once, for pnpm
pnpm install
pnpm test
```

[AGENTS.md](AGENTS.md) lists each app and package, and how to run it.

## Layout

- `apps/*`: apps that deploy.
- `packages/*`: packages that publish, and `packages/ui`, the shared Chakra UI components, once
  an app needs them.

Add another with `pnpm stacks add <stack> <name>` (`pnpm stacks list` shows the
stacks).

## Tooling

oxlint and oxfmt (`pnpm lint`, `pnpm format`), TypeScript, Vitest (`pnpm test`), husky and
lint-staged, and TanStack Intent for the agent skills packages ship (`pnpm skills`). Dependabot
opens weekly update PRs.
