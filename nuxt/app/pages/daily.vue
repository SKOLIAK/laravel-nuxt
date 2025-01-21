<script setup lang="ts">
  import { useRenderDoubleLineChart, useRenderPieChart } from "@/utils/charts";
  import { futureContractsJson } from "@/utils/contracts";
  import { filteredTrades, traderTimeZone } from "@/utils/global";
  import { tags } from "@/utils/tags";
  import { useGetFilteredTrades } from "@/utils/trades";
  import { useMountDaily } from "@/utils/utils";
  import NoContent from "~/components/app/NoContent.vue";
  import dayjs from "dayjs";
  import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
  import Multiselect from "vue-multiselect";

  const auth = useAuthStore();
  const { $storage } = useNuxtApp();


  onBeforeMount(async () => {
    try {
      await useMountDaily();
    } catch (e) {
      console.warn(e);
    }
  });

  const uploadingScreenshot = ref(false);

  function uploadScreenshot(e) {}

  const dailyTabs = [
    {
      slot: "trades",
      label: "Trades",
    },
    {
      slot: "blotter",
      label: "Blotter",
    },
    {
      slot: "screenshots",
      label: "Screenshots",
    },
    {
      slot: "diaries",
      label: "Diaries",
    },
    {
      slot: "",
      label: "",
    },
  ];

  const checkDate = (param1, param2) => {
    //console.log("param 1 "+param1)
    //console.log("param 2 "+param2)
    let tdDateUnix = dayjs(param1 * 1000).tz(traderTimeZone.value);
    let tradeDateUnix = dayjs(param2 * 1000).tz(traderTimeZone.value);
    let check = tdDateUnix.isSame(tradeDateUnix, "day");
    return check;
  };

  const viewingScreenshot = ref("");
  const isViewingScreenshot = ref(false);

  function viewScreenshot(src) {
    viewingScreenshot.value = src;
    isViewingScreenshot.value = true;
  }

  const tradeViewScreenshots = reactive({
    list: [],
  });
  const tradeViewData = reactive({
    id: "",
    ratings: {
      preparation: 8,
      entry: 0,
      stop_loss: 0,
      target: 0,
      management: 0,
      rules: 0,
    },
    tags: [],
    screenshot: "",
    screenshots: [],
    note: "",
  });



  function deleteScreenshot(id) {
  console.log('   ---> Deleting ' + id)
  $fetch("screenshots", {
      method: "DELETE",
      params: {
        screenshot: id,
      },
      ignoreResponseError: true,
      onResponse({ response }) {
        if (response.status !== 200) {
          useToast().add({
            icon: GetErrorIcon,
            color: GetErrorColor,
            title: response._data?.message ?? response.statusText ?? "Something went wrong",
          });
        } else if (response._data?.status == 'ok') {
          let indx = tradeViewData.screenshots.findIndex(x => x == response._data.data)

          useToast().add({
            icon: GetSuccessIcon,
            color: GetSuccessColor,
            title: "Deleted" + indx,
          });
        }
      },
    });
}



  const ratingRates = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  let contractSpecs = {};
  const viewTradeOpen = ref(false);
  let viewTradeObj = {};
  let lastIdentifier = null;
  const tradeViewLoaded = ref(false);
  const tradeViewUpdating = ref(false);

  async function updateViewTrade() {
    tradeViewUpdating.value = true;
    viewTradeObj = await $fetch("/trades", {
      method: "PUT",
      body: { data: tradeViewData },
    });
    await useGetFilteredTrades();
    tradeViewUpdating.value = false;
  }

  async function viewTrade(identifier) {
    tradeViewLoaded.value = false;
    viewTradeOpen.value = true;
    if (lastIdentifier != identifier) {
      viewTradeObj = await $fetch("/trades/" + identifier);

      tradeViewData.id = viewTradeObj.id;
      tradeViewData.note = viewTradeObj.note;
      tradeViewData.ratings.preparation = viewTradeObj.ratings.preparation;
      tradeViewData.ratings.entry = viewTradeObj.ratings.entry;
      tradeViewData.ratings.stop_loss = viewTradeObj.ratings.stop_loss;
      tradeViewData.ratings.target = viewTradeObj.ratings.target;
      tradeViewData.ratings.management = viewTradeObj.ratings.management;
      tradeViewData.ratings.rules = viewTradeObj.ratings.rules;

      tradeViewData.tags = [];
      if (viewTradeObj.tags.length != 0) {
        viewTradeObj.tags.forEach((element, x) => {
          let temp = {};
          temp.id = x;
          temp.name = element.name;
          temp.color = element.color;
          temp.text_color = element.text_color;
          tradeViewData.tags[x] = temp;
        });
      }

      tradeViewData.screenshots = viewTradeObj.screenshots;

      contractSpecs = futureContractsJson.value.filter((x) => x.symbol == viewTradeObj.symbol);
      lastIdentifier = identifier;
      tradeViewLoaded.value = true;
      console.warn("viewing", viewTradeObj);
    } else {
      tradeViewLoaded.value = true;
    }
  }

  const screenshotUpload = ref("");

  watch(screenshotUpload, function () {
    if (screenshotUpload.value != "") {
      tradeViewData.screenshots.unshift({ file: screenshotUpload });
      tradeViewData.screenshot = screenshotUpload;
      console.log("unhsift");
    }
  });

  /******************************************************************
   * TAGS
   * ****************************************************************/
  const isModalTags = ref(false);
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Daily" class="bg-white dark:bg-gray-900">
        <template #right>
          <!-- Actions ... -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white dark:bg-gray-900">
        <template #left>
          <Filters />
        </template>
        <template #right>
          <div class="flex h-max items-center justify-center" v-if="!hasData">
            <div
              class="mt-1.5 animate-pulse gap-x-2 rounded bg-orange-300 px-2 py-1 text-xs font-medium text-orange-900 ring-1 ring-orange-400"
            >
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

        <div class="relative flex gap-x-4 overflow-hidden" v-if="hasData">
          <div class="w-full grow">
            <div v-for="(itemTrade, index) in filteredTrades">
              <div class="base-card mb-4 !p-0">
                <div class="p-3">
                  <div class="flex grow items-center justify-center">
                    <div class="font-medium text-gray-700 dark:text-gray-200">
                      {{ useCreatedDateFormat(itemTrade.dateUnix) }}
                    </div>

                    <div class="ml-2 mt-1 grow text-gray-500">
                      <UIcon name="tabler:circle-plus" class="cursor-pointer" />
                      <UIcon name="tabler:circle-minus" class="cursor-pointer" />
                    </div>

                    <div class="ml-auto select-none text-xs font-medium text-gray-500">
                      <span
                        v-if="itemTrade.pAndL != undefined"
                        class="rounded px-2 py-0.5"
                        :class="{
                          'green-trade bg-green-trade':
                            itemTrade.pAndL[amountCase + 'Proceeds'] > 0,
                          'red-trade bg-red-trade': itemTrade.pAndL[amountCase + 'Proceeds'] <= 0,
                        }"
                      >
                        Pnl({{ amountCase.charAt(0) }}):
                        {{ useTwoDecCurrencyFormat(itemTrade.pAndL[amountCase + "Proceeds"]) }}
                      </span>
                    </div>
                  </div>

                  <div class="text-2xs flex gap-x-1">...</div>
                </div>
                <UDivider />
                <div class="p-2">
                  <!-- Charts-->
                  <div class="flex flex-wrap items-center justify-center gap-x-2">
                    <div class="h-20 w-20 ml-4">
                      <div :id="'pieChart' + itemTrade.dateUnix" class="h-full w-full"></div>
                    </div>
                    <div class="h-24 w-64">
                      <div :id="'doubleLineChart' + itemTrade.dateUnix" class="h-full w-full"></div>
                    </div>

                    <!-- Stats -->
                    <div
                      class="mb-2 ml-4 mt-8 md:mt-0 grid grow grid-cols-3 grid-rows-2 gap-4 text-center text-base font-medium"
                      v-if="itemTrade.pAndL"
                    >
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

                  <UTabs
                    :items="dailyTabs"
                    variant="pill"
                    size="lg"
                    class="mt-4 gap-4"
                    :ui="{ trigger: 'flex-1' }"
                    :default-index="0"
                  >
                    <template #trades="{ item }">
                      <table class="w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Symbol
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Vol
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Position
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Entry
                            </th>
                            <th
                              scope="col"
                              class="flex items-center gap-x-1 px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              PnL/Vol
                              <UPopover mode="hover">
                                <UIcon name="mdi:information-variant-circle-outline" size="1.2em" />
                                <template #panel>
                                  <div class="px-3.5 py-2 capitalize text-gray-900 dark:text-gray-200 text-2xs">
                                    Profit & Loss per unit of security traded (baught or shorted)
                                  </div>
                                </template>
                              </UPopover>
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              PnL(n)
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Tags
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            >
                              Note
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            ></th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                            ></th>
                          </tr>
                        </thead>
                        <tbody class="daily-table divide-y divide-gray-200 dark:divide-gray-700/50">
                          <!-- the page loads faster than the video blob => check if blob, that is after slash, is not null, and then load -->
                          <!--<tr v-if="/[^/]*$/.exec(videoBlob)[0]!='null'&&trade.videoStart&&trade.videoEnd">-->

                          <tr
                            v-for="(trade, index2) in itemTrade.trades"
                            class="group hover:bg-gray-100 dark:hover:bg-neutral-800 mb-1"
                          >
                            <!--Symbol-->
                            <td
                              class="whitespace-nowrap px-6 py-4 font-medium dark:text-neutral-200"
                            >
                              <button
                                class="flex items-center justify-center gap-x-2 rounded bg-white dark:bg-gray-900 dark:text-gray-200 px-4 py-2 text-black"
                                @click="viewTrade(trade.id)"
                              >
                                {{ trade.symbol }}
                                <UIcon name="tabler:eye-search" size="1.2em" />
                              </button>
                            </td>

                            <!--Contracts-->
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              {{
                                trade.strategy.charAt(0).toUpperCase() + trade.strategy.slice(1) ==
                                "Long"
                                  ? trade.buyQuantity
                                  : trade.sellQuantity
                              }}
                            </td>

                            <!--Position-->
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              {{ trade.strategy.charAt(0).toUpperCase() + trade.strategy.slice(1) }}
                            </td>

                            <!--Entry-->
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <span v-if="trade.tradesCount == 0">
                                <span v-if="trade.openPosition">
                                  <UTooltip
                                    :text="
                                      'Swing trade opened on ' + useDateCalFormat(trade.entryTime)
                                    "
                                  >
                                    Open
                                  </UTooltip>
                                </span>
                                <span v-else>
                                  <UTooltip
                                    :text="
                                      'Swing trade closed on ' + useDateCalFormat(trade.exitTime)
                                    "
                                  >
                                    Closed
                                  </UTooltip>
                                </span>
                              </span>
                              <span v-else>
                                {{ useTimeFormat(trade.entryTime) }}

                                <UTooltip
                                  v-if="checkDate(trade.td, trade.entryTime) == false"
                                  :text="'Swing trade from ' + useDateCalFormat(trade.entryTime)"
                                >
                                  <UIcon name="mdi:information-variant-circle-outline" size="1em" />
                                </UTooltip>
                              </span>
                            </td>

                            <!--P&L/Vol-->
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <span v-if="trade.tradesCount == 0"></span>
                              <span
                                v-else
                                v-bind:class="[
                                  trade.grossSharePL > 0 ? 'green-trade' : 'red-trade',
                                ]"
                                >{{ useTwoDecCurrencyFormat(trade.grossSharePL) }}</span
                              >
                            </td>

                            <!--P&L-->
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <span v-if="trade.tradesCount == 0"></span
                              ><span
                                v-else
                                v-bind:class="[trade.netProceeds > 0 ? 'green-trade' : 'red-trade']"
                              >
                                {{ useTwoDecCurrencyFormat(trade.netProceeds) }}</span
                              >
                            </td>

                            <!--TAGS -->
                            <td
                              class="flex items-center justify-start gap-x-1 whitespace-nowrap px-6 py-4 font-medium"
                            >
                              <Tag v-for="tag in trade.tags" :tag="tag"/>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <span v-if="trade.note.length > 12"
                                >{{ trade.note.substring(0, 12) }}...</span
                              ><span v-else>{{ trade.note }}</span>
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <!-- ~/components/Trades/ViewDetails/AverageRating -->
                              <TradesViewDetailsAverageRating :rating="trade.ratings.average" />
                            </td>

                            <td class="whitespace-nowrap px-6 py-4 font-medium">
                              <UIcon
                                name="tabler:photo"
                                size="1.2em"
                                v-if="trade.screenshots.length != 0"
                              />
                              <UIcon
                                name="tabler:photo-x"
                                class="text-gray-400"
                                size="1.2em"
                                v-else
                              />
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

        <USlideover
          v-model="viewTradeOpen"
          prevent-close
          :ui="{
            wrapper: 'top-4 bottom-4 right-4',
            rounded: 'rounded-xl',
            translate: { base: 'translate-x-0', right: 'translate-x-4' },
            overlay: { background: 'bg-backdrop' },
          }"
        >
          <div
            class="flex h-screen items-center justify-center transition-all duration-500"
            v-if="!tradeViewLoaded"
          >
            <UIcon name="svg-spinners:eclipse" size="2.5em" />
          </div>
          <UCard
            v-else
            class="flex flex-1 flex-col !overflow-hidden"
            :ui="{
              background: 'green-background green-gradient',
              body: { base: 'flex-1 !relative', padding: '' },
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              header: { padding: '' },
            }"
          >
            <template #header>
              <div
                class="flex !items-start justify-between rounded-tr-lg border-r border-t dark:border-gray-800/50 border-white/10 px-4 py-5 text-white sm:px-6"
              >
                <div class="w-full">
                  <h1 class="text-4xl font-bold">{{ viewTradeObj.symbol }}</h1>
                  <div class="text-2xs font-medium">
                    {{ contractSpecs[0].name }}
                  </div>
                  <div class="text-sm mt-2 flex items-center justify-start gap-x-1">

                    <Tag v-for="tag in tradeViewData.tags" :tag="tag"/>

                    <UTooltip text="Add or Remove tags" v-if="!isModalTags">
                      <UButton
                        variant="ghost"
                        @click="isModalTags = true"
                        icon="tabler:circle-plus"
                        size="2xs"
                        >Edit</UButton
                      >
                    </UTooltip>
                    <UButton variant="outline" @click="isModalTags = false" size="2xs" icon="tabler:x" v-else
                      >Close</UButton
                    >
                  </div>

                  <div class="my-4 min-h-screen w-full space-x-2" v-if="isModalTags">
                    <Multiselect
                      v-model="tradeViewData.tags"
                      placeholder="Select tags"
                      label="name"
                      track-by="name"
                      :options="tags"
                      :option-height="104"
                      :show-labels="false"
                      :multiple="true"
                    >
                      <template #singleLabel="props">
                        <div
                          class="inline rounded px-2 py-0.5 text-xs font-bold text-white/80"
                          :style="{
                            background: props.option.color,
                            color: props.option.text_color,
                          }"
                        >
                          <span class="drop-shadow">
                            {{ props.option.name }}
                          </span>
                        </div>
                      </template>
                      <template #option="props">
                        <div
                          class="inline rounded px-2 py-0.5 text-xs font-bold text-white/80"
                          :style="{
                            background: props.option.color,
                            color: props.option.text_color,
                          }"
                        >
                          <span class="drop-shadow">
                            {{ props.option.name }}
                          </span>
                        </div>
                      </template>
                    </Multiselect>
                  </div>
                </div>

                <UButton
                  color="white"
                  variant="soft"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1 ml-auto"
                  @click="viewTradeOpen = false"
                />
              </div>
            </template>
            <div
              class="flex h-full w-full items-center justify-center bg-white dark:bg-gray-900 p-6 transition-all duration-500"
              v-if="tradeViewUpdating"
            >
              <UIcon name="svg-spinners:eclipse" size="2.5em" />
            </div>
            <div class="absolute bottom-0 h-full w-full overflow-y-auto bg-white dark:bg-gray-900 p-6" v-else>
              <!-- QUICK STATS -->
              <div class="flex items-center justify-between text-xs font-medium">
                <div>
                  <div class="font-normal text-gray-700 dark:text-gray-500">Entered At</div>
                  <p>{{ useCreatedDateFormat(viewTradeObj.entryTime) }}</p>
                </div>
                <div>
                  <div class="font-normal text-gray-700 dark:text-gray-500">Outcome</div>
                  <p
                    class="rounded px-1.5 py-0.5 text-center capitalize"
                    v-bind:class="[
                      viewTradeObj[amountCase + 'Status'] == 'win'
                        ? 'green-trade bg-green-trade'
                        : 'red-trade bg-red-trade',
                    ]"
                  >
                    {{ viewTradeObj[amountCase + "Status"] }}
                  </p>
                </div>
                <div>
                  <div class="font-normal text-gray-700 dark:text-gray-500">Duration</div>
                  <p class="text-right">
                    {{ useTimeDuration(viewTradeObj.exitTime - viewTradeObj.entryTime) }}
                  </p>
                </div>
                <div>
                  <div class="font-normal text-gray-700 dark:text-gray-500">Rating</div>
                  <!-- ~/components/Trades/ViewDetails/AverageRating -->
                  <TradesViewDetailsAverageRating
                    :rating="viewTradeObj.ratings.average"
                    class="text-right"
                  />
                </div>
              </div>

              <!-- RATINGS -->
              <div class="mt-4 flex items-end justify-between gap-x-2">
                <UFormGroup label="Prep" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.preparation"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.preparation != 0"
                  />
                </UFormGroup>

                <UFormGroup label="Entry" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.entry"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.entry != 0"
                  />
                </UFormGroup>

                <UFormGroup label="Stop" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.stop_loss"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.stop_loss != 0"
                  />
                </UFormGroup>

                <UFormGroup label="Target" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.target"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.target != 0"
                  />
                </UFormGroup>

                <UFormGroup label="Manage" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.management"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.management != 0"
                  />
                </UFormGroup>

                <UFormGroup label="Rules" size="xs">
                  <USelect
                    v-model="tradeViewData.ratings.rules"
                    :options="ratingRates"
                    :disabled="viewTradeObj.ratings.rules != 0"
                  />
                </UFormGroup>
              </div>

              <!-- NOTE -->
              <UFormGroup label="Note" size="xs">
                <UTextarea v-model="tradeViewData.note" autoresize />

                <!-- ACTIONS -->
                <div class="mt-4 flex justify-end">
                  <InputUploadScreenshot
                    entity="screenshots"
                    v-model="screenshotUpload"
                    max-size="10"
                    accept=".png, .jpg, .jpeg, .webp"
                  />

                  <UButton
                    size="xs"
                    class="ml-auto"
                    @click="updateViewTrade"
                    :loading="tradeViewUpdating"
                    >Save</UButton
                  >
                </div>
              </UFormGroup>

              <!-- SCREENSHOTS -->
              <div class="trade-overview-screenshots relative mt-4 overflow-y-auto">
                <div v-for="sc in tradeViewData.screenshots">
                  <div
                    :style="{ 'background-image': 'url(' + $storage(sc.file) + ')' }"
                    class="group relative mb-2 h-full min-h-48 w-full min-w-64 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700/50 dark:bg-gray-900 bg-cover bg-center bg-no-repeat hover:shadow-lg"
                  >
                    <div
                      class="duration-400 absolute bottom-0 left-0 right-0 top-0 flex cursor-pointer select-none items-start justify-end bg-white/10 dark:bg-gray-700/10 p-2 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <UPopover>
                        <UButton color="red" class="z-10" size="2xs">Delete</UButton>
                        <template #panel="{ close }">
                          <div class="text-sm font-medium">
                            <div class="bg-gradient-to-tr from-rose-700 to-rose-600 p-2 text-center text-white">
                              <span class="text-xs drop-shadow-sm">Are you sure?</span>
                            </div>
                            <div
                              class="mt-2 flex items-center justify-between gap-x-2 p-1 px-2 pb-2"
                            >
                              <UButton
                                color="red"
                                class="z-10"
                                size="2xs"
                                @click="deleteScreenshot(sc.id)"
                                >Proceed</UButton
                              >
                              <UButton color="white" class="z-10" size="2xs" @click="close"
                                >Cancel</UButton
                              >
                            </div>
                          </div>
                        </template>
                      </UPopover>
                      <button
                        class="absolute h-full w-full"
                        @click="viewScreenshot($storage(sc.file))"
                      />
                    </div>
                  </div>
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
      overlay: { background: 'bg-backdrop' },
      background: '',
    }"
  >
    <div
      class="flex h-full w-full items-center justify-center"
      @click="isViewingScreenshot = false"
    >
      <NuxtImg :src="viewingScreenshot" class="!max-h-fit !w-10/12 rounded-lg sm:!w-10/12" />
    </div>
  </UModal>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
