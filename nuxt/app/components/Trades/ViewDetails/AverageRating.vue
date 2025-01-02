<template>
  <p
    class="text-xs select-none font-bold inline-flex items-center py-0.5 px-1.5 rounded  text-black/90 mr-1 bg-gray-200"
    :class="{
      'rating-8-up': rating >= 8,
      'rating-7-up': rating >= 7 && rating <= 8,
      'rating-5-up': rating <= 7 && rating >= 5,
      'rating-3-up': rating >= 3 && rating <= 5,
      'rating-0-up': rating <= 3 && rating > 0
    }"
  >
    <span v-if="rating > 0">{{ rating }}</span>
    <span v-else>~</span>
  </p>
</template>

<script lang="ts" setup>
defineProps({
  rating: Number
})
</script>
