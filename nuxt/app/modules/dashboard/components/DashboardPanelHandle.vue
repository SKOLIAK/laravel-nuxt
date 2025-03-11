<template>
  <div v-bind="attrs" :class="ui.wrapper">
    <div :class="ui.container" />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { twJoin } from 'tailwind-merge'
import type { DeepPartial } from '#ui/types'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical'
  },
  side: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: undefined
  },
  isDragged: {
    type: Boolean as PropType<true | false>,
    default: false
  },
  ui: {
    type: Object as PropType<DeepPartial<typeof config.value>>,
    default: () => ({})
  }
})

const config = computed(() => {
  const wrapper: string = twJoin(
    'hidden md:block bg-transparent select-none absolute group focus:outline-none',
    props.orientation === 'vertical' && 'w-[9px] h-full inset-y-0 cursor-col-resize',
    props.orientation === 'horizontal' && 'h-[9px] w-full inset-x-0 -top-[5px] cursor-row-resize',
    props.side == 'left' && 'right-1 hover:-right-[calc(0 - 1px)]',
    props.side == 'right' && '-left-3 hover:-left-[calc(3em - 1px)]'
  )

  const container: string = twJoin(
    'focus:outline-none rounded-full focus:bg-primary-400 dark:focus:bg-primary-400 group-hover:bg-primary-400 dark:group-hover:bg-primary-400 dark:group-hover:bg-gray-700 bg-black/20 dark:bg-white/20 transition duration-200 absolute my-4 top-1/2 transform group-hover:w-[3px] transition-all duration-200',
    props.orientation === 'vertical' && 'w-px h-1/2 inset-x-0 mx-auto -translate-y-1/2',
    props.orientation === 'horizontal' && 'h-px w-1/2 inset-y-0 my-auto -translate-x-1/2',
    props.isDragged && '!bg-gray-400 dark:!bg-gray-50',
    props.orientation === 'vertical' && props.isDragged && 'h-2/3 !w-[3px]',
    props.orientation === 'horizontal' && props.isDragged && 'w-2/3 !h-[3px]',
  )

  return {
    wrapper,
    container
  }
})

const { ui, attrs } = useUI('dashboard.panel.handle', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
