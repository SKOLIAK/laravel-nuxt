<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'
import VChart from 'vue-echarts';

import { totals, dashboardIdMounted, profitAnalysis, selectedRatio } from '@/utils/global'
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

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')

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
        ratio.value = useTwoDecCurrencyFormat(totals[amountCase.value + 'Proceeds'] / totals.trades)
        ratio.tooltipTitle = '<h2>Average Profit Per Trade</h2><div class="text-xs"> <code>APPT = Proceeds &divide; Number of Trades</code></div><div class="mt-2">Proceeds: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Proceeds']) + '</div><div>Trades: ' + useThousandFormat(totals.trades) + '</div>'
    }
    if (selectedRatio.value == 'apps') {
        ratio.name = "Average Profit Factor per Security"
        ratio.shortName = "APPS"
        ratio.value = useXDecCurrencyFormat(totals[amountCase.value + 'Proceeds'] / (totals.quantity / 2), 4)
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
        ratio.value = useXDecFormat(profitFactor, 2)
        ratio.tooltipTitle = '<h2>Profit Factor</h2><div class="mb-2"><code>Profit Factor = Wins &divide; Expenses</code></div><div>Wins: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Wins']) + '</div><div>Expenses: ' + useThousandCurrencyFormat(totals[amountCase.value + 'Loss']) + '</div>'
    }
    return ratio
})
</script>

<template>
  <UDashboardPage>
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
          <!-- ~/components/home/HomeDateRangePicker.vue -->
          <HomeDateRangePicker
            v-model="range"
            class="-ml-2.5"
          />

          <!-- ~/components/home/HomePeriodSelect.vue -->
          <HomePeriodSelect
            v-model="period"
            :range="range"
          />

          <HomeProceedsSelect />

          <HomeSelectedRatio />
        </template>


      </UDashboardToolbar>

      <UDashboardPanelContent>

        <DEVBlock>
          <template #title>Totals / Mounted: {{ dashboardIdMounted }}</template>
          <template #code>
            {{ totals }}
            <hr>
            {{ profitAnalysis }}
          </template>
        </DEVBlock>

          <div class="grid grid-cols-5 gap-4 mb-4" v-if="dashboardIdMounted">

            <!-- LINE 1-->
            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium">Cumulated PnL</span>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito">
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
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito">
                {{ ratioCompute.value }}
              </h4>
            </div>

            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium">P/L Ratio</span>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-if="!isNaN(profitAnalysis[amountCase + 'R'])">
                {{ (profitAnalysis[amountCase +'R']).toFixed(2) }}
              </h4>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
            </div>

            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium">Largest Win</span>
              <h4
                class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                v-if="profitAnalysis[amountCase + 'HighWinPerShare'] > 0"
               >
                  {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'HighWinPerShare']) }}
              </h4>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
            </div>

            <!-- LINE 2-->


            <div class="base-card overflow-hidden">
              <span class="text-gray-500 text-xs font-medium">Largest Expense</span>
              <h4
                class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito"
                v-if="profitAnalysis[amountCase + 'HighLossPerShare'] > 0"
               >
                  {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + 'HighLossPerShare']) }}
              </h4>
              <h4 class="text-gray-900 text-3xl font-bold truncate tracking-tight text-ellipsis font-nunito" v-else>-</h4>
            </div>

            <!-- 9 -->
          </div>



        <div class="base-card">
          <!-- <ChartCumulativePnl /> -->
           <v-chart id="cumulatedPnl" class="h-full w-full" autoresize />
        </div>



      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
