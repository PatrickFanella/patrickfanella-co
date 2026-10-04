import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

// Latin subsets used above the fold on every route. Preloading them lets the
// fonts arrive before the app renders, so text does not swap after paint.
const preloadedFonts = [/^inter-latin-wght-normal-.*\.woff2$/, /^space-grotesk-latin-wght-normal-.*\.woff2$/, /^jetbrains-mono-latin-wght-normal-.*\.woff2$/]

function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((file) => preloadedFonts.some((pattern) => pattern.test(file.split('/').pop() ?? '')))
        if (files.length !== preloadedFonts.length) {
          throw new Error(`Expected ${preloadedFonts.length} preloaded font files, found ${files.length}: ${files.join(', ')}`)
        }
        return files.map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  envDir: '..',
  plugins: [react(), tailwindcss(), preloadFonts()],
  build: {
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
