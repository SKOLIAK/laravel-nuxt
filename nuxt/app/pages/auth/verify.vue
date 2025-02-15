<script lang="ts" setup>
  definePageMeta({
    validate: (route) => !!route.query.verify_url,
    layout: "auth",
  });

  const route = useRoute();
  const auth = useAuthStore();

  const { pending, error } = useLazyFetch<any>(route.query.verify_url as string, {
    async onResponse({ response }) {
      if (response._data?.ok) {
        await auth.fetchUser();
      }
    },
  });

  useSeoMeta({
    title: "Email Verification",
  });
</script>
<template>
  <UCard class="mx-auto my-20 w-full max-w-md">
    <div class="space-y-4">
      <h1 class="mb-6 text-2xl font-medium">
        Email Verification
        <UIcon v-if="pending" name="i-heroicons-arrow-path-solid" class="animate-spin" />
        <span v-else-if="error" class="text-rose-500">Error</span>
        <span v-else class="text-primary">Done</span>
      </h1>
      <div v-if="error && error.data?.message">{{ error.data?.message }}</div>

      <div class="text-sm">
        <NuxtLink class="text-sm" to="/">Back to Home</NuxtLink>
      </div>
    </div>
  </UCard>
</template>
