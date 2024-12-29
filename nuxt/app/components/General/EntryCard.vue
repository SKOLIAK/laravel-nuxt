<script lang="ts" setup>
defineProps({
  color: String,
  to: String,
  data: Object
})
</script>


<template>
  <button class="relative transition-all duration-200 overflow-hidden rounded-xl ring-1 ring-gray-200 hover:ring-gray-300 group" :to="to">
    <div class="h-1 absolute bottom-0 left-0 right-0 transition-all duration-500" :style="{'background-color': color}"></div>
    <div class="bg-white min-w-32 min-h-32 max-w-64 p-4 select-none cursor-pointer flex items-center justify-center">
      <div class="text-text-muted group-hover:text-text-normal transition duration-200 over">
        <div class="text-xs font-medium text-gray-600 truncate text-ellipsis group-hover:text-gray-700"><slot /></div>
      </div>
    </div>
  </button>
</template>
