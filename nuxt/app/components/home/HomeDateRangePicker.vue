<script setup lang="ts">
import { sub, format, isSameDay, type Duration } from 'date-fns'
import type { Range } from '~/types'


import { ranges, dateRange } from '@/utils/dateRange'


function isRangeSelected(duration: Duration) {
  return isSameDay(dateRange.value.start, sub(new Date().setHours(0,0,0,0), duration)) && isSameDay(dateRange.value.end, new Date().setHours(0,0,0,0))
}

function selectRange(duration: Duration) {
  dateRange.value = { start: sub(new Date().setHours(0,0,0,0), duration), end: new Date().setHours(0,0,0,0) }
}
const timezone = ref(null);
const rules = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
});
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      >
        {{ format(dateRange.start, 'd MMM, yyy') }} - {{ format(dateRange.end, 'd MMM, yyy') }}
      </UButton>
    </template>

    <template #panel="{ close }">
      <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-primary-800' : 'hover:bg-gray-50 dark:hover:bg-primary-800/50']"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <DatePicker
          v-model="dateRange"
          @close="close"
          :rules="rules"
          :timezone="timezone"
        />
      </div>
    </template>
  </UPopover>
</template>
