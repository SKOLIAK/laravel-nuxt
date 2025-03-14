<script setup lang="ts">
import type { PropType } from 'vue'
import type { card as cardConfig } from '#ui/ui.config'
import type { DeepPartial } from '#ui/types'


import useDragAndDrop from '#flow/composables/useDragAndDrop'
const { onDragStart } = useDragAndDrop()
const slots = useSlots()

const config = computed(() => ({
  wrapper: 'bg-background cursor-pointer p-2 rounded-md border border-black/20 dark:border-white/20 transiton-colors duration-200 hover:border-black/50 hover:dark:border-white/50 text-sm overflow-hidden',
  base: 'flex items-center justify-start gap-2 font-medium text-foreground',
  title: 'truncate text-ellipsis',
  slot: 'text-xs text-foreground/70 font-normal truncate text-ellipsis',
  icon: {
    base: 'flex-shrink-0',
    size: '1.5em',
  }
}))

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  id: {
    type: String,
    required: true
  },

  title: {
    type: String,
    default: 'Node Card'
  },

  subtitle: {
    type: String,
    default: ''
  },

  iconColor: {
    type: String,
    default: 'opacity-40'
  },

  icon: {
    type: String,
    default: 'lucide:mouse-pointer-click'
  },

  draggable: {
    type: Boolean,
    default: true
  },

  canvas: {
    type: Boolean,
    default: false
  },

  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },

  ui: {
    type: Object as PropType<DeepPartial<typeof config.value & typeof cardConfig>>,
    default: () => ({})
  }
})

const { ui, attrs } = useUI('node.card', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>

<template>
  <div 
    :class="ui.wrapper"
    :draggable="draggable && !canvas" 
    @dragstart="!canvas && onDragStart($event, `__${props.id}`)"
    v-bind="attrs"
  >
    <div :class="ui.base">
      <UIcon :name="icon" :size="ui.icon.size" :class="[ui.icon.base, iconColor]"/> 

      <div class="flex flex-col">
        <div :class="ui.title" v-if="$slots.title">
          <slot />
        </div>


          <span v-if="title || $slots.title" :class="ui.title">
            <slot name="title">
              <span :class="ui.title">{{ title }}</span>
            </slot>
          </span>

          <div :class="ui.slot" v-if="$slots.default || props.subtitle">
            <template v-if="props.subtitle">{{ props.subtitle }}</template>
            <slot v-else />
          </div>
      </div>

      <template v-if="slots.after">
        <slot name="after"/>
      </template>
    </div>

  </div>
</template>
