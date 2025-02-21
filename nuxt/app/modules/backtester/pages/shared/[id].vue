<script lang="ts" setup>
  definePageMeta({
    layout: "shared",
  });

  useSeoMeta({
    title: "Shared Backtest",
  });

  const { SelectedBacktest, fetchFolders, Folders, SelectedFolder } = useBacktester()

  onBeforeMount(async () => {
    await fetchFolders()
    SelectedFolder.value = Folders.value[0]
    SelectedBacktest.value = Folders.value[0].backtests[0]
  })


</script>

<template>
    <div class="overflow-hidden bg-gray-800 rounded-md ring-1 ring-inset ring-white/10 fixed top-16 left-4 right-4 bottom-4">
        <div class="w-full h-full overflow-y-auto p-4 no-scrollbar">
            {{ SelectedFolder }}
        </div>

    </div>
    <div class="bg-gradient-to-t from-gray-900 to-transparent absolute bottom-4 left-4 right-4 h-16"></div>
</template>
