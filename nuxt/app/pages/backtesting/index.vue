
<script lang="ts" setup>
const isOpen = ref(false)
const twModalOpen = ref(false)
const symbols = reactive([])

futuresTradovateFees.value.forEach(element => {
  symbols.push(element.symbol + ' - '+ element.name)
});



import { PasteObject, pasteTrades } from '@/utils/paste_tw';

const auth = useAuthStore()












import dayjs from 'dayjs';
const twTestObject = ref({})

var pasted = false
var event = null
let result = null


import { futureContractsJson } from '@/utils/contracts'



import { ModalsNotifyCreateAccount } from '#components'


const modal = useModal()

function openModal() {

  modal.open(ModalsNotifyCreateAccount, {
    onNavigate() {
      modal.close(ModalsNotifyCreateAccount)
    }
  })
}




addEventListener("paste", (e) => {
  if (auth.user.accounts.length > 0) {
    pasteTrades(e)
  } else {
    openModal()
  }
});


function onpaste(event) {}





const SparkleText = () => {
    let index = 0,
      interval = 1600;

    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const animate = (star: HTMLElement) => {
      star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
      star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
    };

    const stars = Array.from(document.getElementsByClassName("magic-star"));
    for (const star of stars) {
      const htmlStar = star as HTMLElement;
      setTimeout(() => {
        animate(htmlStar);

        setInterval(() => animate(htmlStar), 1300);
      }, index++ * (interval / 2));
    }
}







</script>


<template>
  <UDashboardPage>

  <UDashboardPanel grow>
    <UDashboardNavbar title="Backtesting" class="sticky top-0 bg-white">
      <template #right>
        <UTooltip text="Paste TradingView Trades">
          <button class="w-8 h-8" @click="twModalOpen = true">
            <img src="/assets/images/tw.png" class="filter invert">
          </button>
        </UTooltip>
        <UButton
          label="Slideover"
          size="sm"
          color="white"
          class="ml-1.5 btn"
          @click="isOpen = true"
        />
        <UButton
          icon="i-heroicons-plus"
          label="Add"
          size="sm"
          class="ml-1.5 btn"
          to="/backtesting/add"
        />
      </template>
    </UDashboardNavbar>

    <UDashboardPanelContent  :ui="{ wrapper: 'overflow-y-visible' }">




      <DEVBlock>
        <template #title>
          Paste Object:
        </template>
       <template #code>
        {{ PasteObject }}
       </template>
      </DEVBlock>

      <DEVBlock >
        <template #title>
          Accounts:
        </template>
       <template #code>
        {{ auth.user.accounts }}
       </template>
      </DEVBlock>


      <div class="base-card mb-4 flex items-center justify-start gap-x-4" v-for="data in PasteObject">
          <div>
            <div class="font-bold text-blue-600 text-xs">{{ data.symbol }}</div>
            <div class="text-xs">{{ data.symbolOriginal }}</div>
            <div class="text-xs">{{ dayjs.unix(data.entryTime).tz(traderTimeZone.value).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
          <div class="font-bold text-xs text-white rounded py-1 px-2" :class="{'bg-primary-600' : data.strategy == 'long', 'bg-orange-600': data.strategy == 'short'}">
            {{ data.strategy }}
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Risk to Reward Ratio</div>
            <div>{{  data.rrr }}</div>
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Entry Price</div>
            <div>{{  data.entry }}</div>
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Take Profit Price</div>
            <div>{{  data.target }}</div>
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Stop Loss Price</div>
            <div>{{  data.stop }}</div>
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Outcome</div>
            <div class="text-white p-1 rounded" :class="{'bg-orange-600': data.outcome == 'Loss', 'bg-primary': data.outcome == 'Win', 'bg-gray-600': data.outcome == 'BE'}">{{  data.outcome }}</div>
          </div>
          <div class="font-bold text-xs">
            <div class="text-gray-500 font-normal">Gross Proceeds</div>
            <div>{{  useTwoDecCurrencyFormat(data.proceeds) }}</div>
          </div>

        </div>


      <BacktestFolders />







      <AppNoContent v-if="false">
        Use the <div class="opener-button primary green rounded inline py-0.5 px-2">Add</div> button to start
      </AppNoContent>
    </UDashboardPanelContent>

  </UDashboardPanel>
</UDashboardPage>

<USlideover
  :ui="{wrapper: 'inset-[unset] left-0 top-[60px] right-0 bottom-0', width: 'max-w-full', translate: { base: 'translate-y-0 translate-x-0', right: 'translate-y-full rtl:-translate-y-full translate-x-0 rtl:-translate-x-0', }, rounded: 'rounded-xl', overlay: { background: 'backdrop-blur-xs bg-emerald-950/25'}}"
  v-model="isOpen"
  prevent-close
>
  <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Create Backtest
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
      </div>
    </template>

      Slideover content
  </UCard>
</USlideover>

<UModal :ui="{overlay: { background: 'backdrop-blur-sm bg-emerald-950/25'}}" v-model="twModalOpen">
  {{ SparkleText() }}
  <UCard class="relative flex flex-col flex-1 justify-center" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <div class="flex items-center text-4xl justify-center tracking-tight font-medium mb-8 text-gray-7000">
      <span class="tracking-tighter font-bold">
        Let's
        <span class="relative inline-block magic bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Make it Magical
          <UIcon name="lsicon:star-filled" class="magic-star [--size:clamp(20px,1.5vw,30px)] block h-[--size] w-[--size] top-[--star-top] left-[--star-left] absolute animate-starScale text-purple-500" />
          <UIcon name="lsicon:star-filled" class="magic-star [--size:clamp(20px,1.5vw,30px)] block h-[--size] w-[--size] top-[--star-top] left-[--star-left] absolute animate-starScale text-purple-500" />
        </span>


      </span>

    </div>
    <div class="text-center font-normal text-gray-600">
      <div>Press <UKbd>CTRL</UKbd> + <UKbd>V</UKbd> (<UKbd>CMD</UKbd> + <UKbd>V</UKbd> on Mac) to paste trades from TradingView on all pages that have TradingView logo</div>
      <UDivider class="divider my-4" />
      <span class="text-xs text-normal text-gray-600 mt-4">Make sure to adjust the position tool in Tradingview to start at the candle where you entered the trade and end at the candle where you exited the trade. </span>
    </div>

  </UCard>
</UModal>

</template>
