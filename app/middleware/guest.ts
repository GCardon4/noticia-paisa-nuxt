// Middleware para páginas de invitados (ej: login)
// Si el usuario ya está autenticado, lo redirige al home
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser()
  if (user.value) {
    return navigateTo('/')
  }
})
