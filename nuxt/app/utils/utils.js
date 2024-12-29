import { dashboardChartsMounted, dashboardIdMounted, spinnerLoadingPage, spinnerLoadingPageText } from "./global"
import { useGetFilteredTrades, useTotalTrades, useCalculateProfitAnalysis } from './trades'
import { getOpenPositionsParse } from "./add_trades"
import { useCharts } from "./charts"
import { hasData } from "./global"

export async function useMountDashboard() {
  console.log('\n✅ MOUNTING DASHBOARD')
  dashboardChartsMounted.value = false
  dashboardIdMounted.value = false
  await getOpenPositionsParse()
  await Promise.all([useGetFilteredTrades()])
  await useTotalTrades()
  await useCalculateProfitAnalysis()

  if (hasData.value) {
    await useCharts('init')
  }

  await (dashboardIdMounted.value = true)
  spinnerLoadingPage.value = false
}
