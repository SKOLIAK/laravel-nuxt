<script lang="ts" setup>

</script>

<template>
<button class=" p-4 group min-w-32 min-h-32 max-w-64 pt-4 select-none cursor-pointer flex flex-col items-center justify-start rounded-xl border-2 border-dashed border-border-normal hover:border-border-hover focus:border-border-pressed transition duration-200 overflow-hidden" @click="$emit('clicked')">
  <div class="rounded-full mb-2.5 w-10 h-10 bg-gray-100 group-hover:bg-gray-200 transition duration-300 flex items-center justify-center p-2.5 text-gray-500/80 group-hover:text-gray-500">
  <UIcon name="akar-icons:plus" size="1em" />
</div>
<div class="text-text-muted group-hover:text-text-normal transition duration-200 over">
  <div class="text-xs font-medium text-gray-500/80 truncate text-ellipsis"><slot /></div>
</div>
</button>

</template>
