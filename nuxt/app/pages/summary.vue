<script lang="ts" setup>
import dayjs from "dayjs"
import { getGreeting, newActions } from '@/utils/misc'
import { useMountDaily } from "@/utils/utils";
import { amountCase } from "@/utils/global";


import { VisSingleContainer, VisDonut } from '@unovis/vue'

const auth = useAuthStore()

useHead({
  title: 'Summary'
})

onBeforeMount(async () => {
    try {
      await useMountDaily();
    } catch (e) {
      console.warn(e);
    }
  });

const tabItems = [
    {
      label: "Daily",
    },
    {
      label: "Weekly",
    },
  ];

const selectedTab = ref(0);


const dayWinRate = computed(() => {
  let win = 0
  let loss = 0
  let winstreak = 0
  let lossstreak = 0
  let lastType = 0
  let temp = {loaded: false}

  if (JSON.stringify(filteredTrades) != '{}') {
    filteredTrades.forEach(e => {

    if(e.pAndL[amountCase.value + 'Proceeds'] > 0) {
      win += 1
    } else if (e.pAndL[amountCase.value + 'Proceeds'] < 0) {
      loss += 1
    }

    })
  }


  temp.wins = win
  temp.losses = loss
  temp.winstreak = winstreak
  temp.lossstreak = lossstreak
  temp.streak = winstreak != 0 ? winstreak + ' Day Win Streak' : lossstreak != 0 ? lossstreak + ' Day Loss Streak' : 'Total Days Traded ' + (win + loss)
  temp.loaded = true
  temp.percent = useNoDecPercentFormat(win / (win + loss))

  return temp

});
</script>

<template>
  <UDashboardPage>

    <UDashboardPanel
      id="calendar"
      :width="350"
      class="bg-white dark:bg-gray-800 h-[calc(100vh-2em)]"
      :ui="{
        border: 'dark:!border-gray-900'
      }"
    >
      <UDashboardNavbar
        :ui="{
          wrapper: 'dark:!border-gray-900',
          title: 'text-lg font-medium text-black dark:text-white',
        }"
        title="Summary"
      >
        <template #right>
          <UTabs
            v-model="selectedTab"
            :items="tabItems"
            :ui="{
              wrapper: '',
              list: {
                background: 'dark:bg-gray-900',
                height: 'h-9',
                tab: {
                  height: 'h-7', size: 'text-[13px]'
                },

                marker: {
                  background: 'dark:bg-gray-800 ring-1 ring-inset ring-gray-700/25'
                }
              },
            }"
          />
        </template>
      </UDashboardNavbar>

      <div class="overflow-y-auto">
        <!-- Calendar here -->
        <div class="px-4">
          <Calendar :small="true" />
        </div>

        <!-- Day Win % -->
        <div class="ring-1 ring-gray-700/25 bg-gray-900 rounded-lg mx-4 p-1 flex items-center justify-start gap-x-4">
          <template v-if="dayWinRate.wins != 0 && dayWinRate.losses != 0">
            <div class="bg-gray-800 text-gray-200 font-semibold text-3xl tracking-tighter rounded-lg ring-1 ring-inset ring-gray-700/25 px-4 py-2 drop-shadow">
              {{ dayWinRate.percent }}
            </div>

            <div class="text-sm font-medium leading-relaxed">
              <div>
                {{ dayWinRate.streak }}
              </div>

              <p class="text-xs text-gray-500">Of which {{ dayWinRate.wins }}W & {{ dayWinRate.losses }}L</p>

            </div>
          </template>
          <Spinner v-else />
        </div>



      </div>

    </UDashboardPanel>


    <UDashboardPanel grow>


      <UDashboardNavbar class="bg-white dark:bg-gray-800 border-b dark:border-gray-900">
        <template #left>
          <Filters />
        </template>
        <template #right>
          <UDropdown :items="newActions">
            <UButton icon="akar-icons:plus">New</UButton>
          </UDropdown>
        </template>
      </UDashboardNavbar>



      <UDashboardPanelContent>

        <!-- Summary Cards-->
        <Summary :trade="itemTrade" :index="index" v-for="(itemTrade, index) in filteredTrades"/>

      </UDashboardPanelContent>

    </UDashboardPanel>
</UDashboardPage>
</template>
