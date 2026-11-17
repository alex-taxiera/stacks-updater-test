# AGENTS.md

Guide for coding agents working in this repo. Read [README.md](README.md) for what it is.

Sections between `<!-- stacks:… -->` markers are managed by [stacks](https://github.com/alex-taxiera/stacks):
`stacks add` and `stacks update` rewrite them. Edit outside the markers freely.

<!-- intent-skills:start -->

## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

## Shape

A pnpm workspace. Apps that deploy live in `apps/<name>`; packages that publish, and the shared UI
package, live in `packages/<name>`.

<!-- stacks:apps:start -->
<!-- stacks:block:ui -->

- `packages/ui` (`@stacks-updater-test/ui`) — the Chakra UI v3 snippets, theme, provider and shared Storybook
  preview every app uses. Source only, no build step: import `@stacks-updater-test/ui/<snippet>`,
  `@stacks-updater-test/ui/theme`, `@stacks-updater-test/ui/storybook`. Storybook on 6008; `pnpm storybook` starts every
  package's (VS Code does when the folder opens).

<!-- /stacks:block:ui -->
<!-- stacks:block:rust -->

- `crates/core` (`app-core`) — the Rust logic the Tauri apps' commands call, tested on its
  own (`cargo test -p app-core`). The root `Cargo.toml` is the workspace: `crates/*` and
  `apps/*/src-tauri`.

<!-- /stacks:block:rust -->
<!-- stacks:block:app:desktop -->

- `apps/desktop` (package `desktop`) — Desktop: a Tauri 2 desktop app. The window is
  Vite, React and Chakra (`src/`); its commands are Rust (`src-tauri/src/lib.rs`), over
  `crates/core`.
  - `pnpm --filter desktop tauri dev` opens it (Vite on 3000); `tauri build` makes the installers.
  - The front end calls Rust only through `src/api.ts`, which Storybook mocks
    (`.storybook/preview.tsx`), as it does every `@tauri-apps/*` module the app uses.
  - Plugins: dialog (the system's file pickers) and opener (links in the browser), through `api`.
  - What the window may do is in `src-tauri/capabilities/`: grant a command or plugin there,
    narrowly, before using it. The content security policy is in `tauri.conf.json`.

<!-- /stacks:block:app:desktop -->
<!-- stacks:apps:end -->

## Commands

| Task                 | Command                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| Install              | `pnpm install` (also runs `agents:sync`; `corepack enable` once for pnpm)    |
| Tests                | `pnpm test`                                                                  |
| Typecheck, build     | `pnpm typecheck` / `pnpm build`                                              |
| Lint, format         | `pnpm lint` / `pnpm format` (oxlint and oxfmt, from the root)                |
| Agent skills         | `pnpm skills` (Intent's `list`); `pnpm exec intent load <package>#<skill>`   |
| Add an app           | `pnpm stacks add <stack> <name>` (`pnpm stacks list` for stacks)             |
| Update stacks' parts | `pnpm stacks update` (the AGENTS.md blocks and MCP servers; `--check` in CI) |

Run one package's script with `pnpm --filter <name> <script>`. Shared dependency versions live in
the `catalog:` in `pnpm-workspace.yaml`; a package asks for one with `"catalog:"`, so every package
gets the same versions.

## Rules

- **pnpm only.** Never run `npm`, `npx` or `yarn`: use `pnpm`, `pnpm exec` and `pnpm dlx`. The root
  `package.json` refuses other package managers (`devEngines`, `packageManager`).
- **Imports inside an app or package use `#/`** (`#/components/Header`) where its `tsconfig.json`
  has `paths`, and relative paths with extensions (`./greet.ts`) where it runs on Node directly.
- **Types over casts** in TypeScript: narrow with a guard instead of `as`.

<!-- stacks:rules:start -->
<!-- stacks:block:rust -->

- **Rust:** `cargo fmt`, and `cargo clippy --workspace --all-targets -- -D warnings` clean.
  Work goes in `crates/core`; a Tauri command only converts between it and the front end.
  A type the front end sees derives `TS` with `#[ts(export)]`; `pnpm bindings` writes it to
  `apps/desktop/src/bindings`, and CI fails when that's out of date.

<!-- /stacks:block:rust -->
<!-- stacks:block:release:desktop -->

- **`apps/desktop` releases from `.github/workflows/release-desktop.yml`**: set the version in
  `apps/desktop/src-tauri/tauri.conf.json`, push the tag `desktop@v<version>` (or run the workflow by hand),
  then publish the draft release it makes once its installers are attached. Installers
  aren't code-signed: Windows SmartScreen and macOS Gatekeeper warn until they are.

<!-- /stacks:block:release:desktop -->
<!-- stacks:block:updater:desktop -->

- **`apps/desktop` updates itself** from the `desktop-updater` release, which
  `.github/workflows/updater-desktop.yml` points at a release when you publish its draft.
  Release builds sign updates with the `DESKTOP_UPDATER_KEY` and `DESKTOP_UPDATER_KEY_PASSWORD`
  secrets: `pnpm --filter desktop updater:keys --secrets` sets them from the key in
  `~/.tauri`, which must never be lost or committed. A new key strands every installed copy.

<!-- /stacks:block:updater:desktop -->
<!-- stacks:rules:end -->

<!-- stacks:ui:start -->
<!-- stacks:block:ui -->

## UI

- **Chakra UI v3**, not v2: compound components (`Dialog.Root`, `Switch.Root`…) and
  `colorPalette`. Check an unfamiliar component's API with the `chakra-ui` MCP server before using
  it, and load the `chakra-ui-builder` skill (or `chakra-ui-refactor`) for UI work.
- **Reach for a snippet before a compound component.** `packages/ui/src/components/ui` holds
  Chakra's snippets, shared by every app, so a component writes `<Switch checked>Label</Switch>`,
  not the five parts behind it. oxlint enforces it: importing a component that has a snippet (or
  could have one) from `@chakra-ui/react` is an error outside `packages/ui/src` and `.storybook`.
  Before writing UI, check what's there with the `storybook-ui` MCP's `docs-list`. Add a missing
  snippet with `pnpm --filter @stacks-updater-test/ui exec chakra snippet add <name> --tsx --outdir src/components/ui`,
  convert it to React 19 style (`ref` as a prop, no `forwardRef`, no `"use client"`), import within
  the package by relative path, and give it a story so `docs-show` documents it.
- **Theme tokens, recipes and slot recipes live in `packages/ui/src/theme.ts`** and
  `packages/ui/src/recipes`, one system for every app. Run `pnpm --filter @stacks-updater-test/ui typegen` after
  changing them so their props are typed. Use semantic tokens (`fg.muted`, `bg.subtle`,
  `accent.fg`…) over raw colours so both colour modes work.

### Storybook and its MCP servers

Stories sit next to their component (`Header.tsx` and `Header.stories.tsx`) and every one runs as a
test under `pnpm test`. Each package has its own Storybook; the app Storybooks compose the library's
as a "UI library" ref. Shared preview setup (theme switcher, Chakra provider, toaster, a11y
settings) is `@stacks-updater-test/ui/storybook`; each package's `.storybook/preview.tsx` spreads `basePreview` and
calls `resetUi()` in its `beforeEach`.

- Use the `storybook-<package>` MCP tools before answering questions about or changing UI
  components. Never guess props: call `docs-list` and `docs-show`, and use only props that are
  documented or shown in example stories. If a prop isn't documented, ask instead of assuming.
- Call `get-storybook-story-instructions` before creating or updating stories, and run `test-run`
  to verify your changes.
- Write or update a story when you create a reusable component or a snippet, or add props, states
  or variants to one. Cover each state the component can reach (empty, loading, error…), not every
  prop combination. Don't write stories for pages or thin wrappers.
- Add a `play` function that checks the behaviour a story is about, with role- or label-based
  queries. Chakra overlays (dialogs, tooltips, toasts) render in a portal: query them with
  `screen`, not `canvas`, and `waitFor` them to finish animating in.
- Don't wrap stories in a provider or add a `<Toaster />`; `.storybook/preview.tsx` does. Don't add
  `tags: ["autodocs"]` or a `title`; titles come from the file path.
- Prefer presentational components that take callbacks (`onSave`) so stories pass `fn()` args.

### Accessibility

Storybook's a11y addon runs axe on every story. Violations are reported in the a11y panel and by
the MCP's `test-run`, but don't fail tests (`a11y.test: "todo"` in `@stacks-updater-test/ui/storybook`).

- Fix structural issues yourself: labels, roles, `aria-label` on icon-only buttons, alt text,
  table headers, heading order.
- Ask before changing anything visual, such as colour contrast, sizes or focus styles: describe
  the issue and offer two or three options.
- Don't turn rules off to make a report go away.

<!-- /stacks:block:ui -->
<!-- stacks:ui:end -->

## Agent config and MCP servers

`AGENTS.md`, `.agents/skills/` and `.agents/mcp.json` are the sources. `pnpm agents:sync` (run on
install, checkout and merge) generates `CLAUDE.md`, `.claude/skills/`, and the MCP configs for
Claude Code (`.mcp.json`), Cursor (`.cursor/mcp.json`) and VS Code (`.vscode/mcp.json`). Those
are gitignored: edit the sources, never the generated files. Skills from other repositories come
from `pnpm dlx skills add <owner/repo>` and are pinned in `skills-lock.json`; skills that ship
inside packages are Intent's (above).

<!-- stacks:mcp:start -->
<!-- stacks:block:chakra-ui -->

- `chakra-ui` — Chakra's component docs, props and examples.

<!-- /stacks:block:chakra-ui -->
<!-- stacks:block:storybook-ui -->

- `storybook-ui` — `packages/ui`'s Storybook, port 6008. Each app's Storybook is `storybook-<app>`, and is only up while it runs.

<!-- /stacks:block:storybook-ui -->
<!-- stacks:block:storybook-desktop -->

- `storybook-desktop` — `apps/desktop`'s Storybook, port 6009.

<!-- /stacks:block:storybook-desktop -->
<!-- stacks:mcp:end -->

## Commits

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
`<type>(<scope>): <description>`, for example `feat(web): add sign-in page` or
`chore(deps): bump vite`. Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`,
`build`, `ci`, `chore`. Scope by app or package. Imperative, lower case, no trailing period; mark
breaking changes with `!` and a `BREAKING CHANGE:` footer. The default branch is `trunk`.

The pre-commit hook runs lint-staged (oxlint `--fix` and oxfmt on staged files). Don't skip it with
`--no-verify`; fix what it reports.
