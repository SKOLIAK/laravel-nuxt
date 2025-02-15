<script lang="ts" setup>
import dayjs from 'dayjs'
import twConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { isObjectEmpty } from '@/utils/misc'
import { APPDOWChartData } from '@/utils/backtester'

const { theme } = resolveConfig(twConfig)
const appConfig = useAppConfig();

const minValue = computed(() => {
    if (isObjectEmpty(APPDOWChartData.value)) return 0

    return Math.min(...Object.entries(APPDOWChartData.value).map(([k, v], i) => v))
})

const maxValue = computed(() => {
    if (isObjectEmpty(APPDOWChartData.value)) return 0

    return Math.max(...Object.entries(APPDOWChartData.value).map(([k, v], i) => v))
})

function __(value) {
    return 100 * (value - minValue.value) / (maxValue.value - minValue.value)
}

function weekdayName(day) {
    switch (day) {
        case '1':
            return 'Mon'
            break;
        case '2':
            return 'Tues'
            break;
        case '3':
            return 'Wed'
            break;
        case '4':
            return 'Thur'
            break;
        case '5':
            return 'Fri'
            break;
        case '6':
            return 'Sat'
            break;
        case '7':
            return 'Sun'
            break;
    }
}

function shadeColor(color, percent) {

var R = parseInt(color.substring(1,3),16);
var G = parseInt(color.substring(3,5),16);
var B = parseInt(color.substring(5,7),16);

R = parseInt(R * (100 + percent) / 100);
G = parseInt(G * (100 + percent) / 100);
B = parseInt(B * (100 + percent) / 100);

R = (R<255)?R:255;
G = (G<255)?G:255;
B = (B<255)?B:255;

R = Math.round(R)
G = Math.round(G)
B = Math.round(B)

var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

return "#"+RR+GG+BB;
}

function hexToRgba(colour, alpha = 1) {
    const [r, g, b] = colour.match(/\w\w/g).map(x => parseInt(x, 16))
    return `rgb(${r},${g},${b})`
}

function getRgb(color) {
  let [r, g, b] = color.replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(str => Number(str));;
  return {
    r,
    g,
    b
  }
}

function colorInterpolate(colorA, colorB, intval) {
  const rgbA = getRgb(hexToRgba(colorA)),
    rgbB = getRgb(hexToRgba(colorB));
  const colorVal = (prop) =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval) ;
  return 'rgb('+ colorVal('r') + ',' + colorVal('g') + ',' + colorVal('b') + ')'
}

</script>

<template>
    <div class="flex flex-col">
        <div class="text-xs mb-2 drop-shadow flex items-center justify-start gap-x-1">
            Avg. Pnl Per Day of Week
            <UIcon name="akar-icons:info" title="Indicates on which day of the week on average you tend to win more"/>
        </div>

        <div class="flex justify-between h-4 overflow-hidden rounded">
            <div
            class="min-w-1 w-full text-center text-2xs drop-shadow mb-1"
            v-for="(a,b) in APPDOWChartData"
            >
                {{ weekdayName(b) }}
            </div>
        </div>
        <div class="flex justify-between h-4">
            <div
            class="min-w-1 w-full transition-all duration-200 hover:scale-110 bg-yellow-300 flex items-center justify-center text-2xs"
            v-for="(a,b) in APPDOWChartData"
            :style="{'background-color': colorInterpolate(theme.colors[appConfig.ui.gray][900], theme.colors.yellow[400], __(a) / 100)}"
            >
            <span class="drop-shadow" v-if="__(a) > 0">{{ useTwoDecFormat(__(a) / 100) }}</span>
        </div>
        </div>
        <div class="mt-2 bg-gradient-to-r from-gray-900 to-yellow-400 h-1 rounded"></div>
        <div class="flex items-ceter justify-between text-2xs font-normal drop-shadow opacity-80">
            <span>Min: {{ useTwoDecCurrencyFormat(minValue) }}</span>
            <span>Max: {{ useTwoDecCurrencyFormat(maxValue) }}</span>
        </div>
    </div>
</template>
