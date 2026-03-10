<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <!-- Loading state -->
        <div v-if="loading && !postData.name" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="50px" />
          <div class="text-grey-7 q-mt-md">Cargando post...</div>
        </div>

        <!-- Formulario de edición -->
        <q-card v-else class="q-pa-md">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold q-mb-md">
                  Editar Noticia
                </div>
                <div class="text-subtitle2 text-grey-7 q-mb-md">
                  Solo puedes editar tus propias noticias
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  round
                  icon="close"
                  @click="handleCancel"
                  :disable="postStore.loading"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleUpdatePost" class="q-gutter-md">
              <!-- Título del post -->
              <q-input
                v-model="postData.name"
                label="Título de la Noticia"
                outlined
                :rules="[val => !!val || 'El título es requerido']"
                lazy-rules
                counter
                maxlength="200"
              >
                <template v-slot:prepend>
                  <q-icon name="title" />
                </template>
              </q-input>

              <!-- Descripción del post -->
              <q-input
                v-model="postData.description"
                label="Descripción de la Noticia"
                type="textarea"
                outlined
                rows="8"
                :rules="[val => !!val || 'La descripción es requerida']"
                lazy-rules
                counter
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>

              <!-- Etiquetas -->
              <div>
                <q-select
                  v-model="postData.tags"
                  label="Etiquetas"
                  outlined
                  multiple
                  use-chips
                  use-input
                  new-value-mode="add-unique"
                  hint="Presiona Enter para agregar una etiqueta"
                  input-debounce="0"
                  :options="availableTags"
                  @new-value="createTag"
                >
                  <template v-slot:prepend>
                    <q-icon name="label" />
                  </template>
                  <template v-slot:hint>
                    Escribe y presiona Enter. Máximo 5 etiquetas
                  </template>
                </q-select>
              </div>

              <!-- Municipio -->
              <div>
                <q-select
                  v-model="postData.municipio"
                  label="Municipio"
                  outlined
                  :options="filteredMunicipios"
                  use-input
                  input-debounce="300"
                  @filter="filterMunicipios"
                  hint="Selecciona o busca el municipio"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No se encontró el municipio
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Lugar/Barrio (opcional) -->
              <div>
                <q-input
                  v-model="postData.lugar"
                  label="Lugar o Barrio (Opcional)"
                  outlined
                  hint="Ej: El Poblado, Laureles, Centro, etc."
                  counter
                  maxlength="100"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
              </div>

              <!-- Tipo de Medio -->
              <div>
                <div class="text-caption text-grey-7 q-mb-sm">Tipo de Medio:</div>
                <q-btn-toggle
                  v-model="mediaType"
                  toggle-color="primary"
                  :options="[
                    {label: 'Imagen', value: 'image', icon: 'image'},
                    {label: 'Video', value: 'video', icon: 'videocam'}
                  ]"
                  spread
                  unelevated
                />
              </div>

              <!-- Imagen actual -->
              <div v-if="mediaType === 'image' && currentImageUrl && !postData.newImage">
                <div class="text-caption text-grey-7 q-mb-sm">Imagen actual:</div>
                <q-img
                  :src="currentImageUrl"
                  style="max-width: 100%; max-height: 300px;"
                  class="rounded-borders q-mb-md"
                  fit="contain"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3">
                      <q-icon name="broken_image" size="80px" color="grey-5" />
                    </div>
                  </template>
                </q-img>
                <q-btn
                  label="Cambiar Imagen"
                  icon="image"
                  color="primary"
                  outline
                  @click="showImageSelector = true"
                  class="q-mb-md"
                />
              </div>

              <!-- Selector de nueva imagen -->
              <div v-if="mediaType === 'image' && (showImageSelector || !currentImageUrl)">
                <q-file
                  v-model="postData.newImage"
                  label="Nueva Imagen de la Noticia"
                  outlined
                  accept="image/jpeg, image/png, image/webp"
                  max-file-size="5242880"
                  @update:model-value="handleImageSelect"
                  @rejected="onFileRejected"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="image" />
                  </template>
                  <template v-slot:hint>
                    Formatos: JPG, PNG, WEBP. Tamaño máximo: 5MB
                  </template>
                </q-file>

                <!-- Preview de la nueva imagen -->
                <div v-if="imagePreview" class="q-mt-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Vista previa de la nueva imagen:</div>
                  <q-img
                    :src="imagePreview"
                    style="max-width: 100%; max-height: 400px;"
                    class="rounded-borders"
                    fit="contain"
                  >
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-negative text-white">
                        No se pudo cargar la imagen
                      </div>
                    </template>
                  </q-img>
                </div>

                <q-btn
                  v-if="currentImageUrl"
                  label="Mantener Imagen Actual"
                  icon="undo"
                  color="grey"
                  flat
                  @click="cancelImageChange"
                  class="q-mt-sm"
                />
              </div>

              <!-- Video actual -->
              <div v-if="mediaType === 'video' && currentVideoUrl && !postData.newVideo">
                <div class="text-caption text-grey-7 q-mb-sm">Video actual:</div>
                <video
                  :src="currentVideoUrl"
                  controls
                  class="rounded-borders q-mb-md"
                  style="max-width: 100%; max-height: 400px; background-color: black;"
                  preload="metadata"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
                <q-btn
                  label="Cambiar Video"
                  icon="videocam"
                  color="primary"
                  outline
                  @click="showVideoSelector = true"
                  class="q-mb-md"
                />
              </div>

              <!-- Selector de nuevo video -->
              <div v-if="mediaType === 'video' && (showVideoSelector || !currentVideoUrl)">
                <q-file
                  v-model="postData.newVideo"
                  label="Nuevo Video de la Noticia"
                  outlined
                  accept="video/mp4, video/webm, video/ogg"
                  max-file-size="52428800"
                  @update:model-value="handleVideoSelect"
                  @rejected="onVideoRejected"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="videocam" />
                  </template>
                  <template v-slot:hint>
                    Formatos: MP4, WEBM, OGG. Tamaño máximo: 50MB. Duración máxima: 2 minutos
                  </template>
                </q-file>

                <!-- Preview del nuevo video con info -->
                <div v-if="videoPreview" class="q-mt-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Vista previa del nuevo video:</div>
                  
                  <!-- Banner de información del video -->
                  <q-banner v-if="videoInfo" class="bg-blue-1 q-mb-sm" rounded>
                    <template v-slot:avatar>
                      <q-icon name="info" color="blue" />
                    </template>
                    <div class="row q-gutter-md">
                      <div>
                        <div class="text-caption text-grey-7">Tamaño</div>
                        <div class="text-body2 text-weight-medium">{{ videoInfo.size }}</div>
                      </div>
                      <div>
                        <div class="text-caption text-grey-7">Duración</div>
                        <div class="text-body2 text-weight-medium">{{ videoInfo.duration }}</div>
                      </div>
                    </div>
                  </q-banner>

                  <video
                    :src="videoPreview"
                    controls
                    class="rounded-borders"
                    style="max-width: 100%; max-height: 400px; background-color: black;"
                    preload="metadata"
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>

                <q-btn
                  v-if="currentVideoUrl"
                  label="Mantener Video Actual"
                  icon="undo"
                  color="grey"
                  flat
                  @click="cancelVideoChange"
                  class="q-mt-sm"
                />
              </div>

              <!-- Checkbox para publicar -->
              <q-checkbox
                v-model="postData.isPublic"
                label="Hacer público este post"
                color="primary"
              >
                <q-tooltip>
                  Si no está marcado, el post se guardará como borrador
                </q-tooltip>
              </q-checkbox>

              <!-- Botones de acción -->
              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  type="submit"
                  label="Guardar Cambios"
                  color="primary"
                  :loading="postStore.loading"
                  :disable="postStore.loading"
                  icon="save"
                  unelevated
                />
                <q-btn
                  label="Cancelar"
                  color="grey"
                  outline
                  @click="handleCancel"
                  :disable="postStore.loading"
                  icon="cancel"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Información del post -->
        <q-card class="q-mt-md q-pa-md" v-if="postData.created_at">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-grey-7 q-mb-xs">Información del post</div>
            <div class="text-body2">
              <strong>Creado:</strong> {{ formatDate(postData.created_at) }}
            </div>
            <div class="text-body2" v-if="authStore.user">
              <strong>Autor:</strong> {{ authStore.user.email }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { usePostStore } from 'src/stores/postStore'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'
import { todosMunicipios, buscarMunicipio } from 'src/data/municipios'

const authStore = useAuthStore()
const postStore = usePostStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Estado del formulario
const loading = ref(true)
const imagePreview = ref(null)
const videoPreview = ref(null)
const videoInfo = ref(null)
const currentImageUrl = ref(null)
const currentVideoUrl = ref(null)
const showImageSelector = ref(false)
const showVideoSelector = ref(false)
const postId = ref(null)
const mediaType = ref('image')

// Municipios
const filteredMunicipios = ref(todosMunicipios)

// Etiquetas disponibles predefinidas
const availableTags = ref([
  'Noticias Locales',
  'Deportes',
  'Cultura',
  'Tecnología',
  'Política',
  'Economía',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Medio Ambiente'
])

const postData = reactive({
  name: '',
  description: '',
  newImage: null,
  newVideo: null,
  isPublic: false,
  created_at: null,
  tags: [],
  municipio: null,
  lugar: ''
})

// Observa cambios en el tipo de medio para limpiar el medio opuesto
watch(mediaType, (newType) => {
  if (newType === 'image') {
    postData.newVideo = null
    videoPreview.value = null
    videoInfo.value = null
  } else if (newType === 'video') {
    postData.newImage = null
    imagePreview.value = null
  }
})

// Filtra municipios según búsqueda
const filterMunicipios = (val, update) => {
  update(() => {
    filteredMunicipios.value = buscarMunicipio(val)
  })
}

// Crea una nueva etiqueta
const createTag = (val, done) => {
  if (val.length > 0 && postData.tags.length < 5) {
    // Capitaliza la primera letra
    const formattedTag = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    if (!postData.tags.includes(formattedTag)) {
      done(formattedTag, 'add-unique')
    }
  } else if (postData.tags.length >= 5) {
    $q.notify({
      type: 'warning',
      message: 'Máximo 5 etiquetas permitidas',
      position: 'top'
    })
  }
}

// Carga el post al montar el componente
onMounted(async () => {
  postId.value = route.params.id || route.query.id

  if (!postId.value) {
    $q.notify({
      type: 'negative',
      message: 'ID de post no válido',
      position: 'top'
    })
    router.push({ name: 'home' })
    return
  }

  await loadPost()
})

// Carga los datos del post desde Supabase
const loadPost = async () => {
  loading.value = true
  
  const result = await postStore.fetchPostById(postId.value)
  
  if (result.success && result.data) {
    const post = result.data

    // Verifica que el usuario sea el autor del post
    if (post.autor !== authStore.user?.id) {
      $q.notify({
        type: 'negative',
        message: 'No tienes permiso para editar este post',
        position: 'top'
      })
      router.push({ name: 'home' })
      return
    }

    // Carga los datos en el formulario
    postData.name = post.name
    postData.description = post.description
    postData.isPublic = post.is_public
    postData.created_at = post.created_at
    postData.tags = post.tags || []
    postData.municipio = post.municipio || null
    postData.lugar = post.lugar || ''
    currentImageUrl.value = post.img_url
    currentVideoUrl.value = post.video_url
    
    // Establece el tipo de medio según lo que tenga el post
    if (post.video_url) {
      mediaType.value = 'video'
    } else {
      mediaType.value = 'image'
    }
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Error al cargar el post',
      position: 'top'
    })
    router.push({ name: 'home' })
  }
  
  loading.value = false
}

// Formatea la fecha
const formatDate = (dateString) => {
  return date.formatDate(dateString, 'D MMMM YYYY, h:mm A')
}

// Maneja la selección de imagen y crea el preview
const handleImageSelect = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    imagePreview.value = null
  }
}

// Maneja la selección de video y crea el preview
const handleVideoSelect = async (file) => {
  if (file) {
    // Valida la duración del video
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src)
      const duration = video.duration
      
      if (duration > 120) { // 2 minutos = 120 segundos
        $q.notify({
          type: 'negative',
          message: 'El video debe tener una duración máxima de 2 minutos',
          position: 'top',
          timeout: 3000
        })
        postData.newVideo = null
        videoPreview.value = null
        videoInfo.value = null
        return
      }
      
      // Si pasa la validación, muestra el preview
      videoPreview.value = URL.createObjectURL(file)
      videoInfo.value = {
        size: formatFileSize(file.size),
        duration: formatDuration(duration)
      }
    }
    
    video.src = URL.createObjectURL(file)
  } else {
    videoPreview.value = null
    videoInfo.value = null
  }
}

// Formatea el tamaño del archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Formatea la duración del video
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Maneja archivos rechazados
const onFileRejected = () => {
  $q.notify({
    type: 'negative',
    message: 'Archivo no válido. Verifica el formato y tamaño (máx. 5MB)',
    position: 'top'
  })
}

// Maneja videos rechazados
const onVideoRejected = () => {
  $q.notify({
    type: 'negative',
    message: 'Video no válido. Verifica el formato y tamaño (máx. 50MB)',
    position: 'top'
  })
}

// Cancela el cambio de imagen
const cancelImageChange = () => {
  postData.newImage = null
  imagePreview.value = null
  showImageSelector.value = false
}

// Cancela el cambio de video
const cancelVideoChange = () => {
  postData.newVideo = null
  videoPreview.value = null
  videoInfo.value = null
  showVideoSelector.value = false
}

// Maneja la actualización del post
const handleUpdatePost = async () => {
  const updates = {
    name: postData.name,
    description: postData.description,
    isPublic: postData.isPublic,
    tags: postData.tags,
    municipio: postData.municipio,
    lugar: postData.lugar,
    img_url: currentImageUrl.value,
    video_url: currentVideoUrl.value
  }

  // Si hay una nueva imagen, la incluye
  if (postData.newImage) {
    updates.image = postData.newImage
  }

  // Si hay un nuevo video, lo incluye
  if (postData.newVideo) {
    updates.video = postData.newVideo
  }

  const result = await postStore.updatePost(postId.value, updates)
  
  if (result.success) {
    $q.notify({
      type: 'positive',
      message: 'Noticia actualizada correctamente',
      position: 'top',
      icon: 'check_circle'
    })

    // Redirige al home después de un pequeño delay
    setTimeout(() => {
      router.push({ name: 'home' })
    }, 1000)
  } else {
    $q.notify({
      type: 'negative',
      message: result.error || 'Error al actualizar la noticia',
      position: 'top',
      icon: 'error'
    })
  }
}

// Maneja la cancelación
const handleCancel = () => {
  // Verifica si hay cambios sin guardar
  const hasChanges = 
    postData.name !== postStore.currentPost?.name ||
    postData.description !== postStore.currentPost?.description ||
    postData.isPublic !== postStore.currentPost?.is_public ||
    postData.newImage !== null

  if (hasChanges) {
    $q.dialog({
      title: 'Confirmar',
      message: '¿Deseas cancelar? Se perderán los cambios no guardados.',
      cancel: true,
      persistent: true
    }).onOk(() => {
      router.push({ name: 'home' })
    })
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<style scoped lang="scss">
.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
