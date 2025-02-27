<script lang="ts" setup>
import { useMouse, useWindowScroll } from '@vueuse/core'
import Folder from '../components/Folder.vue'
const { IsSaving, fetchFolders, SelectedBacktest } = useBacktester()

const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })

function onContextMenu() {
  const top = unref(y) - unref(windowY)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left
  })

  isOpen.value = true
}



onBeforeMount(async () => {
    await fetchFolders()
})

const sort = ref({
    column: 'entryTime',
    direction: 'desc'
})

const columns = [{
    key: 'symbolOriginal',
    label: 'Symbol',
    sortable: true,
    disabled: true
}, 
{
    key: 'session',
    label: 'Session',
    sortable: true
},
{
    key: 'quantity',
    label: 'Quantity',
    sortable: true
}, 
{
    key: 'entryTime',
    label: 'Entry Time',
    sortable: true
},
{
    key: 'entry',
    label: 'Entry'
},
{
    key: 'target',
    label: 'Take Profit'
},
{
    key: 'stop',
    label: 'Stop Loss'
}, 
{
    key: 'rrr',
    label: 'Realised Risk-Reward',
    sortable: true
},
{
    key: 'outcome',
    label: 'Outcome'
},
{
    key: 'actions',
    label: 'Actions',
    disabled: true
}
]

const items = row => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]

const selectedRows = ref([])

function select(row) {
  const index = selectedRows.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

const selectedColumns = ref([...columns])

let trades = ref([])

watch(SelectedBacktest, () => {
    trades.value = [...SelectedBacktest.value.trades]
})
</script>


<template>

<div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Columns" class="w-full max-w-60" />
        <Folder />
        <Backtest />
    </div>

    <UTable 
    :sort="sort" 
    v-model="selectedRows" 
    :columns="selectedColumns" 
    :rows="trades" 
    @select="select" 
    @contextmenu.prevent="onContextMenu"
    :loading="IsSaving"
    :ui="{
        tr: {
            base: 'transition-all duration-200',
            selected: 'bg-gray-50 dark:bg-gray-700/50',
            active: 'hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer'
        },
        th: {
            padding: 'px-2 py-1.5'
        },
        td: {
            padding: 'p-2'
        }
    }"
    >

        <!-- Fix quantity to have 2 decimal plaes-->
        <template #quantity-data="{ row }">
            {{ useTwoDecFormat(row.quantity) }}
        </template>

        <!-- Individual trade actions -->
        <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
        </template>

        <!-- Loading -->
        <template #loading-state>
            <div class="flex items-center justify-center h-32">
              <UIcon name="svg-spinners:bars-rotate-fade" />
            </div>
          </template>

        <!-- No data -->
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="font-bold relative inline-block bg-gradient-to-r from-primary via-primary-700 dark:via-primary-200 to-primary bg-clip-text text-transparent drop-shadow-sm">
              No Trading Activity
            </span>
            <div class="text-center font-normal text-gray-500 dark:text-gray-400 text-sm max-w-96" v-if="$device.isMobile">
              You can only add trades using a PC
            </div>
            <div class="text-center font-normal text-gray-500 dark:text-gray-400 text-sm max-w-96" v-else>
              <div class="font-medium">
                Press 
                <template v-if="$device.isWindows">
                  <UKbd>CTRL</UKbd> + <UKbd>V</UKbd> 
                </template>

                <template v-if="$device.isMacOS">
                  <UKbd>CMD</UKbd> + <UKbd>V</UKbd>
                </template> to paste trades from TradingView
              </div>
              <UDivider class="my-4"/>
              <span class="text-normal text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Make sure to adjust the position tool in Tradingview to start at the candle where you
                  entered the trade and end at the candle where you exited the trade.
              </span>
            </div>
          </div>
        </template>


    </UTable>
</div>

<UContextMenu 
    v-model="isOpen" 
    :ui="{
        background: 'bg-gray-100 dark:bg-gray-800',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
    }"
    :virtual-element="virtualElement"
    >
    <div class="flex flex-col gap-2 divide-y divide-gray-200 dark:divide-gray-700">


        <template v-if="Object.keys(trades[0]).length > 0">

            <div class="p-1" v-if="!selectedRows.length || selectedRows.length == 1">
                <UButton color="white" variant="ghost" class="w-full">
                    <div class="group flex items-center justify-between gap-1.5 w-full">
                    <div>Add Journal Entry</div>
                    <UIcon name="heroicons:document-plus" class="ml-auto text-gray-400 dark:text-gray-500 ms-auto flex-shrink-0"/>
                    </div>
                </UButton>

                <UButton color="white" variant="ghost" class="w-full">
                    <div class="group flex items-center justify-between gap-1.5 w-full">
                    <div>Edit</div>
                    <UIcon name="heroicons:document-text" class="ml-auto text-gray-400 dark:text-gray-500 ms-auto flex-shrink-0"/>
                    </div>
                </UButton>

                <UButton color="white" variant="ghost" class="w-full">
                    <div class="group flex items-center justify-between gap-1.5 w-full">
                    <div>Delete</div>
                    <UIcon name="heroicons:trash" class="ml-auto text-gray-400 dark:text-gray-500 ms-auto flex-shrink-0"/>
                    </div>
                </UButton>
            </div>

            <!-- If selected multiple trades we do bulk actions -->
            <div class="p-1" v-if="selectedRows.length > 1">
                <div class="px-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium my-0.5">
                    {{ selectedRows.length }} selected
                </div>

                <UButton color="white" variant="ghost" class="w-full">
                    <div class="group flex items-center justify-between gap-1.5 w-full">
                    <div>Edit Selected</div>
                    <UIcon name="heroicons:document-text-solid" class="ml-auto text-gray-400 dark:text-gray-500 ms-auto flex-shrink-0"/>
                    </div>
                </UButton>

                <UButton color="white" variant="ghost" class="w-full">
                    <div class="group flex items-center justify-between gap-1.5 w-full">
                    <div>Delete Selected</div>
                    <UIcon name="heroicons:trash" class="ml-auto text-gray-400 dark:text-gray-500 ms-auto flex-shrink-0"/>
                    </div>
                </UButton>
            </div>
        </template>

        <template v-else>
            <div class="px-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium my-0.5">
                Please select a backtest first
            </div>
        </template>
    </div>
</UContextMenu>
</template>