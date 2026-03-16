<template>
  <q-page class="constrain q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <!-- Loading state -->
        <div v-if="pending" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="50px" />
          <div class="text-grey-7 q-mt-md">Cargando noticia...</div>
        </div>

        <!-- Error state -->
        <div v-else-if="!post || (!post.is_public && !isAuthor)" class="text-center q-pa-xl">
          <q-icon name="error_outline" size="80px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No se encontró la noticia</div>
          <q-btn label="Volver al inicio" color="primary" class="q-mt-md" @click="navigateTo('/')" unelevated />
        </div>

        <!-- Contenido del post -->
        <q-card v-else class="post-detail-card" flat bordered>
          <!-- Header con información del autor -->
          <q-item>
            <q-item-section avatar>
              <q-avatar size="56px" color="primary" text-color="white">
                <img :src="post.profiles?.avatar_url || '/og-default.jpg'" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold text-h6">{{ post.profiles?.full_name || 'Noticia Paisa' }}</q-item-label>
              <q-item-label caption class="text-subtitle2">{{ formatDate(post.created_at) }}</q-item-label>
            </q-item-section>

            <q-item-section side v-if="isAuthor">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="editPost">
                      <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="togglePublic">
                      <q-item-section avatar>
                        <q-icon :name="post.is_public ? 'visibility_off' : 'visibility'" color="orange" />
                      </q-item-section>
                      <q-item-section>{{ post.is_public ? 'Hacer privado' : 'Hacer público' }}</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="deletePost">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Video -->
          <div v-if="post.video_url" class="post-video-container">
            <video :src="post.video_url" controls class="full-width" style="max-height: 600px; background-color: black;" preload="metadata">
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          <!-- Imagen -->
          <q-img v-else-if="post.img_url" :src="post.img_url" :ratio="16/9" spinner-color="primary" class="post-image">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="broken_image" size="80px" color="grey-5" />
              </div>
            </template>
          </q-img>

          <!-- Contenido -->
          <q-card-section class="q-pa-lg">
            <h1 class="text-h4 text-weight-bold q-mb-md">{{ post.name }}</h1>

            <div class="row items-center q-mb-md q-gutter-sm">
              <q-chip color="grey-2" text-color="grey-8" icon="visibility">
                <span class="text-weight-medium">{{ postViews }}</span>
                <span class="q-ml-xs">{{ postViews === 1 ? 'vista' : 'vistas' }}</span>
              </q-chip>
            </div>

            <div v-if="post.municipio" class="q-mb-md">
              <q-chip
                color="orange-2"
                text-color="orange-9"
                icon="location_on"
                :label="`${post.municipio}${post.lugar ? ', ' + post.lugar : ''}`"
              />
            </div>

            <div v-if="post.tags?.length > 0" class="q-mb-lg">
              <q-chip v-for="tag in post.tags" :key="tag" color="blue-2" text-color="primary" :label="tag" icon="label" />
            </div>

            <div class="text-body1 text-grey-9 post-content">{{ post.description }}</div>

            <div v-if="!post.is_public || isAuthor" class="q-mt-lg">
              <q-badge v-if="!post.is_public" color="orange" label="Borrador" class="q-mr-sm" />
              <q-badge v-if="isAuthor" color="primary" label="Tu publicación" outline />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Acciones -->
          <q-card-actions class="q-pa-md">
            <q-btn flat icon="arrow_back" label="Volver" @click="$router.back()" />
            <q-space />
            <q-btn flat round icon="share" color="primary">
              <q-menu>
                <q-list style="min-width: 200px">
                  <q-item clickable v-close-popup @click="shareOnFacebook">
                    <q-item-section avatar><img src="/social-icons/icon-facebook.svg" class="social-icon"/></q-item-section>
                    <q-item-section>Facebook</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="shareOnWhatsApp">
                    <q-item-section avatar><img src="/social-icons/icon-whatsapp.svg" class="social-icon"/></q-item-section>
                    <q-item-section>WhatsApp</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="shareOnTwitter">
                    <q-item-section avatar><img src="/social-icons/icon-twitter.svg" class="social-icon"/></q-item-section>
                    <q-item-section>Twitter / X</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="copyLink">
                    <q-item-section avatar><q-icon name="link" color="grey-7" /></q-item-section>
                    <q-item-section>Copiar enlace</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePostStore } from '~/stores/postStore'
import { useQuasar, date } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const postStore = usePostStore()
const supabase = useSupabaseClient()

const postId = route.params.id
const postViews = ref(0)
let viewsSubscription = null

const siteUrl = useRuntimeConfig().public.siteUrl

// Carga el post con SSR
const { data: post, pending } = await useAsyncData(`post-${postId}`, async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles!autor(full_name, avatar_url), views_post(views)`)
    .eq('id', postId)
    .single()

  if (error || !data) return null

  return { ...data, views: data.views_post?.[0]?.views || 0 }
})

// SEO con datos del post — computed para SSR reactivo
const seoTitle = computed(() => post.value?.name || 'Noticia Paisa')
const seoDescription = computed(() => post.value?.description?.substring(0, 155) || 'Lee esta noticia en Noticia Paisa')
const seoUrl = computed(() => `${siteUrl}/post/${postId}`)

// Imagen OG: transforma imágenes de Supabase a JPEG 1200×630 para máxima compatibilidad con WhatsApp
const seoImage = computed(() => {
  const img = post.value?.img_url
  if (!img) return `${siteUrl}/og-default.jpg`
  // Usa el render endpoint de Supabase para estandarizar formato y dimensiones
  if (img.includes('/storage/v1/object/public/')) {
    return img.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + '?width=1200&height=630&resize=cover&format=origin'
  }
  return img
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogSiteName: 'Noticia Paisa',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogImageSecureUrl: seoImage,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogUrl: seoUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

const myUserId = ref(null)
const isAuthor = computed(() => myUserId.value && myUserId.value === post.value?.autor)

onMounted(async () => {
  if (postId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) myUserId.value = user.id

    // Sincroniza con el store
    if (post.value) postStore.currentPost = post.value

    const result = await postStore.incrementPostViews(postId)
    if (result.success) postViews.value = result.views

    viewsSubscription = postStore.subscribeToPostViews(postId, (newViews) => {
      postViews.value = newViews
    })

    postViews.value = await postStore.getPostViews(postId)
  }
})

onUnmounted(() => {
  if (viewsSubscription) postStore.unsubscribeFromPostViews(viewsSubscription)
})

const formatDate = (dateString) => date.formatDate(dateString, 'D [de] MMMM [de] YYYY, h:mm A')

const editPost = () => navigateTo(`/editar-post/${post.value.id}`)

const togglePublic = async () => {
  const result = await postStore.togglePublic(post.value.id)
  $q.notify({
    type: result.success ? 'positive' : 'negative',
    message: result.success ? 'Visibilidad actualizada' : (result.error || 'Error al cambiar visibilidad'),
    position: 'top'
  })
  if (result.success) await refreshNuxtData(`post-${postId}`)
}

const deletePost = () => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.',
    cancel: true, persistent: true
  }).onOk(async () => {
    const result = await postStore.deletePost(post.value.id)
    if (result.success) {
      $q.notify({ type: 'positive', message: 'Noticia eliminada correctamente', position: 'top' })
      navigateTo('/')
    } else {
      $q.notify({ type: 'negative', message: result.error || 'Error al eliminar', position: 'top' })
    }
  })
}

const shareOnFacebook = () => {
  const url = `${siteUrl}/post/${postId}`
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = () => {
  const url = `${siteUrl}/post/${postId}`
  window.open(`https://wa.me/?text=${encodeURIComponent(`${post.value.name}\n\n${url}`)}`, '_blank')
}

const shareOnTwitter = () => {
  const url = `${siteUrl}/post/${postId}`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value.name)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  const url = `${siteUrl}/post/${postId}`
  try {
    await navigator.clipboard.writeText(url)
    $q.notify({ type: 'positive', message: 'Enlace copiado al portapapeles', position: 'top', icon: 'link' })
  } catch {
    $q.notify({ type: 'negative', message: 'No se pudo copiar el enlace', position: 'top' })
  }
}
</script>

<style scoped>
.post-detail-card {
  border-radius: 12px;
  overflow: hidden;
}

.post-image {
  max-height: 600px;
}

.post-content {
  line-height: 1.8;
  white-space: pre-line;
  font-size: 1.1rem;
}

.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
