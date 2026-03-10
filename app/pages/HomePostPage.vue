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

              <!-- Indicaciones -->
              <div v-if="numerosPicoPlaca" class="q-mt-md">
                <div class="text-weight-medium q-mb-xs">
                  🚗 Carros Particulares - <div class="text-caption ">con el último número de la placa</div> 
                </div>
                <div class="text-weight-medium">
                  🏍️ Motos de 2 y 4 Tiempos - <div class="text-caption ">con el primer número de la placa</div> 
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
              <div class="text-subtitle1 text-black q-mb-sm">Hoy {{ nombreDia }}</div>
              
              <div v-if="picoPlacaTaxis !== null" class="text-h3 text-weight-bold text-black q-mt-sm q-mb-md">
                {{ picoPlacaTaxis }}
              </div>
              <div v-else class="text-h6 text-grey-7 q-mt-sm q-mb-md">
                No hay restricción
              </div>

              <!-- Indicación -->
              <div v-if="picoPlacaTaxis !== null" class="q-mt-md">
                <div class="text-caption text-weight-medium text-black">
                  Aplica para el último número de la placa
                </div>
              </div>
            </q-card-section> 
          </q-card>
        </div>

        <!-- Filtro de etiquetas y municipios -->
        <q-card v-if="allTags.length > 0 || allMunicipios.length > 0" class="q-mb-md" flat bordered>
          <q-card-section>
            <!-- Filtro por etiquetas -->
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
                <q-btn
                  v-if="selectedTag"
                  flat
                  dense
                  size="sm"
                  label="Limpiar"
                  icon="clear"
                  @click="selectedTag = null"
                />
              </div>
            </div>

            <!-- Filtro por municipios -->
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
                <q-btn
                  v-if="allMunicipios.length > 10"
                  flat
                  dense
                  size="sm"
                  label="Ver más"
                  icon="expand_more"
                  @click="showAllMunicipios = !showAllMunicipios"
                />
                <q-btn
                  v-if="selectedMunicipio"
                  flat
                  dense
                  size="sm"
                  label="Limpiar"
                  icon="clear"
                  @click="selectedMunicipio = null"
                />
              </div>
              
              <!-- Municipios adicionales -->
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
        <div v-else-if="postStore.publicPosts.length === 0" class="text-center q-pa-xl">
          <q-icon name="article" size="80px" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No hay noticias publicadas</div>
          <div class="text-body2 text-grey-6 q-mt-sm">Sé el primero en publicar una noticia</div>
          <q-btn 
            v-if="authStore.isAuthenticated()"
            label="Crear Noticia" 
            color="primary" 
            class="q-mt-md"
            @click="$router.push('/crear-post')"
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
        >
          <!-- Header con avatar, nombre y opciones -->
          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <img v-if="getAuthorAvatar(post)" :src="getAuthorAvatar(post)" />
                <q-icon v-else name="person" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{ getAuthorName(post) }}</q-item-label>
              <q-item-label caption>
                {{ formatDate(post.created_at) }}
              </q-item-label>
              <!-- Ubicación -->
              <q-item-label caption v-if="post.municipio">
                <q-icon name="location_on" size="xs" />
                {{ post.municipio }}{{ post.lugar ? `, ${post.lugar}` : '' }}
              </q-item-label>
            </q-item-section>

            <!-- Menú de opciones si es el autor -->
            <q-item-section side v-if="isAuthor(post.autor)">
              <q-btn flat round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="editPost(post.id)">
                      <q-item-section avatar>
                        <q-icon name="edit" color="primary" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="togglePublic(post.id)">
                      <q-item-section avatar>
                        <q-icon :name="post.is_public ? 'visibility_off' : 'visibility'" color="orange" />
                      </q-item-section>
                      <q-item-section>
                        {{ post.is_public ? 'Hacer privado' : 'Hacer público' }}
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="deletePost(post.id)">
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

          <!-- Video del post (clickeable) -->
          <div 
            v-if="post.video_url" 
            class="cursor-pointer relative-position"
            @click="viewPostDetail(post.id)"
          >
            <video
              :src="post.video_url"
              controls
              class="full-width"
              style="max-height: 500px; background-color: black;"
              preload="metadata"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          <!-- Imagen del post (clickeable) -->
          <q-img
            v-else-if="post.img_url"
            :src="post.img_url"
            :ratio="16/9"
            spinner-color="primary"
            class="cursor-pointer"
            @click="viewPostDetail(post.id)"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="broken_image" size="80px" color="grey-5" />
              </div>
            </template>
          </q-img>

          <!-- Contenido del post -->
          <q-card-section>
            <!-- Título clickeable -->
            <div 
              class="text-h6 text-weight-bold q-mb-sm cursor-pointer text-primary"
              @click="viewPostDetail(post.id)"
            >
              {{ post.name }}
            </div>
            
            <!-- Párrafo corto (extracto) -->
            <div class="text-body2 text-grey-8">
              {{ getExcerpt(post.description) }}
            </div>
            
            <!-- Etiquetas y badges -->
            <div class="q-mt-md row items-center q-gutter-xs">
              <!-- Etiquetas del post -->
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
              
              <!-- Badges de estado -->
              <q-badge 
                v-if="!post.is_public" 
                color="orange" 
                label="Borrador"
              />
              <q-badge 
                v-if="isAuthor(post.autor)" 
                color="primary" 
                label="Tu publicación" 
                outline
              />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Acciones del post -->
          <q-card-actions align="between">
            <div class="row items-center q-gutter-sm">
              <q-btn 
                flat 
                color="primary" 
                label="Leer más" 
                icon="arrow_forward"
                @click="viewPostDetail(post.id)"
              />
              
              <!-- Contador de vistas -->
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
                      <q-item-section avatar>
                        <img src="/social-icons/icon-facebook.svg" class="social-icon"/>
                      </q-item-section>
                      <q-item-section>Facebook</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="shareOnWhatsApp(post)">
                      <q-item-section avatar>
                        <img src="/social-icons/icon-whatsapp.svg" class="social-icon"/>
                      </q-item-section>
                      <q-item-section>WhatsApp</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="shareOnTwitter(post)">
                      <q-item-section avatar>
                        <img src="/social-icons/icon-twitter.svg" class="social-icon"/>
                      </q-item-section>
                      <q-item-section>Twitter / X</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="copyLink(post)">
                      <q-item-section avatar>
                        <q-icon name="link" color="grey-7" />
                      </q-item-section>
                      <q-item-section>Copiar enlace</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-card-actions>
        </q-card>
      </div>

      <!-- Sidebar - perfil del usuario -->
      <div class="col-4 large-screen-only">
        <q-card class="fixed" style="width: 300px;">
          <q-item v-if="authStore.user">
            <q-item-section avatar>
              <q-avatar size="48px" color="primary" text-color="white">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{ authStore.user.email }}</q-item-label>
              <q-item-label caption>Noticia Paisa</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator v-if="authStore.user" />

          <q-card-section v-if="authStore.user">
            <div class="text-caption text-grey-7 q-mb-sm">Estadísticas</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-h6">{{ postStore.userPosts.length }}</div>
                <div class="text-caption text-grey-6">Mis posts</div>
              </div>
              <div class="col-6">
                <div class="text-h6">{{ postStore.publicPostsCount }}</div>
                <div class="text-caption text-grey-6">Públicos</div>
              </div>
            </div>
          </q-card-section>

          <q-separator v-if="authStore.user" />

          <q-card-actions>
            <q-btn 
              v-if="authStore.user"
              label="Crear Noticia" 
              color="primary" 
              class="full-width"
              icon="add"
              @click="$router.push('/crear-post')"
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
                <q-item-label caption>
                  Siempre Actualizados
                </q-item-label>
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
import { usePostStore } from 'src/stores/postStore'
import { useAuthStore } from 'src/stores/authStore'
import { useQuasar, date } from 'quasar'
import { useRouter } from 'vue-router'
import { useHomeMeta } from 'src/composables/useMeta'

const postStore = usePostStore()
const authStore = useAuthStore()
const router = useRouter()

// useQuasar solo disponible en cliente
const $q = typeof window !== 'undefined' ? useQuasar() : { notify: () => {}, dialog: () => {} }

// Configura meta tags para la home - funciona en SSR y cliente
try {
  useHomeMeta()
} catch (e) {
  console.warn('Error al configurar meta tags:', e.message)
}

// Estado para filtrado por etiquetas y municipios
const selectedTag = ref(null)
const selectedMunicipio = ref(null)
const showAllMunicipios = ref(false)

// Obtiene el día actual de la semana
const diaActual = computed(() => {
  return new Date().getDay() // 0=Domingo, 1=Lunes, 2=Martes, etc.
})

// Obtiene el nombre del día en español
const nombreDia = computed(() => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return dias[diaActual.value]
})

// Obtiene los números de pico y placa según el día
const numerosPicoPlaca = computed(() => {
  const picoPlacaPorDia = {
    1: '6 - 9', // Lunes
    2: '5 - 7', // Martes
    3: '1 - 8', // Miércoles
    4: '0 - 2', // Jueves
    5: '3 - 4', // Viernes
    6: null,    // Sábado - No hay restricción
    0: null     // Domingo - No hay restricción
  }
  return picoPlacaPorDia[diaActual.value]
})

// Cronograma de pico y placa para taxis (Diciembre 2025 y Enero 2026)
const picoPlacaTaxis = computed(() => {
  const hoy = new Date()
  const mes = hoy.getMonth() + 1 // 1-12
  const dia = hoy.getDate()
  const anio = hoy.getFullYear()
  
  // Cronograma para Diciembre 2025
  const cronogramaDiciembre = {
    1: 0, 22: 0,
    9: 1, 23: 1,
    13: 2, 17: 2, 31: 2,
    4: 3, 18: 3,
    5: 4, 19: 4,
    15: 5, 29: 5,
    2: 6, 16: 6, 30: 6,
    10: 7, 24: 7,
    11: 8,
    12: 9, 26: 9
  }
  
  // Cronograma para Enero 2026
  const cronogramaEnero = {
    6: 0, 20: 0,
    7: 1, 21: 1,
    15: 2, 29: 2,
    16: 3, 30: 3,
    2: 4, 19: 4,
    13: 5, 27: 5,
    14: 6, 28: 6,
    8: 7, 22: 7,
    9: 8, 23: 8,
    5: 9, 26: 9
  }
  
  // Determina qué cronograma usar
  if (anio === 2025 && mes === 12) {
    return cronogramaDiciembre[dia] !== undefined ? cronogramaDiciembre[dia] : null
  } else if (anio === 2026 && mes === 1) {
    return cronogramaEnero[dia] !== undefined ? cronogramaEnero[dia] : null
  }
  
  return null
})

// Obtiene todas las etiquetas únicas de los posts
const allTags = computed(() => {
  const tags = new Set()
  if (postStore.postsByDate && Array.isArray(postStore.postsByDate)) {
    postStore.postsByDate.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
  }
  return Array.from(tags).sort()
})

// Obtiene todos los municipios únicos de los posts
const allMunicipios = computed(() => {
  const municipios = new Set()
  if (postStore.postsByDate && Array.isArray(postStore.postsByDate)) {
    postStore.postsByDate.forEach(post => {
      if (post.municipio) {
        municipios.add(post.municipio)
      }
    })
  }
  return Array.from(municipios).sort()
})

// Carga los posts públicos al montar el componente
onMounted(async () => {
  // Solo ejecuta en el cliente, no en SSR
  if (typeof window === 'undefined') return
  
  await postStore.fetchPublicPosts()
  
  // Si hay usuario autenticado, también carga sus posts
  if (authStore.user) {
    await postStore.fetchUserPosts()
  }
})

// Formatea la fecha de creación del post
const formatDate = (dateString) => {
  return date.formatDate(dateString, 'D MMMM YYYY, h:mm A')
}

// Obtiene el nombre del autor desde los datos del post
const getAuthorName = (post) => {
  // Si el post tiene el perfil del autor cargado
  if (post.profiles && post.profiles.full_name) {
    return post.profiles.full_name
  }
  return 'Usuario'
}

// Obtiene la URL del avatar del autor
const getAuthorAvatar = (post) => {
  if (post.profiles && post.profiles.avatar_url) {
    return post.profiles.avatar_url
  }
  return null
}

// Verifica si el usuario actual es el autor del post
const isAuthor = (autorId) => {
  return authStore.user && authStore.user.id === autorId
}

// Obtiene un extracto corto de la descripción
const getExcerpt = (description, maxLength = 150) => {
  if (!description) return ''
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength) + '...'
}

// Navega a la vista detallada del post
const viewPostDetail = (postId) => {
  router.push({ name: 'detalle-post', params: { id: postId } })
}

// Filtra posts por etiqueta
const filterByTag = (tag) => {
  if (selectedTag.value === tag) {
    selectedTag.value = null // Si ya está seleccionada, la deselecciona
  } else {
    selectedTag.value = tag
    selectedMunicipio.value = null // Limpia filtro de municipio
  }
}

// Filtra posts por municipio
const filterByMunicipio = (municipio) => {
  if (selectedMunicipio.value === municipio) {
    selectedMunicipio.value = null // Si ya está seleccionado, lo deselecciona
  } else {
    selectedMunicipio.value = municipio
    selectedTag.value = null // Limpia filtro de etiqueta
  }
}

// Posts filtrados por etiqueta y/o municipio
const filteredPosts = computed(() => {
  let posts = postStore.postsByDate || []
  
  // Filtra por etiqueta
  if (selectedTag.value && Array.isArray(posts)) {
    posts = posts.filter(post => 
      post.tags && post.tags.includes(selectedTag.value)
    )
  }
  
  // Filtra por municipio
  if (selectedMunicipio.value && Array.isArray(posts)) {
    posts = posts.filter(post => 
      post.municipio === selectedMunicipio.value
    )
  }
  
  return posts
})

// Edita un post
const editPost = (postId) => {
  router.push({ name: 'editar-post', params: { id: postId } })
}

// Alterna la visibilidad del post
const togglePublic = async (postId) => {
  const result = await postStore.togglePublic(postId)
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Visibilidad actualizada',
      position: 'top'
    })
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Error al cambiar visibilidad',
      position: 'top'
    })
  }
}

// Elimina un post
const deletePost = (postId) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: '¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const result = await postStore.deletePost(postId)
    
    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Noticia eliminada correctamente',
        position: 'top'
      })
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
const shareOnFacebook = (post) => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para compartir correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${post.id}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

// Comparte en WhatsApp
const shareOnWhatsApp = (post) => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para que WhatsApp cargue las meta tags correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${post.id}`
  const text = `${post.name}\n\n${postUrl}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank')
}

// Comparte en Twitter/X
const shareOnTwitter = (post) => {
  if (typeof window === 'undefined') return
  
  // Usa la URL del sitio sin hash para compartir correctamente
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${post.id}`
  const text = `${post.name}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

// Copia el enlace del post al portapapeles
const copyLink = async (post) => {
  if (typeof window === 'undefined' || !navigator.clipboard) return
  
  // Usa la URL del sitio sin hash
  const siteUrl = process.env.SITE_URL || window.location.origin
  const postUrl = `${siteUrl}/post/${post.id}`
  
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

<style scoped lang="scss">
.card-post {
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.placa-card-taxis {
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
}

.large-screen-only {
  @media (max-width: 768px) {
    display: none;
  }
}

.social-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>