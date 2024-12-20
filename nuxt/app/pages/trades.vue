<script setup lang="ts">
import { TradesData, trades, blotter } from '@/utils/trades';
import dayjs from 'dayjs';


onMounted(async() => {
  await useGetExistingTradesArray()
  await useGetExistingAccounts()
})

const isNewTradeModalOpen = ref(false)

async function removeTrades() {
  console.log('Canceling trades')
  TradesData.splice(0)
  for (var blot in blotter) delete blotter[blot];
  for (var p in pAndL) delete pAndL[p];

  if (Object.keys(blotter) == 0) {
    useToast().add({
        icon: GetSuccessIcon,
        title: "Trade data has been cleared",
        color: GetSuccessColor,
    })
  } else {
    useToast().add({
      icon: GetInfoIcon,
      title: "Please reload the page",
      color: GetInfoColor,
    })
  }


}

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
        <!-- ./components/Trades/FileUpload.vue -->
        <TradesFileupload />
      </UDashboardModal>

      <UDashboardToolbar class="bg-orange-500/50" v-if="existingImports.length != 0">
        <template #left>
          <div class="font-medium text-xs text-white text-shadow">
            Following dates are already imported: <span v-for="(item, index) in existingImports">
                <span v-if="index > 0">, </span>{{ useDateCalFormat(item) }}</span>
          </div>
        </template>
      </UDashboardToolbar>

      <UDashboardToolbar class="bg-primary-500/25 dark:bg-primary-500/10" v-if="Object.keys(blotter).length > 0 && Object.keys(pAndL).length > 0">
        <template #left>
          <div class="font-medium text-xs text-primary-900/90 dark:text-white dark:text-shadow" v-for="(execution, index) in executions">
            {{ useCreatedDateFormat(index) }}
          </div>
        </template>
      </UDashboardToolbar>
      <div
        v-if="Object.keys(blotter).length > 0 && Object.keys(pAndL).length > 0"
        v-for="(execution, index) in executions"
      >
      <div v-if="blotter[index]">

      <div class="h-max w-full overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-600 dark:text-gray-400 overflow-auto">
                <thead class="text-xs text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Symbol
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Volume
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Gross P&L
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Commissions
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Fess
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Net P&L
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Wins (g)
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Loss (g)
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Trades
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Executions
                        </th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-for="blot in blotter[index]" class="text-xs bg-white border-b dark:bg-gray-900 dark:border-gray-800">
                            <td class="px-6 py-4">{{ blot.symbol }}</td>
                            <td class="px-6 py-4">{{ useDecimalsArithmetic(blot.buyQuantity, blot.sellQuantity) }}</td>
                            <td v-bind:class="[blot.grossProceeds > 0 ? 'green-trade' : 'red-trade']">
                                {{ (blot.grossProceeds).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ (blot.commission).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ (blot.fees).toFixed(2) }}</td>
                            <td class="px-6 py-4" v-bind:class="[blot.netProceeds > 0 ? 'green-trade' : 'red-trade']">
                                {{ (blot.netProceeds).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ blot.grossWinsCount }}</td>
                            <td class="px-6 py-4">{{ blot.grossLossCount }}</td>
                            <td class="px-6 py-4">{{ blot.trades }}</td>
                            <td class="px-6 py-4">{{ blot.executions }}</td>
                        </tr>
                        <tr v-if="index != null"  class="text-gray-700 dark:text-white text-sm text-shadow font-medium bg-gray-50 border-b dark:border-b-transparent dark:bg-gray-700 dark:border-gray-600 uppercase"> <!-- SUM ROW-->
                            <td class="px-6 py-4">Total</td>
                            <td class="px-6 py-4">{{ useDecimalsArithmetic(pAndL[index].buyQuantity, pAndL[index].sellQuantity) }}</td>
                            <td class="px-6 py-4" v-bind:class="[pAndL[index].grossProceeds > 0 ? 'green-trade' : 'red-trade']">
                                {{ (pAndL[index].grossProceeds).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ (pAndL[index].commission).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ (pAndL[index].fees).toFixed(2) }}</td>
                            <td class="px-6 py-4" v-bind:class="[pAndL[index].netProceeds > 0 ? 'green-trade' : 'red-trade']">
                                {{ (pAndL[index].netProceeds).toFixed(2) }}</td>
                            <td class="px-6 py-4">{{ pAndL[index].grossWinsCount }}</td>
                            <td class="px-6 py-4">{{ pAndL[index].grossLossCount }}</td>
                            <td class="px-6 py-4">{{ pAndL[index].trades }}</td>
                            <td class="px-6 py-4">{{ pAndL[index].executions }}</td>
                        </tr>
                    </tbody>
            </table>
            </div>
          </div>

          <div class="flex items-center">
            <div class="mr-auto p-6">
              <UButton
              label="Submit"
              color="primary"
              size="md"
              class="mr-2"
              @click="useUploadTrades"
            />
              <UButton
              label="Cancel"
              color="gray"
              size="md"
              @click="removeTrades"
            />
            </div>
          </div>
      </div>

      <UButton
              label="TEST UPLOAD TRADES"
              color="primary"
              size="md"
              class="mr-2 inline"
              @click="useUploadTrades"
            />
      <div class="h-max w-full overflow-x-auto hidden">
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
