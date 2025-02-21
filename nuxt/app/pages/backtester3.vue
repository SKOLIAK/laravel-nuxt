
<script lang="ts" setup>
import { VisAxis, VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from "@unovis/vue"
import { GroupedBar } from '@unovis/ts'
import { brokers, selectedBroker, selectedTradovateTier, tradovateTiers } from "@/utils/brokers"
import twConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { pluck } from '@/utils/misc'
import { getMean, getMode } from '@/utils/math'


const { theme } = resolveConfig(twConfig)
const appConfig = useAppConfig();

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



const rrTickFormat = (_tick: number) => backtester.ChartData.value.riskToReward[_tick] != undefined ? backtester.ChartData.value.riskToReward[_tick].tick : _tick
const sessionTickFormat = (_tick: number) => backtester.ChartData.value.sessionGain[_tick] != undefined ? backtester.ChartData.value.sessionGain[_tick].tick : ''
const y = [
    (d) =>  d.y,
    (d) =>  d.y2,
    (d) =>  d.y3,
    (d) =>  d.y4,
  ]
  const color = (d, i: number) =>  [theme.colors['green'][500], theme.colors['yellow'][500], theme.colors['rose'][500], theme.colors['blue'][700]][i]

const RRData = computed(() => {
    let temp = {
        mean: 0,
        mode: 0
    }

    if(!isObjectEmpty(backtester.SelectedBacktest.value) && backtester.SelectedBacktest.value.trades != undefined) {
        let arr  = pluck(backtester.SelectedBacktest.value.trades, ['rrr']).filter(x => x > 0)
        temp.mean = getMean(arr)
        temp.mode = getMode(arr)
    }

    return temp
})



const tooltipTriggerRRS = {
    [GroupedBar.selectors.bar]: (d) =>  `<div class="flex flex-col text-xs font-medium">
    <h3 class="text-sm">` + d.y + ` Trades</h3>
    <span>Between ` + d.tick.split('-').join(' & ') + `RR</span>
    </div>`
}


const tooltipTriggerSessions = {
    [GroupedBar.selectors.bar]: (d) =>  `
    <div class="flex flex-col text-xs font-medium">
        <h3 class="mb-2 text-sm">` + d.tick + ` Session</h3>
        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` +theme.colors['green'][500] +`"></span>
            Total Trades
            <b>` + d.y + `</b>
        </div>

        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` +theme.colors['yellow'][500] +`"></span>
            Total Gain (%)
            <b>` + useTwoDecFormat(d.y2) + `</b>
        </div>

        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` +theme.colors['rose'][500] +`"></span>
            Total R Multiple
            <b>` + useTwoDecFormat(d.y3) + `</b>
        </div>


        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` +theme.colors['blue'][500] +`"></span>
            Win Rate (%)
            <b>` + useTwoDecFormat(d.y4) + `</b>
        </div>


    </div>`
}
</script>

<template>
    {{ backtester.ChartData.value.riskToReward }}
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


            <div>
                <UCard>
                    <div class="text-sm font-medium mb-4">
                        <div class="flex flex-col">
                            <span>RR Mean: {{ useTwoDecFormat(RRData.mean) }} | RR Mode: {{ useTwoDecFormat(RRData.mode) }}</span>
                        </div>
                    </div>
                    <VisXYContainer :data="backtester.ChartData.value.riskToReward">
                        <VisGroupedBar :x="d => d.x" :y="d => d.y" :color="theme.colors[appConfig.ui.primary][500]"/>
                        <VisAxis type="x" :tickFormat="rrTickFormat"/>
                        <VisAxis type="y" />
                        <VisTooltip :triggers="tooltipTriggerRRS" />
                    </VisXYContainer>
                </UCard>

                <UCard>
                    <div class="text-sm font-medium mb-4">
                        Gain per session
                    </div>
                    <VisXYContainer :data="backtester.ChartData.value.sessionGain">
                        <VisGroupedBar :x="d => d.x" :y="y" :color="color" />
                        <VisAxis type="x"/>
                        <VisAxis type="y" :tickFormat="sessionTickFormat" />
                        <VisTooltip :triggers="tooltipTriggerSessions" />
                    </VisXYContainer>
                </UCard>
            </div>




            <div class="p-5 bg-green-500/10">
                <h3 class="mb-5 text-green-500">Testing Dynamic Calculations [Backtester V2]</h3>


                <div class="flex my-4">


                    <UFormGroup label="Select Folder">
                        <BacktestInputSelectFolder />
                    </UFormGroup>

                    <UFormGroup label="Select Backtest">
                        <BacktestInputSelect/>
                    </UFormGroup>
                </div>


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
                        Trade <b>{{ x + 1 }}</b> |  <b>Gain:</b> <div class="inline-block rounded px-1.5 py-0.5" :class="{'green-trade bg-green-trade': trade.gain > 0, 'red-trade bg-red-trade': trade.gain < 0}">{{ useTwoDecPercentFormat(trade.gain) }}</div> | Session: {{ trade.session ?? 'N/A' }}
                    </div>
                </div>


            </div>










        </UDashboardPanelContent>

    </UDashboardPanel>



</UDashboardPage>
</template>
