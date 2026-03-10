// composables/useAuth.js — reemplaza authStore
  export function useAuth() {
    const user = useSupabaseUser()           // reactivo, SSR-aware
    const supabase = useSupabaseClient()

    const isAuthenticated = computed(() => !!user.value)

    const login = async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { success: false, error: error.message }
      return { success: true, user: data.user }
    }

    const logout = async () => {
      await supabase.auth.signOut()
      await navigateTo('/login')
    }

    return { user, isAuthenticated, login, logout }
  }

  Antes en Quasar (authStore.js):
  // Inicializa la sesión del usuario al cargar la aplicación
  const initializeAuth = async () => {
    if (typeof window === 'undefined') return  // ← guarda manual SSR
    const { data: { session } } = await supabase.auth.getSession()
    // ...
  }