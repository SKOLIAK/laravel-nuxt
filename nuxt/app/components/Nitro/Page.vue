<script lang="ts" setup>
  import VChart from "vue-echarts";
  import {
    selectedInstrument,
    selectedSession,
    nitroFilter,
    nitroFilters,
    dayOfWeek,
    daysOfWeek,
    weekOfMonth,
    weeksOfMonth,
    monthOfYear,
    monthsOfYear,
    rules,
    rule,
    directions,
    direction,
    sessionTimes,
    selectedSessionTime,

    getSessionTimes

    } from '@/utils/nitro'

    import { useNitroCharts } from '@/utils/charts'


onMounted(async () => {
  await useNitroCharts();
})
</script>

<template>
  <div class="mx-4 mt-8 p-4 drop-shadow">

    <!-- Filters -->
    <div class="flex items-center justify-start gap-4">
      <!-- General Filter -->
      <UFormGroup label="How do you want to filter your data?" size="xs" class="!w-1/2">
        <USelectMenu v-model="nitroFilter" :options="nitroFilters" />
      </UFormGroup>

      <!-- Days Of the Week Filter -->
      <UFormGroup label="Select Day" size="xs" v-if="nitroFilter == nitroFilters[1]" class="!w-1/2">
        <USelectMenu v-model="dayOfWeek" :options="daysOfWeek" />
      </UFormGroup>

      <!-- Week of Month Filter -->
      <UFormGroup label="Select Week" size="xs" v-if="nitroFilter == nitroFilters[2]" class="!w-1/2">
        <USelectMenu v-model="weekOfMonth" :options="weeksOfMonth" />
      </UFormGroup>


      <!-- Month of Year Filter -->
      <UFormGroup label="Select Month" size="xs" v-if="nitroFilter == nitroFilters[3]" class="!w-1/2">
        <USelectMenu v-model="monthOfYear" :options="monthsOfYear" searchable />
      </UFormGroup>
    </div>

    <!-- Filtered DR Stats-->
    <div class="flex items-center justify-between mt-6 text-xs gap-x-4">

      <!-- DR Confirmation % -->
      <div>
        <p class="tracking-tight">Conf. DR</p>
        <h3 class="text-sm leading-relaxed font-medium">95.1%</h3>
      </div>

      <!-- DR True % -->
      <div>
        <p class="tracking-tight">DR True</p>
        <h3 class="text-sm leading-relaxed font-medium">81.3%</h3>
      </div>

      <!-- Conf. Long % -->
      <div>
        <p class="tracking-tight">Conf. Long</p>
        <h3 class="text-sm leading-relaxed font-medium">54.2%</h3>
      </div>

      <!-- Ret. into DR % -->
      <div>
        <p class="tracking-tight">Ret. into DR</p>
        <h3 class="text-sm leading-relaxed font-medium">88.4%</h3>
      </div>

      <!-- Ret. into IDR % -->
      <div>
        <p class="tracking-tight">Ret. into IDR</p>
        <h3 class="text-sm leading-relaxed font-medium">75.4%</h3>
      </div>

      <!-- Outside DR % -->
      <div>
        <p class="tracking-tight">Outside DR</p>
        <h3 class="text-sm leading-relaxed font-medium">60.6%</h3>
      </div>

      <!-- Mean SD Up -->
      <div>
        <p class="tracking-tight">Mean SD Up</p>
        <h3 class="text-sm leading-relaxed font-medium">0.6x</h3>
      </div>

      <!-- Mean SD Down -->
      <div>
        <p class="tracking-tight">Mean SD Down</p>
        <h3 class="text-sm leading-relaxed font-medium">0.6x</h3>
      </div>

      <!-- Avg. Conf. time -->
      <div>
        <p class="tracking-tight">Avg. Conf. time</p>
        <h3 class="text-sm leading-relaxed font-medium">11:27</h3>
      </div>

    </div>


    <UDivider class="my-8"/>


    <!-- Further Filters -->
    <div class="text-sm font-medium">
      Do you want to narrow down your data further?
    </div>

    <div class="flex items-center justify-between gap-8 mt-4">

      <!-- DR Rule Filter -->
      <UFormGroup label="DR Rule" size="xs">
        <URadioGroup v-model="rule" :options="rules" size="xs" />
      </UFormGroup>

      <!-- Confirmation Direction Filter -->
      <UFormGroup label="Confirmation Direction" size="xs">
        <URadioGroup v-model="direction" :options="directions" size="xs" />
      </UFormGroup>

      <!-- Time Filter -->
      <UFormGroup label="Confirmation Time" size="xs" class="!w-1/2">
        <USelectMenu v-model="selectedSessionTime" :options="sessionTimes" />
      </UFormGroup>

    </div>


    <UDivider class="my-8"/>


    <!-- Charts Section-->
    <div class="grid grid-cols-2 grid-rows-10 gap-2">

      <!-- Median SD Extension Chart -->
      <div class="bg-gray-900/20 ring-1 ring-inset ring-gray-700/25 p-2 rounded-lg text-xs">
        <div class="p-2">
          Median SD Extension
          <h3 class="text-base">1.6x</h3>
        </div>
        <v-chart class="w-full h-full" id="nitro-extension-chart" autoresize />
      </div>




    </div>


  </div>
</template>
