<script lang="ts" setup>
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat.js";
  import duration from "dayjs/plugin/duration.js";
  import isoWeek from "dayjs/plugin/isoWeek.js";
  import localizedFormat from "dayjs/plugin/localizedFormat.js";
  import timezone from "dayjs/plugin/timezone.js";
  import updateLocale from "dayjs/plugin/updateLocale.js";
  import utc from "dayjs/plugin/utc.js";

  dayjs.extend(utc);

  dayjs.extend(isoWeek);

  dayjs.extend(timezone);

  dayjs.extend(duration);

  dayjs.extend(updateLocale);

  dayjs.extend(localizedFormat);

  dayjs.extend(customParseFormat);

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  onBeforeMount(async () => {
    await useLoadCalendar();
  });

  defineProps({
    small: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>


<div v-if="small == true">
  <div class="mb-5">

    <h3
      class="text-center text-sm subpixel-antialiased font-semibold leading-loose py-2"
      v-if="calendarData.hasOwnProperty(0)"
    >
      {{ calendarData[0][0].month }}
    </h3>

    <div class="p-1 bg-gray-100 dark:bg-gray-900 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700/10">
      <div class="grid grid-cols-7">
        <div
          class="flex items-center justify-center py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs"
          v-for="(day, index) in days"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 mt-1">
        <div v-for="(day, index) in days">
          <div
            class="relative flex items-center justify-center p-2.5 xl:aspect-square bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300/45 shadow shadow-gray-200 dark:shadow-none dark:ring-gray-700/25 rounded m-0.5 h-10 w-10"
            v-for="line in calendarData"
            :class="{
              'bg-green-trade green-trade dark:ring-teal-400/10':
                line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] > 0,
              'bg-red-trade red-trade  dark:ring-rose-400/10':
                line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] < 0
            }"
          >
              <!--Indicator if it's the current day-->
              <div
                class="bg-white rounded w-4 h-1 absolute bottom-1"
                v-if="line[index].day == dayjs().format('D') && calendarData[0][0].month == dayjs().format('MMMM YYYY')"
              />
            <div class="select-none text-xs font-semibold" v-if="line[index].day != 0">


              <UPopover
              :ui="{
                background: '',
                ring: ''
              }">
                <div class="w-full h-full">
                  {{ line[index].day }}
                </div>
                <template #panel>
                  <!-- @TODO: Move to a component -->
                  <div
                  class="text-center p-2 ring-1 ring-inset min-w-16 shadow-lg"
                  v-bind:class="[
                    line[index].pAndL[amountCase + 'Proceeds'] < 0 ? 'bg-red-trade dark:ring-white/10 ring-rose-500/10' :
                    line[index].pAndL[amountCase + 'Proceeds'] > 0 ? 'bg-green-trade dark:ring-white/10 ring-teal-500/10' :
                    'dark:bg-gray-800 dark:ring-gray-700/25'
                  ]"
                  >

                    <!-- If it is the current day -->
                    <div v-if="line[index].day == dayjs().format('D') && calendarData[0][0].month == dayjs().format('MMMM YYYY')">
                      Today is {{ dayjs().format('dddd, DD MMMM YYYY') }}
                    </div>

                    <div v-else-if="line[index].pAndL[amountCase + 'Proceeds']" class="text-wrap">


                      <!-- Format if trades were placed on the same day as today -->
                      <span v-if="line[index].day == dayjs().format('D')">Today you </span>
                      <span v-else>On this day you </span>


                      <span v-if="line[index].pAndL[amountCase + 'Proceeds'] < 0">experienced drawdown</span>
                      <span v-if="line[index].pAndL[amountCase + 'Proceeds'] > 0">were profitable</span>

                      <span
                        class="underline"
                        v-if="line[index].pAndL[amountCase + 'Proceeds'] !< 0 && line[index].pAndL[amountCase + 'Proceeds'] !> 0"
                      >
                        had break-even day
                      </span>

                      <!-- Show the proceeds -->
                      <p class="text-xl font-nunito font-semibold mt-2">
                        {{ useThousandCurrencyFormat(parseInt(line[index].pAndL[amountCase + "Proceeds"])) }}
                        <div class="capitalize text-2xs font-normal dropw-shadow">{{ amountCase }} return</div>
                      </p>

                    </div>

                    <!-- Otherwise, if there we're no trades that day... -->
                    <div v-else>
                      It seems you haven't traded on this day
                    </div>
                  </div>
                </template>
              </UPopover>

            </div>
          </div>
        </div>
      </div>


  </div>
  </div>
</div>



<div v-else>
  <div class="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
    <div class="flex w-full items-center gap-4">
      <div>
        <h5
          class="text-xl font-semibold leading-8 text-gray-900 dark:text-white"
          v-if="calendarData.hasOwnProperty(0)"
        >
          {{ calendarData[0][0].month }}
        </h5>
      </div>
      <div class="ml-auto flex items-center hidden">
        <button
          class="rounded p-1 text-gray-600 transition-all duration-300 hover:bg-gray-600 hover:text-white"
          v-on:click="monthLastNext(-1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
              stroke="currentcolor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <button
          class="rounded p-1 text-gray-600 transition-all duration-300 hover:bg-gray-600 hover:text-white"
          v-on:click="monthLastNext(1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
              stroke="currentcolor"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="rounded-xl ring-1 ring-gray-200 dark:ring-gray-700/50 overflow-hidden">
    <div class="grid grid-cols-7 rounded-t-3xl border-b border-gray-200 dark:border-gray-700/50">
      <div
        class="flex items-center justify-center border-r border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700/50 py-3.5 text-sm font-medium text-gray-600"
        v-for="(day, index) in days"
        :class="{
          'rounded-tl-xl border-r': index == 0,
          'rounded-tr-xl border-r-0': index == days.length - 1,
        }"
      >
        {{ day }}
      </div>
    </div>
    <div class="grid grid-cols-7 rounded-b-xl">
      <div v-for="(day, index) in days">
        <div
          class="flex items-center justify-center min-h-[60px] min-w-[60px] max-h-[100px] max-w-[100px] border-b border-r border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700/50 p-3.5 text-gray-600 dark:text-gray-500 transition-all duration-300 hover:bg-gray-50 max-xl:min-h-[60px] xl:aspect-square"
          v-for="line in calendarData"
          :class="{
            'bg-white': line[index].day != 0,
            'bg-green-trade green-trade':
              line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] > 0,
            'bg-red-trade red-trade':
              line[index].day != 0 && line[index].pAndL[amountCase + 'Proceeds'] < 0,
          }"
        >
          <div class="select-none text-xs font-semibold relative" v-if="line[index].day != 0">

              <span class="text-sm" v-if="line[index].pAndL[amountCase + 'Proceeds']">
                {{ useThousandCurrencyFormat(parseInt(line[index].pAndL[amountCase + "Proceeds"])) }}
              </span>
            <div>
              {{ line[index].day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
