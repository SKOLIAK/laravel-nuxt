<script lang="ts" setup>
import { ref, watch } from 'vue'
import { pasteTrades, PasteObject } from "@/utils/paste_tw";
import { BacktesterObject, BacktesterFolders, useGetFolders, ViewingBacktest, CreatingBacktest, StartCreateBacktest, StartMakeBacktestCopy, EditingBacktest } from '@/utils/backtester'

addEventListener("paste", (e) => {
  pasteTrades(e);
});

watch(PasteObject, (x, y) => {
  if(x.length > 0) {
    BacktesterObject.value = x
  }
})

onBeforeMount(async () => {
  await useGetFolders();
});
</script>

<template>
  <div class="p-4">

    <div class="flex items-center justify-start mb-5">
      <h3>Backtester</h3>
      <span class="bg-primary/20 ring-1 ring-primary/50 text-white font-bold rounded px-1.5 py-0.5 drop-shadow text-xs ml-2">
        {{ BacktesterFolders.length }} Folders
      </span>
    </div>

    <div class="flex items-center justify-start gap-1">
      <UButton color="white">New Folder</UButton>
    </div>


    <div class="bg-gray-900/20 rounded ring-1 ring-gray-700/25 p-2 max-w-72 my-5">
      <div class="p-2 text-xs font-medium text-white" v-for="Folder in BacktesterFolders">
        <div class="flex items-center justify-between bg-gray-700/25 rounded p-2 ring-1 ring-inset ring-gray-700/25">
          {{ Folder.name }}
          <UButton color="white" size="2xs" @click.prevent="StartCreateBacktest()">New Backtest</UButton>
        </div>

        <div v-for="Backtest in Folder.backtests" class="bg-gray-900/50 p-2 flex items-center justify-between">
          {{ Backtest.name }}


          <div class="flex items-center justify-between">
            <UButton color="white" size="2xs" @click.prevent="BacktesterObject = Backtest; ViewingBacktest = true; CreatingBacktest = false">View</UButton>
          </div>

        </div>


      </div>
    </div>




    <div>
      Viewing: {{ ViewingBacktest }}
    </div>
    <div>
      Creating: {{ CreatingBacktest }}
    </div>
    <div>
      Editing: {{ EditingBacktest }}
    </div>

    <UButton color="blue" v-if="ViewingBacktest" @click.prevent="StartMakeBacktestCopy()">Make a copy</UButton>

    <UInput v-if="EditingBacktest" v-model="BacktesterObject.name" />

    <div class="text-xs drop-shadow mt-2">{{ BacktesterObject }}</div>
  </div>
</template>
