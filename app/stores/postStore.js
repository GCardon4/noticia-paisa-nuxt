import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const usePostStore = defineStore('post', () => {
  // Estado
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  // Obtiene todos los posts públicos
  const publicPosts = computed(() => {
    return posts.value.filter(post => post.is_public === true)
  })

  // Obtiene los posts del usuario actual
  const userPosts = computed(() => {
    // Solo ejecuta en el cliente para evitar problemas SSR
    if (typeof window === 'undefined') return []
    
    const authStore = useAuthStore()
    if (!authStore.user) return []
    return posts.value.filter(post => post.autor === authStore.user.id)
  })

  // Obtiene posts ordenados por fecha (más recientes primero)
  const postsByDate = computed(() => {
    return [...posts.value].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
  })

  // Cuenta total de posts públicos
  const publicPostsCount = computed(() => publicPosts.value.length)

  // Actions

  // Obtiene todos los posts públicos desde Supabase
  const fetchPublicPosts = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!autor (
            full_name,
            avatar_url
          ),
          views_post (
            views
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Mapea los datos para incluir las vistas directamente
      posts.value = (data || []).map(post => ({
        ...post,
        views: post.views_post?.[0]?.views || 0
      }))
      
      return { success: true, data: posts.value }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener posts públicos:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Obtiene todos los posts del usuario autenticado
  const fetchUserPosts = async () => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!autor (
            full_name,
            avatar_url
          ),
          views_post (
            views
          )
        `)
        .eq('autor', authStore.user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Mapea los datos para incluir las vistas directamente
      posts.value = (data || []).map(post => ({
        ...post,
        views: post.views_post?.[0]?.views || 0
      }))
      
      return { success: true, data: posts.value }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener posts del usuario:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Obtiene un post específico por ID
  const fetchPostById = async (postId) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!autor (
            full_name,
            avatar_url
          ),
          views_post (
            views
          )
        `)
        .eq('id', postId)
        .single()

      if (fetchError) throw fetchError

      // Incluye las vistas en el objeto del post
      currentPost.value = {
        ...data,
        views: data.views_post?.[0]?.views || 0
      }
      
      return { success: true, data: currentPost.value }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener post:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Sube una imagen al storage de Supabase
  const uploadImage = async (file) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      // Genera un nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${authStore.user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Sube el archivo al bucket 'posts'
      const {error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtiene la URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath)

      return { success: true, url: urlData.publicUrl, path: filePath }
    } catch (err) {
      console.error('Error al subir imagen:', err)
      return { success: false, error: err.message }
    }
  }

  // Sube un video al storage de Supabase
  const uploadVideo = async (file) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      // Genera un nombre único para el archivo de video
      const fileExt = file.name.split('.').pop()
      const fileName = `video-${authStore.user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Sube el archivo al bucket 'posts' (mismo bucket, diferentes prefijos)
      const {error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtiene la URL pública del video
      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath)

      return { success: true, url: urlData.publicUrl, path: filePath }
    } catch (err) {
      console.error('Error al subir video:', err)
      return { success: false, error: err.message }
    }
  }

  // Crea un nuevo post en Supabase
  const createPost = async (postData) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      loading.value = true
      error.value = null

      let imageUrl = null
      let videoUrl = null

      // Si hay una imagen, primero la sube
      if (postData.image) {
        const uploadResult = await uploadImage(postData.image)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        imageUrl = uploadResult.url
      }

      // Si hay un video, primero lo sube
      if (postData.video) {
        const uploadResult = await uploadVideo(postData.video)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        videoUrl = uploadResult.url
      }

      // Crea el post en la base de datos
      const { data, error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            name: postData.name,
            description: postData.description,
            autor: authStore.user.id,
            img_url: imageUrl,
            video_url: videoUrl,
            is_public: postData.isPublic || false,
            tags: postData.tags || [],
            municipio: postData.municipio || null,
            lugar: postData.lugar || null
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError

      // Agrega el nuevo post al estado local
      posts.value.unshift(data)

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Error al crear post:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Actualiza un post existente
  const updatePost = async (postId, updates) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      loading.value = true
      error.value = null

      let imageUrl = updates.img_url
      let videoUrl = updates.video_url

      // Si hay una nueva imagen, la sube
      if (updates.image && typeof updates.image !== 'string') {
        const uploadResult = await uploadImage(updates.image)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        imageUrl = uploadResult.url
      }

      // Si hay un nuevo video, lo sube
      if (updates.video && typeof updates.video !== 'string') {
        const uploadResult = await uploadVideo(updates.video)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error)
        }
        videoUrl = uploadResult.url
      }

      // Actualiza el post
      const { data, error: updateError } = await supabase
        .from('posts')
        .update({
          name: updates.name,
          description: updates.description,
          img_url: imageUrl,
          video_url: videoUrl,
          is_public: updates.isPublic,
          tags: updates.tags || [],
          municipio: updates.municipio || null,
          lugar: updates.lugar || null
        })
        .eq('id', postId)
        .eq('autor', authStore.user.id) // Solo permite actualizar posts propios
        .select()
        .single()

      if (updateError) throw updateError

      // Actualiza el post en el estado local
      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        posts.value[index] = data
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Error al actualizar post:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Elimina un post
  const deletePost = async (postId) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      loading.value = true
      error.value = null

      // Obtiene el post para eliminar su imagen del storage
      const post = posts.value.find(p => p.id === postId)

      // Elimina el post de la base de datos
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('autor', authStore.user.id) // Solo permite eliminar posts propios

      if (deleteError) throw deleteError

      // Si el post tenía imagen, la elimina del storage
      if (post?.img_url) {
        const fileName = post.img_url.split('/').pop()
        await supabase.storage.from('posts').remove([fileName])
      }

      // Elimina el post del estado local
      posts.value = posts.value.filter(p => p.id !== postId)

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error al eliminar post:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Alterna el estado público de un post
  const togglePublic = async (postId) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.user) {
        throw new Error('Usuario no autenticado')
      }

      const post = posts.value.find(p => p.id === postId)
      if (!post) {
        throw new Error('Post no encontrado')
      }

      loading.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .from('posts')
        .update({ is_public: !post.is_public })
        .eq('id', postId)
        .eq('autor', authStore.user.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Actualiza el post en el estado local
      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        posts.value[index] = data
      }

      return { success: true, data }
    } catch (err) {
      error.value = err.message
      console.error('Error al cambiar visibilidad del post:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Limpia el estado de posts
  const clearPosts = () => {
    posts.value = []
    currentPost.value = null
    error.value = null
  }

  // Obtiene las vistas de un post
  const getPostViews = async (postId) => {
    try {
      const { data, error: viewsError } = await supabase
        .from('views_post')
        .select('views')
        .eq('post_id', postId)
        .single()

      if (viewsError) {
        // Si no existe registro, devuelve 0
        if (viewsError.code === 'PGRST116') {
          return 0
        }
        throw viewsError
      }

      return data?.views || 0
    } catch (err) {
      console.error('Error al obtener vistas del post:', err)
      return 0
    }
  }

  // Incrementa las vistas de un post
  const incrementPostViews = async (postId) => {
    try {
      // Solo ejecuta en el cliente
      if (typeof window === 'undefined') return { success: false }

      // Primero verifica si existe un registro para este post
      const { data: existingView, error: fetchError } = await supabase
        .from('views_post')
        .select('id, views')
        .eq('post_id', postId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (existingView) {
        // Si existe, incrementa las vistas
        const { data, error: updateError } = await supabase
          .from('views_post')
          .update({ views: existingView.views + 1 })
          .eq('id', existingView.id)
          .select()
          .single()

        if (updateError) throw updateError

        return { success: true, views: data.views }
      } else {
        // Si no existe, crea un nuevo registro con views = 1
        const { data, error: insertError } = await supabase
          .from('views_post')
          .insert({ post_id: postId, views: 1 })
          .select()
          .single()

        if (insertError) throw insertError

        return { success: true, views: data.views }
      }
    } catch (err) {
      console.error('Error al incrementar vistas del post:', err)
      return { success: false, error: err.message }
    }
  }

  // Suscribe a cambios en tiempo real de las vistas de un post
  const subscribeToPostViews = (postId, callback) => {
    // Solo ejecuta en el cliente
    if (typeof window === 'undefined') return null

    const subscription = supabase
      .channel(`views_post_${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'views_post',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          callback(payload.new.views)
        }
      )
      .subscribe()

    return subscription
  }

  // Desuscribe de cambios en tiempo real
  const unsubscribeFromPostViews = (subscription) => {
    if (subscription) {
      supabase.removeChannel(subscription)
    }
  }

  return {
    // Estado
    posts,
    currentPost,
    loading,
    error,
    
    // Getters
    publicPosts,
    userPosts,
    postsByDate,
    publicPostsCount,
    
    // Actions
    fetchPublicPosts,
    fetchUserPosts,
    fetchPostById,
    uploadImage,
    createPost,
    updatePost,
    deletePost,
    togglePublic,
    clearPosts,
    
    // Vistas
    getPostViews,
    incrementPostViews,
    subscribeToPostViews,
    unsubscribeFromPostViews
  }
})
