# style-bender

A small showcase design system. Design owns tokens and CSS in this coded library; Figma is a 1:1 mirror of it. The repo doubles as a training demo, so prefer clear, well-explained steps over clever ones.

## Stack
Vite + React + TypeScript, shadcn/ui (components copied into `src/components/ui`), Tailwind v4 reading CSS variables generated from tokens, Storybook, and a DTCG 2025.10 token pipeline (Style Dictionary or Terrazzo, chosen in Phase 1).

## Ground rules
1. **Git is the source of truth.** When Figma and code disagree, stop and show the diff to David.
2. **Commit straight to `main`.** No branches or PRs unless David asks. Keep commits small, one concern each.
3. **No hard-coded colors, font sizes or spacing in components.** Everything comes from tokens. No Tailwind arbitrary values such as `bg-[#...]`.
   - Known temporary exception: shadcn's default `oklch(...)` values in `src/index.css` and default component classes. Phase 1 replaces them.
4. **Show a short plan before each phase and wait for David's OK.**
5. **After each working session, append to `docs/lesson-log.md`:** what we did, what broke, the fix, and any prompt that worked well.

## Figma
- Plan: paid. Still do all Figma reads and writes through `use_figma`, and load the `figma-use` skill first.
- Never call `get_design_context`, `get_variable_defs`, `get_metadata` or `get_screenshot` without asking.
- Code Connect is unavailable. Component mappings live in `figma-map.json`.

## Scope
- Foundations: color tokens (light and dark), typography scale.
- Components: Button (primary, secondary, tertiary, ghost, danger; 3 sizes), Banner (from shadcn Alert: info, success, warning, error), Heading/Text.
- Card is a later walkthrough. Do not add it yet.
- Docs follow Carbon: Foundations and Components sections; each component page has Guidelines, Specifications, Code and Accessibility tabs.

## Layout
- `tokens/`: DTCG token JSON (design-owned, see CODEOWNERS).
- `src/components/ui/`: shadcn components and their stories.
- `docs/`: `foundations/`, `components/`, `lesson-log.md`.
- `figma-map.json`: Figma component to code mapping.

## Commands
- `npm run dev`: app. `npm run storybook`: Storybook on :6006. `npm run build`: typecheck + build. `npm run lint`.

## Tools
- `gh` is at `~/.local/bin/gh`, logged in with a fine-grained token for this repo only. Never touch other repos or orgs.
