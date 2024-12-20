<script lang="ts" setup>
import { brokers, selectedBroker, tradovateTiers, selectedTradovateTier } from '@/utils/brokers';
</script>
<template>
      <div class="max-w-sm mb-5 flex items-center mx-auto">
      <label for="file-input" class="sr-only">Choose file</label>

          <USelect v-model="selectedBroker" :options="brokers" class="mr-1" />
          <USelect v-model="selectedTradovateTier" :options="tradovateTiers"/>

          <label
            for="tradesFileInput"
            class="ml-1 cursor-pointer focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 aria-disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 dark:aria-disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
            >
              <UIcon name="akar-icons:plus" />
              Choose Orders File
              <input type="file" id='tradesFileInput' v-on:change="useImportTrades($event, 'file')" class="hidden" />
          </label>
        </div>
</template>

