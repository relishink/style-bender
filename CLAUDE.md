# style-bender

A small showcase that proves a 1:1 match between a Figma library and a custom coded style guide. The repo doubles as a training demo, so prefer clear, well-explained steps over clever ones.

## Roles
- **Design (David in Figma, with Claude):** owns tokens and visual intent.
- **Style guide team (engineering):** builds and maintains the coded style guide in this repo.
- The coded style guide is the only rendered reference. There is no Storybook or other middle layer: Figma is compared directly with the style guide app.

## Stack
Vite + React + TypeScript, shadcn/ui (components copied into `src/components/ui`), Tailwind v4 reading CSS variables generated from tokens, and DTCG 2025.10 tokens built with Terrazzo (`terrazzo.config.ts`): `tokens/style-bender.resolver.json` loads primitives, then the light or dark theme.

## Ground rules
1. **Git is the source of truth.** When Figma and code disagree, stop and show the diff to David.
2. **Commit straight to `main`.** No branches or PRs unless David asks. Keep commits small, one concern each.
3. **No hard-coded colors, font sizes or spacing in components.** Spacing classes read `--spacing` and `text-xs/sm/base/lg` read the typography tokens, so Tailwind's scale is token-backed. Everything comes from tokens. No Tailwind arbitrary values such as `bg-[#...]`.
   - Colors, radius, spacing and type come from `tokens/` via `src/styles/tokens.css` (generated, never edit by hand). Heading and Text use the typography tokens.
   - Enforced: `npm run check:tokens` (also in the pre-commit hook and CI).
4. **Show a short plan before each phase and wait for David's OK.**
5. **After each working session, append to `docs/lesson-log.md`:** what we did, what broke, the fix, and any prompt that worked well.

## Figma
- Plan: paid. Still do all Figma reads and writes through `use_figma`, and load the `figma-use` skill first.
- Never call `get_design_context`, `get_variable_defs`, `get_metadata` or `get_screenshot` without asking.
- Code Connect is unavailable. Component mappings live in `figma-map.json`.

## Scope
- Foundations: color tokens (light and dark), typography scale.
- Components (built, 1:1): Button (shadcn's set: default, secondary, outline, ghost, destructive, link; sizes xs, sm, default, lg), Banner (`banner.tsx`, from shadcn Alert: info, success, warning, error; Figma set renamed to "Banner"), Heading/Text (`typography.tsx`, text styles only).
- Figma starting point: Obra's free "shadcn/ui kit Community Edition", Nova style (matches our `base-nova` code). Figma names map to code as Primary = `default`, Error = `destructive`.
- Where the kit and shadcn's real theme differ, shadcn's theme (in Git) wins and Figma is updated.
- Card (`card.tsx`): designed in Figma by David ("Card - Nova - Confirmation", node 5021:12383), brought to code in Phase 4.
- Pagination (`pagination.tsx`): from the kit's "Pagination" (node 1962:14050), built from our Buttons; number buttons map Figma `Active=On|Off` to `isActive`.
- The style guide app follows Carbon: Foundations and Components sections; each component page has Guidelines, Specifications, Code and Accessibility tabs, with live examples rendered by the app itself.
- No Storybook.

## Layout
- `tokens/`: DTCG token JSON (design-owned, see CODEOWNERS): `primitives.tokens.json`, `typography.tokens.json`, `light.tokens.json`, `dark.tokens.json`, and the resolver.
- `src/styles/tokens.css`: generated CSS variables. Names match shadcn's (`--primary`, `--neutral-500`).
- `src/components/ui/`: shadcn components.
- `src/styleguide/`: the style guide app (hash routes, Carbon-style Foundations and Components). Pages read `tokens/` and `parity/figma-snapshot.json` directly, never hand-copied values.
- `parity/`: `figma-snapshot.figma.js` (run read-only via `use_figma`, save output to `figma-snapshot.json`) and `check.mjs` (`npm run parity`).
- `docs/`: `foundations/`, `components/`, `lesson-log.md`.
- `figma-map.json`: Figma component sets (with node IDs) mapped to code components and prop values. `npm run parity` checks each mapping in both directions.
- `public/figma/`: PNG renders exported from Figma (read-only `use_figma`) for the side-by-side on each component page.

## Commands
- `npm run tokens`: rebuild `src/styles/tokens.css` from `tokens/`. `npm run dev`: style guide app. `npm run build` (runs tokens first): typecheck + build. `npm run lint`. `npm run parity`: compare `tokens/` with the saved Figma snapshot. `npm run check:tokens`: flag hard-coded values in components. `npm run visual`: pixel diff of components against `public/figma/*.png`.

## Tools
- `gh` is at `~/.local/bin/gh`, logged in with a fine-grained token for this repo only. Never touch other repos or orgs.

## Adding or changing a component (the 1:1 loop)
1. Change code and/or tokens; run `npm run tokens`.
2. Update Figma through `use_figma` (bind to variables, never raw values).
3. Add or update the entry in `figma-map.json` (a variant can map to a cva prop value, or with `"kind": "boolean"` to a true/false prop); add its node ID to `COMPONENT_SET_IDS` in `parity/figma-snapshot.figma.js`.
   - `shadcn add` may offer to overwrite our customised `button.tsx`: always answer no.
4. Re-run the snapshot, save `parity/figma-snapshot.json`, run `npm run parity` until it reports 1:1.
5. Re-export the Figma renders for the docs page and check sizes in the browser (Figma strokes sit inside the box: use `inset-ring`, not `border`, when height must match).

## Guardrails
- Pre-commit hook (`.githooks/pre-commit`, installed by `npm install`): `check:tokens` and `parity` must pass.
- CI (`.github/workflows/checks.yml`) on every push: build, lint, `check:tokens`, `parity`, `visual`. Diff images are uploaded when the pixel diff fails.
- Pixel diff: sizes may differ by at most 1px (Figma rounds text boxes up to whole pixels); up to 5% of pixels may differ (text anti-aliasing differs between Figma, macOS and Linux).
