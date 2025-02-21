<script lang="ts" setup>
const { SelectedBacktest, SelectedBacktestComputed } = useBacktester()

useHead({
  title: SelectedBacktestComputed.name ?? 'Backtester'
})

</script>
<template>
    <div class="text-lg font-medium text-white">
        <template v-if="isObjectEmpty(SelectedBacktest)">
            Backtester
        </template>

        <!-- ~/components/input/BacktestTitle.vue -->
        <InputBacktestTitle v-else/>
    </div>

</template>
