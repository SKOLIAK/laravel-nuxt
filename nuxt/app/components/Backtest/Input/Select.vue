<script lang="ts" setup>
    const backtester = useBacktester()
</script>

<template>
    <!-- Backtest Select Dropdown-->
    <USelectMenu class="min-w-44 max-w-80" v-if="!isObjectEmpty(backtester.SelectedFolder.value)" :options="backtester.SelectedFolder.value.backtests" v-model="backtester._SelectedBacktest.value" searchable option-attribute="name" :search-attributes="['name']">
        <template #option="{ option: backtest }">
            <div class="bg-gray-700 ring-1 ring-inset ring-white/10 rounded text-xs py-0.5 px-1 font-medium">
                <span class="drop-shadow">
                    <template v-if="backtest.trades.length">
                        {{ useTwoDecPercentFormat(
                            backtest.trades.filter(x => x.outcome.toLowerCase() == 'win').length /
                            (backtest.trades.filter(x => x.outcome.toLowerCase() == 'win').length +
                            backtest.trades.filter(x => x.outcome.toLowerCase() == 'loss').length)
                        ) }}
                    </template>
                    <template v-else>0%</template>
                </span>
            </div>
            <!-- <UIcon name="solar:document-text-line-duotone" class="w-4 h-4 shrink-0" /> -->
            <span class="truncate text-ellipsis" :title="backtest.name">
                {{ backtest.name }}
            </span>
        </template>
        <template #leading>
            <UIcon name="solar:document-text-line-duotone" class="w-5 h-5 shrink-0" v-if="!isObjectEmpty(backtester._SelectedBacktest.value)" />
            <template v-else>
                <span class="opacity-50">Select Backtest</span>
            </template>

        </template>
    </USelectMenu>
</template>
