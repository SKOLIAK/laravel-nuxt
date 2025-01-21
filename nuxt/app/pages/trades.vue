<script setup lang="ts">
  import { blotter, TradesData } from "@/utils/trades";
  import dayjs from "dayjs";

  onMounted(async () => {
    await useGetExistingTradesArray();
    await useGetExistingAccounts();
  });

  const isNewTradeModalOpen = ref(false);

  async function removeTrades() {
    console.log("Canceling trades");
    TradesData.splice(0);
    for (var blot in blotter) delete blotter[blot];
    for (var p in pAndL) delete pAndL[p];

    if (Object.keys(blotter) == 0) {
      useToast().add({
        icon: GetSuccessIcon,
        title: "Trade data has been cleared",
        color: GetSuccessColor,
      });
    } else {
      useToast().add({
        icon: GetInfoIcon,
        title: "Please reload the page",
        color: GetInfoColor,
      });
    }
  }
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Trades" class="bg-white">
        <template #right>
          <div
            class="mr-auto flex items-center p-6"
            v-if="Object.keys(blotter).length > 0 && Object.keys(pAndL).length > 0"
          >
            <UButton
              label="Add Trades"
              icon="i-heroicons-arrow-up-on-square-stack"
              color="primary"
              class="mr-1"
              @click="useUploadTrades"
            />
            <UTooltip text="Cancel">
              <UButton icon="i-heroicons-x-mark" color="gray" @click="removeTrades" />
            </UTooltip>
          </div>

          <UButton
            v-else
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
          <div class="text-shadow text-xs font-medium text-white">
            Following dates are already imported:
            <span v-for="(item, index) in existingImports">
              <span v-if="index > 0">, </span>{{ useDateCalFormat(item) }}</span
            >
          </div>
        </template>
      </UDashboardToolbar>

      <div
        v-if="Object.keys(blotter).length > 0 && Object.keys(pAndL).length > 0"
        v-for="(execution, index) in executions"
      >
        <div v-if="blotter[index]">
          <div
            class="bg-primary-500/25 dark:bg-primary-500/10 text-primary-900/90 dark:text-shadow p-4 text-xs font-medium dark:text-white"
          >
            {{ useCreatedDateFormat(index) }}
          </div>

          <div class="h-max w-full overflow-x-auto">
            <table class="w-full overflow-auto text-left text-sm text-gray-600 dark:text-gray-400">
              <thead class="bg-gray-50 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">Symbol</th>
                  <th scope="col" class="px-6 py-3">Volume</th>
                  <th scope="col" class="px-6 py-3">Gross P&L</th>
                  <th scope="col" class="px-6 py-3">Commissions</th>
                  <th scope="col" class="px-6 py-3">Fess</th>
                  <th scope="col" class="px-6 py-3">Net P&L</th>
                  <th scope="col" class="px-6 py-3">Wins (g)</th>
                  <th scope="col" class="px-6 py-3">Loss (g)</th>
                  <th scope="col" class="px-6 py-3">Trades</th>
                  <th scope="col" class="px-6 py-3">Executions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="blot in blotter[index]"
                  class="border-b bg-white text-xs dark:border-gray-800 dark:bg-gray-900"
                >
                  <td class="px-6 py-4">{{ blot.symbol }}</td>
                  <td class="px-6 py-4">
                    {{ useDecimalsArithmetic(blot.buyQuantity, blot.sellQuantity) }}
                  </td>
                  <td v-bind:class="[blot.grossProceeds > 0 ? 'green-trade' : 'red-trade']">
                    {{ blot.grossProceeds.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4">{{ blot.commission.toFixed(2) }}</td>
                  <td class="px-6 py-4">{{ blot.fees.toFixed(2) }}</td>
                  <td
                    class="px-6 py-4"
                    v-bind:class="[blot.netProceeds > 0 ? 'green-trade' : 'red-trade']"
                  >
                    {{ blot.netProceeds.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4">{{ blot.grossWinsCount }}</td>
                  <td class="px-6 py-4">{{ blot.grossLossCount }}</td>
                  <td class="px-6 py-4">{{ blot.trades }}</td>
                  <td class="px-6 py-4">{{ blot.executions }}</td>
                </tr>
                <tr
                  v-if="index != null"
                  class="text-shadow border-b bg-gray-50 text-sm font-medium uppercase text-gray-700 dark:border-gray-600 dark:border-b-transparent dark:bg-gray-700 dark:text-white"
                >
                  <!-- SUM ROW-->
                  <td class="px-6 py-4">Total</td>
                  <td class="px-6 py-4">
                    {{ useDecimalsArithmetic(pAndL[index].buyQuantity, pAndL[index].sellQuantity) }}
                  </td>
                  <td
                    class="px-6 py-4"
                    v-bind:class="[pAndL[index].grossProceeds > 0 ? 'green-trade' : 'red-trade']"
                  >
                    {{ pAndL[index].grossProceeds.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4">{{ pAndL[index].commission.toFixed(2) }}</td>
                  <td class="px-6 py-4">{{ pAndL[index].fees.toFixed(2) }}</td>
                  <td
                    class="px-6 py-4"
                    v-bind:class="[pAndL[index].netProceeds > 0 ? 'green-trade' : 'red-trade']"
                  >
                    {{ pAndL[index].netProceeds.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4">{{ pAndL[index].grossWinsCount }}</td>
                  <td class="px-6 py-4">{{ pAndL[index].grossLossCount }}</td>
                  <td class="px-6 py-4">{{ pAndL[index].trades }}</td>
                  <td class="px-6 py-4">{{ pAndL[index].executions }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
