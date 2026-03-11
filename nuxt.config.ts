// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-03-10',

    future: {
      compatibilityVersion: 4,
    },

    hooks: {
      async 'build:before'() {
        const { mkdirSync, writeFileSync, existsSync } = await import('node:fs')
        const { resolve } = await import('node:path')
        const serverDist = resolve('.nuxt/dist/server')
        mkdirSync(serverDist, { recursive: true })
        const precomputedFile = resolve(serverDist, 'client.precomputed.mjs')
        if (!existsSync(precomputedFile)) {
          writeFileSync(precomputedFile, 'export default undefined')
        }
      }
    },

    modules: [
      '@nuxt/ui',
      '@nuxtjs/supabase',
      'nuxt-quasar-ui',
      '@pinia/nuxt',
      '@nuxt/eslint',
    ],

    quasar: {
      plugins: ['Notify', 'Dialog'],
      extras: {
        font: 'roboto-font',
        fontIcons: ['material-icons'],
      },
      config: {
        brand: {
          primary: '#009506',
          secondary: '#26A69A',
          accent: '#9C27B0',
          dark: '#1d1d1d',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037',
        }
      }
    },

    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY,
      redirect: false,  // manejamos auth manualmente
    },

    runtimeConfig: {
      public: {
        siteUrl: process.env.SITE_URL || 'https://noticia-paisa.com',
      }
    },

    ssr: true,

    build: {
      transpile: ['quasar'],
    },

    vite: {
      plugins: [
        {
          name: 'fix-quasar-virtual-resolution',
          enforce: 'pre',
          resolveId(id, importer) {
            if (importer?.includes('__quasar') && id.startsWith('quasar/')) {
              return this.resolve(id, process.cwd() + '/package.json', { skipSelf: true })
            }
          },
        },
      ],
    },
  })
