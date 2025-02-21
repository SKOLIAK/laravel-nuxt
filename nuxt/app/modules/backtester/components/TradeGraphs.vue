<script lang="ts" setup>
const { useSessionsChart } = useBacktesterSettings()
</script>
<template>
    <div class="m-4 flex flex-col gap-y-4">
        <div class="flex items-start justify-between gap-x-4">
            <ChartsRMultiple />
            <div class="bg-gray-900 rounded p-4 min-w-96 h-full"></div>
        </div>

        <ChartsSessionDistribution v-if="useSessionsChart" />
    </div>
</template>
