// Middleware de autenticación — protege rutas que requieren login
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/login')
  }
})
