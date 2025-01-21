<script lang="ts" setup>
  defineProps({
    links: Object,
  });
</script>

<template>
  <div class="py-4">
    <RouterLink :to="link.to" class="navlink group" v-for="link in links">
      <div class="justify-left flex items-center mb-0.5">
        <div class="navlink-active mr-4 h-4 w-1 rounded rounded-bl-none rounded-tl-none"></div>
        <!--active-->
        <div
          class="navlink-active-card ring-gray-300/10 ring-inset mr-4 flex grow items-center rounded-lg p-1 text-sm font-medium text-white/70 group-hover:text-white transition-all duration-500 group-hover:bg-gray-800 group-hover:ring-1"
        >
          <div
            class="icon text-base filter grayscale group-hover:grayscale-0 mr-2 flex items-center rounded-lg bg-white/5 p-2 text-gray-500 ring-1 ring-inset ring-gray-700/50 transition-all duration-500 group-hover:bg-gray-800 group-hover:ring-0"
          >
            <UIcon :name="link.icon" size="1.2em" />
          </div>
          <div class="justify-right flex items-center"></div>
          <div class="mr-auto">
            {{ link.label }}
          </div>
          <div v-if="link.tooltip" v-for="shortcut in link.tooltip.shortcuts">
            <div
              v-if="shortcut == 'meta'"
              class="ml-1 mt-0.5 flex items-center justify-center rounded bg-gray-600/5 p-1 text-base text-gray-400/50 ring-1 ring-gray-500/10 transition-all duration-500 group-hover:text-gray-400/80 group-hover:ring-gray-200/10"
            >
              <UIcon name="akar-icons:command" size=".65em" />
            </div>

            <UKbd
              :value="shortcut"
              v-else
              class="ml-1 bg-gray-600/5 text-xs uppercase text-gray-400/50 ring-gray-500/5 transition-all duration-500 group-hover:text-gray-400/80 group-hover:ring-gray-200/10"
            />
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
