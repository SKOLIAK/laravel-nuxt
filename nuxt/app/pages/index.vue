<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'
import VChart from 'vue-echarts';

const items = [[{
  label: 'New mail',
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox'
}, {
  label: 'New user',
  icon: 'i-heroicons-user-plus',
  to: '/users'
}]]

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')

onBeforeMount(async () => {
    await useMountDashboard()

})



</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Dashboard">
        <template #right>

          <UDropdown :items="items">
            <UButton
              icon="i-heroicons-plus"
              size="md"
              class="ml-1.5 rounded-full"
            />
          </UDropdown>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
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

          <HomeProceedsSelect />

        </template>


      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- ~/components/home/HomeChart.vue -->
        <!-- <HomeChart
          :period="period"
          :range="range"
        /> -->

        <div class="chart-card">
          <!-- <ChartCumulativePnl /> -->
           <v-chart id="cumulatedPnl" class="h-full w-full" autoresize />
        </div>



      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
