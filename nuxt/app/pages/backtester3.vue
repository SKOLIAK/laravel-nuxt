
<script lang="js" setup>
import { brokers, selectedBroker, selectedTradovateTier, tradovateTiers } from "@/utils/brokers";
const tw_paste = useTWPaste()
const backtester = useBacktester()
const auth = useAuthStore()

onBeforeMount(async () => {
    await backtester.fetchFolders()
    await backtester.recalculate()
})

onMounted(() => {
    // ...
})

// Don't forget the destroy event. Avoid memory leaks
onUnmounted(() => {
    // ...
})
</script>

<template>
<UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar class="bg-gray-800 border-b border-gray-900">
            <template #left>
                <div class="flex items-center justify-start">
                    <!-- ~/components/PercentGauge.vue -->
                    <PercentageGauge
                        :percent="backtester.SelectedBacktest.value.percentage"
                        class="h-full"
                        v-if="!isObjectEmpty(backtester.SelectedBacktest.value)"
                    />

                    <!-- Title -->
                    <div>
                        <div class="text-lg font-medium text-white">
                            <div v-if="!isObjectEmpty(backtester.SelectedBacktest.value)" class="flex items-center gap-x-2">
                                <UIcon name="solar:pen-2-outline" />
                                <BacktestInputName :name="backtester.SelectedBacktest.value.name" />
                            </div>
                            <h3 v-else>
                                Backtesting
                            </h3>
                        </div>

                        <!-- If unsaved changes made -->
                        <div class="text-2xs flex items-center gap-x-1 text-gray-400" v-if="!IsDirty && !isObjectEmpty(backtester.SelectedBacktest.value)">
                            in: {{ backtester.SelectedBacktest.value.group.name }}
                        </div>
                        <div class="text-2xs font-medium flex items-center justify-start gap-x-1 animate-pulse" v-if="backtester.IsDirty.value">
                            <template v-if="!IsSaving">
                                <UIcon name="akar-icons:triangle-alert" class="text-yellow-300"/>
                                <span class="opacity-80">Unsaved changes.</span>
                                <button class="text-blue-300 opacity-100 underline" @click.prevent="backtester.IsSaving.value = true">Save</button>
                            </template>
                            <template v-else>
                                <Spinner /> Saving...
                            </template>
                        </div>
                    </div>

                </div>
            </template>
        </UDashboardNavbar>


        <UDashboardPanelContent class="!p-0 !overflow-x-hidden">
            <!-- ~/components/Backtest/TradesTable.vue -->
            <!-- <BacktestTradesTable /> -->
             <DEVBlock class="hidden">
                <template #code>{{ backtester.SelectedBacktest }}</template>
            </DEVBlock>



            <div class="p-5 bg-green-500/10">
                <h3 class="mb-5 text-green-500">Testing Dynamic Calculations [Backtester V2]</h3>



                <div class="flex items-center justify-start gap-4 mb-4">

                    <UFormGroup label="Starting Balance">
                        <UInput v-model="backtester._SelectedBacktest.value.starting_balance" type="number" min="0" @input="backtester.recalculate()"/>
                    </UFormGroup>

                    <UFormGroup label="Ending Balance">
                        <div class="font-medium">{{ backtester.SelectedBacktest.value.ending_balance }}</div>
                    </UFormGroup>

                    <UFormGroup label="Total Gain">
                        <div class="font-medium rounded px-1.5 py-0.5" :class="{'green-trade bg-green-trade': backtester.SelectedBacktest.value.gain > 0, 'red-trade bg-red-trade': backtester.SelectedBacktest.value.gain < 0}">{{ useTwoDecPercentFormat(backtester.SelectedBacktest.value.gain) }}</div>
                    </UFormGroup>

                    <UFormGroup label="Total R Multiple">
                        <div class="font-medium">{{ backtester.SelectedBacktest.value.totalR }}</div>
                    </UFormGroup>
                </div>


                <h3>Trades: <small class="bg-gray-900 rounded p-0.5">(Total Gain calculated from trades: {{ useTwoDecPercentFormat(backtester.SelectedBacktest.value.test) }})</small></h3>
                <div class="flex flex-col text-sm gap-2">
                    <div v-for="(trade, x) in backtester.SelectedBacktest.value.trades">
                        Trade <b>{{ x + 1 }}</b> |  <b>Gain:</b> <div class="inline-block rounded px-1.5 py-0.5" :class="{'green-trade bg-green-trade': trade.gain > 0, 'red-trade bg-red-trade': trade.gain < 0}">{{ useTwoDecPercentFormat(trade.gain) }}</div>
                    </div>
                </div>


            </div>










        </UDashboardPanelContent>

    </UDashboardPanel>



</UDashboardPage>
</template>
