<script setup>
  import { brokers, selectedBroker, selectedTradovateTier, tradovateTiers } from "@/utils/brokers";
  import { trades } from "@/utils/trades";

  let file = null;
  function handleFileUpload(event) {
    if (!selectedTradovateTier.value) {
      useToast().add({
        icon: "octicon:info-16",
        title: "Select commission plan first",
        color: "primary",
      });
    } else {
      file = event.target.files[0];
    }
  }
</script>

<template>
  <div>
    <div class="mb-5 max-w-sm">
      <label for="file-input" class="sr-only">Choose file</label>
      <input
        type="file"
        id="tradesFileInput"
        accept=".csv"
        v-on:change="useImportTrades($event, 'file')"
        class="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-neutral-400"
      />
    </div>
    <div class="flex">
      <URadioGroup v-model="selectedBroker" legend="Brokers" :options="brokers" class="mr-5" />
      <URadioGroup
        v-model="selectedTradovateTier"
        legend="Commission Plan"
        :options="tradovateTiers"
      />
    </div>
  </div>

  <div class="relative mt-5 overflow-x-auto rounded">
    <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <thead class="bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Account</th>
          <th scope="col" class="px-6 py-3">Volume & Symbol</th>
          <th scope="col" class="px-6 py-3">Gross</th>
          <th scope="col" class="px-6 py-3">Net</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
          v-for="data in trades['1733720400']"
        >
          <th
            scope="row"
            class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
          >
            <div class="text-xs">
              {{ data.account }}
              <small class="text-4xs font-bold text-blue-500" v-if="data.strategy == 'long'">
                Long <UIcon name="octicon:arrow-up-right-16" class="h-3 w-3" />
              </small>
              <small class="text-4xs font-bold text-red-500" v-if="data.strategy == 'short'">
                Short <UIcon name="octicon:arrow-down-right-16" class="h-3 w-3" />
              </small>
            </div>
            <div class="text-xs text-black/30 dark:text-white/30">
              Open time
              <UIcon name="octicon:arrow-right-24" />
              Close time
            </div>
          </th>
          <td class="flex flex-wrap items-center px-6 py-4">
            <h1 class="mr-1 text-2xl text-blue-500">
              {{ data.strategy == "long" ? data.buyQuantity : data.sellQuantity }}
            </h1>
            <div class="mr-auto text-xs font-medium">
              {{ data.symbolDescription }}
              <small class="block text-xs text-black/30 dark:text-white/30"
                >{{ data.symbol }}
                <span>- {{ data.symbolOriginal }}</span>
              </small>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="font-medium">{{ data.grossProceeds.toFixed(2) }} {{ data.currency }}</div>
            <small class="font-medium text-gray-500"
              >-{{ data.commission.toFixed(2) }} {{ data.currency }}</small
            >
          </td>
          <td class="px-4 py-2">
            <div
              class="inline rounded p-2 text-xs font-medium"
              :class="{
                'bg-black/20 text-gray-200': data.netProceeds < 0,
                'bg-primary-500 text-white': data.netProceeds >= 0,
              }"
            >
              {{ data.netProceeds.toFixed(2) }} {{ data.currency }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
