<script lang="ts" setup>
  import { selectedMonth } from "@/utils/dateRange";
  import { traderTimeZone } from "@/utils/global";
  import { sub } from "date-fns";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat.js";
  import duration from "dayjs/plugin/duration.js";
  import isoWeek from "dayjs/plugin/isoWeek.js";
  import localizedFormat from "dayjs/plugin/localizedFormat.js";
  import timezone from "dayjs/plugin/timezone.js";
  import updateLocale from "dayjs/plugin/updateLocale.js";
  import utc from "dayjs/plugin/utc.js";
  import type { Period, Range } from "~/types";

  const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() });
  const period = ref<Period>("daily");

  dayjs.extend(utc);

  dayjs.extend(isoWeek);

  dayjs.extend(timezone);

  dayjs.extend(duration);

  dayjs.extend(updateLocale);

  dayjs.extend(localizedFormat);

  dayjs.extend(customParseFormat);

  const route = useRoute();
</script>

<template>
  <!-- ~/components/home/HomeDateRangePicker.vue -->
  <HomeDateRangePicker v-model="range" class="-ml-2.5" />

  <!-- ~/components/home/HomePeriodSelect.vue -->
  <HomePeriodSelect v-model="period" :range="range" v-if="route.path != '/summary'" />

  <!-- ~/components/home/HomeSelectedRatio.vue -->
  <HomeProceedsSelect />

  <!-- ~/components/home/HomeSelectedRatio.vue -->
  <HomeSelectedRatio  v-if="route.path != '/summary'" />
</template>
