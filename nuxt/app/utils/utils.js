import { useCalendar } from "@angelblanco/v-calendar";

import { getOpenPositionsParse } from "./add_trades";
import { useCharts } from "./charts";
import {
  dashboardChartsMounted,
  dashboardIdMounted,
  hasData,
  spinnerLoadingPage,
  spinnerLoadingPageText,
} from "./global";
import { useGetTags } from "./tags";
import { useCalculateProfitAnalysis, useGetFilteredTrades, useTotalTrades } from "./trades";

export async function useMountDashboard() {
  console.log("\n✅ MOUNTING DASHBOARD");
  dashboardChartsMounted.value = false;
  dashboardIdMounted.value = false;
  await getOpenPositionsParse();
  await Promise.all([useGetFilteredTrades()]);
  await useTotalTrades();
  await useCalculateProfitAnalysis();

  if (hasData.value) {
    await useCharts("init");
  }

  await (dashboardIdMounted.value = true);
  spinnerLoadingPage.value = false;
}

export async function useMountDaily() {
  console.log("\n✅ MOUNTING DAILY");

  await (spinnerLoadingPage.value = true)
  await (spinnerLoadingPageText.value = 'Please Wait...')
  await useGetTags();
  await useLoadCalendar();
  await useRenderPieChart();
  await useRenderDoubleLineChart();
  // <!-- ... -->

  await (spinnerLoadingPage.value = false)
}
