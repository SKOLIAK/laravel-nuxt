<script lang="ts" setup>
import { amountCase } from '@/utils/global'

defineProps({
  trade: {
    type: Object,
    default: {}
  }
})
</script>

<template>
    <!-- QUICK STATS -->
    <div class="flex items-center justify-between text-xs font-medium" v-if="JSON.stringify(trade) != '{}'">
      <div>
        <div class="font-normal text-gray-700 dark:text-gray-500">Entered At</div>
        <p>{{ useCreatedDateFormat(trade.entryTime) }}</p>
      </div>


      <div>
        <div class="font-normal text-gray-700 dark:text-gray-500">Direction</div>
        <p
          class="flex items-center justify-center gap-x-1 rounded px-1.5 py-0.5 text-center capitalize ring-1 ring-inset ring-white/10"
          v-bind:class="[
            trade['strategy'] == 'long'
              ? 'bg-teal-950 text-teal-100'
              : 'bg-orange-950 text-orange-100',
          ]"
        >
          {{ trade['strategy'] == 'long' ? 'Long' : 'Short' }}
          <UIcon :name="trade['strategy'] == 'long' ? 'akar-icons:arrow-up' : 'akar-icons:arrow-down'" />
        </p>
      </div>

      <div>
        <div class="font-normal text-gray-700 dark:text-gray-500">Duration</div>
        <p class="text-right">
          {{ useTimeDuration(trade.exitTime - trade.entryTime) }}
        </p>
      </div>

      <div>
        <div class="font-normal text-gray-700 dark:text-gray-500">Outcome</div>
        <p
          class="rounded px-1.5 py-0.5 text-center capitalize ring-1 ring-inset ring-white/10"
          v-bind:class="[
            trade[amountCase + 'Status'] == 'win'
              ? 'green-trade bg-green-trade'
              : 'red-trade bg-red-trade',
          ]"
        >
          {{ useTwoDecCurrencyFormat(trade[amountCase + "Proceeds"]) }}
        </p>
      </div>


      <div>
        <div class="font-normal text-gray-700 dark:text-gray-500">Rating</div>
        <!-- ~/components/Trades/ViewDetails/AverageRating -->
        <TradesViewDetailsAverageRating
          :rating="trade.ratings.average"
          class="text-right"
        />
      </div>
    </div>


</template>
