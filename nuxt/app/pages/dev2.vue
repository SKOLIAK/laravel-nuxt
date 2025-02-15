<script lang="ts" setup>
import { watch } from 'vue'
import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { isObjectEmpty } from '@/utils/misc'
import { spinnerLoadingPage } from '@/utils/global'
import {
    IsSaving,
    IsDirty,
    useAutosave,
    BacktesterObject,
    BacktesterFolders,
    useGetFolders,
    SelectedFolder,
    SelectedBacktest,
    PasteBacktesterTrades,
    useGetLargestLossTrade,
    SelectedBacktestWinRate,

} from '@/utils/backtester'

const { theme } = resolveConfig(tailwindConfig)

onBeforeMount(async () => {
  await useGetFolders();
})

addEventListener("paste", (e) => {
    PasteBacktesterTrades(e);
})

watch(SelectedFolder, (a, b) => {
    if(!isObjectEmpty(SelectedFolder) && SelectedFolder.value.backtests != undefined) {
       // SelectedBacktest.value = SelectedFolder.value.backtests[0] ?? {}
    }

})
















const data = []
let medianVal = 'Not loaded'



let dirs = ['Long', 'Short']
let dir = dirs[Math.floor(Math.random()*dirs.length)]


import { VisXYContainer, VisGroupedBar } from '@unovis/vue'
import { Percent } from 'lucide-vue-next';


type DataRecord = {
    x: number;
    y: number;
    r: number;
  };

const x = (d: DataRecord) =>  d.x
const y = (d: DataRecord) =>  d.y

</script>

<template>
<UDashboardPage>
    <UDashboardPanel grow>
        <UDashboardNavbar class="bg-gray-800 border-b border-gray-900">
            <template #left>
                <div>
                    <div class="flex items-center gap-x-2">

                        <!-- ~/components/PercentGauge.vue -->
                        <PercentageGauge
                            :percent="SelectedBacktestWinRate"
                            class="h-full"
                            v-if="!isObjectEmpty(SelectedBacktest)"
                        />

                        <!-- Title -->
                        <div>
                            <div class="text-lg font-medium text-white">
                                <div v-if="!isObjectEmpty(SelectedBacktest)" class="flex items-center gap-x-2">
                                    <UIcon name="solar:pen-2-outline" />
                                    <BacktestInputName />
                                </div>
                                <h3 v-else>
                                    Backtesting
                                </h3>
                            </div>

                            <!-- If unsaved changes made -->
                            <div class="text-2xs flex items-center gap-x-1 text-gray-400" v-if="!IsDirty && !isObjectEmpty(SelectedBacktest)">
                                in: {{ SelectedBacktest.group.name }}
                            </div>
                            <div class="text-2xs font-medium flex items-center justify-start gap-x-1 animate-pulse" v-if="IsDirty">
                                <template v-if="!IsSaving">
                                    <UIcon name="akar-icons:triangle-alert" class="text-yellow-300"/>
                                    <span class="opacity-80">Unsaved changes.</span>
                                    <button class="text-blue-300 opacity-100 underline" @click.prevent="IsSaving = true">Save</button>
                                </template>
                                <template v-else>
                                    <Spinner /> Saving...
                                </template>
                            </div>
                        </div>

                    </div>
                </div>

            </template>
            <template #right>
                <!-- ... -->
                <UPopover :ui="{background: '!bg-gray-800 border border-white/10'}">
                    <UButton
                        icon="tabler:dots-vertical"
                        size="sm"
                        color="white"
                        variant="ghost"
                    />
                    <template #panel>
                        <div class="p-2 flex flex-col gap-2 ">
                            <UCheckbox v-model="useAutosave" label="Auto Save" />
                        </div>
                    </template>
                </UPopover>
            </template>
        </UDashboardNavbar>


        <UDashboardPanelContent class="!p-0 !overflow-x-hidden">

            <!-- ~/components/Backtest/TradesTable.vue -->
            <BacktestTradesTable />

        </UDashboardPanelContent>

    </UDashboardPanel>

    <UDashboardPanel
      :width="600"
      class="bg-gray-800 h-[calc(100vh-2em)] select-none"
      :ui="{
        border: 'border-l border-r-0 dark:!border-gray-900'
      }"
    >
      <UDashboardNavbar
        :ui="{
          wrapper: 'dark:!border-gray-900',
          title: 'text-lg font-medium text-black dark:text-white',
        }"
      >
        <template #left>

            <!-- New Folder Button-->
            <UTooltip text="New Folder">
                <UButton
                    icon="solar:add-folder-linear"
                    size="sm"
                    color="white"
                    :label="BacktesterFolders.length == 0 ? 'Create Folder' : ''"
                    @click.prevent="$refs.FolderActions.NewFolder()"
                />
            </UTooltip>

            <!-- Folder Settings Button-->
            <UTooltip text="Edit Folder" v-if="!isObjectEmpty(SelectedFolder)">
                <UButton
                    icon="solar:settings-outline"
                    size="sm"
                    color="white"
                    @click.prevent="$refs.FolderActions.EditFolder(SelectedFolder)"
                />
            </UTooltip>

            <!-- Folder Select Dropdown-->
            <USelectMenu class="w-44" v-if="BacktesterFolders.length != 0" :options="BacktesterFolders" v-model="SelectedFolder" searchable option-attribute="name" :search-attributes="['name']">
                <template #option="{ option: folder }">
                    <UIcon name="solar:folder-2-bold-duotone" :style="{'color': folder.color}" class="w-4 h-4"/>
                    <span class="truncate text-ellipsis">{{ folder.name }}</span>
                </template>
                <template #leading>
                    <UIcon name="solar:folder-2-bold-duotone" class="w-5 h-5" :style="{'color': SelectedFolder.color}" />
                </template>
            </USelectMenu>
        </template>
        <template #right>
            <template v-if="SelectedFolder.backtests">

                <!-- Divider-->
                <span class="text-black opacity-50 mt-1">|</span>

                <!-- Backtest Select Dropdown-->
                <USelectMenu class="w-44 ml-2" :options="SelectedFolder.backtests" v-model="SelectedBacktest" searchable option-attribute="name" :search-attributes="['name']">
                    <template #option="{ option: backtest }">
                        <UIcon name="solar:document-text-line-duotone" class="w-4 h-4" />
                        <span class="truncate text-ellipsis" :title="backtest.name">
                            {{ backtest.name }}
                        </span>
                    </template>
                    <template #leading>
                        <UIcon name="solar:document-text-line-duotone" class="w-5 h-5" v-if="!isObjectEmpty(SelectedBacktest)" />
                        <template v-else>
                            <span class="opacity-50" v-if="SelectedFolder.backtests.length > 0">Select Backtest</span>
                            <span class="opacity-50" v-else>No Backtests</span>
                        </template>

                    </template>
                </USelectMenu>

                <!-- New Backtest Button-->
                <UTooltip text="New Backtest">
                    <UButton icon="solar:paperclip-broken" size="sm" color="white" @click.prevent="$refs.BacktestActions.NewBacktest()"/>
                </UTooltip>

                <!-- Make Backtest Copy Button-->
                <UTooltip text="Make a Copy" v-if="!isObjectEmpty(SelectedBacktest)">
                    <UButton icon="solar:copy-outline" size="sm" color="white"/>
                </UTooltip>

                <!-- Delete Backtest Copy Button-->
                <UTooltip text="Delete action cannot be undone." v-if="!isObjectEmpty(SelectedBacktest)">
                    <UButton
                        icon="tabler:trash-x"
                        size="sm"
                        color="rose"
                        variant="soft"
                        @click.prevent="useDeleteBacktest(SelectedBacktest.id, SelectedFolder.id)"
                        :disabled="spinnerLoadingPage"
                    />
                </UTooltip>
            </template>


        </template>
      </UDashboardNavbar>

    <AppNoContent v-if="BacktesterFolders.length == 0">
        <div class="drop-shadow">
            <div class="mb-2">
                You don't have any backtesting folders yet.
            </div>
            <div class="flex items-center justify-center gap-x-1">
                Click
                <div type="button" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 button button text-center font-medium rounded-md text-xs gap-x-1 px-2 py-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white disabled:bg-white aria-disabled:bg-white dark:bg-gray-900  dark:disabled:bg-gray-900 dark:aria-disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"><span class="iconify i-solar:add-folder-linear flex-shrink-0 h-4 w-4" aria-hidden="true"></span><span class="">Create Folder</span></div>
                button at the top to begin.
            </div>
        </div>
    </AppNoContent>

    <AppNoContent v-else-if="!isObjectEmpty(SelectedFolder) && SelectedFolder.backtests.length == 0">
        <div class="drop-shadow">
            <div class="mb-2">
                You haven't created any backtests yet.
                Create one to get started
            </div>
        </div>
    </AppNoContent>

    <AppNoContent v-else-if="!isObjectEmpty(SelectedBacktest) && !SelectedBacktest.trades.length">
        <div class="drop-shadow">
            <div class="mb-2">
                This backtest is empty. You can paste trades from TradingView once done backtesting.
            </div>
            Use <UKbd>CTRL</UKbd> + <UKbd>V</UKbd> (<UKbd>CMD</UKbd> + <UKbd>V</UKbd> on Mac) to paste trades

            <p class="mt-4 italic text-sm">
                Make sure to adjust the position tool in Tradingview to start at the candle where you entered the trade and end at the candle where you exited the trade.
            </p>
        </div>
    </AppNoContent>



    <div v-else-if="!isObjectEmpty(SelectedBacktest)" class="p-4 flex flex-col gap-4">

        <div class="flex items-start justify-between text-sm">
            <div>
                <span class="text-xs">Starting Balance</span>
                <h3>{{ SelectedBacktest.starting_balance }}</h3>
            </div>

            <div>
                <span class="text-xs">Win Percentage</span>
                <h3>{{ useTwoDecPercentFormat(SelectedBacktestWinRate) }}</h3>
            </div>

            <UPopover>
            <div>
                <span class="text-xs">Worst Trade</span>
                <h3 v-if="useGetLargestLossTrade() != undefined">{{ useTwoDecCurrencyFormat(useGetLargestLossTrade().netProceeds) }}</h3>
                <h3 v-else>-</h3>
            </div>
            <template #panel>
                <div class="p-2">
                    on {{ useGetLargestLossTrade().symbolOriginal }}
                    with a RR of {{ useGetLargestLossTrade().rrr }}
                </div>
            </template>
            </UPopover>
        </div>

        <!-- ~/components/Charts/PnlByDay.vue -->
        <ChartsPnlByDay/>


        <DEVBlock>
            <template #title>Selected Backtest </template>
            <template #code>
                {{ SelectedBacktest }}
            </template>
        </DEVBlock>
      </div>


      <div class="overflow-y-auto" :class="{'opacity-50': spinnerLoadingPage}">

        <VisXYContainer :data="data">
            <VisGroupedBar :x="x" :y="y" />
        </VisXYContainer>

      </div>

    </UDashboardPanel>

</UDashboardPage>

<!-- Modals -->
<BacktestFoldersActions ref="FolderActions" />
<BacktestBacktestsActions ref="BacktestActions" />

</template>
