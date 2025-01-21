<script lang="ts" setup></script>

<template>
  <button
    class="border-border-normal dark:border-gray-700 focus:border-border-pressed group flex min-h-32 min-w-32 max-w-64 cursor-pointer select-none flex-col items-center justify-start overflow-hidden rounded-xl border-2 border-dashed p-4 pt-4 transition duration-200"
    @click="$emit('clicked')"
  >
    <div
      class="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 p-2.5 text-gray-500/80 dark:text-gray-400 transition duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-300"
    >
      <UIcon name="akar-icons:plus" size="1em" />
    </div>
    <div class="text-text-muted group-hover:text-text-normal over transition duration-200">
      <div class="truncate text-ellipsis text-xs font-medium text-gray-500/80 dark:text-gray-400"><slot /></div>
    </div>
  </button>
</template>
