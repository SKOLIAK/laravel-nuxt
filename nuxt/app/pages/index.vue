<script setup lang="ts">
import dayjs from "dayjs"
  import {
    dashboardIdMounted,
    profitAnalysis,
    selectedRatio,
    totals,
    totalsByDate,
  } from "@/utils/global";
  import VChart from "vue-echarts";
  const auth = useAuthStore();
  //
  const items = [
    [
      {
        label: "New mail",
        icon: "i-heroicons-paper-airplane",
        to: "/inbox",
      },
      {
        label: "New user",
        icon: "i-heroicons-user-plus",
        to: "/users",
      },
    ],
  ];

  onBeforeMount(async () => {
    await useMountDashboard();
  });

  const ratioCompute = computed(() => {
    let ratio = {
      shortName: "",
      name: "",
      value: "",
      tooltipTitle: "",
    };

    if (selectedRatio.value == "appt") {
      ratio.shortName = "APPT";
      ratio.name = "Average Profit Factor per Trade";
      let val = totals[amountCase.value + "Proceeds"] / totals.trades;
      ratio.value = val ? useTwoDecCurrencyFormat(val) : "-";
      ratio.tooltipTitle =
        '<div class="dark:text-white"><h2 class="dark:!text-white">Average Profit Per Trade</h2><div class="text-xs"> <code>APPT = Proceeds &divide; Number of Trades</code></div><div class="mt-2">Proceeds: ' +
        useThousandCurrencyFormat(totals[amountCase.value + "Proceeds"]) +
        "</div><div>Trades: " +
        useThousandFormat(totals.trades) +
        "</div></div>";
    }
    if (selectedRatio.value == "apps") {
      ratio.name = "Average Profit Factor per Security";
      ratio.shortName = "APPS";
      let val = totals[amountCase.value + "Proceeds"] / (totals.quantity / 2);
      ratio.value = val ? useXDecCurrencyFormat(val, 4) : "-";
      ratio.tooltipTitle =
        '<div class="dark:text-white"><h2 class="dark:!text-white">Average Profit Per Security</h2><div class="mb-2"><code>APPS = Proceeds &divide; Number of Securities Traded</code></div><div class="text-xs">Proceeds: ' +
        useThousandCurrencyFormat(totals[amountCase.value + "Proceeds"]) +
        "</div><div>Securities Traded: " +
        useThousandFormat(totals.quantity / 2) +
        "</div></div>";
    }
    if (selectedRatio.value == "profitFactor") {
      ratio.shortName = "Profit Factor";
      ratio.name = "Profit Factor";
      let wins = parseFloat(totals[amountCase.value + "Wins"]).toFixed(2);
      let loss = parseFloat(-totals[amountCase.value + "Loss"]).toFixed(2);
      let profitFactor = 0;
      //console.log("wins " + wins + " and loss " + loss)
      if (loss != 0) {
        profitFactor = wins / loss;
        //console.log(" -> profitFactor "+profitFactor)
      }
      ratio.value = profitFactor ? useXDecFormat(profitFactor, 2) : "-";
      ratio.tooltipTitle =
        '<div class="dark:text-white"><h2 class="dark:!text-white">Profit Factor</h2><div class="mb-2"><code>Profit Factor = Wins &divide; Expenses</code></div><div>Wins: ' +
        useThousandCurrencyFormat(totals[amountCase.value + "Wins"]) +
        "</div><div>Expenses: " +
        useThousandCurrencyFormat(totals[amountCase.value + "Loss"]) +
        "</div></div>";
    }
    return ratio;
  });

  var debug = false;



  const getGreeting = (param) => {
    const currentTime = +dayjs().format("HH");

    const emojis = [
      '😄','😃','😀','😊','😉','😍','😘','😚','😜','😝','😛','😁','😂','😪','😅','😆','😋','😎','😇','😏'
    ];

    if (currentTime >= 6 && currentTime < 12) {
      return "Good morning, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Good afternoon, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else if (currentTime >= 18 && currentTime < 22) {
      return "Good evening, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    } else {
      return "Good night, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
    }
  };

</script>

<template>
  <UDashboardPage class="relative">
    <UDashboardPanel grow>
      <UDashboardNavbar class="bg-white dark:bg-gray-900">
        <template #left>
          <div v-if="auth.logged" class="text-lg font-medium text-black dark:text-white">
            <h2 class="font-nunito font-medium tracking-tight leading-snug">
              {{ getGreeting(auth.user.name) }}
            </h2>
            <div class="text-xs font-medium text-gray-500 ">
             <!-- It's {{ dayjs().format('dddd, DD MMMM YYYY') }} -->
            </div>
          </div>

        </template>
        <template #right>
          <UDropdown :items="items">
            <UButton icon="i-heroicons-plus" label="Add" size="sm" class="btn ml-1.5" />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white dark:bg-gray-900">
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

        <div class="mb-4 grid grid-cols-4 grid-rows-3 gap-4">
          <div class="base-card overflow-hidden">
            <span class="text-xs font-medium text-gray-500">Cumulated PnL</span>
            <USkeleton class="mt-1 h-8 w-full" v-if="!dashboardIdMounted" />
            <h4
              class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              v-else
            >
              {{ useThousandCurrencyFormat(totals[amountCase + "Proceeds"]) }}
            </h4>
          </div>

          <div class="base-card overflow-hidden">
            <span class="justify-left flex items-center gap-x-1 text-xs font-medium text-gray-500 dark:text-white">
              {{ ratioCompute.shortName }}
              <UPopover mode="hover">
                <UIcon name="tabler:info-square-rounded" size="1em" class="text-primary" />
                <template #panel>
                  <div
                    class="selected-ratio-tooltip px-3.5 py-2 text-xs text-gray-900"
                    v-html="ratioCompute.tooltipTitle"
                  ></div>
                </template>
              </UPopover>
            </span>
            <USkeleton class="mt-1 h-8 w-full" v-if="!dashboardIdMounted" />
            <h4
              class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              v-else
            >
              {{ ratioCompute.value }}
            </h4>
          </div>

          <div class="col-start-1 row-span-2 row-start-2">
            <div class="base-card relative flex h-full items-center justify-center p-8">
              <UIcon
                name="svg-spinners:eclipse"
                class="absolute left-2 top-2 animate-pulse"
                size="1em"
                v-if="!dashboardIdMounted"
              />
              <div class="h-40 w-40">
                <div id="pieChart1" class="h-full w-full" />
              </div>
            </div>
          </div>
          <div class="col-start-2 row-span-2 row-start-2">
            <div class="base-card flex h-full items-center justify-center p-8">
              <div class="flex items-center justify-normal">
                <div>
                  <USkeleton class="mr-4 h-24 w-24" />
                </div>
                <div>
                  <USkeleton class="h-6 w-40" />
                  <USkeleton class="mt-2 h-4 w-32" />
                  <USkeleton class="mt-1 h-4 w-16" />
                  <USkeleton class="mt-1 h-4 w-24" />
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-2 col-start-3 row-start-1">
            <!-- remove col-span-2 if adding another card -->
            <div class="col-span-2 col-start-3 row-start-1">
              <div class="base-card overflow-hidden">
                <span class="text-xs font-medium text-gray-500">P/L Ratio</span>
                <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
                <div v-else>
                  <h4
                    class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                    v-if="!isNaN(profitAnalysis[amountCase + 'R'])"
                  >
                    {{ profitAnalysis[amountCase + "R"].toFixed(2) }}
                  </h4>
                  <h4
                    class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                    v-else
                  >
                    -
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div class="col-start-4 row-start-1" v-if="false">
            <div class="col-span-2 col-start-3 row-start-1">
              <div class="base-card overflow-hidden">
                <span class="text-xs font-medium text-gray-500">Expected Return</span>
                <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
                <div v-else>
                  <h4
                    class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                    v-if="!isNaN(profitAnalysis[amountCase + 'CurrExpectReturn'])"
                  >
                    {{ profitAnalysis[amountCase + "CurrExpectReturn"].toFixed(2) }}
                  </h4>
                  <h4
                    class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                    v-else
                  >
                    -
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div class="row-start-2">
            <div class="base-card overflow-hidden">
              <span class="text-xs font-medium text-gray-500">Largest Win</span>
              <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
              <div v-else>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-if="profitAnalysis[amountCase + 'HighWinPerShare'] > 0"
                >
                  {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + "HighWinPerShare"]) }}
                </h4>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-else
                >
                  -
                </h4>
              </div>
            </div>
          </div>
          <div class="row-start-2">
            <div class="base-card overflow-hidden">
              <span class="text-xs font-medium text-gray-500">Largest Expense</span>
              <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
              <div v-else>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-if="profitAnalysis[amountCase + 'HighLossPerShare'] > 0"
                >
                  <div class="flex items-center justify-start gap-x-2">
                    {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + "HighLossPerShare"]) }}
                    <UPopover mode="hover" v-if="false">
                      <!-- @todo -->
                      <UIcon
                        name="tabler:adjustments-exclamation"
                        size="0.8em"
                        class="!text-fuchsia-400"
                      />
                      <template #panel>
                        <div class="text-xs text-gray-700">
                          <div
                            class="bg-fuchsia-400 p-2 !font-sans text-sm font-normal !text-white drop-shadow"
                          >
                            Your largest expense exceeds 1R
                          </div>
                          <div class="p-2 !font-sans font-normal">
                            Keep your expenses down to 1R to avoid blowing up
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>
                </h4>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-else
                >
                  -
                </h4>
              </div>
            </div>
          </div>
          <div class="col-start-3">
            <div class="base-card overflow-hidden">
              <span class="text-xs font-medium text-gray-500">Avg. Win</span>
              <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
              <div v-else>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-if="profitAnalysis[amountCase + 'AvWinPerShare'] > 0"
                >
                  {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + "AvWinPerShare"]) }}
                </h4>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-else
                >
                  -
                </h4>
              </div>
            </div>
          </div>
          <div class="col-start-4 row-start-3">
            <div class="base-card overflow-hidden">
              <span class="text-xs font-medium text-gray-500">Avg. Expense</span>
              <USkeleton class="mt-1 h-8 w-40" v-if="!dashboardIdMounted" />
              <div v-else>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-if="profitAnalysis[amountCase + 'AvLossPerShare'] > 0"
                >
                  {{ useTwoDecCurrencyFormat(profitAnalysis[amountCase + "AvLossPerShare"]) }}
                </h4>
                <h4
                  class="font-nunito truncate text-ellipsis text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                  v-else
                >
                  -
                </h4>
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
