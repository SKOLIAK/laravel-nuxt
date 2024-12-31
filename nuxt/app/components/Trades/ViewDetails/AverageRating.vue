<template>
  <p
    class="text-xs select-none font-bold inline-flex items-center py-0.5 px-1.5 rounded  text-black/90 mr-1 bg-gray-200"
    :class="{
      'bg-green-600 text-white drop-shadow': rating >= 7,
      'bg-gray-500 text-white drop-shadow': rating <= 7 && rating >= 5,
      'bg-gray-700 text-white drop-shadow': rating <= 5 && rating >= 3,
      'bg-gray-900 text-white drop-shadow': rating <= 3 && rating > 0
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
