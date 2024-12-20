export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp()
  const auth = useAuthStore()

  if (auth.logged && !auth.user.roles.includes('admin')) {
    return nuxtApp.runWithContext(() => {
      useToast().add({
        icon: GetErrorIcon,
        title: "Access denied.",
        color: GetErrorColor,
      });

      return navigateTo('/')
    })
  }
})
