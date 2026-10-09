# Lesson log

One entry per working session: what we did, what broke, the fix, and any prompt that worked well. This feeds the training deck.

## 2026-10-09: Phase 0 scaffold

**What we did**
- Cloned the repo, scaffolded Vite + React + TypeScript, added Tailwind v4, ran `shadcn init`, and added `button` and `alert`.
- Added Storybook (a11y and docs addons only) with Button and Alert stories in shadcn's default style.
- Added the folder skeleton, CODEOWNERS, a design-change PR template and CLAUDE.md.

**What broke, and the fix**
- `npm create vite` refuses a non-empty folder, and when I copied the template in it overwrote `README.md`. Fix: restore it with `git checkout README.md`. Lesson: scaffold in a scratch folder, then copy only what you need.
- TypeScript 6 rejects `baseUrl` (TS5101). Fix: use `paths` alone; it works in bundler mode.
- `brew` and `gh` were missing. Fix: download the official `gh` release, verify its checksum, install to `~/.local/bin`.
- `gh auth login` with the browser flow asks for access to every org on the account. Fix: use a fine-grained token limited to this one repo, fed to `gh` via the clipboard, never pasted into chat.
- Copying a command from chat overwrote the token on the clipboard, giving a 401 "Bad credentials". Fix: check with `pbpaste | cut -c1-11; pbpaste | wc -c` before logging in.
- `storybook init` added Chromatic, Vitest, Playwright and an MCP addon plus sample stories with hard-coded CSS. Fix: removed all of it, kept `addon-a11y` and `addon-docs`.

**Decisions**
- Dropped the branch-and-PR workflow: we commit straight to `main`.
- shadcn's default `oklch(...)` values in `src/index.css` are a temporary exception to the no-hard-coded-values rule until Phase 1.

**Prompt that worked**
> Do ALL Figma reads and writes through `use_figma`. Never call get_design_context, get_variable_defs, get_metadata or get_screenshot without asking me.

Putting the tool-cost constraint in the brief up front kept the whole session inside the Figma read cap.
