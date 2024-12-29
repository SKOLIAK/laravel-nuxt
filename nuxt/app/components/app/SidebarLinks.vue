<script lang="ts" setup>
defineProps({
  links: Object
})
</script>

<template>
<div class="py-4">
  <RouterLink :to="link.to" class="navlink group" v-for="link in links">
    <div class="flex items-center justify-left">
    <div class="rounded rounded-tl-none rounded-bl-none navlink-active w-1 h-4 mr-4"></div><!--active-->
      <div class="mr-4 grow flex items-center text-white/90 text-sm font-medium group-hover:bg-gradient-to-r from-white/10 via-white/0 to-white/0 rounded-lg transition-all duration-500 p-1 group-hover:ring-1 ring-primary-300/10">
        <div class="bg-white/5 text-white/90 rounded-lg p-2 flex items-center mr-2 ring-1 ring-white/10 group-hover:bg-white group-hover:text-primary transition-all duration-500">
          <UIcon :name="link.icon" size="1.2em" />
        </div>
        <div class="flex items-center justify-right"></div>
          <div class="mr-auto">
            {{ link.label }}
          </div>
          <div v-if="link.tooltip" v-for="shortcut in link.tooltip.shortcuts">
            <div  v-if="shortcut == 'meta'" class="mt-0.5 rounded bg-gray-600/5 ring-1 p-1 flex items-center justify-center ring-gray-500/10 text-gray-400/50 group-hover:text-gray-400/80 group-hover:ring-gray-200/10 text-base ml-1 transition-all duration-500">
              <UIcon name="akar-icons:command" size=".65em"  />
            </div>

            <UKbd :value="shortcut" v-else class="bg-gray-600/5 ring-gray-500/5 text-gray-400/50 group-hover:text-gray-400/80 group-hover:ring-gray-200/10 text-xs uppercase ml-1 transition-all duration-500"/>

          </div>

        </div>
      </div>
    </RouterLink >
</div>
</template>
