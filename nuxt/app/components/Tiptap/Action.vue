<template>
  <button
    type="button"
    class="cursor-pointer rounded p-1.5 hover:bg-black/10 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white [&:not(:last-child)]:mr-1"
    v-bind="$attrs"
    :class="{
      'dark:bg-primary-600 dark:hover:bg-primary-700 bg-black/10 text-black': editor.isActive(name),
      'text-gray-500': !editor.isActive(name),
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup>
  defineProps({
    editor: Object,
    name: String,
  });
</script>
