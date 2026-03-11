// composables/useAuth.js — composable de autenticación para Nuxt 3
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
    await navigateTo('/')
  }

  return { user, isAuthenticated, login, logout }
}
