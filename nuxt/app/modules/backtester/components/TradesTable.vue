<script lang="ts" setup>
const { SelectedBacktest, SelectedBacktestComputed, selectedTrades } = useBacktester()
const checked = ref(true)

function selectTrade(trade) {
    if(selectedTrades.value.includes(trade)) {
        selectedTrades.value = selectedTrades.value.filter((x) => x != trade)
    } else {
        selectedTrades.value.push(trade)
    }
}

function selectAllTrades() {
    selectedTrades.value.splice(0)
    SelectedBacktest.value.trades.forEach(trade => {
        selectedTrades.value.push(trade)
    });
}

</script>
<template>

<div class="relative">

        <UBasePanel class="flex flex-col items-start justify-start absolute right-2 bottom-24 z-20 drop-shadow-lg" v-if="selectedTrades.length">
            
            <div class="p-2 border-b border-white/10 w-full text-xs flex items-center justify-between gap-x-20">
                <span class="opacity-70 drop-shadow-sm">
                    Selected {{ selectedTrades.length }} {{ selectedTrades.length == 1 ? 'trade' : 'trades' }}
                </span>
                
                <div class="flex items-center justify-start gap-2 ms-auto">
                    <UButton color="white" variant="ghost" size="2xs" @click="selectAllTrades()" v-if="SelectedBacktest.trades.length != selectedTrades.length">
                        Select All
                    </UButton>
                    <UButton color="white" variant="ghost" size="2xs" @click="selectedTrades.splice(0)">Deselect All</UButton>
                </div>
            </div>
            <div class="flex items-center justify-start p-3 gap-2 font-medium text-xs">
                ...
            </div>
        </UBasePanel>



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
                    <th scope="col" class="px-3 py-2"></th>
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
                        <UHelpTitle text="Total number of Break-Even trades">
                            BE: {{ SelectedBacktest.trades.filter(x => x.outcome == 'BE').length }}
                        </UHelpTitle>
                    </td>

                    <td class="px-3 py-2">-</td>

                    <td class="px-3 py-2">
                        <UHelpTitle text="Total sum of R multiple gained">
                            Tot. R: {{ useTwoDecFormat(SelectedBacktestComputed.totalR) }}
                        </UHelpTitle>
                    </td>

                    <td class="px-3 py-2">
                        Balance: {{ useTwoDecCurrencyFormat(SelectedBacktestComputed.ending_balance) }}
                    </td>

                    <td class="px-3 py-2">
                        <UHelpTitle text="Total Gain Percentage">
                            Tot. Gain: {{ useTwoDecPercentFormat(SelectedBacktestComputed.gain) }}
                        </UHelpTitle>
                    </td>
                    <td class="px-3 py-2">
                        Actions
                    </td>
                </tr>
                </thead>

            <!-- Table body -->
            <tbody class="">
                <tr 
                    class="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200" 
                    v-for="(trade, n) in SelectedBacktest.trades" v-if="SelectedBacktest.trades.length > 0"
                    :class="{'bg-gray-700/25 hover:!bg-gray-700/70': selectedTrades.includes(trade)}"
                >
                <th scope="row" class="px-3 py-2"
                @click="selectTrade(trade)">
                    <UCheckbox v-model="checked" v-if="selectedTrades.includes(trade)"/>
                    <template v-else>
                        {{ n + 1 }}
                    </template>
                </th>
                <td class="px-3 py-2" @click="selectTrade(trade)">{{ trade.symbolOriginal }}</td>
                <td class="px-3 py-2" @click="selectTrade(trade)">{{ trade.session }}</td>
                <td class="px-3 py-2 capitalize" @click="selectTrade(trade)">
                    {{ trade.direction }}
                    <UIcon v-if="trade.direction == 'long'" name="akar-icons:arrow-up-right" class="green-trade"/>
                    <UIcon v-else name="akar-icons:arrow-down-right" class="red-trade"/>
                </td>
                <td class="px-3 py-2" @click="selectTrade(trade)">
                    {{ trade.outcome }}
                </td>
                <td class="px-3 py-2" @click="selectTrade(trade)">
                    {{ trade.rrr }}
                </td>
                <td class="px-3 py-2" @click="selectTrade(trade)">
                    {{ useTwoDecCurrencyFormat(trade.netProceeds) }}
                </td>
                <td class="px-3 py-2" @click="selectTrade(trade)">
                    {{ useTwoDecPercentFormat(trade.gain) }}
                </td>
                <td class="px-3 py-2">
                    <UPopover>
                        <UButton color="white" size="2xs" variant="ghost" icon="mdi:dots-vertical"/>
                        <template #panel>
                            <UBasePanel class="flex items-center  gap-2 p-2 w-full">
                                <UButton color="white" variant="ghost" size="xs" class="w-full">Edit</UButton>
                                <UDivider />
                                <UButton color="rose" variant="ghost" size="xs" class="w-full">Delete</UButton>
                            </UBasePanel>
                        </template>
                    </UPopover>
                </td>
                </tr>
            </tbody>

            </table>

            <div class="tracking-wider sticky top-0 bg-gray-900 !z-10 text-2xs font-medium p-1.5 text-center text-gray-400" v-else>
                <span class="animate-pulse">No data</span>
            </div>

        </div>
        
    </div>
</template>
