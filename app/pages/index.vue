<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- Columna de posts -->
      <div class="col-12 col-sm-8">
        <!-- Encabezado -->
        <div class="text-center q-mb-xl">
          <h1 class="text-h3 text-weight-bold q-mb-md">Reportando para Vos!!!</h1>
        </div>

        <!-- Información pico y placa diario -->
        <div>
          <q-card class="bg-yellow-7 q-mb-md placa-card">
            <q-card-section class="text-center">
              <div class="text-h6 text-weight-bold">Pico y Placa Área Metropolitana</div>
              <div class="text-subtitle1 q-mb-sm">Hoy {{ nombreDia }}</div>

              <div v-if="numerosPicoPlaca" class="text-h4 text-weight-bold q-mt-sm q-mb-md">
                {{ numerosPicoPlaca }}
              </div>
              <div v-else class="text-h5 q-mt-sm q-mb-md">
                No hay restricción
              </div>

              <div v-if="numerosPicoPlaca" class="q-mt-md">
                <div class="text-weight-medium q-mb-xs">
                  🚗 Carros Particulares - <div class="text-caption">con el último número de la placa</div>
                </div>
                <div class="text-weight-medium">
                  🏍️ Motos de 2 y 4 Tiempos - <div class="text-caption">con el primer número de la placa</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Información pico y placa para taxis -->
        <div>
          <q-card class="bg-white q-mb-md placa-card-taxis" flat bordered>
            <q-card-section class="text-center">
              <div class="text-h6 text-weight-bold text-black">🚕 Pico y Placa Taxis</div>
              <img src="/pico-placa-taxis.jpeg" alt="Pico y Placa Taxis" class="full-width q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Filtro de etiquetas y municipios -->
        <q-card v-if="allTags.length > 0 || allMunicipios.length > 0" class="q-mb-md" flat bordered>
          <q-card-section>
            <div v-if="allTags.length > 0" class="q-mb-md">
              <div class="row items-center q-gutter-sm">
                <div class="text-subtitle2 text-grey-7">
                  <q-icon name="label" class="q-mr-xs" />
                  Etiquetas:
                </div>
                <q-chip
                  v-for="tag in allTags"
                  :key="tag"
                  :selected="selectedTag === tag"
                  clickable
                  color="primary"
                  :outline="selectedTag !== tag"
                  :label="tag"
                  @click="filterByTag(tag)"
                />
                <q-btn v-if="selectedTag" flat dense size="sm" label="Limpiar" icon="clear" @click="selectedTag = null" />
              </div>
            </div>

            <div v-if="allMunicipios.length > 0">
              <div class="row items-center q-gutter-sm">
                <div class="text-subtitle2 text-grey-7">
                  <q-icon name="location_city" class="q-mr-xs" />
                  Municipios:
                </div>
                <q-chip
                  v-for="municipio in allMunicipios.slice(0, 10)"
                  :key="municipio"
                  :selected="selectedMunicipio === municipio"
                  clickable
                  color="secondary"
                  :outline="selectedMunicipio !== municipio"
                  :label="municipio"
                  @click="filterByMunicipio(municipio)"
                />
                <q-btn v-if="allMunicipios.length > 10" flat dense size="sm" label="Ver más" icon="expand_more" @click="showAllMunicipios = !showAllMunicipios" />
                <q-btn v-if="selectedMunicipio" flat dense size="sm" label="Limpiar" icon="clear" @click="selectedMunicipio = null" />
              </div>

              <div v-if="showAllMunicipios && allMunicipios.length > 10" class="q-mt-sm">
                <div class="row items-center q-gutter-sm">
                  <q-chip
                    v-for="municipio in allMunicipios.slice(10)"
                    :key="municipio"
                    :selected="selectedMunicipio === municipio"
                    clickable
                    color="secondary"
                    :outline="selectedMunicipio !== municipio"
                    :label="municipio"
                    @click="filterByMunicipio(municipio)"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

<!-- Loading state -->
        <div v-if="postStore.loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="50px" />
          <div class="text-grey-7 q-mt-md">Cargando noticias...</div>
        </div>

        <!-- Sin posts -->
        <div v-else-if="filteredPosts.length === 0" class="text-center q-pa-xl">
          <q-icon name="article" size="80px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No hay noticias publicadas</div>
          <div class="text-body2 text-grey-6 q-mt-sm">Sé el primero en publicar una noticia</div>
          <q-btn
            v-if="myUserId"
            label="Crear Noticia"
            color="primary"
            class="q-mt-md"
            @click="navigateTo('/crear-post')"
            unelevated
          />
        </div>

        <!-- Lista de posts -->
        <q-card
          v-for="post in filteredPosts"
          :key="post.id"
          class="card-post q-mb-md"
          bordered
          flat
          v-intersection.once="(entry) => onCardVisible(entry, post.id)"
        >
          <!-- Header con avatar, nombre y opciones -->
          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <img :src="getAuthorAvatar(post)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{ getAuthorName(post) }}</q-item-label>
              <q-item-label caption>{{ formatDate(post.created_at) }}</q-item-label>
              <q-item-label caption v-if="post.municipio">
                <q-icon name="location_on" size="xs" />
                {{ post.municipio }}{{ post.lugar ? `, ${post.lugar}` : '' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="isAuthor(post.autor)">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="editPost(post.id)">
                      <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="togglePublic(post.id)">
                      <q-item-section avatar>
                        <q-icon :name="post.is_public ? 'visibility_off' : 'visibility'" color="orange" />
                      </q-item-section>
                      <q-item-section>{{ post.is_public ? 'Hacer privado' : 'Hacer público' }}</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="deletePost(post.id)">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Video del post -->
          <template v-if="post.video_url">
            <div v-if="loadedMedia[post.id]" class="cursor-pointer relative-position" @click="viewPostDetail(post.id)">
              <video :src="post.video_url" controls class="full-width post-media-fade" style="max-height: 500px; background-color: black;" preload="none">
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <div v-else class="media-placeholder cursor-pointer" @click="viewPostDetail(post.id)" />
          </template>

          <!-- Imagen del post -->
          <template v-else-if="post.img_url">
            <q-img
              v-if="loadedMedia[post.id]"
              :src="post.img_url"
              :ratio="16/9"
              spinner-color="primary"
              class="cursor-pointer post-media-fade"
              @click="viewPostDetail(post.id)"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3">
                  <q-icon name="broken_image" size="80px" color="grey-5" />
                </div>
              </template>
            </q-img>
            <div v-else class="media-placeholder cursor-pointer" @click="viewPostDetail(post.id)" />
          </template>

          <!-- Contenido del post -->
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-sm cursor-pointer text-primary" @click="viewPostDetail(post.id)">
              {{ post.name }}
            </div>
            <div class="text-body2 text-grey-8">{{ getExcerpt(post.description) }}</div>

            <div class="q-mt-md row items-center q-gutter-xs">
              <q-chip
                v-for="tag in post.tags"
                :key="tag"
                size="sm"
                color="blue-2"
                text-color="primary"
                :label="tag"
                clickable
                @click="filterByTag(tag)"
              />
              <q-badge v-if="!post.is_public" color="orange" label="Borrador" />
              <q-badge v-if="isAuthor(post.autor)" color="primary" label="Tu publicación" outline />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Acciones del post -->
          <q-card-actions align="between">
            <div class="row items-center q-gutter-sm">
              <q-btn flat color="primary" label="Leer más" icon="arrow_forward" @click="viewPostDetail(post.id)" />
              <q-btn v-if="isAuthor(post.autor)" flat color="secondary" label="Editar" icon="edit" @click="editPost(post.id)" />
              <div class="row items-center text-grey-6 text-caption">
                <q-icon name="visibility" size="16px" class="q-mr-xs" />
                <span>{{ post.views || 0 }}</span>
              </div>
            </div>

            <div>
              <q-btn flat round icon="share">
                <q-menu>
                  <q-list style="min-width: 200px">
                    <q-item clickable v-close-popup @click="shareOnFacebook(post)">
                      <q-item-section avatar><img src="/social-icons/icon-facebook.svg" class="social-icon"/></q-item-section>
                      <q-item-section>Facebook</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="shareOnWhatsApp(post)">
                      <q-item-section avatar><img src="/social-icons/icon-whatsapp.svg" class="social-icon"/></q-item-section>
                      <q-item-section>WhatsApp</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="shareOnTwitter(post)">
                      <q-item-section avatar><img src="/social-icons/icon-twitter.svg" class="social-icon"/></q-item-section>
                      <q-item-section>Twitter / X</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="copyLink(post)">
                      <q-item-section avatar><q-icon name="link" color="grey-7" /></q-item-section>
                      <q-item-section>Copiar enlace</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>

      <!-- Sidebar -->
      <div class="col-4 large-screen-only">
        <q-card class="fixed" style="width: 300px;">
          <q-item v-if="myUserId">
            <q-item-section avatar>
              <q-avatar size="48px" color="primary" text-color="white">
                <img v-if="authStore.profile?.avatar_url" :src="authStore.profile.avatar_url" />
                <q-icon v-else name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">{{ authStore.profile?.full_name || authStore.user?.email }}</q-item-label>
              <q-item-label caption>Noticia Paisa</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator v-if="myUserId" />

          <q-card-section v-if="myUserId">
            <div class="text-caption text-grey-7 q-mb-sm">Estadísticas</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-h6">{{ myPostsCount }}</div>
                <div class="text-caption text-grey-6">Mis posts</div>
              </div>
              <div class="col-6">
                <div class="text-h6">{{ postStore.publicPostsCount }}</div>
                <div class="text-caption text-grey-6">Públicos</div>
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="myUserId" />

          <q-card-actions>
            <q-btn
              v-if="myUserId"
              label="Crear Noticia"
              color="primary"
              class="full-width"
              icon="add"
              @click="navigateTo('/crear-post')"
              unelevated
            />
            <q-item v-else>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white">
                  <img src="https://aicjdmlphcozkmdsjraf.supabase.co/storage/v1/object/public/avatars/logotipo-noticiapaisa.jpg"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Noticia Paisa</q-item-label>
                <q-item-label caption>Siempre Actualizados</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { usePostStore } from '~/stores/postStore'
import { useAuthStore } from '~/stores/authStore'
import { useQuasar, date } from 'quasar'

const postStore = usePostStore()
const authStore = useAuthStore()
const supabase = useSupabaseClient()
const myUserId = ref(null)
const $q = useQuasar()

useSeoMeta({
  title: 'Noticia Paisa — Reportando para Vos',
  description: 'Noticias de Antioquia y el Área Metropolitana. Siempre Actualizados.',
  ogType: 'website',
  ogUrl: 'https://noticiapaisa.com',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

const selectedTag = ref(null)
const selectedMunicipio = ref(null)
const showAllMunicipios = ref(false)
const loadedMedia = ref({})

const onCardVisible = (entry, postId) => {
  if (entry.isIntersecting) {
    loadedMedia.value[postId] = true
  }
}

const diaActual = computed(() => new Date().getDay())

const nombreDia = computed(() => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[diaActual.value]
})

const numerosPicoPlaca = computed(() => {
  const picoPlacaPorDia = {
    1: '1 - 7',
    2: '0 - 3',
    3: '4 - 6',
    4: '5 - 9',
    5: '2 - 8',
    6: null,
    0: null
  }
  return picoPlacaPorDia[diaActual.value]
})


const allTags = computed(() => {
  const tags = new Set()
  postStore.postsByDate.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const allMunicipios = computed(() => {
  const municipios = new Set()
  postStore.postsByDate.forEach(post => {
    if (post.municipio) municipios.add(post.municipio)
  })
  return Array.from(municipios).sort()
})

const filteredPosts = computed(() => {
  let posts = postStore.postsByDate || []
  if (selectedTag.value) posts = posts.filter(p => p.tags?.includes(selectedTag.value))
  if (selectedMunicipio.value) posts = posts.filter(p => p.municipio === selectedMunicipio.value)
  return posts
})

// Carga posts en SSR + cliente
const { data: ssrPosts } = await useAsyncData('public-posts', () =>
  useSupabaseClient()
    .from('posts')
    .select(`*, profiles!autor(full_name, avatar_url), views_post(views)`)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .then(({ data }) => data || [])
)

// Hidrata el store con los datos SSR
if (ssrPosts.value) {
  postStore.posts = ssrPosts.value.map(post => ({
    ...post,
    views: post.views_post?.[0]?.views || 0
  }))
}

const loadUserData = async (userId) => {
  if (!userId) return
  const [profileResult, draftsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('posts')
      .select(`*, profiles!autor(full_name, avatar_url), views_post(views)`)
      .eq('autor', userId)
      .eq('is_public', false)
      .order('created_at', { ascending: false })
  ])
  if (profileResult.data) authStore.profile = profileResult.data
  const drafts = (draftsResult.data || []).map(p => ({ ...p, views: p.views_post?.[0]?.views || 0 }))
  if (drafts.length) {
    const existingIds = new Set(postStore.posts.map(p => p.id))
    drafts.forEach(d => { if (!existingIds.has(d.id)) postStore.posts.push(d) })
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) myUserId.value = user.id

  await postStore.fetchPublicPosts()

  if (myUserId.value) {
    await loadUserData(myUserId.value)
  }
})

const formatDate = (dateString) => date.formatDate(dateString, 'D MMMM YYYY, h:mm A')

const getAuthorName = (post) => post.profiles?.full_name || 'Noticia Paisa'
const getAuthorAvatar = (post) => post.profiles?.avatar_url || '/og-default.jpg'
const isAuthor = (autorId) => !!(myUserId.value && myUserId.value === autorId)
const myPostsCount = computed(() => {
  if (!myUserId.value) return 0
  return postStore.posts.filter(p => p.autor === myUserId.value).length
})

const getExcerpt = (description, maxLength = 150) => {
  if (!description) return ''
  return description.length <= maxLength ? description : description.substring(0, maxLength) + '...'
}

const viewPostDetail = (postId) => navigateTo(`/post/${postId}`)
const editPost = (postId) => navigateTo(`/editar-post/${postId}`)

const filterByTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  if (selectedTag.value) selectedMunicipio.value = null
}

const filterByMunicipio = (municipio) => {
  selectedMunicipio.value = selectedMunicipio.value === municipio ? null : municipio
  if (selectedMunicipio.value) selectedTag.value = null
}

const togglePublic = async (postId) => {
  const result = await postStore.togglePublic(postId)
  $q.notify({
    type: result.success ? 'positive' : 'negative',
    message: result.success ? 'Visibilidad actualizada' : (result.error || 'Error al cambiar visibilidad'),
    position: 'top'
  })
}

const deletePost = (postId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const result = await postStore.deletePost(postId)
    $q.notify({
      type: result.success ? 'positive' : 'negative',
      message: result.success ? 'Noticia eliminada correctamente' : (result.error || 'Error al eliminar'),
      position: 'top'
    })
  })
}

const siteUrl = useRuntimeConfig().public.siteUrl

const shareOnFacebook = (post) => {
  const url = `${siteUrl}/post/${post.id}`
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = (post) => {
  const url = `${siteUrl}/post/${post.id}`
  window.open(`https://wa.me/?text=${encodeURIComponent(`${post.name}\n\n${url}`)}`, '_blank')
}

const shareOnTwitter = (post) => {
  const url = `${siteUrl}/post/${post.id}`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.name)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
}

const copyLink = async (post) => {
  const url = `${siteUrl}/post/${post.id}`
  try {
    await navigator.clipboard.writeText(url)
    $q.notify({ type: 'positive', message: 'Enlace copiado al portapapeles', position: 'top', icon: 'link' })
  } catch {
    $q.notify({ type: 'negative', message: 'No se pudo copiar el enlace', position: 'top' })
  }
}
</script>

<style scoped>
.card-post {
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.card-post:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.placa-card-taxis {
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.cursor-pointer:hover {
  opacity: 0.9;
}

.media-placeholder {
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}

.post-media-fade {
  animation: fadeIn 0.35s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (max-width: 768px) {
  .large-screen-only {
    display: none;
  }
}

.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
