<template>
  <q-page class="constrain q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <!-- Loading state -->
        <div v-if="postStore.loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="50px" />
          <div class="text-grey-7 q-mt-md">Cargando noticia...</div>
        </div>

        <!-- Error state -->
        <div v-else-if="!postStore.currentPost" class="text-center q-pa-xl">
          <q-icon name="error_outline" size="80px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No se encontró la noticia</div>
          <q-btn 
            label="Volver al inicio" 
            color="primary" 
            class="q-mt-md"
            @click="$router.push('/')"
            unelevated
          />
        </div>

        <!-- Contenido del post -->
        <q-card v-else class="post-detail-card" flat bordered>
          <!-- Header con información del autor -->
          <q-item>
            <q-item-section avatar>
              <q-avatar size="56px" color="primary" text-color="white">
                <img v-if="getAuthorAvatar()" :src="getAuthorAvatar()" />
                <q-icon v-else name="person" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold text-h6">{{ getAuthorName() }}</q-item-label>
              <q-item-label caption class="text-subtitle2">
                {{ formatDate(postStore.currentPost.created_at) }}
              </q-item-label>
            </q-item-section>

            <!-- Menú de opciones si es el autor -->
            <q-item-section side v-if="isAuthor()">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="editPost">
                      <q-item-section avatar>
                        <q-icon name="edit" color="primary" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="togglePublic">
                      <q-item-section avatar>
                        <q-icon :name="postStore.currentPost.is_public ? 'visibility_off' : 'visibility'" color="orange" />
                      </q-item-section>
                      <q-item-section>
                        {{ postStore.currentPost.is_public ? 'Hacer privado' : 'Hacer público' }}
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="deletePost">
                      <q-item-section avatar>
                        <q-icon name="delete" color="negative" />
                      </q-item-section>
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Video principal -->
          <div v-if="postStore.currentPost.video_url" class="post-video-container">
            <video
              :src="postStore.currentPost.video_url"
              controls
              class="full-width"
              style="max-height: 600px; background-color: black;"
              preload="metadata"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          <!-- Imagen principal -->
          <q-img
            v-else-if="postStore.currentPost.img_url"
            :src="postStore.currentPost.img_url"
            :ratio="16/9"
            spinner-color="primary"
            class="post-image"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="broken_image" size="80px" color="grey-5" />
              </div>
            </template>
          </q-img>

          <!-- Contenido principal -->
          <q-card-section class="q-pa-lg">
            <!-- Título -->
            <h1 class="text-h4 text-weight-bold q-mb-md">
              {{ postStore.currentPost.name }}
            </h1>

            <!-- Estadísticas -->
            <div class="row items-center q-mb-md q-gutter-sm">
              <!-- Vistas -->
              <q-chip
                color="grey-2"
                text-color="grey-8"
                icon="visibility"
              >
                <span class="text-weight-medium">{{ postViews }}</span>
                <span class="q-ml-xs">{{ postViews === 1 ? 'vista' : 'vistas' }}</span>
              </q-chip>
            </div>

            <!-- Ubicación -->
            <div v-if="postStore.currentPost.municipio" class="q-mb-md">
              <q-chip
                color="orange-2"
                text-color="orange-9"
                icon="location_on"
                :label="`${postStore.currentPost.municipio}${postStore.currentPost.lugar ? ', ' + postStore.currentPost.lugar : ''}`"
              />
            </div>

            <!-- Etiquetas -->
            <div v-if="postStore.currentPost.tags && postStore.currentPost.tags.length > 0" class="q-mb-lg">
              <q-chip
                v-for="tag in postStore.currentPost.tags"
                :key="tag"
                color="blue-2"
                text-color="primary"
                :label="tag"
                icon="label"
              />
            </div>

            <!-- Descripción completa -->
            <div class="text-body1 text-grey-9 post-content">
              {{ postStore.currentPost.description }}
            </div>

            <!-- Badges de estado -->
            <div v-if="!postStore.currentPost.is_public || isAuthor()" class="q-mt-lg">
              <q-badge 
                v-if="!postStore.currentPost.is_public" 
                color="orange" 
                label="Borrador"
                class="q-mr-sm"
              />
              <q-badge 
                v-if="isAuthor()" 
                color="primary" 
                label="Tu publicación" 
                outline
              />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Acciones -->
          <q-card-actions class="q-pa-md">
            <q-btn 
              flat 
              icon="arrow_back" 
              label="Volver" 
              @click="$router.back()"
            />
            
            <q-space />
            
            <q-btn flat round icon="share" color="primary">
              <q-menu>
                <q-list style="min-width: 200px">
                  <q-item clickable v-close-popup @click="shareOnFacebook">
                    <q-item-section avatar>
                      <img src="/social-icons/icon-facebook.svg" class="social-icon"/>
                    </q-item-section>
                    <q-item-section>Facebook</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="shareOnWhatsApp">
                    <q-item-section avatar>
                      <img src="/social-icons/icon-whatsapp.svg" class="social-icon"/>
                    </q-item-section>
                    <q-item-section>WhatsApp</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="shareOnTwitter">
                    <q-item-section avatar>
                      <img src="/social-icons/icon-twitter.svg" class="social-icon"/>
                    </q-item-section>
                    <q-item-section>Twitter / X</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="copyLink">
                    <q-item-section avatar>
                      <q-icon name="link" color="grey-7" />
                    </q-item-section>
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
import { onMounted, onUnmounted, ref } from 'vue'
import { usePostStore } from 'src/stores/postStore'
import { useAuthStore } from 'src/stores/authStore'
import { useQuasar, date } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

const postStore = usePostStore()
const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

// Estado para las vistas
const postViews = ref(0)
let viewsSubscription = null

// Carga el post al montar el componente
onMounted(async () => {
  const postId = route.params.id
  if (postId && !postStore.currentPost) {
    await postStore.fetchPostById(postId)
  }
  
  // Incrementa las vistas del post
  if (postId) {
    const result = await postStore.incrementPostViews(postId)
    if (result.success) {
      postViews.value = result.views
    }
    
    // Suscribe a cambios en tiempo real de las vistas
    viewsSubscription = postStore.subscribeToPostViews(postId, (newViews) => {
      postViews.value = newViews
    })
    
    // También carga las vistas actuales
    const currentViews = await postStore.getPostViews(postId)
    postViews.value = currentViews
  }
})

// Limpia la suscripción al desmontar
onUnmounted(() => {
  if (viewsSubscription) {
    postStore.unsubscribeFromPostViews(viewsSubscription)
  }
})

// Formatea la fecha de creación del post
const formatDate = (dateString) => {
  return date.formatDate(dateString, 'D [de] MMMM [de] YYYY, h:mm A')
}

// Obtiene el nombre del autor
const getAuthorName = () => {
  if (postStore.currentPost?.profiles?.full_name) {
    return postStore.currentPost.profiles.full_name
  }
  return 'Usuario'
}

// Obtiene la URL del avatar del autor
const getAuthorAvatar = () => {
  if (postStore.currentPost?.profiles?.avatar_url) {
    return postStore.currentPost.profiles.avatar_url
  }
  return null
}

// Verifica si el usuario actual es el autor del post
const isAuthor = () => {
  return authStore.user && postStore.currentPost && authStore.user.id === postStore.currentPost.autor
}

// Edita el post
const editPost = () => {
  router.push({ name: 'editar-post', params: { id: postStore.currentPost.id } })
}

// Alterna la visibilidad del post
const togglePublic = async () => {
  const result = await postStore.togglePublic(postStore.currentPost.id)
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Visibilidad actualizada',
      position: 'top'
    })
    // Recarga el post para actualizar el estado
    await postStore.fetchPostById(postStore.currentPost.id)
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Error al cambiar visibilidad',
      position: 'top'
    })
  }
}

// Elimina el post
const deletePost = () => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const result = await postStore.deletePost(postStore.currentPost.id)
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Noticia eliminada correctamente',
        position: 'top'
      })
      router.push('/')
    } else {
      $q.notify({
        type: 'negative',
        message: result.error || 'Error al eliminar la noticia',
        position: 'top'
      })
    }
  })
}

// Comparte en Facebook
const shareOnFacebook = () => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para compartir correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${postStore.currentPost.id}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

// Comparte en WhatsApp
const shareOnWhatsApp = () => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para que WhatsApp cargue las meta tags correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${postStore.currentPost.id}`
  const text = `${postStore.currentPost.name}\n\n${postUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank')
}

// Comparte en Twitter/X
const shareOnTwitter = () => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para compartir correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${postStore.currentPost.id}`
  const text = `${postStore.currentPost.name}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

// Copia el enlace del post al portapapeles
const copyLink = async () => {
  if (typeof window === 'undefined' || !navigator.clipboard) return
  
  // Usa la URL del sitio sin hash
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${postStore.currentPost.id}`
  
  try {
    await navigator.clipboard.writeText(postUrl)
    $q.notify({
      type: 'positive',
      message: 'Enlace copiado al portapapeles',
      position: 'top',
      icon: 'link'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'No se pudo copiar el enlace',
      position: 'top',
    })
  }
}
</script>

<script>
// preFetch para SSR - se ejecuta antes de renderizar en el servidor
export default {
  preFetch: async ({ store, currentRoute, redirect }) => {
    const postId = currentRoute.params.id
    
    if (!postId) {
      redirect({ name: 'home' })
      return
    }

    try {
      // Usa fetch directo de Supabase en SSR
      const { supabase } = await import('src/boot/supabase')
      
      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!autor (
            full_name,
            avatar_url
          )
        `)
        .eq('id', postId)
        .eq('is_public', true)
        .single()
      
      if (error || !post) {
        console.error('Error fetching post for SSR:', error)
        redirect({ name: 'home' })
        return
      }
      
      // Guarda el post en el store para que meta() pueda accederlo
      const postStore = store.state.value?.post || store.$state?.post
      if (postStore) {
        postStore.currentPost = post
      }
      
      return { post }
    } catch (error) {
      console.error('Error in preFetch:', error)
      redirect({ name: 'home' })
    }
  },
  
  meta({ store }) {
    // Intenta obtener el post del store de Pinia
    const postStore = store.state.value?.post || store.$state?.post
    const post = postStore?.currentPost
    
    // Si no hay post en el store, usa valores por defecto
    if (!post) {
      return {
        title: 'Noticia Paisa',
        meta: {
          description: { name: 'description', content: 'Noticias de Antioquia y Medellín' }
        }
      }
    }
    
    const description = post.description?.substring(0, 155) || 'Lee esta noticia en Noticia Paisa'
    const siteUrl = process.env.SITE_URL || 'https://noticia-paisa.com'
    const postUrl = `${siteUrl}/post/${post.id}`
    
    // Prioriza la imagen sobre el video para compartir en redes sociales
    let imageUrl = post.img_url || `${siteUrl}/icons/favicon-128x128.png`
    
    // Asegura que la URL de la imagen sea absoluta
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    }
    
    return {
      title: post.name,
      titleTemplate: title => title,
      
      meta: {
        description: { name: 'description', content: description },
        keywords: { name: 'keywords', content: post.tags?.join(', ') || 'noticias, antioquia, medellín' },
        
        // Open Graph / Facebook / WhatsApp
        ogTitle: { property: 'og:title', content: post.name },
        ogDescription: { property: 'og:description', content: description },
        ogImage: { property: 'og:image', content: imageUrl },
        ogImageSecure: { property: 'og:image:secure_url', content: imageUrl },
        ogImageWidth: { property: 'og:image:width', content: '1200' },
        ogImageHeight: { property: 'og:image:height', content: '630' },
        ogImageType: { property: 'og:image:type', content: 'image/jpeg' },
        ogUrl: { property: 'og:url', content: postUrl },
        ogType: { property: 'og:type', content: 'article' },
        ogSiteName: { property: 'og:site_name', content: 'Noticia Paisa' },
        ogLocale: { property: 'og:locale', content: 'es_CO' },
        
        // Twitter
        twitterCard: { name: 'twitter:card', content: 'summary_large_image' },
        twitterTitle: { name: 'twitter:title', content: post.name },
        twitterDescription: { name: 'twitter:description', content: description },
        twitterImage: { name: 'twitter:image', content: imageUrl },
        twitterSite: { name: 'twitter:site', content: '@NoticPaisa' },
        
        // Article Info
        articlePublishedTime: { property: 'article:published_time', content: post.created_at },
        articleAuthor: { property: 'article:author', content: post.profiles?.full_name || 'Noticia Paisa' },
        articleSection: { property: 'article:section', content: post.tags?.[0] || 'Noticias' }
      },
      
      link: {
        canonical: { rel: 'canonical', href: postUrl }
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
