<script lang="ts" setup>
  defineProps({
    color: String,
    to: String,
    data: Object,
  });
</script>

<template>
  <button
    class="group relative overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-700/50 transition-all duration-200 hover:ring-gray-300 dark:hover:ring-gray-700"
    :to="to"
  >
    <div
      class="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500"
      :style="{ 'background-color': color }"
    ></div>
    <div
      class="flex min-h-32 min-w-32 max-w-64 cursor-pointer select-none items-center justify-center bg-white dark:bg-gray-800 p-4"
    >
      <div class="text-text-muted group-hover:text-text-normal over transition duration-200">
        <div
          class="truncate text-ellipsis text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:dark:text-white group-hover:text-gray-700"
        >
          <slot />
        </div>
      </div>
    </div>
  </button>
</template>
