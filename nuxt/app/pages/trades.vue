<script setup lang="ts">
import { brokers, selectedBroker, tradovateTiers, selectedTradovateTier } from '@/utils/brokers';
import { trades } from '@/utils/trades';
import dayjs from 'dayjs';

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'email',
  label: 'Email',
  sortable: true
}, {
  key: 'location',
  label: 'Location'
}, {
  key: 'status',
  label: 'Status'
}]

const isNewTradeModalOpen = ref(false)
const sort = ref({ column: 'id', direction: 'asc' as const })

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Trades"
      >
        <template #right>
          <UButton
            label="Import Trades"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="isNewTradeModalOpen = true"
          />
        </template>
      </UDashboardNavbar>



      <UDashboardModal
        v-model="isNewTradeModalOpen"
        title="Import Trades"
        description="Select your orders .csv file"
        :ui="{ width: 'sm:max-w-md' }"
      >
      <div class="max-w-sm mb-5 flex items-center mx-auto">
      <label for="file-input" class="sr-only">Choose file</label>

          <USelect v-model="selectedBroker" :options="brokers" class="mr-1" />
          <USelect v-model="selectedTradovateTier" :options="tradovateTiers"/>

          <label
            for="tradesFileInput"
            class="ml-1 cursor-pointer focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 aria-disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 dark:aria-disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"
            >
              <UIcon name="akar-icons:paper" />
              Choose Orders File
              <input type="file" id='tradesFileInput' v-on:change="useImportTrades($event, 'file')" class="hidden" />
          </label>
        </div>
      </UDashboardModal>

      <div class="h-max w-full overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-auto">
                <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Account
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Volume & Symbol
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Gross
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Net
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-800" v-for="data in trades['1733720400']">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <div class="text-xs">{{ data.account }}
                                <small class="text-blue-500 font-bold text-4xs" v-if="data.strategy == 'long'">
                                    Long <UIcon name="octicon:arrow-up-right-16" class="w-3 h-3" />
                                </small>
                                <small class="text-red-500 font-bold text-4xs"v-if="data.strategy == 'short'">
                                    Short <UIcon name="octicon:arrow-down-right-16" class="w-3 h-3" />
                                </small>
                            </div>
                            <div class="text-xs dark:text-white/30 text-black/30">
                                {{ dayjs(data.entryTime)  }}
                                <UIcon name="octicon:arrow-right-24" />
                                {{ dayjs(data.exitTime) }}
                            </div>

                        </th>
                        <td class="px-6 py-4 flex flex-wrap items-center">
                            <h1 class="text-blue-500 mr-1 text-2xl">{{ data.strategy == 'long' ? data.buyQuantity : data.sellQuantity }}</h1>
                            <div class="font-medium text-xs mr-auto">{{ data.symbolDescription }}
                            <small class="block text-xs text-black/30 dark:text-white/30">{{ data.symbol }}
                                <span>- {{ data.symbolOriginal }}</span>
                            </small>
                            </div>
                        </td>
                        <td class="px-6 py-4">


                            <div class="font-medium">{{ data.grossProceeds.toFixed(2) }} {{ data.currency }}</div>
                            <small class="text-gray-500 font-medium">-{{ data.commission.toFixed(2) }} {{ data.currency }}</small>
                        </td>
                        <td class="px-4 py-2">
                            <div class="font-medium p-2 rounded inline text-xs" :class="{'red-trade': data.netProceeds < 0, 'green-trade': data.netProceeds >= 0}">
                                {{ data.netProceeds.toFixed(2) }} {{ data.currency }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
      </div>

<!--

      <UTable
        :rows="trades"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              v-bind="row.avatar"
              :alt="row.name"
              size="xs"
            />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :label="row.status"
            :color="row.status === 'subscribed' ? 'green' : row.status === 'bounced' ? 'orange' : 'red'"
            variant="subtle"
            class="capitalize"
          />
        </template>
      </UTable> -->
    </UDashboardPanel>
  </UDashboardPage>
</template>
