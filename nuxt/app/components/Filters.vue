<script lang="ts" setup>
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
</script>

<template>
    <!-- ~/components/home/HomeDateRangePicker.vue -->
    <HomeDateRangePicker
      v-model="range"
      class="-ml-2.5"
    />

    <!-- ~/components/home/HomePeriodSelect.vue -->
    <HomePeriodSelect
      v-model="period"
      :range="range"
    />

    <!-- ~/components/home/HomeSelectedRatio.vue -->
    <HomeProceedsSelect />

    <!-- ~/components/home/HomeSelectedRatio.vue -->
    <HomeSelectedRatio />

</template>
