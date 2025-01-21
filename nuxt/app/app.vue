<script setup lang="ts">
  const colorMode = useColorMode();

  const auth = useAuthStore();
  /** Important methods */
  useSetTimeZone(auth.logged ? auth.user.timezone : "");

  const color = computed(() => (colorMode.value === "dark" ? "#111827" : "white"));

  useHead({
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { key: "theme-color", name: "theme-color", content: color },
    ],
    link: [{ rel: "icon", href: "/favicon.ico" }],
    htmlAttrs: {
      lang: "en",
    },
  });
</script>

<template>
  <div class="green-background">
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
