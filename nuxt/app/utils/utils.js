import { dashboardChartsMounted, dashboardIdMounted, spinnerLoadingPage, spinnerLoadingPageText } from "./global"
import { useGetFilteredTrades, useTotalTrades } from './trades'
import { getPositionBagsParse } from "./add_trades"
import { useCharts } from "./charts"
import { hasData } from "./global"

export async function useMountDashboard() {
  console.log('\n✅ MOUNTING DASHBOARD')
  spinnerLoadingPage.value = true
  spinnerLoadingPageText.value = 'Mounting dashboard...'

  await console.time("  --> Duration mount dashboard")


  dashboardChartsMounted.value = false
  dashboardIdMounted.value = false

  await getPositionBagsParse()
  await Promise.all([useGetFilteredTrades()])
  await useTotalTrades()



  await console.timeEnd("  --> Duration mount dashboard")

  if (hasData.value) {
    await useCharts('clear')
  }

  spinnerLoadingPage.value = false
}

export function newShade(hexColor, magnitude) {
  hexColor = hexColor.replace(`#`, ``);
  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);
    let r = (decimalColor >> 16) + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    let g = (decimalColor & 0x0000ff) + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  } else {
    return hexColor;
  }
};
