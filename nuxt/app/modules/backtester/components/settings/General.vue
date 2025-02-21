<script lang="ts" setup>
const { autosaveDuration, autosaveEnabled } = useBacktester()
const { useSessionColors, backtesterTypes, backtesterType, useSessionsChart } = useBacktesterSettings()
</script>

<template>
    <div class="min-w-64 bg-gray-800 select-none cursor-default">
        <div class="p-3 border-b border-white/5">
            <h3 class="font-medium text-sm tracking-wide drop-shadow">Settings</h3>
        </div>
        <div class="flex flex-col p-4 gap-y-3">

            <span class="text-sm font-medium opacity-50 mt-2">General</span>

            <div class="font-medium text-xs flex items-center justify-between gap-x-4">
                <UTooltip :text="'Automatically saves any changes made after ' + autosaveDuration / 1000 + ' seconds'">
                    <span class="drop-shadow">Auto Save</span>
                </UTooltip>
                <UToggle v-model="autosaveEnabled" size="sm" />
            </div>



            <span class="text-sm font-medium opacity-50 mt-2">Charts</span>

            <div class="font-medium text-xs flex items-center justify-between gap-x-4">
                <span class="drop-shadow">Session Distribution Chart</span>
                <UToggle v-model="useSessionsChart" size="sm"/>
            </div>

            <div class="font-medium text-xs flex items-center justify-between gap-x-4">
                <span class="drop-shadow">Session Colors</span>
                <UToggle v-model="useSessionColors" size="sm"/>
            </div>


            <span class="text-sm font-medium opacity-50 mt-2">Backtesting</span>

            <div class="font-medium text-xs flex items-center justify-between gap-x-4">
                <span class="drop-shadow">Market Type</span>
                <USelectMenu v-model="backtesterType" :options="backtesterTypes" size="xs" />
            </div>

        </div>
    </div>
</template>
