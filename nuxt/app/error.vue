<script setup lang="ts">
  import type { NuxtError } from "#app";

  useSeoMeta({
    title: "Page not found",
    description: "We are sorry but this page could not be found.",
  });

  defineProps({
    error: {
      type: Object as PropType<NuxtError>,
      required: true,
    },
  });

  useHead({
    htmlAttrs: {
      lang: "en",
    },
  });
</script>

<template>
  <div>
    <UMain>
      <UContainer>
        <UPage class="mt-40 text-center">
          <div class="text-4xl font-medium">
            <span class="text-red-300">Error </span>
            <span class="text-white">{{ error.statusCode }}</span>
          </div>
          <div class="mt-4 text-sm font-normal text-white">{{ error.message }}</div>
        </UPage>
      </UContainer>
    </UMain>

    <UNotifications />
  </div>
</template>
