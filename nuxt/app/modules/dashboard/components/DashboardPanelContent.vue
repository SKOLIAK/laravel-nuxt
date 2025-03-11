<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { DeepPartial } from '#ui/types'

const config = {
  wrapper: 'flex-1 flex flex-col overflow-y-auto bg-white dark:bg-gray-800 no-scrollbar relative m-4 ml-0 rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-white/5'
}

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<DeepPartial<typeof config>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('dashboard.panel.content', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
