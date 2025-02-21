<script lang="ts" setup>
const backtester = useBacktester()

/** Reset backtest selection */
watch(backtester.SelectedFolder, () => {
    backtester._SelectedBacktest.value = {}
})
</script>

<template>
    <!-- Folder Select Dropdown-->
    <USelectMenu class="min-w-44 max-w-80" v-if="backtester.Folders.value.length != 0" :options="backtester.Folders.value" v-model="backtester.SelectedFolder.value" searchable option-attribute="name" :search-attributes="['name']">
        <template #option="{ option: folder }">
            <UIcon name="solar:folder-2-bold-duotone" :style="{'color': folder.color}" class="w-4 h-4"/>
            <span class="truncate text-ellipsis">{{ folder.name }}</span>
        </template>
        <template #leading>
            <UIcon name="solar:folder-2-bold-duotone" class="w-5 h-5" :style="{'color': backtester.SelectedFolder.value.color}" />
        </template>
    </USelectMenu>
</template>
