<template>
  <div class="mb-4 rounded-lg bg-black p-8 text-sm text-white">
    <div class="flex items-center justify-start">
      <div class="grow font-medium tracking-tighter"><slot name="title" /></div>
      <button class="ml-auto text-xs font-medium text-white/80" @click="collapseExpand">
        <span v-if="isCollapsed">Expand</span>
        <span v-else>Collapse</span>
      </button>
    </div>
    <div class="h-full overflow-hidden transition duration-500" :class="{ '!h-0': isCollapsed }">
      <code class="text-primary rounded bg-white/10 p-0.5 text-xs !font-bold"
        ><slot name="code"
      /></code>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const isCollapsed = ref(false);

  function collapseExpand() {
    isCollapsed.value = !isCollapsed.value;
  }
</script>
