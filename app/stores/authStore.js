import { defineStore } from 'pinia'
import { supabase } from 'src/boot/supabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado del usuario autenticado
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Inicializa la sesión del usuario al cargar la aplicación
  const initializeAuth = async () => {
    // Solo ejecuta en el cliente, no en SSR
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      loading.value = true
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user || null

      // Escucha cambios en el estado de autenticación
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
    } catch (err) {
      error.value = err.message
      console.error('Error al inicializar autenticación:', err)
    } finally {
      loading.value = false
    }
  }

  // Inicia sesión con email y contraseña
  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) throw loginError

      user.value = data.user
      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      console.error('Error al iniciar sesión:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Registra un nuevo usuario
  const register = async (email, password, metadata = {}) => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (signUpError) throw signUpError

      return { success: true, user: data.user }
    } catch (err) {
      error.value = err.message
      console.error('Error al registrar usuario:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Cierra la sesión del usuario
  const logout = async () => {
    try {
      loading.value = true
      error.value = null

      const { error: logoutError } = await supabase.auth.signOut()
      
      if (logoutError) throw logoutError

      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error al cerrar sesión:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Verifica si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user.value
  }

  // Obtiene el perfil del usuario desde la tabla profiles
  const getUserProfile = async () => {
    try {
      if (!user.value) return null

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (profileError) throw profileError

      return data
    } catch (err) {
      console.error('Error al obtener perfil:', err)
      return null
    }
  }

  return {
    user,
    loading,
    error,
    initializeAuth,
    login,
    register,
    logout,
    isAuthenticated,
    getUserProfile
  }
})
