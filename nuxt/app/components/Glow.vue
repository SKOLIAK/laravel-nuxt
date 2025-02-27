<template>
  <div>
    <div
    ref="target"
    :style="cssVars"
    :class="['rounded-lg p-0.5', props.class || '']"
  >
    <div
      class="rounded-lg w-full h-full bg-gradient-to-b from-gray-800/50 to-gray-950/50 bg-gray-950/80"
    ></div>

        <slot />
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from "vue";
import { useMouseInElement } from "@vueuse/core";
const props = defineProps(["class"]);
const target = ref(null);
const { elementX, elementY } = useMouseInElement(target);
const cssVars = computed(() => ({
  "--x": `${target.value ? elementX.value : -1000}px`,
  "--y": `${target.value ? elementY.value : -1000}px`,
  "background-image": `radial-gradient(
    300px circle at var(--x) var(--y),
    rgb(var(--color-primary-500)) 0,
    transparent 100%
  )`,
  'border-radius': 'var(--)'
}));

</script>

<style scoped>
.shine {
  background-image: radial-gradient(
    300px circle at var(--x) var(--y),
    #FF0000 0,
    transparent 100%
  );
}
</style>