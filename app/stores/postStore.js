import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePostStore = defineStore('post', () => {
  // useSupabaseClient y useSupabaseUser son auto-importados por @nuxtjs/supabase
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()  // reactivo y SSR-aware

  // Estado
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const publicPosts = computed(() => posts.value.filter(post => post.is_public === true))

  const userPosts = computed(() => {
    if (!user.value) return []
    return posts.value.filter(post => post.autor === user.value.id)
  })

  const postsByDate = computed(() => {
    return [...posts.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  })

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
      if (!user.value) throw new Error('Usuario no autenticado')

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
        .eq('autor', user.value.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

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
      if (!user.value) throw new Error('Usuario no autenticado')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName)

      return { success: true, url: urlData.publicUrl, path: fileName }
    } catch (err) {
      console.error('Error al subir imagen:', err)
      return { success: false, error: err.message }
    }
  }

  // Sube un video al storage de Supabase
  const uploadVideo = async (file) => {
    try {
      if (!user.value) throw new Error('Usuario no autenticado')

      const fileExt = file.name.split('.').pop()
      const fileName = `video-${user.value.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName)

      return { success: true, url: urlData.publicUrl, path: fileName }
    } catch (err) {
      console.error('Error al subir video:', err)
      return { success: false, error: err.message }
    }
  }

  // Crea un nuevo post en Supabase
  const createPost = async (postData) => {
    try {
      // Obtener el usuario directamente desde la sesión activa (más confiable que el ref reactivo)
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      if (authError || !currentUser) throw new Error('Usuario no autenticado')

      loading.value = true
      error.value = null

      let imageUrl = null
      let videoUrl = null

      if (postData.image) {
        const uploadResult = await uploadImage(postData.image)
        if (!uploadResult.success) throw new Error(uploadResult.error)
        imageUrl = uploadResult.url
      }

      if (postData.video) {
        const uploadResult = await uploadVideo(postData.video)
        if (!uploadResult.success) throw new Error(uploadResult.error)
        videoUrl = uploadResult.url
      }

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert([{
          name: postData.name,
          description: postData.description,
          autor: currentUser.id,
          img_url: imageUrl,
          video_url: videoUrl,
          is_public: postData.isPublic || false,
          tags: postData.tags || [],
          municipio: postData.municipio || null,
          lugar: postData.lugar || null
        }])
        .select()
        .single()

      if (insertError) throw insertError

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
      if (!user.value) throw new Error('Usuario no autenticado')

      loading.value = true
      error.value = null

      let imageUrl = updates.img_url
      let videoUrl = updates.video_url

      if (updates.image && typeof updates.image !== 'string') {
        const uploadResult = await uploadImage(updates.image)
        if (!uploadResult.success) throw new Error(uploadResult.error)
        imageUrl = uploadResult.url
      }

      if (updates.video && typeof updates.video !== 'string') {
        const uploadResult = await uploadVideo(updates.video)
        if (!uploadResult.success) throw new Error(uploadResult.error)
        videoUrl = uploadResult.url
      }

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
        .eq('autor', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) posts.value[index] = data

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
      if (!user.value) throw new Error('Usuario no autenticado')

      loading.value = true
      error.value = null

      const post = posts.value.find(p => p.id === postId)

      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('autor', user.value.id)

      if (deleteError) throw deleteError

      if (post?.img_url) {
        const fileName = post.img_url.split('/').pop()
        await supabase.storage.from('posts').remove([fileName])
      }

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
      if (!user.value) throw new Error('Usuario no autenticado')

      const post = posts.value.find(p => p.id === postId)
      if (!post) throw new Error('Post no encontrado')

      loading.value = true
      error.value = null

      const { data, error: updateError } = await supabase
        .from('posts')
        .update({ is_public: !post.is_public })
        .eq('id', postId)
        .eq('autor', user.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = posts.value.findIndex(p => p.id === postId)
      if (index !== -1) posts.value[index] = data

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
        if (viewsError.code === 'PGRST116') return 0
        throw viewsError
      }

      return data?.views || 0
    } catch (err) {
      console.error('Error al obtener vistas del post:', err)
      return 0
    }
  }

  // Incrementa las vistas de un post (solo cliente)
  const incrementPostViews = async (postId) => {
    try {
      if (import.meta.server) return { success: false }

      const { data: existingView, error: fetchError } = await supabase
        .from('views_post')
        .select('id, views')
        .eq('post_id', postId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (existingView) {
        const { data, error: updateError } = await supabase
          .from('views_post')
          .update({ views: existingView.views + 1 })
          .eq('id', existingView.id)
          .select()
          .single()

        if (updateError) throw updateError
        return { success: true, views: data.views }
      } else {
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
    if (import.meta.server) return null

    return supabase
      .channel(`views_post_${postId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'views_post', filter: `post_id=eq.${postId}` },
        (payload) => callback(payload.new.views)
      )
      .subscribe()
  }

  // Desuscribe de cambios en tiempo real
  const unsubscribeFromPostViews = (subscription) => {
    if (subscription) supabase.removeChannel(subscription)
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
