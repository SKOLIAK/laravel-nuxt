<template>
  <button
    @click.prevent="$emit('addTag')"
    class="group text-gray-600 hover:text-gray-400 focus:outline-none active:outline-none flex items-center justify-between rounded text-xs ring-1 ring-inset ring-white/10 gap-x-1 drop-shadow-sm overflow-hidden h-5 bg-gray-800 hover:bg-gray-700 transition-all duration-300"
  >
    <div class="py-0.5 group-hover:px-2 w-0 group-hover:w-full transition-all duration-500">

    <!-- Tag Name -->
    <div class="truncate text-ellipsis font-bold">Add Tag</div>

    </div>
    <!-- Delete Action -->
    <div
      class="text-gray-500 group-hover:text-gray-300 transition-all duration-1000 rounded rounded-l-none p-1.5 bg-black/20 flex items-center justify-center h-full ring-1 ring-inset ring-black/10 border-t border-r border-b border-white/10"
    >
      <UIcon name="akar-icons:plus"/>
  </div>
</button>

</template>

<script lang="ts" setup>

defineProps({
  tag: Object,
  deletable: Boolean
})
</script>

