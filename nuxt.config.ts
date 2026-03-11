// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-03-10',

    future: {
      compatibilityVersion: 4,
    },
    modules: [
      '@nuxtjs/supabase',
      'nuxt-quasar-ui',
      '@pinia/nuxt',
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
  })