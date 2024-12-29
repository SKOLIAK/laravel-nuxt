<script setup lang="ts">
import VChart from 'vue-echarts';

import { totals, dashboardIdMounted, profitAnalysis, selectedRatio, totalsByDate } from '@/utils/global'

//
const items = [[{
  label: 'New mail',
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox'
}, {
  label: 'New user',
  icon: 'i-heroicons-user-plus',
  to: '/users'
}]]



onBeforeMount(async () => {
    await useMountDashboard()
})

const ratioCompute = computed(() => {
    let ratio = {
      shortName: '',
      name: '',
      value: '',
      tooltipTitle: ''
    }

    if (selectedRatio.value == 'appt') {
        ratio.shortName = "APPT"
        ratio.name = "Average Profit Factor per Trade"
        let val = totals[amountCase.value + 'Proceeds'] / totals.trades
        ratio.value = val ? useTwoDecCurrencyFormat(val) : '-'
        ratio.tooltipTitle = '<h2>Average Profit Per Trade</h2><div class="text-xs"> <code>APPT = Proceeds &divide; Number of Trades</code></div><div class="mt-2">Proceeds: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Proceeds']) + '</div><div>Trades: ' + useThousandFormat(totals.trades) + '</div>'
    }
    if (selectedRatio.value == 'apps') {
        ratio.name = "Average Profit Factor per Security"
        ratio.shortName = "APPS"
        let val = totals[amountCase.value + 'Proceeds'] / (totals.quantity / 2)
        ratio.value = val ? useXDecCurrencyFormat(val, 4) : '-'
        ratio.tooltipTitle = '<h2>Average Profit Per Security</h2><div class="mb-2"><code>APPS = Proceeds &divide; Number of Securities Traded</code></div><div class="text-xs">Proceeds: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Proceeds']) + '</div><div>Securities Traded: ' + useThousandFormat(totals.quantity / 2) + '</div>'
    }
    if (selectedRatio.value == 'profitFactor') {
        ratio.shortName = "Profit Factor"
        ratio.name = "Profit Factor"
        let wins = parseFloat(totals[amountCase.value + 'Wins']).toFixed(2)
        let loss = parseFloat(-totals[amountCase.value + 'Loss']).toFixed(2)
        let profitFactor = 0
        //console.log("wins " + wins + " and loss " + loss)
        if (loss != 0) {
            profitFactor = wins / loss
            //console.log(" -> profitFactor "+profitFactor)
        }
        ratio.value = profitFactor ? useXDecFormat(profitFactor, 2) : '-'
        ratio.tooltipTitle = '<h2>Profit Factor</h2><div class="mb-2"><code>Profit Factor = Wins &divide; Expenses</code></div><div>Wins: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Wins']) + '</div><div>Expenses: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Loss']) + '</div>'
    }
    return ratio
})

var debug = false
</script>

<template>
  <UDashboardPage class="relative">
    <UDashboardPanel grow>
      <UDashboardNavbar title="Dashboard" class="bg-white">
        <template #right>

          <UDropdown :items="items">
            <UButton
              icon="i-heroicons-plus"
              label="Add"
              size="sm"
              class="ml-1.5 btn"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white">
        <template #left>
          <Filters />
        </template>


      </UDashboardToolbar>

      <UDashboardPanelContent class="relative">




        <DEVBlock v-if="debug">
          <template #title>Totals / Mounted: {{ dashboardIdMounted }}</template>
          <template #code>
            {{ totals }}
          </template>
        </DEVBlock>
        <DEVBlock v-if="debug">
          <template #title>Totals By Date</template>
          <template #code>
            {{ totalsByDate }}
          </template>
        </DEVBlock>


        <div class="grid grid-cols-4 grid-rows-3 gap-4 mb-4">
            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium">Cumulated PnL</span>
              <USkeleton class="h-8 mt-1 w-full" v-if="!dashboardIdMounted"/>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>
                  {{ useThousandCurrencyFormat(totals[amountCase+'Proceeds']) }}
              </h4>
            </div>

            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium flex items-center justify-left gap-x-1">
                {{ ratioCompute.shortName }}
                <UPopover mode="hover">
                  <UIcon name="tabler:info-square-rounded" size="1em" class="text-primary" />
                  <template #panel>
                    <div class="py-2 px-3.5 text-xs text-gray-900 selected-ratio-tooltip" v-html="ratioCompute.tooltipTitle"></div>
                  </template>
                </UPopover>
              </span>
              <USkeleton class="h-8 mt-1 w-full" v-if="!dashboardIdMounted"/>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>
                {{ ratioCompute.value }}
              </h4>
            </div>

            <div class="row-span-2 col-start-1 row-start-2">
              <div class="base-card h-full p-8 flex items-center justify-center relative">
                <UIcon name="svg-spinners:eclipse" class="absolute animate-pulse" size="2em" v-if="!dashboardIdMounted"/>
                <div class="w-40 h-40">
                  <div id="pieChart1" class="w-full h-full" />
                </div>
              </div>
            </div>
            <div class="row-span-2 col-start-2 row-start-2">
              <div class="base-card h-full p-8 flex items-center justify-center">
                <div class="flex items-center justify-normal">
                  <div>
                    <USkeleton class="h-24 w-24 mr-4"/>
                  </div>
                  <div>
                    <USkeleton class="h-6 w-40"/>
                    <USkeleton class="h-4 mt-2 w-32"/>
                    <USkeleton class="h-4 mt-1 w-16"/>
                    <USkeleton class="h-4 mt-1 w-24"/>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-start-3 row-start-1  col-span-2"> <!-- remove col-span-2 if adding another card -->
              <div class="col-span-2 col-start-3 row-start-1">
                <div class="base-card overflow-hidden">
                  <span class="text-gray-500 text-xs font-medium">P/L Ratio</span>
                  <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                    <div v-else>
                      <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-if="!isNaN(profitAnalysis[amountCase + 'R'])">
                        {{ (profitAnalysis[amountCase +'R']).toFixed(2) }}
                      </h4>
                      <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                    </div>
                  </div>
              </div>
            </div>

            <div class="col-start-4 row-start-1" v-if="false">
              <div class="col-span-2 col-start-3 row-start-1">
                <div class="base-card overflow-hidden">
                  <span class="text-gray-500 text-xs font-medium">Expected Return</span>
                  <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                    <div v-else>
                      <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-if="!isNaN(profitAnalysis[amountCase + 'CurrExpectReturn'])">
                        {{ (profitAnalysis[amountCase +'CurrExpectReturn']).toFixed(2) }}
                      </h4>
                      <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                    </div>
                </div>
              </div>
            </div>

            <div class="row-start-2">
              <div class="base-card overflow-hidden">
                <span class="text-gray-500 text-xs font-medium">Largest Win</span>
                <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                  <div v-else>
                    <h4
                      class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                      v-if="profitAnalysis[amountCase + 'HighWinPerShare'] > 0"
                    >
                        {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'HighWinPerShare']) }}
                    </h4>
                    <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                  </div>
              </div>
            </div>
            <div class="row-start-2">
              <div class="base-card overflow-hidden">
                <span class="text-gray-500 text-xs font-medium">Largest Expense</span>
                <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                  <div v-else>
                      <h4
                        class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                        v-if="profitAnalysis[amountCase + 'HighLossPerShare'] > 0"
                      >
                          <div class="flex items-center justify-start gap-x-2">
                            {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'HighLossPerShare']) }}
                            <UPopover mode="hover" v-if="false"> <!-- @todo -->
                              <UIcon name="tabler:adjustments-exclamation" size="0.8em" class="!text-fuchsia-400" />
                              <template #panel>
                                <div class="text-xs text-gray-700">
                                  <div class="p-2 text-sm !font-sans font-normal bg-fuchsia-400 !text-white drop-shadow">Your largest expense exceeds 1R </div>
                                  <div class="p-2 !font-sans font-normal">
                                    Keep your expenses down to 1R to avoid blowing up
                                  </div>
                                </div>
                              </template>

                            </UPopover>
                          </div>
                      </h4>
                      <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                  </div>
              </div>
            </div>
            <div class="col-start-3">
              <div class="base-card overflow-hidden">
                <span class="text-gray-500 text-xs font-medium">Avg. Win</span>
                <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                  <div v-else>
                    <h4
                      class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                      v-if="profitAnalysis[amountCase + 'AvWinPerShare'] > 0"
                    >
                        {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'AvWinPerShare']) }}
                    </h4>
                    <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                  </div>
              </div>
            </div>
            <div class="col-start-4 row-start-3">
              <div class="base-card overflow-hidden">
                <span class="text-gray-500 text-xs font-medium">Avg. Expense</span>
                <USkeleton class="h-8 mt-1 w-40" v-if="!dashboardIdMounted"/>
                  <div v-else>
                    <h4
                      class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                      v-if="profitAnalysis[amountCase + 'AvLossPerShare'] > 0"
                    >
                        {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'AvLossPerShare']) }}
                    </h4>
                    <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
                  </div>
              </div>
            </div>
        </div>

        <!-- CHARTS -->

        <div class="base-card">
          <!-- <ChartCumulativePnl /> -->
           <v-chart id="cumulatedPnl" class="h-full w-full" autoresize />
        </div>



      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
