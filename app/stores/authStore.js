import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // useSupabaseClient y useSupabaseUser son auto-importados por @nuxtjs/supabase
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()  // reactivo y SSR-aware, manejado por el módulo

  const loading = ref(false)
  const error = ref(null)

  // Verifica si el usuario está autenticado (compatible con llamadas como función)
  const isAuthenticated = () => !!user.value

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
        options: { data: metadata }
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

      return { success: true }
    } catch (err) {
      error.value = err.message
      console.error('Error al cerrar sesión:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
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
    isAuthenticated,
    login,
    register,
    logout,
    getUserProfile
  }
})
