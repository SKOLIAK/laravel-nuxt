<script lang="ts" setup>
defineProps({
  file: {
    type: String,
    default: 'None'
  }
})
</script>

<template>
  <UModal
    :ui="{
      wrapper: 'top-4 right-4 bottom-4',
      rounded: 'rounded-xl',
      translate: { base: 'translate-x-0', right: 'translate-x-4' },
      overlay: { background: 'bg-backdrop' },
      base: 'ring-1 ring-gray-700/50 overflow-hidden'
    }">
    {{ file }}
    <img :src="file" />
  </UModal>
</template>
