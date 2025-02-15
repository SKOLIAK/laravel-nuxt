export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const auth = useAuthStore();

  if (auth.logged && auth.user.must_verify_email) {
    return nuxtApp.runWithContext(() => {
      useToast().add({
        icon: GetErrorIcon,
        title: "Please confirm your email.",
        color: GetErrorColor,
      });

      return navigateTo("/account/general");
    });
  }
});
