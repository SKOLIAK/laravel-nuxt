<script lang="ts" setup>

import { SelectedBacktest, SelectedBacktestEndingBalance } from '@/utils/backtester'
import { isEmptyObject } from 'tailwind-variants/dist/utils.js';


const Comp = computed(() => {
    if(isEmptyObject(SelectedBacktest)) return 'Fuck off'
    let a = useGetLargestLossTrade()
    console.warn(a)

    return a
})


</script>
<template>
    <!-- Table responsive wrapper -->
    <div class="overflow-x-auto bg-white dark:bg-gray-800 h-[calc(100vh-4em)] overflow-y-scroll -mr-2 select-none">

        <!-- Table -->
        <table class="min-w-full text-left text-xs whitespace-nowrap" v-if="!isObjectEmpty(SelectedBacktest) && SelectedBacktest.trades.length != 0">


        <!-- Table head -->
        <thead class="tracking-wider sticky top-0 bg-gray-800 select-none">
            <tr>
                <th scope="col" class="px-3 py-2">
                    #
                </th>
                <th scope="col" class="px-3 py-2">
                    Symbol
                </th>
                <th scope="col" class="px-3 py-2">
                    Session
                </th>
                <th scope="col" class="px-3 py-2 flex items-center justify-normal gap-x-1">
                    L/S
                    <UIcon name="akar-icons:info" title="Long or Short" />
                </th>
                <th scope="col" class="px-3 py-2">
                    Outcome
                </th>

                <th scope="col" class="px-3 py-2">
                    Realised RR
                </th>
                <th scope="col" class="px-3 py-2">
                    Pnl
                </th>
                <th scope="col" class="px-3 py-2">
                    Gain (%)
                </th>
            </tr>
        </thead>
            <!-- Table footer -->
            <thead class="tracking-wider sticky top-0 bg-gray-900 !z-10">
            <tr class="text-xs">
                <th class="px-3 py-2">
                    Trades: {{ SelectedBacktest.trades.length }}
                </th>

                <td class="px-3 py-2">
                    Wins: {{ SelectedBacktest.trades.filter(x => x.outcome == 'Win').length }}
                </td>

                <td class="px-3 py-2">
                    Losses: {{ SelectedBacktest.trades.filter(x => x.outcome == 'Loss').length }}
                </td>

                <td class="px-3 py-2">
                    BE: {{ SelectedBacktest.trades.filter(x => x.outcome == 'BE').length }}
                    <UIcon name="akar-icons:info" title="Total number of Break-Even trades" />
                </td>

                <td class="px-3 py-2">-</td>

                <td class="px-3 py-2">
                    Tot. R: {{ useTwoDecFormat(SelectedBacktest.totalR) }}
                    <UIcon name="akar-icons:info" title="Total sum of R multiple gained" />
                </td>

                <td class="px-3 py-2">
                    Balance: {{ useTwoDecCurrencyFormat(SelectedBacktestEndingBalance) }}
                </td>

                <td class="px-3 py-2">
                    Tot. Gain: {{ useTwoDecPercentFormat(SelectedBacktest.gain) }}
                    <UIcon name="akar-icons:info" title="Total Gain percentage" />
                </td>
            </tr>
            </thead>

        <!-- Table body -->
        <tbody>
            <tr class="border-b border-gray-700" v-for="(trade, n) in SelectedBacktest.trades" v-if="SelectedBacktest.trades.length > 0">
            <th scope="row" class="px-3 py-2">{{ n + 1 }}</th>
            <td class="px-3 py-2">{{ trade.symbol }}</td>
            <td class="px-3 py-2">{{ trade.session }}</td>
            <td class="px-3 py-2 capitalize">
                {{ trade.strategy }}
                <UIcon v-if="trade.strategy == 'long'" name="akar-icons:arrow-up-right" class="green-trade"/>
                <UIcon v-else name="akar-icons:arrow-down-right" class="red-trade"/>
            </td>
            <td class="px-3 py-2">
                {{ trade.outcome }}
            </td>
            <td class="px-3 py-2">
                {{ trade.rrr }}
            </td>
            <td class="px-3 py-2">
                {{ useTwoDecCurrencyFormat(trade.netProceeds) }}
            </td>
            <td class="px-3 py-2">
                {{ useTwoDecPercentFormat(trade.gain) }}
            </td>
            </tr>
        </tbody>

        </table>

        <div class="tracking-wider sticky top-0 bg-gray-900 !z-10 text-2xs font-medium p-1.5 text-center text-gray-400" v-else>
            <span class="animate-pulse">No data</span>
        </div>

    </div>
</template>
