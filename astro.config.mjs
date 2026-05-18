// @ts-check
import { defineConfig } from 'astro/config'
import sanity from '@sanity/astro'

export default defineConfig({
  integrations: [
    sanity({
      projectId: '84i991bj',
      dataset: 'production',
      apiVersion: '2026-03-01',
      useCdn: false,
    }),
  ],
})
