<script lang="ts" setup>
  import { futureContractsJson } from "@/utils/contracts";
  import { PasteObject, pasteTrades } from "@/utils/paste_tw";
  import { ModalsNotifyCreateAccount } from "#components";
  import dayjs from "dayjs";

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
    <UDashboardPanel grow>
      <UDashboardNavbar title="Backtesting" class="sticky top-0 bg-white dark:bg-gray-900">
        <template #right>
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
          />
          <UButton
            icon="i-heroicons-plus"
            label="Add"
            size="sm"
            class="btn ml-1.5"
            to="/backtesting/add"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent :ui="{ wrapper: 'overflow-y-visible' }">
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

        <BacktestFolders />

        <AppNoContent v-if="false">
          Use the
          <div class="opener-button primary green inline rounded px-2 py-0.5">Add</div>
          button to start
        </AppNoContent>


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
