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
        background: 'dark:bg-gray-900 ring-1 ring-inset ring-black/5 dark:ring-white/5',
        height: 'h-9',
        tab: {
            height: 'h-7'
        },

        marker: {
            background: 'dark:bg-gray-800 ring-1 ring-inset ring-black/10 dark:ring-white/5'
        }
        },
    }"
  />
</template>