<script setup lang="ts">
  import type { NuxtError } from "#app";

  useSeoMeta({
    title: "Page not found",
    description: "We are sorry but this page could not be found.",
  });

  let props = defineProps({
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

  console.log(props.error)
</script>

<template>


<section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600 dark:text-rose-500">Oh no!</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's wrong.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400" v-if="error.statusCode == 404">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>

            <UButton to='/' v-if="error.statusCode == 404" size="xl" color="white">Back to Homepage</UButton>

        </div>
    </div>
</section>
</template>
