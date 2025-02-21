<script lang="ts" setup>

const { SelectedBacktestComputed, SelectedBacktest } = useBacktester()
const { useSessionColors } = useBacktesterSettings()
const { useGetProceedsFromTrade } = useTrade()

const auth = useAuthStore()
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
                    Quantity
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
                    Trades: {{ SelectedBacktestComputed.trades.length }}
                </th>

                <td class="px-3 py-2">
                    Wins: {{ SelectedBacktestComputed.trades.filter(x => x.outcome == 'Win').length }}
                </td>

                <td class="px-3 py-2">
                    Losses: {{ SelectedBacktestComputed.trades.filter(x => x.outcome == 'Loss').length }}
                </td>

                <td class="px-3 py-2">
                    BE: {{ SelectedBacktestComputed.trades.filter(x => x.outcome == 'BE').length }}
                    <UIcon name="akar-icons:info" title="Total number of Break-Even trades" />
                </td>

                <td class="px-3 py-2">-</td>

                <td class="px-3 py-2">-</td>

                <td class="px-3 py-2">
                    Tot. R: {{ useTwoDecFormat(SelectedBacktestComputed.totalR) }}
                    <UIcon name="akar-icons:info" title="Total sum of R multiple gained" />
                </td>

                <td class="px-3 py-2">
                    Balance: {{ useTwoDecCurrencyFormat(SelectedBacktestComputed.ending_balance) }}
                </td>

                <td class="px-3 py-2">
                    Tot. Gain: {{ useTwoDecPercentFormat(SelectedBacktestComputed.gain) }}
                    <UIcon name="akar-icons:info" title="Total Gain percentage" />
                </td>
            </tr>
            </thead>

        <!-- Table body -->
        <tbody>
            <tr
                class="border-b group border-gray-700 h-10"
                v-for="(trade, n) in SelectedBacktestComputed.trades" v-if="SelectedBacktestComputed.trades.length > 0"
            >
                <th scope="row" class="px-3 py-2 group-hover:bg-gradient-to-r from-gray-900 to-gray-800">
                    <span class="group-hover:hidden" v-if="!trade.selected">{{ n + 1 }}</span>
                    <div class="hidden group-hover:flex items-center justify-start gap-x-1 transition-all duration-200" >
                        <UTooltip :text="!trade.selected ? 'Enable editing' : 'Disable editing'">
                            <UCheckbox v-model="trade.selected" />
                        </UTooltip>

                    </div>
                    <UCheckbox class="group-hover:hidden" v-model="trade.selected" v-if="trade.selected"/>

                </th>
                <td class="px-3 py-2">{{ trade.symbol }}</td>
                <td class="px-3 py-2">

                    <USelectMenu v-model="trade.session" :options="auth.user.sessions.map(x => x.name)" size="2xs" v-if="trade.selected">
                        <template #option="{ option: session }">
                            <span class="truncate text-ellipsis text-xs" :title="session">{{ session }}</span>
                        </template>
                    </USelectMenu>
                    <template v-else>
                        <UTooltip text="Click to edit">
                            <button @click="trade.selected = true" class="flex items-center gap-x-1">
                                <span
                                    v-if="useSessionColors"
                                    class="w-1.5 h-1.5 inline-block rounded-full bg-gray-800"
                                    :style="{'background-color': auth.user.sessions.filter(x => x.name == trade.session).length ? auth.user.sessions.filter(x => x.name == trade.session)[0].color : 'rgba(0,0,0,0)'}"
                                ></span>

                                {{ trade.session }}
                            </button>
                        </UTooltip>
                    </template>
                </td>
                <td class="px-3 py-2 capitalize">
                    {{ trade.direction }}
                    <UIcon v-if="trade.direction == 'long'" name="akar-icons:arrow-up-right" class="green-trade"/>
                    <UIcon v-else name="akar-icons:arrow-down-right" class="red-trade"/>
                </td>
                <td class="px-3 py-2">
                    <UInput size="2xs" v-model="trade.quantity" class="inline-block bg-transparent outline-none focus:outline-none" type="number" @input="trade.netProceeds = useGetProceedsFromTrade(trade)" v-if="trade.selected"/>
                    <template v-else>
                        <UTooltip text="Click to edit">
                            <button @click="trade.selected = true">{{ trade.quantity }}</button>
                        </UTooltip>

                    </template>
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
            <span class="animate-pulse">No Data to Display</span>
        </div>

    </div>
</template>

