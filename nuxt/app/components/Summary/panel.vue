<script lang="ts" setup>
import { ModalsViewTrade } from "#components"

const modal = useModal()


function modalViewTrade(trade_identifier) {
  modal.open(ModalsViewTrade, {
    identifier: trade_identifier
  })
}

defineProps({
  trade: Object,
  index: Number
})

function removeTag(_tag_id, _on) {
  console.warn('remove tag', _tag_id, _on)
}

function addTag() {
  console.warn('Want to add a tag to a day, open modal to choose')
}

</script>

<template>
  <div
    v-if="JSON.stringify(trade) != '{}'"
    class="bg-gray-900 ring-1 rounded-lg p-1 mb-4"
    :class="{'ring-rose-500/70': trade.rating == 2, 'ring-primary/70': trade.rating == 1, 'ring-gray-700/25': trade.rating == 0}"
  >
    <!-- Header -->
    <div class="py-2 px-4">

      <!-- Date & Pnl Row -->
      <div class="flex items-center justify-between text-sm font-semibold">

        <!-- Date & Votes -->
        <div class="flex items-center justify-start">

          <span class="mr-4">
            {{ useCreatedDateFormat(trade.dateUnix) }}
          </span>

          <!-- Upvoting & Downvoting -->
          <SummaryVote :trade="trade" v-model="trade.rating" />

        </div>

        <!-- Pnl -->
        <div
          class="rounded ring-1 ring-inset py-0.5 px-2 ring-white/10 text-xs"
          v-if="trade.pAndL != undefined"
          :class="{
            'green-trade bg-green-trade': trade.pAndL[amountCase + 'Proceeds'] > 0,
            'red-trade bg-red-trade': trade.pAndL[amountCase + 'Proceeds'] <= 0,
          }">
            Pnl({{ amountCase.charAt(0) }}):
            {{ useTwoDecCurrencyFormat(trade.pAndL[amountCase + "Proceeds"]) }}
        </div>


      </div>

      <!-- Tag Row -->
      <div class="flex items-center justify-start gap-1 mt-1">
        <Tag :tag="tag" v-for="tag in trade.tags" v-on:deleteTag="removeTag(tag.id, trade.dateUnix)" :deletable="true"/>
        <AddTag v-on:addTag="addTag" />
      </div>
    </div>

    <!-- Content -->
    <div class="bg-gray-800 rounded-lg ring-1 ring-inset ring-gray-700/25 p-4">

      <div class="flex items-center justify-start gap-x-4">
        <!-- Win Rate Chart -->
        <div class="h-20 w-20 ml-4">
          <div :id="'pieChart' + trade.dateUnix" class="h-full w-full"></div>
        </div>

        <!-- Pnl By Time -->
        <div class="h-24 w-64">
          <div :id="'doubleLineChart' + trade.dateUnix" class="h-full w-full"></div>
        </div>

        <!-- Misc Stats Grid -->
        <SummaryStats :trade="trade" />
      </div>

      <!-- TEST COMPONENT -->
      <div v-for="t in trade.trades">
        <UButton size="2xs" color="gray" @click="modalViewTrade(t.id)">View</UButton>
        {{ t.symbol }} <small>({{ t.id }})</small>

      </div>

      <slot />
    </div>


  </div>
</template>
