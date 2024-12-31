<script setup lang="ts">
import dayjs from 'dayjs'
import { onBeforeMount, onMounted, computed, reactive, ref } from 'vue';
import NoContent from '~/components/app/NoContent.vue';

import { useMountDaily } from '@/utils/utils';
import { filteredTrades, traderTimeZone } from '@/utils/global';
import { useRenderPieChart, useRenderDoubleLineChart } from '@/utils/charts';
import { futureContractsJson } from '@/utils/contracts';

const auth = useAuthStore();
const { $storage } = useNuxtApp();

onBeforeMount(async () => {
  try {
    await useMountDaily()
  } catch(e) {
    console.warn(e)
  }
})


const uploadingScreenshot = ref(false)

function uploadScreenshot(e) {

}


const dailyTabs = [
{
  slot: 'trades',
  label: 'Trades',
}, {
  slot: 'blotter',
  label: 'Blotter',
}, {
  slot: 'screenshtos',
  label: 'Screenshtos',
}, {
  slot: 'diaries',
  label: 'Diaries',
}, {
  slot: '',
  label: '',
}]



const checkDate = ((param1, param2) => {
    //console.log("param 1 "+param1)
    //console.log("param 2 "+param2)
    let tdDateUnix = dayjs(param1 * 1000).tz(traderTimeZone.value)
    let tradeDateUnix = dayjs(param2 * 1000).tz(traderTimeZone.value)
    let check = tdDateUnix.isSame(tradeDateUnix, 'day')
    return check
})

const viewingScreenshot = ref('')
const isViewingScreenshot = ref(false)

function viewScreenshot(src)
{
  viewingScreenshot.value = src
  isViewingScreenshot.value = true
}


const tradeViewData = reactive({
  'id': '',
  ratings: {
    "preparation": 8,
    "entry": 0,
    "stop_loss": 0,
    "target": 0,
    "management": 0,
    "rules": 0
  },
  tags: [],
  screenshot: '',
  note: ''
})

const ratingRates = ref([0,1,2,3,4,5,6,7,8,9,10])

let contractSpecs = {}
const viewTradeOpen = ref(false)
let viewTradeObj = {}
let lastIdentifier = null
const tradeViewLoaded = ref(false)
const tradeViewUpdating = ref(false)

async function updateViewTrade() {
  tradeViewUpdating.value = true
  viewTradeObj = await $fetch('/trades', {
    method: 'PUT',
    body: { 'data': tradeViewData }
  })
  tradeViewUpdating.value = false
}


async function viewTrade(identifier) {
  tradeViewLoaded.value = false
  viewTradeOpen.value = true
  if (lastIdentifier != identifier) {
    viewTradeObj = await $fetch('/trades/' + identifier)

    tradeViewData.id = viewTradeObj.id
    tradeViewData.note = viewTradeObj.note
    tradeViewData.ratings.preparation = viewTradeObj.ratings.preparation
    tradeViewData.ratings.entry = viewTradeObj.ratings.entry
    tradeViewData.ratings.stop_loss = viewTradeObj.ratings.stop_loss
    tradeViewData.ratings.target = viewTradeObj.ratings.target
    tradeViewData.ratings.management = viewTradeObj.ratings.management
    tradeViewData.ratings.rules = viewTradeObj.ratings.rules


    if(viewTradeObj.tags.length != 0) {
      viewTradeObj.tags.forEach((element, x) => {
        let temp = {}
        temp.id = x
        temp.name = element.name
        temp.colors = [element.color,element.text_color]
        tradeViewData.tags[x] = temp
      });
    }

    contractSpecs = futureContractsJson.value.filter(x => x.symbol == viewTradeObj.symbol)
    lastIdentifier = identifier
    tradeViewLoaded.value = true
    console.warn('viewing',viewTradeObj)
  } else {
    tradeViewLoaded.value = true
  }
}

</script>


<template>
  <UDashboardPage>

    <UDashboardPanel grow>
      <UDashboardNavbar title="Daily" class="bg-white">
        <template #right>
          <!-- Actions ... -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white">
        <template #left>
          <Filters />
        </template>
        <template #right>
          <div class="h-max flex items-center justify-center" v-if="!hasData">
            <div class="animate-pulse text-xs font-medium bg-orange-300 ring-1 ring-orange-400 text-orange-900 mt-1.5 py-1 px-2 rounded gap-x-2">
              <UIcon name="tabler:arrow-wave-right-down" />
              Connecting...
            </div>
          </div>
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- Conent ...
         <NoContent />
      -->

      <div class="flex gap-x-4 relative" v-if="hasData">
        <div class="grow w-full">
          <div v-for="(itemTrade, index) in filteredTrades">
            <div class="base-card !p-0 mb-4">
              <div class="p-3">
                  <div class="flex items-center justify-center grow">
                    <div class="font-medium text-gray-700">
                      {{ useCreatedDateFormat(itemTrade.dateUnix) }}
                    </div>

                    <div class="ml-2 mt-1 grow text-gray-500">
                      <UIcon name="tabler:circle-plus" class="cursor-pointer" />
                      <UIcon name="tabler:circle-minus" class="cursor-pointer" />
                    </div>

                    <div class="ml-auto text-xs font-medium text-gray-500 select-none">
                      <span
                          v-if="itemTrade.pAndL != undefined"
                          class="rounded py-0.5 px-2"
                          :class="{
                            'green-trade bg-green-trade': itemTrade.pAndL[amountCase + 'Proceeds'] > 0,
                            'red-trade bg-red-trade': itemTrade.pAndL[amountCase + 'Proceeds'] <= 0
                          }"
                        >
                          Pnl({{ amountCase.charAt(0) }}): {{ useTwoDecCurrencyFormat(itemTrade.pAndL[amountCase + 'Proceeds']) }}
                        </span>
                    </div>
                  </div>

                  <div class="flex text-2xs gap-x-1">
                    ...
                  </div>
            </div>
            <UDivider />
            <div class="p-2">

              <!-- Charts-->
            <div class="flex items-center justify-start gap-x-2">
              <div class="h-20 w-20">
                <div :id="'pieChart' + itemTrade.dateUnix" class="w-full h-full"></div>
              </div>
              <div class="h-24 w-64">
                <div :id="'doubleLineChart' + itemTrade.dateUnix" class="w-full h-full"></div>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 grid-rows-2 gap-4 ml-4 grow text-base font-medium text-center mb-2" v-if="itemTrade.pAndL">
                  <div>
                      <label class="daily-card-info-title">Executions</label>
                      <p>{{ itemTrade.pAndL.executions }}</p>
                  </div>
                  <div class="col-start-1 row-start-2">
                    <label class="daily-card-info-title">Trades</label>
                    <p>{{ itemTrade.pAndL.trades }}</p>
                  </div>
                  <div class="col-start-2 row-start-1">
                    <label class="daily-card-info-title">Wins</label>
                    <p>{{ itemTrade.pAndL.grossWinsCount }}</p>
                  </div>
                  <div class="col-start-2 row-start-2">
                    <label class="daily-card-info-title">Expenses</label>
                    <p>{{ itemTrade.pAndL.grossLossCount }}</p>
                  </div>
                  <div class="col-start-3 row-start-1">
                    <label class="daily-card-info-title">Tot Fees</label>
                    <p>{{ useTwoDecCurrencyFormat(itemTrade.pAndL.commission) }}</p>
                  </div>
                  <div class="row-start-2">
                    <label class="daily-card-info-title"><!-- ... --></label>
                      <p><!-- ... --></p>
                  </div>
              </div>
            </div>
            <!-- Tabs -->

            <UTabs :items="dailyTabs" variant="pill" size="lg" class="mt-4 gap-4" :ui="{ trigger: 'flex-1' }" :default-index="0">
                <template #trades="{ item }">
                  <table class="divide-y divide-gray-200 dark:divide-neutral-700 w-full">
                    <thead>
                        <tr>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Symbol</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Vol</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Position</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Entry</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500 flex gap-x-1 items-center">
                              PnL/Vol
                              <UPopover mode="hover">
                                <UIcon name="mdi:information-variant-circle-outline" size="1.2em"/>
                                <template #panel>
                                <div class="py-2 px-3.5 text-xs text-gray-900 capitalize">
                                  Profit & Loss per unit of security traded (baught or shorted)
                                </div>
                              </template>
                              </UPopover>
                            </th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">PnL(n)</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Tags</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Note</th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"></th>
                            <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-neutral-700 text-sm">

                        <!-- the page loads faster than the video blob => check if blob, that is after slash, is not null, and then load -->
                        <!--<tr v-if="/[^/]*$/.exec(videoBlob)[0]!='null'&&trade.videoStart&&trade.videoEnd">-->

                        <tr v-for="(trade, index2) in itemTrade.trades"
                            class="hover:bg-gray-100 dark:hover:bg-neutral-700 group"
                            >

                            <!--Symbol-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              <button class="bg-white rounded py-2 px-4 text-black flex items-center justify-center gap-x-2"
                              @click="viewTrade(trade.id)">
                                {{ trade.symbol }}
                                <UIcon name="tabler:eye-search" size="1.2em" />
                              </button>
                            </td>

                            <!--Contracts-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{{ trade.strategy.charAt(0).toUpperCase() + trade.strategy.slice(1) == "Long" ? trade.buyQuantity : trade.sellQuantity }}</td>

                            <!--Position-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{
                                    trade.strategy.charAt(0).toUpperCase() +
                                    trade.strategy.slice(1)
                                }}
                            </td>

                            <!--Entry-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              <span v-if="trade.tradesCount == 0">
                                <span v-if="trade.openPosition">
                                  <UTooltip :text="'Swing trade opened on ' + useDateCalFormat(trade.entryTime)">
                                    Open
                                  </UTooltip>
                                </span>
                                <span v-else>
                                  <UTooltip :text="'Swing trade closed on ' + useDateCalFormat(trade.exitTime)">
                                    Closed
                                  </UTooltip>
                                </span>
                              </span>
                              <span v-else>
                                {{ useTimeFormat(trade.entryTime) }}

                                <UTooltip v-if="checkDate(trade.td, trade.entryTime) == false" :text="'Swing trade from ' + useDateCalFormat(trade.entryTime)">
                                  <UIcon name="mdi:information-variant-circle-outline" size="1em" />
                                </UTooltip>

                              </span>
                            </td>

                            <!--P&L/Vol-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <span v-if="trade.tradesCount == 0"></span>
                                <span v-else
                                    v-bind:class="[trade.grossSharePL > 0 ? 'green-trade' : 'red-trade']">{{
                                        useTwoDecCurrencyFormat(trade.grossSharePL)
                                    }}</span>
                            </td>

                            <!--P&L-->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                <span v-if="trade.tradesCount == 0"></span><span v-else
                                    v-bind:class="[trade.netProceeds > 0 ? 'green-trade' : 'red-trade']">
                                    {{ useTwoDecCurrencyFormat(trade.netProceeds)
                                    }}</span>
                            </td>

                            <!--TAGS -->
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              <div
                                  v-for="tag in trade.tags"
                                  class="text-xs inline font-bold py-0.5 px-2 rounded text-white/80"
                                  :style="{'background': tag.color, 'color': tag.text_color}"
                                >
                                <span class="drop-shadow">
                                  {{ tag.name }}
                                </span>
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    <span v-if="trade.note.length > 12">{{
                                        trade.note.substring(0, 12) }}...</span><span
                                        v-else>{{ trade.note }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                              <!-- ~/components/Trades/ViewDetails/AverageRating -->
                              <TradesViewDetailsAverageRating :rating="trade.ratings.average" />
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">

                              <UIcon name="tabler:photo" size="1.2em" v-if="trade.screenshots.length != 0" />
                              <UIcon name="tabler:photo-x" class="text-gray-400" size="1.2em" v-else/>
                            </td>

                        </tr>
                    </tbody>
                </table>
                </template>
            </UTabs>
            </div>
            </div>
          </div>
        </div>
        <div class="ml-auto w-full">
          <Calendar />
        </div>
      </div>




      <USlideover v-model="viewTradeOpen" prevent-close
      :ui="{wrapper: 'top-4 bottom-4 right-4', rounded: 'rounded-xl', translate: { base: 'translate-x-0', right: 'translate-x-4'}, overlay: { background: 'backdrop-blur-xs bg-emerald-950/25'}}">

      <div class="h-screen flex items-center justify-center transition-all duration-500" v-if="!tradeViewLoaded">
        <UIcon name="svg-spinners:eclipse" size="2.5em" />
      </div>
      <UCard
        v-else
        class="flex flex-col flex-1 !overflow-hidden "
        :ui="{ background: 'green-background green-gradient',
        body: { base: 'flex-1 !relative', padding: '' },
        ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        header: { padding: '' } }"
      >
        <template #header>
          <div class="px-4 py-5 sm:px-6 flex items-center justify-between text-white border-t border-r border-white/10 rounded-tr-lg">
            <div>
              <h1 class="text-4xl font-bold">{{ viewTradeObj.symbol }}</h1>
              <div class="font-medium text-2xs">
                {{ contractSpecs[0].name }}
              </div>
              <div class="flex text-2xs gap-x-1 mt-2">
                  <div class="inline font-bold py-0.5 px-2 rounded text-white/80" :style="{'background': tag.color, 'color': tag.text_color}" v-for="tag in viewTradeObj.tags">
                    <span class="drop-shadow">
                      {{ tag.name }}
                    </span>
                  </div>
                  <button
                    class="inline font-bold py-0.5 px-2 rounded text-white/80"
                    @click="alert('Modal to add tags')"
                  >
                    <span class="drop-shadow">
                      <UIcon name="tabler:circle-plus" size="1.5em"/>
                    </span>
                  </button>
              </div>
            </div>

            <UButton color="white" variant="soft" icon="i-heroicons-x-mark-20-solid" class="ml-auto -my-1" @click="viewTradeOpen = false" />
          </div>
        </template>
      <div class="bg-white p-6 h-full w-full flex items-center justify-center transition-all duration-500" v-if="tradeViewUpdating">
        <UIcon name="svg-spinners:eclipse" size="2.5em" />
      </div>
      <div class="bg-white p-6 h-full w-full overflow-y-auto absolute bottom-0" v-else>


        <!-- QUICK STATS -->
        <div class="flex items-center justify-between font-medium text-xs">
          <div>
            <div class="text-gray-700 font-normal">Entered At</div>
            <p>{{ useCreatedDateFormat(viewTradeObj.entryTime) }}</p>
          </div>
          <div>
            <div class="text-gray-700 font-normal">Outcome</div>
            <p
              class="capitalize rounded py-0.5 px-1.5 text-center"
              v-bind:class="[viewTradeObj[amountCase + 'Status'] == 'win' ? 'green-trade bg-green-trade' : 'red-trade bg-red-trade']">
              {{ viewTradeObj[amountCase + 'Status'] }}
            </p>
          </div>
          <div>
            <div class="text-gray-700 font-normal">Duration</div>
            <p class="text-right">{{ useTimeDuration(viewTradeObj.exitTime - viewTradeObj.entryTime) }}</p>
          </div>
          <div>
            <div class="text-gray-700 font-normal">Rating</div>
            <!-- ~/components/Trades/ViewDetails/AverageRating -->
            <TradesViewDetailsAverageRating :rating="viewTradeObj.ratings.average" class="text-right" />
          </div>

        </div>

        <!-- RATINGS -->
          <div class="flex justify-between items-end gap-x-2 mt-4">

            <UFormGroup label="Prep" size="xs">
              <USelect v-model="tradeViewData.ratings.preparation" :options="ratingRates" :disabled="viewTradeObj.ratings.preparation != 0"/>
            </UFormGroup>

            <UFormGroup label="Entry" size="xs">
              <USelect v-model="tradeViewData.ratings.entry" :options="ratingRates" :disabled="viewTradeObj.ratings.entry != 0"/>
            </UFormGroup>

            <UFormGroup label="Stop" size="xs">
              <USelect v-model="tradeViewData.ratings.stop_loss" :options="ratingRates" :disabled="viewTradeObj.ratings.stop_loss != 0"/>
            </UFormGroup>

            <UFormGroup label="Target" size="xs">
              <USelect v-model="tradeViewData.ratings.target" :options="ratingRates" :disabled="viewTradeObj.ratings.target != 0"/>
            </UFormGroup>

            <UFormGroup label="Manage" size="xs">
              <USelect v-model="tradeViewData.ratings.management" :options="ratingRates" :disabled="viewTradeObj.ratings.management != 0"/>
            </UFormGroup>

            <UFormGroup label="Rules" size="xs">
              <USelect v-model="tradeViewData.ratings.rules" :options="ratingRates" :disabled="viewTradeObj.ratings.rules != 0"/>
            </UFormGroup>

          </div>

        <!-- NOTE -->
        <UFormGroup label="Note" size="xs">
          <UTextarea v-model="tradeViewData.note" />
          <div class="flex justify-end mt-4">
            <InputUploadScreenshot
              v-model="tradeViewData.screenshot"
              accept=".png, .jpg, .jpeg, .webp"
              entity="screenshots"
              max-size="5"
            />

            <UButton size="xs" class="ml-auto" @click="updateViewTrade" :loading="tradeViewUpdating">Save</UButton>
          </div>
        </UFormGroup>

        <!-- SCREENSHOTS -->
        <div class="mt-4 relative trade-overview-screenshots overflow-y-auto">
          <div v-for="sc in viewTradeObj.screenshots">
            <img :src="$storage(sc.file)" placeholder @click="viewScreenshot($storage(sc.file))"/>
          </div>
        </div>
      </div>

      </UCard>
      </USlideover>
      </UDashboardPanelContent>

    </UDashboardPanel>
  </UDashboardPage>

  <!-- SCREENSHOT MODAL -->
  <UModal
    v-model="isViewingScreenshot"
    fullscreen
    :ui="{
      overlay: { background: 'backdrop-blur-xs bg-emerald-950/25'},
      background: '',
    }"
  >
    <div class="w-full h-full flex items-center justify-center" @click="isViewingScreenshot = false">
      <NuxtImg :src="viewingScreenshot" class="rounded-lg sm:!w-10/12 !w-10/12 !max-h-fit"/>
    </div>
  </UModal>

</template>
