<script lang="ts" setup>
const { SelectedFolder, SelectedBacktest } = useBacktester()
</script>
<template>
    <!-- Backtest Select Dropdown-->
    <USelectMenu class="w-full" :options="SelectedFolder.backtests" v-model="SelectedBacktest" searchable option-attribute="name" :search-attributes="['name']">
        <template #option="{ option: backtest }">
            <UBadge color="green" size="xs">
                    <template v-if="backtest.trades.length">
                        {{ useTwoDecPercentFormat(
                            backtest.trades.filter(x => x.outcome.toLowerCase() == 'win').length /
                            (backtest.trades.filter(x => x.outcome.toLowerCase() == 'win').length +
                            backtest.trades.filter(x => x.outcome.toLowerCase() == 'loss').length)
                        ) }}
                    </template>
                    <template v-else>0%</template>
            </UBadge>
            <!-- <UIcon name="solar:document-text-line-duotone" class="w-4 h-4 shrink-0" /> -->
            <span class="truncate text-ellipsis" :title="backtest.name">
                {{ backtest.name }}
            </span>
        </template>
        <template #leading>
            <UIcon name="solar:document-text-line-duotone" class="w-5 h-5 shrink-0" v-if="!isObjectEmpty(SelectedBacktest)" />
            <template v-else>
                <span class="opacity-50">Select Backtest</span>
            </template>

        </template>
    </USelectMenu>
</template>
