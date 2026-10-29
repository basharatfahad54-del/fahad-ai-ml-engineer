import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { buildHomeHead } from './scripts/seo-lib.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'portfolio-seo-html',
        transformIndexHtml(html) {
          return html.replace(
            '<!--seo-head-->',
            buildHomeHead({ ...process.env, ...env }),
          )
        },
      },
    ],
  }
})
