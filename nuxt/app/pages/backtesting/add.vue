<script setup lang="ts">
  import { backtestChart, backtestDataX, backtestDataY } from "@/utils/charts";
  import VChart from "vue-echarts";

  onBeforeMount(async () => {
    await useMountDashboard();
  });

  const isLocked = ref(false);
  let totalEntries = 0;
  let totalRS = 0;
  let valProfit = 2;
  let ddStart = 0;
  let ddEnd = 0;
  let riskPercent = 1;
  let initialStartingBalance = 1000;

  const stats = reactive({
    wins: 0,
    losses: 0,
    bes: 0,
    consecutiveLosses: 0,
    maxConsecutiveLosses: 0,
    pnl: 0,
    gain: 0,
    startingBalance: initialStartingBalance,
    endingBalance: 0,
  });

  // Winning Percentage:79.41%
  // Winning Percentage = (2 × Wins + Ties) / (2 × Total Games Played) × 100
  // = (2 × 25 + 4) / (2 × 34) × 100
  // = 0.79 × 100
  // = 79.41%
  // https://goodcalculators.com/winning-percentage-calculator/
  // © 2015-2024 goodcalculators.com

  function resetbacktester() {
    isLocked.value = false;

    stats.wins = 0;
    stats.losses = 0;
    stats.bes = 0;
    stats.consecutiveLosses = 0;
    stats.maxConsecutiveLosses = 0;
    stats.pnl = 0;
    stats.gain = 0;
    stats.startingBalance = initialStartingBalance;
    stats.endingBalance = 0;

    backtestDataX.value = [];
    backtestDataY.value = [];
    updateChart(1);
  }

  const WinRate = computed(() => {
    return stats.wins + stats.losses != 0
      ? useTwoDecFormat(((2 * stats.wins) / (2 * (stats.wins + stats.losses))) * 100)
      : 0;
  });

  function addBE() {
    stats.bes += 1;
  }

  function addProfit() {
    backtestDataX.value.push(totalEntries);
    totalRS += valProfit;
    backtestDataY.value.push(totalRS);
    totalEntries += 1;
    console.warn(backtestDataX.value);

    stats.pnl += (stats.startingBalance / 100) * riskPercent * valProfit;
    stats.endingBalance = stats.startingBalance + stats.pnl;
    stats.gain = (stats.pnl / stats.startingBalance) * 100;

    stats.wins += 1;
    stats.consecutiveLosses = 0;

    updateChart(1);
  }

  function addLoss() {
    backtestDataX.value.push(totalEntries);
    totalRS -= 1;
    backtestDataY.value.push(totalRS);
    totalEntries += 1;
    console.warn(backtestDataX.value);

    stats.pnl -= (stats.startingBalance / 100) * riskPercent;
    stats.endingBalance -= (stats.startingBalance / 100) * riskPercent;
    stats.gain = (stats.pnl / stats.startingBalance) * 100;

    stats.losses += 1;

    stats.consecutiveLosses += 1;
    if (stats.consecutiveLosses > stats.maxConsecutiveLosses) {
      stats.maxConsecutiveLosses = stats.consecutiveLosses;
    }

    updateChart(0);
  }

  function updateChart(type) {
    backtestChart.value.setOption({
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: backtestDataX.value,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: backtestDataY.value,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            color: "#059669",
          },
          areaStyle: {
            opacity: 0.2,
          },
        },
      ],
    });
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

      <UDashboardPanelContent class="overflow-y-auto overflow-x-hidden">
        <div class="grid grid-flow-col grid-rows-3 gap-4">
          <div class="col-span-2 space-y-2">
            <div class="flex items-start space-x-2">
              <!-- SETUP -->
              <div class="base-card space-y-2 !p-2">
                <UInput
                  placeholder="Balance"
                  type="number"
                  :disabled="isLocked == true"
                  v-model="stats.startingBalance"
                >
                  <template #trailing>
                    <span class="text-xs text-gray-500 dark:text-gray-400">USD</span>
                  </template>
                </UInput>
                <UButton
                  label="Save"
                  class="w-full"
                  :disabled="isLocked == true"
                  @click="isLocked = true"
                />
                <UButton
                  label="Reset"
                  color="white"
                  :disabled="isLocked == false"
                  @click="resetbacktester"
                  class="w-full"
                />
              </div>
              <!-- END -->

              <!-- ACTIONS -->
              <div class="base-card h-max grow !p-2">
                <div class="flex items-center">
                  <div class="space-y-2">
                    <div class="flex space-x-2">
                      <div class="space-y-2">
                        <UInput
                          placeholder="Risk To Reward Ratio"
                          type="number"
                          v-model="valProfit"
                        >
                          <template #trailing>
                            <span class="text-xs text-gray-500 dark:text-gray-400">RRR</span>
                          </template>
                        </UInput>
                        <UButton
                          @click="addProfit"
                          class="w-full"
                          :disabled="stats.startingBalance == 0 || isLocked == false"
                          >Add Profit</UButton
                        >
                      </div>
                      <div class="space-y-2">
                        <UInput placeholder="Risk Percentage" type="number" v-model="riskPercent">
                          <template #trailing>
                            <span class="text-xs text-gray-500 dark:text-gray-400">Risk %</span>
                          </template>
                        </UInput>
                        <UButton
                          @click="addLoss"
                          class="w-full"
                          color="black"
                          :disabled="stats.startingBalance == 0 || isLocked == false"
                          >Add Loss</UButton
                        >
                      </div>
                    </div>
                    <UButton
                      @click="addBE"
                      class="w-full"
                      color="white"
                      :disabled="stats.startingBalance == 0 || isLocked == false"
                      >Add Break-Even</UButton
                    >
                  </div>
                  <div></div>
                </div>
              </div>
              <!-- END -->
            </div>
            <div class="base-card flex space-x-8 text-center text-xs font-medium text-gray-700/50">
              <div>
                Win Rate:
                <div class="text-2xl font-bold text-gray-500">{{ WinRate }}%</div>
              </div>

              <div>
                Pnl
                <div
                  class="text-2xl font-bold text-gray-500"
                  :class="{ 'text-primary': stats.gain > 0, 'text-orange-600': stats.gain < 0 }"
                >
                  {{ useTwoDecFormat(stats.gain) }}%
                </div>
              </div>

              <div>
                Wins/Losses
                <div class="text-2xl font-bold text-gray-500">
                  {{ stats.wins }}W/{{ stats.losses }}L
                </div>
              </div>

              <div>
                Break-Evens
                <div class="text-2xl font-bold text-gray-500">{{ stats.bes }}</div>
              </div>

              <div>
                Max. Losing Streak
                <div class="text-2xl font-bold text-gray-500">{{ stats.maxConsecutiveLosses }}</div>
              </div>

              <div>
                Balance
                <div class="text-2xl font-bold text-gray-500">
                  {{ useTwoDecCurrencyFormat(stats.endingBalance) }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-2 row-span-2">
            <div class="base-card !h-full !w-full !p-2">
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
