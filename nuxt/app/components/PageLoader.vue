<script lang="ts" setup>
  import { spinnerLoadingPage, spinnerLoadingPageText } from "@/utils/global";
</script>

<template>
  <div
    class="bg-gray-950/80 absolute flex text-gray-300 px-2.5 py-1 rounded shadow-lg shadow-gray-900 top-2 left-1/2 transform -translate-x-1/2 ring-1 ring-inset ring-gray-700/10 select-none items-center justify-center backdrop-blur "
    :class="{ hidden: spinnerLoadingPage == false }"
  >
    <div class="flex items-center justify-center space-x-2 text-xs font-medium">
      <Spinner />
      <div>{{ spinnerLoadingPageText }}</div>
    </div>
  </div>
</template>
