<script lang="ts" setup>
import { Handle, Position, useVueFlow } from '@vue-flow/core'
const { getNodeIcon } = useFlow()

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String
  },
  selected: {
    type: Boolean,
    default: false
  },
  source: {
    type: Boolean,
    default: false
  },
  target: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    required: true
  },
})

const getTitle = computed(() => {
  let a = props.type.replace('__', '')
  switch(a) {
    case 'entry':
      return 'Entry Node'
      break;
    case 'true':
      return 'Yes'
      break;
      case 'false':
      return 'No'
      break;
    default: 
      return props.data.label
      break;
  }
}) 


</script>

<template>
  <FNodeCard :id="props.id" :canvas="true" :title="getTitle" :icon="getNodeIcon(type)" :class="{'!border-primary-500': selected}">

    <template v-if="type == '__entry' || type == '__output'"  #title>
      <UInput variant="none" v-model="data.label" />
    </template>  

    <template v-if="type == '__input'"  #title>
      <UTextarea variant="none" v-model="data.label" autoresize />
    </template>  

    <template #after>
      <UButton icon="mdi:drag" color="white" variant="ghost" class="cursor-move" />


      <Handle
        v-if="source"
        type="source"
        :position="Position.Bottom"
        :connectable="true"
      />

      <Handle
        v-if="target"
        type="target"
        :position="Position.Top"
        :connectable="true"
      />
    </template>
  </FNodeCard>
</template>