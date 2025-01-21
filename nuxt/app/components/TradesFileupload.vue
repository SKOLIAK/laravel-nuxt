<script lang="ts" setup>
  import { brokers, selectedBroker, selectedTradovateTier, tradovateTiers } from "@/utils/brokers";
</script>
<template>
  <div class="mx-auto mb-5 flex max-w-sm items-center">
    <label for="file-input" class="sr-only">Choose file</label>

    <USelectMenu v-model="selectedBroker" :options="brokers" class="mr-1" />
    <USelectMenu v-model="selectedTradovateTier" class="min-w-24" :options="tradovateTiers" />

    <label
      for="tradesFileInput"
      class="focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 ml-1 inline-flex flex-shrink-0 cursor-pointer items-center gap-x-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:outline-none focus-visible:outline-0 focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:bg-gray-50 aria-disabled:opacity-75 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 dark:aria-disabled:bg-gray-800"
    >
      <UIcon name="akar-icons:plus" />
      Choose Orders File
      <input
        type="file"
        id="tradesFileInput"
        v-on:change="useImportTrades($event, 'file')"
        class="hidden"
      />
    </label>
  </div>
</template>
