<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

useSeoMeta({
  title: 'Noticia Paisa',
  description: 'Noticias de Antioquia y el Área Metropolitana. Siempre Actualizados.',
  ogTitle: 'Noticia Paisa',
  ogDescription: 'Noticias de Antioquia y el Área Metropolitana.',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
