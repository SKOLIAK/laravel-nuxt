<script lang="ts" setup>
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')

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

import { selectedMonth } from '@/utils/dateRange'
import { traderTimeZone } from '@/utils/global'

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
