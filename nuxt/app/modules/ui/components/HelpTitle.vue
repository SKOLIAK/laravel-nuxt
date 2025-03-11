<template>
  <UTooltip :text="text" :ui="{
    base: '[@media(pointer:coarse)]:hidden h-6 px-2 py-1 text-xs font-normal overflow-auto !max-w-full relative',
  }">
    <span :class="[ui.wrapper]" v-bind="attrs">
      <slot :use="$slots.default" />
      <UIcon :name="icon" :class="[ui.icon.base]" />
    </span>
  </UTooltip>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import colors from '#tailwind-config/theme/colors'
import type uiColors from '#ui-colors'

const appConfig = useAppConfig()

const config = computed(() => ({
  wrapper: 'flex items-center justify-start gap-1',
  icon: {
    base: 'text-blue-600 dark:text-blue-400 cursor-help'
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  icon: {
    type: String,
    default: 'heroicons:information-circle-16-solid'
  },
  text: {
    type: String,
    default: ''
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  ui: {
    type: Object as PropType<Partial<typeof config.value>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('content.callout', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
