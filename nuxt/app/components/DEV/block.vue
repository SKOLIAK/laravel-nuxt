<template>
      <div class="bg-black p-8 text-white rounded-lg mb-4 text-sm">
        <div class="flex items-center justify-start">
          <div class="tracking-tighter font-medium grow "><slot name="title"/></div>
          <button class="ml-auto text-xs font-medium text-white/80" @click="collapseExpand">
            <span v-if="isCollapsed">Expand</span>
            <span v-else>Collapse</span>
          </button>
        </div>
        <div class="h-full transition duration-500 overflow-hidden" :class="{'!h-0': isCollapsed}">
          <code class="bg-white/10 p-0.5 text-xs !font-bold text-primary rounded"><slot name="code"/></code>
        </div>
      </div>
</template>

<script lang="ts" setup>
const isCollapsed = ref(false)

function collapseExpand() {
  isCollapsed.value = !isCollapsed.value
}

</script>
