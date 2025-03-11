<script lang="ts" setup>
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer } from "@unovis/vue"
import { GroupedBar } from '@unovis/ts'
import twConfig from "@/tailwind.config"
import resolveConfig from "tailwindcss/resolveConfig"

const { ChartData, RValues } = useBacktester()
const { theme } = resolveConfig(twConfig)
const appConfig = useAppConfig();


const tickFormat = (_tick: number) => ChartData.value.sessionGain[_tick] != undefined ? ChartData.value.sessionGain[_tick].tick : ''

function sessionName(val) {
    return val == '-' ? 'Traded Outside Any Session' : val
}

const y = [
    (d) =>  d.y,
    (d) =>  d.y2,
    (d) =>  d.y3,
    (d) =>  d.y4,
  ]

const tooltipTrigger = {
    [GroupedBar.selectors.bar]: (d) =>  `
    <div class="flex flex-col text-xs font-medium">
        <h3 class="mb-2 text-sm">` + sessionName(d.tick) + `</h3>
        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` + shadeColor(d.color, -30) +`"></span>
            Total Trades
            <b>` + d.y + `</b>
        </div>

        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` + shadeColor(d.color, -20) +`"></span>
            Total Gain (%)
            <b>` + useTwoDecFormat(d.y2) + `</b>
        </div>

        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` + shadeColor(d.color, -10) +`"></span>
            Total R Multiple
            <b>` + useTwoDecFormat(d.y3) + `</b>
        </div>


        <div class="flex items-center justify-start gap-x-3">
            <span class="w-2 h-2 rounded-full" style="background-color: ` + shadeColor(d.color, 0) +`"></span>
            Win Rate (%)
            <b>` + useTwoDecFormat(d.y4) + `</b>
        </div>


    </div>`
}


  const color = (d, i:number) => [shadeColor(d.color, -30), shadeColor(d.color, -20), shadeColor(d.color, -10), shadeColor(d.color, 0)][i]

</script>
<template>

<div class="w-full bg-white rounded-lg shadow-sm dark:bg-gray-900 pt-4 px-2 pb-2 md:pt-6 md:px-1.5 ">
  <div class="flex justify-between mb-5">
    <div class="grid gap-4 grid-cols-2">
        <ChartsValueStat name="Session Distribution" />
    </div>
  </div>


    <VisXYContainer :data="ChartData.sessionGain">
        <VisGroupedBar :x="d => d.x" :y="y" :color="color" orientation="horizontal" />
        <VisAxis type="x" :gridLine="false"/>
        <VisAxis type="y" :gridLine="false" :tickFormat="tickFormat" />
        <VisTooltip :triggers="tooltipTrigger" />
    </VisXYContainer>

</div>
</template>
