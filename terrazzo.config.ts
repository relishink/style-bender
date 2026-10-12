import { defineConfig } from '@terrazzo/cli'
import css from '@terrazzo/plugin-css'

// Builds src/styles/tokens.css from the DTCG tokens in tokens/.
// Variable names drop the "primitive." / "semantic." group so they match shadcn's CSS variables
// (semantic.primary -> --primary, primitive.neutral.500 -> --neutral-500).
export default defineConfig({
  tokens: ['./tokens/style-bender.resolver.json'],
  outDir: './src/styles/',
  plugins: [
    css({
      filename: 'tokens.css',
      variableName: (token) => '--' + token.id.replace(/^(primitive|semantic)\./, '').replace(/\./g, '-'),
      permutations: [
        { input: { theme: 'light' }, prepare: (css) => `:root {\n  ${css}\n}` },
        { input: { theme: 'dark' }, prepare: (css) => `.dark {\n  ${css}\n}` },
      ],
    }),
  ],
})
