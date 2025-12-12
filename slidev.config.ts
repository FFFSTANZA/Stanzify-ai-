import { defineConfig } from '@slidev/cli'

export default defineConfig({
  title: 'Stanzify Presentation',
  description: 'AI-powered presentation generator',
  author: 'Stanzify',
  keywords: 'slidev, presentation, ai, groq',
  fonts: {
    sans: 'Inter',
    serif: 'Inter',
    mono: 'Fira Code',
  },
  themes: [
    '@slidev/theme-default',
    '@slidev/theme-seriph',
  ],
  remoteAssets: true,
  css: 'unocss',
  export: {
    format: 'pdf',
    timeout: 30000,
    dark: false,
    withToc: false,
    dark: 'current',
    withClicks: false,
  },
  MonacoRun: {
    devtools: true,
  },
  Info: {
    name: 'Stanzify',
    version: '1.0.0',
    description: 'AI-powered presentation generator',
    author: 'Stanzify Team',
  },
  download: true,
  showfooter: true,
  showFilename: false,
  highlighter: 'shiki',
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  controller: true,
  record: true,
  presenter: true,
  remote: true,
  exportFilename: 'presentation',
  build: {
    outDir: 'dist',
    withToc: false,
  },
})