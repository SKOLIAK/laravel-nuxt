<script setup lang="ts">
  import { dateRange, ranges } from "@/utils/dateRange";
  import { traderTimeZone } from "@/utils/global";
  import { format, isSameDay, sub } from "date-fns";
  import type { Duration } from "date-fns";

  function isRangeSelected(duration: Duration) {
    return (
      isSameDay(dateRange.value.start, sub(new Date().setHours(0, 0, 0, 0), duration)) &&
      isSameDay(dateRange.value.end, new Date().setHours(0, 0, 0, 0))
    );
  }

  function selectRange(duration: Duration) {
    dateRange.value = {
      start: sub(new Date().setHours(0, 0, 0, 0), duration),
      end: new Date().setHours(0, 0, 0, 0),
    };
  }
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
        {{ format(dateRange.start, "d MMM, yyy") }} - {{ format(dateRange.end, "d MMM, yyy") }}
      </UButton>
    </template>

    <template #panel="{ close }">
      <div class="flex items-center divide-gray-200 sm:divide-x dark:divide-gray-800">
        <div class="hidden flex-col py-4 sm:flex">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6 text-sm"
            :class="[
              isRangeSelected(range.duration)
                ? 'dark:bg-primary-800 bg-gray-100'
                : 'dark:hover:bg-primary-800/50 hover:bg-gray-50',
            ]"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <DatePicker
          v-model="dateRange"
          @close="close"
          :rules="rules"
          :timezone="traderTimeZone"
          class="text-xs"
        />
      </div>
    </template>
  </UPopover>
</template>
