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

## 2026-10-12: Phase 1 tokens, and the first 1:1 proof

**What we did**
- Chose Terrazzo over Style Dictionary: it is built for DTCG first and validates 2025.10 resolver files, which give us light and dark modes.
- Wrote shadcn's real theme to `tokens/` (primitives, light, dark) and the kit's 22 text styles as typography tokens. `npm run tokens` generates `src/styles/tokens.css`, which replaced the hard-coded `oklch(...)` values.
- Updated 31 Figma variables to match Git and gave 53 of them WEB code syntax (`var(--primary)`), so Figma and code share names.
- Added the parity check: a read-only `use_figma` snapshot (`parity/figma-snapshot.figma.js`) plus `npm run parity`.
- First run: 5 differences, all from the kit's neutral-400 being Tailwind v3 (#a3a3a3) instead of v4 (#a1a1a1). Fixed in Figma, re-exported, and the check passed: 128 values, 1:1.

**What broke, and the fix**
- Terrazzo's `variableName` must return the full name including `--`, or aliases come out as `var(neutral-100)`.
- Tailwind v4 reds are outside sRGB. Terrazzo emits an sRGB fallback plus the exact color under `@media (color-gamut: p3)`. Figma stores sRGB, so the check compares sRGB hex with a tolerance of 1 per channel.
- The kit's raw palette is Tailwind v3 for some colors. Nobody could see a 2-shade grey difference; the check could.
- The first snapshot script resolved aliases in the wrong mode. Fix: keep the current mode when an alias stays inside the same collection.

**Prompt that worked**
> Apply the changes to Figma; we don't need to update every component. Just showcase the workflow and how the two sides can be 1:1.

## 2026-10-12: Color and Typography pages

**What we did**
- Built the style guide app shell: Carbon-style navigation (Foundations, Components), and a dark mode toggle that uses our own shadcn Button.
- The Color page lists every semantic token with light and dark swatches, its CSS variable, its Figma variable and both values. The Typography page renders a specimen for each of the 22 text styles.
- Both pages import `tokens/*.json` and `parity/figma-snapshot.json` directly, so the docs show exactly what the parity check compares. Nothing is copied by hand.

**Checked in the browser**
- Heading 1 renders as Geist 500, 40/40 px, -1.5 px tracking: the same as the Figma text style.

**Lesson**
- A dark swatch on a light page is just the same CSS variable inside a `.dark` wrapper. That only works because every color is a variable.

## 2026-10-12: Phase 3, components 1:1

**What we did**
- `figma-map.json` maps Button, Icon Button and Banner to code, with Figma node IDs. The parity check now also compares each component's Figma variant options with the `cva()` variants in code, in both directions. Breaking one mapping on purpose (`xs` → `xxs`) was caught at once.
- Button: replaced raw Tailwind values (`rounded-[min(...)]`, `text-[0.8rem]`, a `color-mix` hover) with token classes. Measured every size in Figma and in the browser; fixed four drifts (Small text in code; Small/XS gap, XS height and Icon XS size in Figma). All four sizes now match on height, padding, gap, radius and font size.
- Banner: reworked shadcn Alert into info/success/warning/error. Added status tokens (Tailwind v4) in Git, then Figma variables with code syntax, then turned the Figma Alert into a Banner set with matching variants. Parity: 146 values and 3 component APIs, 1:1.
- Heading and Text components only accept named text styles.
- Button and Banner pages with Guidelines, Specifications, Code and Accessibility tabs. Specifications shows the exported Figma render next to the live component, and lists tokens read from the component source. Contrast ratios are computed from the Figma snapshot.

**What broke, and the fix**
- green-600 and amber-600 fail AA on white (3.2:1). Used the 700 shades in light mode.
- Swapping an icon instance in Figma kept the old icon's color, and one triangle icon came in at 16×24. Rebound the strokes and resized.
- The Banner was 38px in code and 36px in Figma: a CSS border adds to the box, a Figma inside stroke does not. Fix: `inset-ring` instead of `border`.
- Copying base64 PNG data by hand corrupted one image twice. Fix: export in 240-character pieces with a checksum each, and verify the PNG CRCs before saving.
- oxlint flags JSX in table row arrays as missing keys; the Table component adds keys, so the rule is off for `src/styleguide/`.

**Prompt that worked**
> Banner colors: use Tailwind v4's. Rendering check: side by side in the docs now, automated pixel diff later.

## 2026-10-13: Phase 4, the Card walkthrough (steps 2–6)

**What we did**
- David designed "Card - Nova - Confirmation" in Figma from library parts only. A read-only `use_figma` design review found every value bound to a variable or text style.
- The review found three things to fix before coding: Figma spacing variables had no link to code, so parity could not see spacing; the body and footer each had a 1px border (a 2px line); the footer had its own 12px radius inside the card's 14px clip. David approved fixes for all three.
- Spacing is now token-backed: one `spacing` token in Git (0.25rem) becomes Tailwind's `--spacing`, Figma's 28 spacing variables carry `calc(var(--spacing) * n)` code syntax, and parity checks each one (202 values). Setting the base to 0.3rem on purpose produced 56 differences.
- Tailwind's `text-xs/sm/base/lg` now read the typography tokens, so font sizes in components come from tokens too.
- `shadcn add card`, restyled to the design: no outer padding, semibold title, solid muted footer, one divider drawn inside the box. Measured in the browser: 400 × 260, header 76, body 120, footer 64, radius 14px. All the same as Figma.
- Card is in `figma-map.json`, and the parity check now also compares each component's corner radius token with the `rounded-*` class in code.

**What broke, and the fix**
- A 1px divider drawn as a CSS border adds 1px of height; Figma's inside stroke does not. Fix: an `inset-border-b` utility that draws it as an inset shadow.
- Copying a 18KB PNG by hand: one of 45 checksummed pieces came back wrong; re-fetching only that piece fixed it.
- The docs image showed as broken until a reload: the page had requested it before the file existed.

**Prompt that worked**
> I made a new card component. Add it to style-bender; it's already in Figma. I don't need to capture making it in Figma.

## 2026-10-13: Phase 4, steps 7–8 (drift caught, then resolved)

**What happened**
- David changed the Figma Card's corner radius from radius-xl (14px) to radius-2xl (18px).
- A fresh snapshot compared fingerprints of all 90 variables and 22 text styles with the saved snapshot (nothing else had changed), then `npm run parity` reported exactly one difference: `Card radius: code --radius-xl, Figma --radius-2xl`.
- Following rule 1, the diff went to David. He chose to set Figma back to radius-xl. A new snapshot confirmed it, and parity returned to 1:1 without a code change.

**Lesson**
- The check names the component, the property and both tokens, so the decision is quick: either Git follows the design (change `rounded-xl` to `rounded-2xl`), or the design goes back. Both are valid; the tool makes the drift visible either way.
- A combined fingerprint of all variables depends on their order. Compare sorted keys, or entry by entry, or you get false alarms.
- Exporting a fingerprint per entry instead of the full values keeps the Figma response small and still proves nothing else changed.
