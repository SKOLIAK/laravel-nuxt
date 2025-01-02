<script setup lang="ts">
import VChart from 'vue-echarts';

import { backtestChart, backtestDataX, backtestDataY } from '@/utils/charts';

onBeforeMount(async () => {
  await useMountDashboard()
})

const isLocked = ref(false)
let totalEntries = 0
let totalRS = 0
let valProfit = 2
let ddStart = 0
let ddEnd = 0
let riskPercent = 1
let initialStartingBalance = 1000

const stats = reactive({
  wins: 0,
  losses: 0,
  bes: 0,
  consecutiveLosses: 0,
  maxConsecutiveLosses: 0,
  pnl: 0,
  gain: 0,
  startingBalance: initialStartingBalance,
  endingBalance: 0
})

// Winning Percentage:79.41%
// Winning Percentage = (2 × Wins + Ties) / (2 × Total Games Played) × 100
// = (2 × 25 + 4) / (2 × 34) × 100
// = 0.79 × 100
// = 79.41%
// https://goodcalculators.com/winning-percentage-calculator/
// © 2015-2024 goodcalculators.com

function resetbacktester() {
  isLocked.value = false

  stats.wins = 0
  stats.losses = 0
  stats.bes = 0
  stats.consecutiveLosses = 0
  stats.maxConsecutiveLosses = 0
  stats.pnl = 0
  stats.gain = 0
  stats.startingBalance = initialStartingBalance
  stats.endingBalance = 0

  backtestDataX.value = []
  backtestDataY.value = []
  updateChart(1)
}


const WinRate = computed(() => {
  return (stats.wins + stats.losses) != 0 ? useTwoDecFormat((2 * stats.wins) / (2 * (stats.wins + stats.losses)) * 100) : 0
})


function addBE() {
  stats.bes += 1
}

function addProfit() {
  backtestDataX.value.push(totalEntries)
  totalRS += valProfit
  backtestDataY.value.push(totalRS)
  totalEntries += 1
  console.warn(backtestDataX.value)


  stats.pnl += ((stats.startingBalance / 100) * riskPercent) * valProfit
  stats.endingBalance = stats.startingBalance + stats.pnl
  stats.gain = (stats.pnl / stats.startingBalance) * 100


  stats.wins += 1
  stats.consecutiveLosses = 0

  updateChart(1)
}

function addLoss() {
  backtestDataX.value.push(totalEntries)
  totalRS -= 1
  backtestDataY.value.push(totalRS)
  totalEntries += 1
  console.warn(backtestDataX.value)



  stats.pnl -= (stats.startingBalance / 100) * riskPercent
  stats.endingBalance -= (stats.startingBalance / 100) * riskPercent
  stats.gain = (stats.pnl / stats.startingBalance) * 100


  stats.losses += 1

  stats.consecutiveLosses += 1
  if (stats.consecutiveLosses > stats.maxConsecutiveLosses) {
    stats.maxConsecutiveLosses = stats.consecutiveLosses
  }

  updateChart(0)
}

function updateChart(type) {
  backtestChart.value.setOption({
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: backtestDataX.value
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: backtestDataY.value,
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#059669',
          },
          areaStyle: {
            opacity: 0.2,
          }
        }
      ]
    })
}

</script>

<template>
  <UDashboardPage>
  <UDashboardPanel grow>
    <UDashboardNavbar title="Backtesting" class="sticky top-0 bg-white">
      <template #right>
        <UButton
            icon="i-heroicons-plus"
            label="Cancel"
            color="gray"
            size="sm"
            class="ml-1.5"
            to="/backtesting"
          />
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent class="overflow-x-hidden overflow-y-auto">

      <div class="grid grid-rows-3 grid-flow-col gap-4">
        <div class="col-span-2 space-y-2">
          <div class="flex items-start space-x-2">

            <!-- SETUP -->
            <div class="base-card !p-2 space-y-2">
              <UInput placeholder="Balance" type="number" :disabled="isLocked == true" v-model="stats.startingBalance">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">USD</span>
                </template>
              </UInput>
              <UButton label="Save" class="w-full" :disabled="isLocked == true" @click="isLocked = true" />
              <UButton label="Reset" color="white" :disabled="isLocked == false" @click="resetbacktester" class="w-full" />
            </div>
            <!-- END -->

            <!-- ACTIONS -->
            <div class="base-card !p-2 grow h-max">
              <div class="flex items-center">
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <div class="space-y-2">
                      <UInput placeholder="Risk To Reward Ratio" type="number" v-model="valProfit" >
                        <template #trailing>
                          <span class="text-gray-500 dark:text-gray-400 text-xs">RRR</span>
                        </template>
                      </UInput>
                      <UButton @click="addProfit" class="w-full" :disabled="stats.startingBalance == 0 || isLocked == false">Add Profit</UButton>
                    </div>
                    <div class="space-y-2">
                      <UInput placeholder="Risk Percentage" type="number" v-model="riskPercent" >
                        <template #trailing>
                          <span class="text-gray-500 dark:text-gray-400 text-xs">Risk %</span>
                        </template>
                      </UInput>
                      <UButton @click="addLoss" class="w-full" color="black" :disabled="stats.startingBalance == 0 || isLocked == false">Add Loss</UButton>
                    </div>
                  </div>
                  <UButton @click="addBE" class="w-full" color="white" :disabled="stats.startingBalance == 0 || isLocked == false">Add Break-Even</UButton>
                </div>
                <div>

                </div>
              </div>
            </div>
            <!-- END -->


          </div>
          <div class="base-card  flex space-x-8 text-center text-xs text-gray-700/50 font-medium">
            <div>Win Rate:
              <div class="text-2xl text-gray-500 font-bold">{{ WinRate }}%</div>
            </div>

            <div>Pnl
              <div class="text-2xl text-gray-500 font-bold" :class="{'text-primary': stats.gain > 0, 'text-orange-600': stats.gain < 0}">
                {{ useTwoDecFormat(stats.gain) }}%
              </div>
            </div>

            <div>Wins/Losses
              <div class="text-2xl text-gray-500 font-bold">{{ stats.wins }}W/{{ stats.losses }}L</div>
            </div>

            <div>Break-Evens
              <div class="text-2xl text-gray-500 font-bold">{{ stats.bes }}</div>
            </div>

            <div>Max. Losing Streak
              <div class="text-2xl text-gray-500 font-bold">{{ stats.maxConsecutiveLosses }}</div>
            </div>

            <div>Balance
              <div class="text-2xl text-gray-500 font-bold">{{ useTwoDecCurrencyFormat(stats.endingBalance) }}</div>
            </div>

          </div>
        </div>
        <div class="row-span-2 col-span-2">
          <div class="base-card !p-2 !w-full !h-full">
            <v-chart id="backtestChartElement" class="h-full w-full" autoresize />
          </div>
        </div>
        <div class="row-span-3 space-y-2">
          <!-- 3 -->
        </div>
      </div>


    </UDashboardPanelContent>

  </UDashboardPanel>
</UDashboardPage>
</template>
