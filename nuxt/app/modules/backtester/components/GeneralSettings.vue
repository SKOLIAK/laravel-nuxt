<script lang="ts" setup>
const { autosaveDuration, autosaveEnabled } = useBacktester()
const { useSessionColors, backtesterTypes, backtesterType, useSessionsChart } = useBacktesterSettings()
</script>

<template>
  <UPopover :ui="{ background: '', ring: '', base: 'focus:outline-none relative overflow-visible' }">
    <UButton color="white" icon="heroicons:cog-6-tooth" />
    <template #panel>
      <UBasePanel>
        <div class="p-3 border-b border-black/10 dark:border-white/10">
          <h3 class="font-medium text-sm tracking-wide">Settings</h3>
        </div>
        <div class="flex flex-col p-4 pt-1 gap-y-2.5">

          <span class="text-xs font-normal opacity-50 mt-2">General</span>

          <div class="font-medium text-xs flex items-center justify-between gap-x-4">
            <UHelpTitle :text="'Automatically saves any changes made after ' + autosaveDuration / 1000 + ' seconds'">
              Auto Save
            </UHelpTitle>
            <UToggle v-model="autosaveEnabled" size="sm" />
          </div>



          <span class="text-xs font-normal opacity-50 mt-2">Charts</span>

          <div class="font-medium text-xs flex items-center justify-between gap-x-4">
            <UHelpTitle text="Display performance across sessions">
              Session Distribution Chart
            </UHelpTitle>
            <UToggle v-model="useSessionsChart" size="sm" />
          </div>

          <div class="font-medium text-xs flex items-center justify-between gap-x-4">
            <UHelpTitle text="Should charts use your session individual colors">
              Session Colors
            </UHelpTitle>
            <UToggle v-model="useSessionColors" size="sm" />
          </div>


          <span class="text-xs font-normal opacity-50 mt-2">Backtesting</span>

          <div class="font-medium text-xs flex items-center justify-between gap-x-4">
            <span>Market Type</span>
            <USelectMenu v-model="backtesterType" :options="backtesterTypes" size="xs" :disabled="true" />
          </div>

        </div>
      </UBasePanel>
    </template>
  </UPopover>
</template>
