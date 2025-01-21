<template>
  <p
    class="mr-1 inline-flex select-none items-center rounded bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 text-xs font-bold text-black/90 dark:text-white/90"
    :class="{
      'rating-8-up': rating >= 8,
      'rating-7-up': rating >= 7 && rating <= 8,
      'rating-5-up': rating <= 7 && rating >= 5,
      'rating-3-up': rating >= 3 && rating <= 5,
      'rating-0-up': rating <= 3 && rating > 0,
    }"
  >
    <span v-if="rating > 0" class="drop-shadow">{{ rating }}</span>
    <span class="dark:text-gray-500" v-else>~</span>
  </p>
</template>

<script lang="ts" setup>
  defineProps({
    rating: Number,
  });
</script>
