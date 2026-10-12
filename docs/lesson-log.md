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

## 2026-10-09: Dropped Storybook

**What we did**
- Removed Storybook and its stories. The goal is a direct 1:1 match between Figma and the coded style guide, and Storybook was a third surface in between.
- Reframed roles: David (designer, in Figma) works with Claude; a separate style guide team builds and maintains the coded style guide.

**Lesson**
- Decide what the "rendered truth" is before adding tooling. `storybook init` is one command, but every extra surface is another place where drift can hide.

## 2026-10-12: Chose a starter kit and inventoried it

**What we did**
- Picked Obra's free "shadcn/ui kit Community Edition" as the Figma starting point, because it pairs with the shadcn code already in the repo.
- Inventoried the duplicated file with read-only `use_figma` calls: 9 variable collections, 22 text styles, and "Nova" component sets for Button (6 variants, 4 sizes, 5 states), Icon Button and Alert.
- Compared the kit's `shadcn colors` variables (light and dark) with `src/index.css`.

**Findings**
- The kit has a "Nova" style, matching our `base-nova` code. Button height, padding, gap and radius match.
- Light mode matches except foreground, accent-foreground, primary-foreground and ring.
- Dark mode differs on about 15 tokens: the kit uses solid neutrals where code uses other steps or white at 10–15% opacity.
- No Figma variable has code syntax set, so nothing links Figma names to CSS variable names yet.

**What broke, and the fix**
- The first inventory script returned more than `use_figma`'s 20 KB limit. Fix: return counts and names first, then drill into one collection or page per call.

**Prompt that worked**
> Inventory the file read-only through use_figma, then show me the differences against the code before changing anything.
