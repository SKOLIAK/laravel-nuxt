<script lang="ts" setup>
  import { futureContractsJson } from "@/utils/contracts";
  import { spinnerLoadingPage, timeZones } from "@/utils/global";
  import { PasteObject, pasteTrades } from "@/utils/paste_tw";
  import { ModalsNotifyCreateAccount } from "#components";
  import dayjs from "dayjs";



  import { ObjectData, createBacktest, ViewingBacktest, ViewBacktestData, CreatingBacktest, CreateBacktestData, newBacktestData, getSessionGain, makingBacktestCopy } from '~/utils/backtests'



  function newBacktest(data) {
    newBacktestData.group = data
    CreatingBacktest.value = true
  }






  const isOpen = ref(false);
  const twModalOpen = ref(false);
  const symbols = reactive([]);

  futuresTradovateFees.value.forEach((element) => {
    symbols.push(element.symbol + " - " + element.name);
  });

  const auth = useAuthStore();

  const twTestObject = ref({});

  var pasted = false;
  var event = null;
  let result = null;

  const modal = useModal();

  function openModal() {
    modal.open(ModalsNotifyCreateAccount, {
      onNavigate() {
        modal.close(ModalsNotifyCreateAccount);
      },
    });
  }

  addEventListener("paste", (e) => {
    if (auth.user.accounts.length > 0) {
      pasteTrades(e);
    } else {
      openModal();
    }
  });

  function onpaste(event) {}

  const SparkleText = () => {
    let index = 0,
      interval = 1600;

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const animate = (star: HTMLElement) => {
      star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
      star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
    };

    const stars = Array.from(document.getElementsByClassName("magic-star"));
    for (const star of stars) {
      const htmlStar = star as HTMLElement;
      setTimeout(
        () => {
          animate(htmlStar);

          setInterval(() => animate(htmlStar), 1300);
        },
        index++ * (interval / 2)
      );
    }
  };
</script>

<template>

<UDashboardPage>

<UDashboardPanel
  :width="280"
  class="bg-white dark:bg-gray-800 h-[calc(100vh-2em)]"
  :ui="{
    border: 'dark:!border-transparent'
  }"
>
  <UDashboardNavbar
    :ui="{
      wrapper: 'dark:!border-gray-900',
      title: 'text-lg font-medium text-black dark:text-white',
    }"
    title="Backtesting"
  >
    <template #right>
      <UButton
        icon="i-heroicons-plus"
        label="New Folder"
        size="sm"
        color="white"
        @click="$refs.Folders.newGroup()"
        :disabled="spinnerLoadingPage"
      />
    </template>
  </UDashboardNavbar>

  <div class="overflow-y-auto" :class="{'opacity-50': spinnerLoadingPage}">
    <!-- ~/components/Backtest/Folders.vue -->
    <BacktestFolders ref="Folders" v-model="ObjectData" @create="createBacktest"/>

  </div>

</UDashboardPanel>

<UDashboardPanel grow>

  <UDashboardNavbar
    class="bg-white dark:bg-gray-800 border-b dark:border-gray-900"
    :title="ViewingBacktest ? ViewBacktestData.name ?? '' : ''"
  >

    <template #left>

      <template v-if="CreatingBacktest">
        <div class="flex items-center justify-start gap-x-2">
          <UInput placeholder="Name your backtest..." v-model="newBacktestData.name" :autocomplete="false" class="w-full font-medium" type="text"/>

          <span class="text-black opacity-70">/</span>
          <span class="text-xs font-medium">in: </span>
          <div
            class="flex-shrink-0 flex items-center gap-x-1 text-xs font-medium py-0.5 px-1.5 rounded ring-1 ring-inset ring-white/10 drop-shadow"
            :style="{'background-color': newBacktestData.group.color }"
          >
            <UIcon name="solar:folder-2-bold-duotone" class="w-3 h-3" />
            {{ newBacktestData.group.name }}
          </div>
        </div>
      </template>


    </template>


    <template #right>
      <!-- Actions if cating a new backtest -->
      <template v-if="ViewingBacktest && !CreatingBacktest">

        <UButton label="Make a copy" @click="makingBacktestCopy = true" />

      </template>

      <template v-if="CreatingBacktest">

        <UTooltip text="Cancel Backtest Creation">
          <UButton
            icon="i-heroicons-x-mark-20-solid"
            size="sm"
            color="white"
            @click.prevent="CreatingBacktest = false"
          />
        </UTooltip>
      </template>

      <!-- Otherwise... -->
      <template v-else>
        <UTooltip text="Paste TradingView Trades">
          <button class="h-8 w-8" @click="twModalOpen = true">
            <img src="/assets/images/tw.png" class="invert filter dark:invert-0" />
          </button>
        </UTooltip>

        <UButton
          label="Slideover"
          size="sm"
          color="white"
          class="btn ml-1.5"
          @click="isOpen = true"
          :disabled="spinnerLoadingPage"
        />
        <UButton
          icon="i-heroicons-plus"
          label="Add"
          size="sm"
          class="btn ml-1.5"
          to="/backtesting/add"
          :disabled="spinnerLoadingPage"
        />
      </template>


    </template>
  </UDashboardNavbar>



  <UDashboardPanelContent class="border-l border-gray-900">


    <UModal v-model="makingBacktestCopy">
      <div class="p-4">
        {{ backtestCopy }}
      </div>
    </UModal>







    {{  ObjectData }}

    <hr />
    {{ ViewBacktestData }} {{ ViewingBacktest }}


    <template v-if="CreatingBacktest || ViewingBacktest">

      <div class="grid grid-cols-2 gap-4">
        <div class="row-span-2">
          <div class="flex items-center text-xs justify-between flex-shrink-0 mb-4 py-2 text-center px-2 rounded ring-1 ring-inset ring-white/10 bg-gray-700">
            <div>
              <h3 class="text-gray-500 font-medium text-xs">Starting Balance</h3>
              <div class="font-bold">{{ useTwoDecCurrencyFormat(ObjectData.starting_balance) }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Account Total</h3>
              <div class="font-bold">{{ useTwoDecCurrencyFormat(ObjectData.ending_balance) }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Gain (%)</h3>
              <div class="font-bold">{{ useTwoDecPercentFormat(ObjectData.gain) }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Win Rate</h3>
              <div class="font-bold">
                {{ useTwoDecPercentFormat(ObjectData.percentage) }}
              </div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">W</h3>
              <div class="font-bold">{{ ObjectData.wins }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">L</h3>
              <div class="font-bold">{{ ObjectData.losses }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">BE</h3>
              <div class="font-bold">{{ ObjectData.break_evens }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Trades</h3>
              <div class="font-bold" v-if="ObjectData.trades">{{ ObjectData.trades.length }}</div>
              <div class="font-bold" v-else>0</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Tot. R</h3>
              <div class="font-bold">{{ useTwoDecFormat(ObjectData.totalR) }}</div>
            </div>

            <div>
              <h3 class="text-gray-500 font-medium text-xs">Avg. R</h3>
              <div class="font-bold" v-if="ObjectData.totalR > 0 && ObjectData.trades">
                {{ useTwoDecFormat(ObjectData.totalR / ObjectData.trades.length) }}
              </div>
              <div class="font-bold" v-else>0</div>
            </div>
          </div>

          <!-- <div>
            Traded Symbols:
            {{ newBacktestData.symbols }}
          </div> -->


          <!-- Session statistics -->
          <div class="flex items-center justify-start mb-4 gap-x-2 drop-shadow">
            <button
              class="rounded ring-1 ring-inset ring-white/10 bg-gray-700 text-sm p-2  transition-all duration-300 hover:ring-white/30"
              v-for="session in tradingSessions"
            >
              <h3
              class="font-bold text-xs text-black/70 drop-shadow text-center ring-1 ring-inset ring-white/10 rounded px-1.5 py-0.5"
              :style="{ 'background-color': session.color }"
              >
                {{ session.name }} Overall
                <span  v-if="ObjectData.trades.filter(x => x.session == session.name).length > 0">
                  ({{
                  useTwoDecPercentFormat(
                    ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'Win').length /
                  (ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'Win').length +
                  ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'Loss').length)
                  )
                  }})
                </span>
                <span v-else>0%</span>
              </h3>
              <div class="grid grid-cols-5 grid-rows-1 gap-1 text-center text-xs mt-2 drop-shadow">
                <div class="px-1.5 py-0.5 text-gray-400 text-2xs" title="Total Number of Trades">#T</div>
                <div class="px-1.5 py-0.5 text-gray-400 text-2xs" title="Total Winning Trades">W</div>
                <div class="px-1.5 py-0.5 text-gray-400 text-2xs" title="Total Losing Trades">L</div>
                <div class="px-1.5 py-0.5 text-gray-400 text-2xs" title="Total Break Even Trades">BE</div>
                <div class="px-1.5 py-0.5 text-gray-400 text-2xs" title="Total Gain Percentage">%</div>
                <div class="px-1.5 py-0.5 font-medium">
                  {{ ObjectData.trades.filter(x => x.session == session.name).length }}
                </div>
                <div class="px-1.5 py-0.5 font-medium">
                  {{ ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'Win').length }}
                </div>
                <div class="px-1.5 py-0.5 font-medium">
                  {{ ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'Loss').length }}
                </div>
                <div class="px-1.5 py-0.5 font-medium">
                  {{ ObjectData.trades.filter(x => x.session == session.name && x.outcome == 'BE').length }}
                </div>

                <div class="px-1.5 py-0.5 font-medium">
                  {{ useTwoDecPercentFormat(getSessionGain(session.name)) }}
                </div>
              </div>
            </button>

            <!-- end -->

        </div>
        <!-- end row -->

        </div>
        <div class="row-span-2">
          <h3 class="text-xs">Execution</h3>
          <div class="h-full w-full px-1.5 py-0.5 text-white text-sm">
            <div class="bg-gray-700 mb-1 mr-1 inline-block drop-shadow text-center ring-1 ring-inset ring-white/10 rounded px-1.5 py-0.5 text-xs font-medium">
              <span class="opacity-50">Stop Loss:</span>
              +2tks DR Level
            </div>

            <div class="bg-gray-700 mb-1 mr-1 inline-block drop-shadow text-center ring-1 ring-inset ring-white/10 rounded px-1.5 py-0.5 text-xs font-medium">
              <span class="opacity-50">RR:</span>
              Variable
            </div>

            <div class="bg-gray-700 mb-1 mr-1 inline-block drop-shadow text-center ring-1 ring-inset ring-white/10 rounded px-1.5 py-0.5 text-xs font-medium">
              <span class="opacity-50">Take Profit:</span>
              First half of DR Session: Next SD Level |
              Second half of DR Session: DR High/Low
            </div>

          </div>
        </div>
    </div>

    <!-- Trades List -->
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Symbol</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Session</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Date</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Direction</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Outcome</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Realised RR</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">RR</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Result</th>
                  <th scope="col" class="px-3 py-1.5 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Gain</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                <tr v-for="trade in newBacktestData.trades">
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">{{ trade.symbol }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">{{ trade.session }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">
                    {{ dayjs.unix(trade.entryTime).tz(timeZones[0]).format("DD/MM/YY") }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200 capitalize">
                    {{ trade.strategy }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">{{ trade.outcome }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">{{ trade.rrr }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">{{ trade.projected_rrr }}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium">
                    {{ useTwoDecCurrencyFormat(trade.proceeds) }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-800 dark:text-neutral-200">
                    {{ useTwoDecPercentFormat(trade.gain) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>




    </template>
    <template v-else>





    <div v-if="ViewingBacktest" class="text-xs group flex items-center justify-center gap-x-4 rounded-lg border border-dashed border-emerald-600 bg-emerald-950 px-4 py-3 font-medium text-emerald-300 transition-all duration-200 hover:border-emerald-400">
    <UIcon name="solar:info-square-broken" size="2em" />
    <div>
      You're trying to view <span class="underline capitalize">{{ ViewBacktestData.name }}</span> backtest
    </div>
  </div>










        <div
          class="base-card mb-4 flex items-center justify-start gap-x-4"
          v-for="data in PasteObject"
        >
          <div>
            <div class="text-xs font-bold text-blue-600">{{ data.symbol }}</div>
            <div class="text-xs">{{ data.symbolOriginal }}</div>
            <div class="text-xs">
              {{
                dayjs.unix(data.entryTime).tz(traderTimeZone.value).format("YYYY-MM-DD HH:mm:ss")
              }}
            </div>
          </div>
          <div
            class="rounded px-2 py-1 text-xs font-bold text-white"
            :class="{
              'bg-primary-600': data.strategy == 'long',
              'bg-orange-600': data.strategy == 'short',
            }"
          >
            {{ data.strategy }}
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Risk to Reward Ratio</div>
            <div>{{ data.rrr }}</div>
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Entry Price</div>
            <div>{{ data.entry }}</div>
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Take Profit Price</div>
            <div>{{ data.target }}</div>
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Stop Loss Price</div>
            <div>{{ data.stop }}</div>
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Outcome</div>
            <div
              class="rounded p-1 text-white"
              :class="{
                'bg-orange-600': data.outcome == 'Loss',
                'bg-primary': data.outcome == 'Win',
                'bg-gray-600': data.outcome == 'BE',
              }"
            >
              {{ data.outcome }}
            </div>
          </div>
          <div class="text-xs font-bold">
            <div class="font-normal text-gray-500">Gross Proceeds</div>
            <div>{{ useTwoDecCurrencyFormat(data.proceeds) }}</div>
          </div>
        </div>

    <AppNoContent>
      Use the
      <div class="opener-button primary green inline rounded px-2 py-0.5">Add</div>
      button to start
    </AppNoContent>




    <DEVBlock>
          <template #title> Paste Object: </template>
          <template #code>
            {{ PasteObject }}
          </template>
        </DEVBlock>

        <DEVBlock>
          <template #title> Accounts: </template>
          <template #code>
            {{ auth.user.accounts }}
          </template>
        </DEVBlock>


      </template>
  </UDashboardPanelContent>

</UDashboardPanel>
</UDashboardPage>



  <USlideover
    :ui="{
      wrapper: 'inset-[unset] left-0 top-[60px] right-0 bottom-0',
      width: 'max-w-full',
      translate: {
        base: 'translate-y-0 translate-x-0',
        right: 'translate-y-full rtl:-translate-y-full translate-x-0 rtl:-translate-x-0',
      },
      rounded: 'rounded-xl',
      overlay: { background: 'backdrop-blur-xs bg-emerald-950/25' },
    }"
    v-model="isOpen"
    prevent-close
  >
    <UCard
      class="flex flex-1 flex-col"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Create Backtest
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      Slideover content
    </UCard>
  </USlideover>

  <UModal
    :ui="{ overlay: { background: 'backdrop-blur-sm bg-emerald-950/25' } }"
    v-model="twModalOpen"
  >
    {{ SparkleText() }}
    <UCard
      class="relative flex flex-1 flex-col justify-center"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <div
        class="text-gray-7000 mb-8 flex items-center justify-center text-4xl font-medium tracking-tight"
      >
        <span class="font-bold tracking-tighter">
          Let's
          <span
            class="magic relative inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Make it Magical
            <UIcon
              name="lsicon:star-filled"
              class="magic-star animate-starScale absolute left-[--star-left] top-[--star-top] block h-[--size] w-[--size] text-purple-500 [--size:clamp(20px,1.5vw,30px)]"
            />
            <UIcon
              name="lsicon:star-filled"
              class="magic-star animate-starScale absolute left-[--star-left] top-[--star-top] block h-[--size] w-[--size] text-purple-500 [--size:clamp(20px,1.5vw,30px)]"
            />
          </span>
        </span>
      </div>
      <div class="text-center font-normal text-gray-600">
        <div>
          Press <UKbd>CTRL</UKbd> + <UKbd>V</UKbd> (<UKbd>CMD</UKbd> + <UKbd>V</UKbd> on Mac) to
          paste trades from TradingView on all pages that have TradingView logo
        </div>
        <UDivider class="divider my-4" />
        <span class="text-normal mt-4 text-xs text-gray-600"
          >Make sure to adjust the position tool in Tradingview to start at the candle where you
          entered the trade and end at the candle where you exited the trade.
        </span>
      </div>
    </UCard>
  </UModal>








</template>
