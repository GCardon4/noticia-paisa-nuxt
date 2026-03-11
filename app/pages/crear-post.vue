<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h4 text-weight-bold q-mb-md">Crear Nueva Noticia</div>
            <div class="text-subtitle2 text-grey-7 q-mb-md">Solo usuarios autenticados pueden crear noticias</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleCreatePost" class="q-gutter-md">
              <q-input
                v-model="postData.name"
                label="Título de la Noticia"
                outlined
                :rules="[val => !!val || 'El título es requerido']"
                lazy-rules
                counter
                maxlength="200"
              >
                <template v-slot:prepend><q-icon name="title" /></template>
              </q-input>

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
                <template v-slot:prepend><q-icon name="description" /></template>
              </q-input>

              <q-select
                v-model="postData.tags"
                label="Etiquetas"
                outlined
                multiple
                use-chips
                use-input
                new-value-mode="add-unique"
                input-debounce="0"
                :options="availableTags"
                @new-value="createTag"
              >
                <template v-slot:prepend><q-icon name="label" /></template>
                <template v-slot:hint>Escribe y presiona Enter. Máximo 5 etiquetas</template>
              </q-select>

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
                <template v-slot:prepend><q-icon name="location_city" /></template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No se encontró el municipio</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                v-model="postData.lugar"
                label="Lugar o Barrio (Opcional)"
                outlined
                hint="Ej: El Poblado, Laureles, Centro, etc."
                counter
                maxlength="100"
              >
                <template v-slot:prepend><q-icon name="place" /></template>
              </q-input>

              <!-- Selector de tipo de media -->
              <div>
                <div class="text-subtitle2 q-mb-sm">Tipo de Contenido</div>
                <q-btn-toggle
                  v-model="mediaType"
                  toggle-color="primary"
                  :options="[
                    {label: 'Imagen', value: 'image', icon: 'image'},
                    {label: 'Video', value: 'video', icon: 'videocam'}
                  ]"
                  spread
                />
              </div>

              <!-- Imagen -->
              <div v-if="mediaType === 'image'">
                <q-file
                  v-model="postData.image"
                  label="Imagen de la Noticia"
                  outlined
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  max-file-size="10485760"
                  @update:model-value="handleImageSelect"
                  @rejected="onFileRejected"
                  :rules="[val => !!val || 'La imagen es requerida']"
                  lazy-rules
                  :loading="processingImage"
                >
                  <template v-slot:prepend><q-icon name="image" /></template>
                  <template v-slot:hint>Formatos: JPG, PNG, WEBP, GIF. Se optimizará automáticamente a WebP (máx. 2000px)</template>
                </q-file>

                <div v-if="imagePreview" class="q-mt-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Vista previa:</div>
                  <q-img :src="imagePreview" style="max-width: 100%; max-height: 400px;" class="rounded-borders" fit="contain">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-negative text-white">No se pudo cargar la imagen</div>
                    </template>
                  </q-img>
                </div>
              </div>

              <!-- Video -->
              <div v-else-if="mediaType === 'video'">
                <q-file
                  v-model="postData.video"
                  label="Video Corto"
                  outlined
                  accept="video/mp4, video/webm, video/quicktime"
                  max-file-size="52428800"
                  @update:model-value="handleVideoSelect"
                  @rejected="onVideoRejected"
                  :rules="[val => !!val || 'El video es requerido']"
                  lazy-rules
                >
                  <template v-slot:prepend><q-icon name="videocam" /></template>
                  <template v-slot:hint>Formatos: MP4, WEBM, MOV. Máximo: 50MB y 2 minutos</template>
                </q-file>

                <div v-if="videoInfo" class="q-mt-sm">
                  <q-banner class="bg-blue-1 text-blue-9" dense rounded>
                    <template v-slot:avatar><q-icon name="info" color="blue" /></template>
                    <div class="text-caption">
                      <div><strong>Tamaño:</strong> {{ videoInfo.size }}</div>
                      <div><strong>Duración:</strong> {{ videoInfo.duration }}</div>
                    </div>
                  </q-banner>
                </div>

                <div v-if="videoPreview" class="q-mt-md">
                  <div class="text-caption text-grey-7 q-mb-sm">Vista previa:</div>
                  <video :src="videoPreview" controls style="max-width: 100%; max-height: 400px; border-radius: 8px;" class="bg-black">
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>

              <q-checkbox v-model="postData.isPublic" label="Publicar inmediatamente" color="primary">
                <q-tooltip>Si no está marcado, el post se guardará como borrador</q-tooltip>
              </q-checkbox>

              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  type="submit"
                  :label="postData.isPublic ? 'Crear y Publicar' : 'Guardar Borrador'"
                  color="primary"
                  :loading="postStore.loading"
                  :disable="postStore.loading"
                  icon="send"
                  unelevated
                />
                <q-btn label="Cancelar" color="grey" outline @click="handleCancel" :disable="postStore.loading" icon="cancel" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <q-card class="q-mt-md q-pa-md" v-if="authStore.user">
          <q-card-section class="q-pa-sm">
            <div class="row items-center">
              <q-icon name="person" size="sm" color="primary" class="q-mr-sm" />
              <div>
                <div class="text-caption text-grey-7">Autor:</div>
                <div class="text-body2 text-weight-medium">{{ authStore.user.email }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { usePostStore } from '~/stores/postStore'
import { useQuasar } from 'quasar'
import { todosMunicipios, buscarMunicipio } from '~/data/municipios'
import { useImageOptimizer } from '~/composable/useImageOptimizer'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const postStore = usePostStore()
const $q = useQuasar()
const { optimizeImage } = useImageOptimizer()

const imagePreview = ref(null)
const processedImageFile = ref(null)
const processingImage = ref(false)
const videoPreview = ref(null)
const videoInfo = ref(null)
const mediaType = ref('image')
const filteredMunicipios = ref(todosMunicipios)

const availableTags = ref([
  'Noticias Locales', 'Noticias Nacionales', 'Noticias Internacionales',
  'Deportes', 'Cultura', 'Tecnología', 'Política', 'Economía',
  'Salud', 'Movilidad', 'Seguridad', 'Entretenimiento', 'Educación', 'Medio Ambiente'
])

const postData = reactive({
  name: '', description: '', image: null, video: null,
  isPublic: false, tags: [], municipio: null, lugar: ''
})

watch(mediaType, (newType) => {
  if (newType === 'image') {
    postData.video = null; videoPreview.value = null; videoInfo.value = null
  } else {
    postData.image = null; imagePreview.value = null
  }
})

const filterMunicipios = (val, update) => {
  update(() => { filteredMunicipios.value = buscarMunicipio(val) })
}

const createTag = (val, done) => {
  if (val.length > 0 && postData.tags.length < 5) {
    const formattedTag = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    if (!postData.tags.includes(formattedTag)) done(formattedTag, 'add-unique')
  } else if (postData.tags.length >= 5) {
    $q.notify({ type: 'warning', message: 'Máximo 5 etiquetas permitidas', position: 'top' })
  }
}

const handleImageSelect = async (file) => {
  if (!file) {
    imagePreview.value = null
    processedImageFile.value = null
    return
  }
  processingImage.value = true
  try {
    const result = await optimizeImage(file)
    processedImageFile.value = result.file
    imagePreview.value = result.preview
    const kb = Math.round(result.file.size / 1024)
    $q.notify({ type: 'positive', message: `Imagen optimizada: ${kb} KB (WebP)`, position: 'top', timeout: 2000 })
  } catch {
    $q.notify({ type: 'negative', message: 'No se pudo procesar la imagen', position: 'top' })
    processedImageFile.value = null
    imagePreview.value = null
  } finally {
    processingImage.value = false
  }
}

const onFileRejected = () => {
  $q.notify({ type: 'negative', message: 'Archivo no válido. Verifica el formato y tamaño (máx. 5MB)', position: 'top' })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleVideoSelect = (file) => {
  if (!file) { videoPreview.value = null; videoInfo.value = null; return }
  const videoUrl = URL.createObjectURL(file)
  videoPreview.value = videoUrl
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.onloadedmetadata = () => {
    window.URL.revokeObjectURL(video.src)
    if (video.duration > 120) {
      $q.notify({ type: 'negative', message: 'El video no debe superar los 2 minutos de duración', position: 'top' })
      postData.video = null; videoPreview.value = null; videoInfo.value = null
      return
    }
    videoInfo.value = { duration: formatDuration(video.duration), size: formatFileSize(file.size) }
  }
  video.src = videoUrl
}

const onVideoRejected = (rejectedEntries) => {
  const msg = rejectedEntries[0]?.failedPropValidation === 'max-file-size'
    ? 'El video supera el tamaño máximo permitido (50MB)'
    : 'Formato de video no válido. Usa MP4, WEBM o MOV'
  $q.notify({ type: 'negative', message: msg, position: 'top' })
}

const handleCreatePost = async () => {
  const result = await postStore.createPost({
    name: postData.name,
    description: postData.description,
    image: mediaType.value === 'image' ? (processedImageFile.value || postData.image) : null,
    video: mediaType.value === 'video' ? postData.video : null,
    isPublic: postData.isPublic,
    tags: postData.tags,
    municipio: postData.municipio,
    lugar: postData.lugar
  })

  if (result.success) {
    $q.notify({
      type: 'positive',
      message: postData.isPublic ? 'Noticia publicada correctamente' : 'Borrador guardado correctamente',
      position: 'top',
      icon: 'check_circle'
    })
    Object.assign(postData, { name: '', description: '', image: null, video: null, isPublic: false, tags: [], municipio: null, lugar: '' })
    imagePreview.value = null; videoPreview.value = null; videoInfo.value = null; mediaType.value = 'image'
    processedImageFile.value = null
    setTimeout(() => navigateTo('/'), 1000)
  } else {
    $q.notify({ type: 'negative', message: result.error || 'Error al crear la noticia', position: 'top', icon: 'error' })
  }
}

const handleCancel = () => {
  if (postData.name || postData.description || postData.image || postData.video) {
    $q.dialog({
      title: 'Confirmar',
      message: '¿Deseas cancelar? Se perderán los cambios no guardados.',
      cancel: true,
      persistent: true
    }).onOk(() => navigateTo('/'))
  } else {
    navigateTo('/')
  }
}
</script>

<style scoped>
.q-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>
