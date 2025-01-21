<script lang="ts" setup>
defineProps({
  trade: Object
})
</script>

<template>
<div
  class="mb-2 ml-4 mt-8 md:mt-0 grid grow grid-cols-3 grid-rows-2 gap-4 text-center text-base font-medium"
  v-if="trade && trade.pAndL"
>
  <div>
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      Executions
    </label>
    <p>{{ trade.pAndL.executions }}</p>
  </div>
  <div class="col-start-1 row-start-2">
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      Trades
    </label>
    <p>{{ trade.pAndL.trades }}</p>
  </div>
  <div class="col-start-2 row-start-1">
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      Wins
    </label>
    <p>{{ trade.pAndL.grossWinsCount }}</p>
  </div>
  <div class="col-start-2 row-start-2">
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      Expenses

    </label>
    <p>{{ trade.pAndL.grossLossCount }}</p>
  </div>
  <div class="col-start-3 row-start-1">
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      Tot. Fees

    </label>
    <p>{{ useTwoDecCurrencyFormat(trade.pAndL.commission) }}</p>
  </div>
  <div class="row-start-2">
    <label class="text-sm text-gray-400 font-normal drop-shadow">
      <!-- ... -->
    </label>
    <p><!-- ... --></p>
  </div>
</div>
</template>
