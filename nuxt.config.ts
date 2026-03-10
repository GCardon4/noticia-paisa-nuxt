// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      sassVariables: true,
    },

    supabase: {
      redirect: false,  // manejamos auth manualmente
    },

    runtimeConfig: {
      public: {
        siteUrl: process.env.SITE_URL || 'https://noticia-paisa.com',
      }
    },

    ssr: true,
  })