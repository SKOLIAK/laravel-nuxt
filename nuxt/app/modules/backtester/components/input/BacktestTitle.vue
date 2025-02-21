<script lang="ts" setup>
const { SelectedBacktest, SelectedBacktestComputed } = useBacktester()
</script>
<template>
    <div class="flex items-center gap-x-2" v-if="!isObjectEmpty(SelectedBacktest)">
        <span class="select-none ring-1 ring-inset ring-white/10 bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
            <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
            </svg>
            {{ useTwoDecPercentFormat(SelectedBacktestComputed.percentage) }}
        </span>
        <input v-model="SelectedBacktest.name" class="bg-transparent outline-none focus:outline-none"/>

    </div>
</template>
