<script setup>
import { Handle, Position, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true
  },
})

</script>

<template>
  <div class="bg-background p-2 rounded-md border border-black/20 dark:border-white/20 text-sm flex items-center">
    <UInput v-model="data.label" variant="none" />

    <UIcon name="mdi:drag" />
    <Handle
      type="source"
      :position="Position.Top"
      :connectable="true"
      :style="{ background: '#5EC697'}"
    />

    <Handle
      type="target"
      :position="Position.Bottom"
      :connectable="true"
    />

  </div>
</template>
