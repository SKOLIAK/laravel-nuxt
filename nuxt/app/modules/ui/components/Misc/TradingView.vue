<script lang="ts" setup>
  const colorMode = useColorMode()
  const color = computed(() => (colorMode.value === "dark" ? "" : "filter invert"))
</script>

<template>
  <div class="bg-black rounded w-8 h-8 p-1 ring-1 ring-white/5 flex-shrink-0 inline-block" :class="color">
    <img src="@/assets/images/tw.png" class="w-full h-full object-contain">
  </div>
</template>
