<script lang="ts" setup>
import { VisAxis, VisGroupedBar, VisTooltip, VisXYContainer } from "@unovis/vue"
import { GroupedBar } from '@unovis/ts'

const { SelectedBacktestComputed, ChartData, RValues } = useBacktester()

const tickFormat = (_tick: number) => ChartData.value.riskToReward[_tick] != undefined ? ChartData.value.riskToReward[_tick].tick : _tick

const tooltipTrigger = {
    [GroupedBar.selectors.bar]: (d) =>  `<div class="flex flex-col text-xs font-medium">
    <h3 class="text-sm">` + d.y + ` Trades</h3>
    <span>Between ` + d.tick.split('-').join(' & ') + `RR</span>
    </div>`
}

</script>
<template>

<div class="w-full bg-white rounded-lg shadow-sm dark:bg-gray-900 pt-4 px-2 pb-2 md:pt-6 md:px-1.5">
  <div class="flex justify-between mb-5">
    <div class="grid gap-4 grid-cols-2">

        <ChartsValueStat name="R Mean" :value="RValues.mean" :info="true">
            <template #info>
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white uppercase">
                        R Multiple Average / Mean
                    </h3>
                    <p>In mathematics, the "mean" is simply the average of a set of numbers, calculated by summing all the numbers and then dividing by the total count of numbers.</p>
                </div>
            </template>
        </ChartsValueStat>

        <ChartsValueStat name="R Mode" :value="RValues.mode" :info="true">
            <template #info>
                <div class="p-3 space-y-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white uppercase">
                        R Multiple Mode
                    </h3>
                    <p>The mode is the most common number that appears in your set of data.</p>
                </div>
            </template>
        </ChartsValueStat>

    </div>
  </div>


    <VisXYContainer :data="ChartData.riskToReward" v-if="SelectedBacktestComputed">
        <VisGroupedBar
            :x="d => d.x"
            :y="d => d.y"
            :color="d => d.color"
        />
        <VisAxis type="x" label="R Multiple" :gridLine="false" :labelFontSize="11" :tickFormat="tickFormat"/>
        <VisAxis type="y" label="Number of Trades" :gridLine="false" :labelFontSize="11" />
        <VisTooltip :triggers="tooltipTrigger" />
    </VisXYContainer>

</div>
</template>
