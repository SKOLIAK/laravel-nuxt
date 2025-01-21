<template>
  <UIcon name="svg-spinners:bars-rotate-fade" :size="size" />
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    default: "1em"
  }
})
</script>
