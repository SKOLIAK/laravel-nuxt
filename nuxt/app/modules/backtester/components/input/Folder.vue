<script lang="ts" setup>
const { Folders, SelectedFolder, fetchFolders } = useBacktester()

onBeforeMount(async () => {
    await fetchFolders()
})
</script>

<template>
    <!-- Folder Select Dropdown-->
    <USelectMenu class="min-w-44 max-w-80" v-if="Folders.length != 0" :options="Folders" v-model="SelectedFolder" searchable option-attribute="name" :search-attributes="['name']">
        <template #option="{ option: folder }">
            <UIcon name="solar:folder-2-bold-duotone" :style="{'color': folder.color}" class="w-4 h-4"/>
            <span class="truncate text-ellipsis">{{ folder.name }}</span>
        </template>
        <template #leading>
            <UIcon name="solar:folder-2-bold-duotone" class="w-5 h-5" :style="{'color': SelectedFolder.color}" />
        </template>
    </USelectMenu>
</template>
