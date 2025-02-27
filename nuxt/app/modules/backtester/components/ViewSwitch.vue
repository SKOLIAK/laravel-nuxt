<script lang="ts" setup>
const { viewTypes, selectedView } = useBacktester()
</script>

<template>
  <UTabs
    v-model="selectedView"
    :items="viewTypes"
    :ui="{
        wrapper: '',
        list: {
        background: 'dark:bg-gray-900',
        height: 'h-9',
        tab: {
            height: 'h-7', size: 'text-[13px]'
        },

        marker: {
            background: 'dark:bg-gray-800 ring-1 ring-inset ring-gray-700/15 dark:ring-gray-700/25'
        }
        },
    }"
  />
</template>