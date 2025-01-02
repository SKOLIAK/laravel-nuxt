<template>
    <button
        type="button"
        class="p-1.5  rounded cursor-pointer hover:bg-black/10 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-600 [&:not(:last-child)]:mr-1"
        v-bind="$attrs"
        :class="{
            'bg-black/10 text-black dark:bg-primary-600 dark:hover:bg-primary-700': editor.isActive(name),
            'text-gray-500': !editor.isActive(name)
        }"
    >
        <slot></slot>
  </button>
</template>

<script setup>
    defineProps({
        editor: Object,
        name: String
    })
</script>
