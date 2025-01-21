<template>
  <div
    class="flex items-center justify-between rounded text-xs font-medium ring-1 ring-inset ring-white/10 gap-x-1 drop-shadow-sm overflow-hidden h-5"
    :style="{ background: tag.color }"
  >
    <div class="text-white py-0.5 px-2">

    <!-- Tag Name -->
    <div class="truncate text-ellipsis">{{ tag.name }}</div>

    </div>
    <!-- Delete Action -->
    <button
      v-if="deletable == true" @click.prevent="$emit('deleteTag')"
      class="rounded rounded-l-none p-1.5 bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors duration-200 h-full ring-1 ring-inset ring-black/10 border-t border-r border-b border-white/10"
    >
      <UIcon name="akar-icons:x-small"/>
    </button>
  </div>

</template>

<script lang="ts" setup>

defineProps({
  tag: Object,
  deletable: Boolean
})
</script>

