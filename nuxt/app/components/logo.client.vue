<script lang="ts" setup>
const colorMode = useColorMode();

defineProps({
  light: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <NuxtLink :to="'/'" class="relative flex-shrink-0">
    <img src="@/assets/images/logo.svg" class="mr-1 h-8" :class="{'logo-light': !light ? colorMode.value == 'dark' : light}"/>
  </NuxtLink>
</template>
