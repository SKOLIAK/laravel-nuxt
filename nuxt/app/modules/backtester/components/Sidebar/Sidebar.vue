<script lang="ts" setup>
const { SelectedFolder, SelectedBacktest } = useBacktester()

const FolderActions = ref()
const BacktestActions = ref()
</script>

<template>
  <UDashboardPanel side="right" :width="450" :resizable="{ min: 450, max: 750 }">
    <UDashboardPanelContent>
      <UDashboardToolbar class="!pt-4">

          <!-- ~/components/SelectFolder.vue -->
          <BSelectFolder />

          <template v-if="!isObjectEmpty(SelectedFolder)">
            <UTooltip text="Update or Delete Folder">
              <UButton icon="lucide:settings" color="white" size="sm" @click="FolderActions.EditFolder(SelectedFolder ?? {}) ?? ''"/>
            </UTooltip>
          </template>
          <UTooltip text="New Folder">
            <UButton icon="lucide:plus" color="white" size="sm" @click="FolderActions.NewFolder() ?? ''"/>
          </UTooltip>
          

      </UDashboardToolbar>

      <UDashboardToolbar>
        <!-- ~/components/SelectBacktest.vue -->
        <BSelectBacktest />
        <template v-if="!isObjectEmpty(SelectedBacktest)">
          <UTooltip text="Update or Delete Backtest">
            <UButton icon="lucide:settings" color="white" size="sm"  @click="BacktestActions.EditBacktest(SelectedBacktest ?? {}) ?? ''"/>
          </UTooltip>

          <UTooltip :text="SelectedBacktest.favourite ? 'Remove from favourites' : 'Add to favourites'">
            <UButton size="sm" color="white" class="h-8" icon="solar:heart-bold" :class="{'!text-primary-600 dark:!text-primary-500': SelectedBacktest.favourite}" />
          </UTooltip>



        </template>
        <template v-if="!isObjectEmpty(SelectedFolder)">
          <UTooltip text="New Backtest">
            <UButton icon="lucide:plus" color="white" size="sm" @click="BacktestActions.NewBacktest() ?? ''"/>
          </UTooltip>
        </template>
      </UDashboardToolbar>

      <div class="p-1 flex flex-col border-t border-white/10 gap-y-1">
        ...
      </div>
    </UDashboardPanelContent>

  </UDashboardPanel>

  
  <BFolderActionsModal ref="FolderActions" />
  <BBacktestActionsModal ref="BacktestActions" />
</template>