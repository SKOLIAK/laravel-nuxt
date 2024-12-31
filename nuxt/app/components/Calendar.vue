<script lang="ts" setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc)
import isoWeek from 'dayjs/plugin/isoWeek.js'
dayjs.extend(isoWeek)
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(timezone)
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)
import updateLocale from 'dayjs/plugin/updateLocale.js'
dayjs.extend(updateLocale)
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
dayjs.extend(localizedFormat)
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat)

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

onBeforeMount(async () => {
  await useLoadCalendar()
})

</script>


<template>

<div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
      <div class="flex items-center gap-4 w-full">
        <div>
          <h5
            class="text-xl leading-8 font-semibold text-gray-900"
            v-if="calendarData.hasOwnProperty(0)"
          >
          {{ calendarData[0][0].month }}
          </h5>
        </div>
        <div class="flex items-center ml-auto">
          <button
            class="text-gray-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-gray-600"
            v-on:click="monthLastNext(-1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10.0002 11.9999L6 7.99971L10.0025 3.99719" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button
            class="text-gray-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-gray-600"
            v-on:click="monthLastNext(1)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="border border-gray-200 rounded-xl">
      <div class="grid grid-cols-7 rounded-t-3xl border-b border-gray-200">

        <div
          class="py-3.5 border-gray-200 border-r bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600"
          v-for="(day, index) in days"
          :class="{'rounded-tl-xl border-r': index == 0, 'rounded-tr-xl border-r-0': index == days.length - 1}">
          {{ day }}
        </div>

      </div>
      <div class="grid grid-cols-7 rounded-b-xl">
        <div v-for="(day, index) in days">
        <div
          class="flex xl:aspect-square min-w-[60px] min-h-[60px] bg-gray-50 text-gray-600 max-xl:min-h-[60px] p-3.5 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50"
          v-for="line in calendarData"
          :class="{
            'bg-white': line[index].day != 0,
            'bg-green-trade green-trade': line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] > 0,
            'bg-red-trade red-trade': line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] < 0
          }"
        >
          <span
            class="text-xs font-semibold"
            v-if="line[index].day != 0"
          >
           {{ line[index].day }}
            <div v-show="line[index].pAndL[amountCase + 'Proceeds']" class="text-2xs">
                    {{ useThousandCurrencyFormat(parseInt(line[index].pAndL[amountCase + 'Proceeds'])) }}
            </div>
          </span>
        </div>
      </div>
      </div>
    </div>
</template>
