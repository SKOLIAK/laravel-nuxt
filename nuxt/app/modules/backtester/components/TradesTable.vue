<script lang="ts" setup>
import dayjs from 'dayjs'
const { SelectedBacktest, SelectedFolder, SelectedBacktestComputed, updateBacktest, fetchFolders, selectedTrades, IsDirty, IsSaving, DirtyTimer, autosaveDuration, autosaveEnabled, deleteTrades, editingTags } = useBacktester()
const checked = ref(true)

const colorMode = useColorMode()

function selectTrade(trade) {
    if(selectedTrades.value.includes(trade)) {
        selectedTrades.value = selectedTrades.value.filter((x) => x != trade)
    } else {
        selectedTrades.value.push(trade)
    }
}

function selectAllTrades() {
    selectedTrades.value.splice(0)
    SelectedBacktest.value.trades.forEach(trade => {
        selectedTrades.value.push(trade)
    });
}

const unsavedTradesCount = computed(() => {
    return  !isObjectEmpty(SelectedBacktest.value) && 
            Object.hasOwn(SelectedBacktest.value, 'trades') && 
            SelectedBacktest.value.trades != undefined  && 
            SelectedBacktest.value.trades.filter(x => x.isNew == true).length ? SelectedBacktest.value.trades.filter(x => x.isNew == true).length : 0
})


async function deleteSpecific(trade_id) {
    /** Wrap selected trades by theyr indentifiers for processing in api */
    await deleteTrades([trade_id])
    SelectedBacktest.value.trades =  SelectedBacktest.value.trades.filter(x => x.identifier != trade_id)
    selectedTrades.value = selectedTrades.value.filter((x) => x.identifier != trade_id)
    IsDirty.value = selectedTrades.value.length == 0 ? false : true
}


async function deleteSelected() {
    /** Wrap selected trades by theyr indentifiers for processing in api */
    let toDelete = selectedTrades.value.filter(x => !x.isNew).map((x) => x.identifier)
    await deleteTrades(
        toDelete
    )

    await (selectedTrades.value.forEach(trade => {
        /** Check if trade is new (not in parse) */
        if(trade.isNew == true) {
            SelectedBacktest.value.trades =  SelectedBacktest.value.trades.filter(x => x.identifier != trade.identifier)
        }
    }))

    /** Remove from client */
    await(toDelete.forEach(id => {
        SelectedBacktest.value.trades =  SelectedBacktest.value.trades.filter(x => x.identifier != id)
    }))

    selectedTrades.value = []
    IsDirty.value = false
}


async function editSelected() {
    await (selectedTrades.value.forEach(trade => {
        SelectedBacktest.value.trades.filter(x => x.identifier == trade.identifier)[0].editing = true
    }))
}

async function finishEditingSelected() {
    await (selectedTrades.value.forEach(trade => {
        SelectedBacktest.value.trades.filter(x => x.identifier == trade.identifier)[0].editing = false
    }))
}

async function useUpdateBacktest() {
    await updateBacktest({
        'id': SelectedBacktest.value.id,
        'folder': SelectedFolder.value.id,
        'name': SelectedBacktest.value.name,
        'session': SelectedBacktest.value.session,
        'trades': selectedTrades.value.filter(x => x.isNew).concat(SelectedBacktest.value.trades.filter(x => x.dirty == true))
    })
    DirtyTimer.value = null
}

function editTags(trade) {
    editingTags.value = trade
}
</script>
<template>

<div class="relative">

        <!-- Actions panel -->
        <UBasePanel class="flex flex-col items-start justify-start absolute right-2 bottom-24 z-20 drop-shadow-lg" v-if="selectedTrades.length || IsDirty">
            
            <div class="p-2 border-black/10 dark:border-white/10 w-full text-xs flex items-center justify-between gap-x-20" :class="{'border-b': !IsSaving}">
                <span class="opacity-70 drop-shadow-sm flex items-center justify-start gap-1">
                    <template v-if="IsSaving">
                        Saving...
                    </template>
                    <template v-else>
                        <template v-if="selectedTrades.length">
                            Selected {{ selectedTrades.length }} {{ selectedTrades.length == 1 ? 'trade' : 'trades' }}
                        </template>
                        <span v-if="selectedTrades.length && IsDirty" class="opacity-30">|</span>
                        <template v-if="IsDirty && unsavedTradesCount > 0">
                            Unsaved {{ unsavedTradesCount }} {{ unsavedTradesCount == 1 ? 'trade' : 'trades' }}
                        </template>
                        <template v-if="IsDirty && unsavedTradesCount == 0">
                            Unsaved Changes
                        </template>
                    </template>
                </span>
                
                <div class="flex items-center justify-start gap-2 ms-auto" v-if="selectedTrades.length">
                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" variant="ghost" size="2xs" @click="selectAllTrades()" v-if="SelectedBacktest.trades.length != selectedTrades.length">
                        Select All
                    </UButton>
                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" variant="ghost" size="2xs" @click="selectedTrades.splice(0)">Deselect All</UButton>
                </div>
            </div>
            <UInfiniteProgress v-if="IsSaving" />
            <div class="flex flex-col items-start justify-start p-3 gap-2 font-medium text-xs">

                <div class="flex items-center justify-start gap-2">
                    <UButton v-if="IsDirty" size="xs" :loading="IsSaving" :disabled="IsSaving" @click="useUpdateBacktest">
                        <template v-if="unsavedTradesCount > 0">
                            Save {{ unsavedTradesCount }}
                            {{ unsavedTradesCount == '1' ? 'Trade' : 'Trades' }}
                        </template>
                        <template v-else>
                            Save Changes
                        </template>
                    </UButton>

                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" size="xs" v-if="selectedTrades.filter(x => x.editing == true).length" @click="finishEditingSelected()">
                        Finish Editting Selected
                    </UButton>

                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" size="xs" v-if="selectedTrades.length" @click="editSelected()">
                        Edit Selected
                    </UButton>

                    <UButton color="rose" variant="soft" size="xs" v-if="selectedTrades.length" @click="deleteSelected()">
                        Delete Selected
                    </UButton>

                   
                </div>

                <span class="opacity-40 mt-2 italic font-normal" v-if="autosaveEnabled">Autosave is enabled</span>
                <!-- ... -->
            </div>
        </UBasePanel>

        

        <!-- Table responsive wrapper -->
        <div class="overflow-x-auto mx-0.5 bg-white dark:bg-gray-800 h-[calc(100vh-4em)] overflow-y-scroll select-none no-scrollbar w-full">
            
            <!-- Table -->
            <table class="min-w-full text-left text-xs whitespace-nowrap" v-if="!isObjectEmpty(SelectedBacktest) && SelectedBacktest.trades.length != 0">


            <!-- Table head -->
            <thead class="tracking-wider sticky top-0 bg-white dark:bg-gray-800 select-none">
                <tr>
                    <th scope="col" class="px-3 py-2">
                        #
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Symbol
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Session
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Time
                    </th>
                    <th scope="col" class="px-3 py-2 flex items-center justify-normal gap-x-1">
                        L/S
                        <UIcon name="akar-icons:info" title="Long or Short" />
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Outcome
                    </th>

                    <th scope="col" class="px-3 py-2">
                        Realised RR
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Pnl
                    </th>
                    <th scope="col" class="px-3 py-2">
                        Gain (%)
                    </th>
                    <th scope="col" class="px-3 py-2"></th>
                </tr>
            </thead>
                <!-- Table footer -->
                <thead class="tracking-wider sticky top-0 bg-gray-200 dark:bg-gray-900 !z-10">
                <tr class="text-xs">
                    <th class="px-3 py-2">
                        Trades: {{ SelectedBacktestComputed.trades.length }}
                    </th>

                    <td class="px-3 py-2">
                        Wins: {{ SelectedBacktestComputed.wins }}
                    </td>

                    <td class="px-3 py-2">
                        Losses: {{ SelectedBacktestComputed.losses }}
                    </td>

                    <td class="px-3 py-2">
                        -
                    </td>

                    <td class="px-3 py-2">
                        <UHelpTitle text="Total number of Break-Even trades">
                            BE: {{ SelectedBacktestComputed.bes }}
                        </UHelpTitle>
                    </td>

                    <td class="px-3 py-2">-</td>

                    <td class="px-3 py-2">
                        <UHelpTitle text="Total sum of R multiple gained">
                            Tot. R: {{ useTwoDecFormat(SelectedBacktestComputed.totalR) }}
                        </UHelpTitle>
                    </td>

                    <td class="px-3 py-2">
                        Balance: {{ useTwoDecCurrencyFormat(SelectedBacktestComputed.ending_balance) }}
                    </td>

                    <td class="px-3 py-2">
                        <UHelpTitle text="Total Gain Percentage">
                            Tot. Gain: {{ useTwoDecPercentFormat(SelectedBacktestComputed.gain) }}
                        </UHelpTitle>
                    </td>
                    <td class="px-3 py-2">
                        Actions
                    </td>
                </tr>
                </thead>

            <!-- Table body -->
            <tbody class="">
                <tr 
                    class="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200" 
                    v-for="(trade, n) in SelectedBacktest.trades" v-if="SelectedBacktest.trades.length > 0"
                    :class="{
                        'bg-gray-100 hover:!bg-gray-300/30 dark:bg-gray-700/25 dark:hover:!bg-gray-700/70': selectedTrades.includes(trade),
                        'pasted': trade.isNew
                    }"
                >
                <th scope="row" class="px-3 py-2"
                @click="selectTrade(trade)">
                    <div class="flex items-center justify-start gap-x-2">
                        <UCheckbox v-model="checked" v-if="selectedTrades.includes(trade)"/>
                        <template v-else>{{ n + 1 }}</template>
                        <UTooltip text="Unsaved" v-if="trade.isNew" class="cursor-help">
                            <div class="bg-orange-600 dark:bg-orange-400 rounded-full w-2 h-2 animate-pulse" />
                        </UTooltip>
                    </div>
                </th>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">{{ trade.symbolOriginal }}</td>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">
                    <UInput v-model="trade.session" size="2xs" v-if="trade.editing" @input="IsDirty = true; trade.dirty = true"/>
                    <template v-else>{{ trade.session }}</template>
                </td>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">
                    <UTooltip :text="dayjs.unix(trade.entryTime).format('HH:mm') + ' GTM+0'">
                        {{ dayjs.unix(trade.entryTime).format('DD/MM/YY') }}
                    </UTooltip>
                    
                </td>
                <td class="px-3 py-2 capitalize truncate" @click="selectTrade(trade)">
                    {{ trade.direction }}
                    <UIcon v-if="trade.direction == 'long'" name="akar-icons:arrow-up-right" class="green-trade"/>
                    <UIcon v-else name="akar-icons:arrow-down-right" class="red-trade"/>
                </td>
                <td 
                    class="px-3 py-2 truncate" 
                    @click="selectTrade(trade)" 
                    :class="{
                        'uppercase': trade.outcome.toLowerCase() == 'be',
                        'capitalize': trade.outcome.toLowerCase() != 'be'
                    }"
                >
                    {{ trade.outcome }}
                </td>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">
                    {{ trade.rrr }}
                </td>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">
                    {{ useTwoDecCurrencyFormat(trade.netProceeds) }}
                </td>
                <td class="px-3 py-2 truncate" @click="selectTrade(trade)">
                    {{ useTwoDecPercentFormat(trade.gain) }}
                </td>
                <td class="px-3 py-2">
                    <UPopover>
                        <UButton color="white" size="2xs" variant="ghost" icon="mdi:dots-vertical"/>
                        <template #panel>
                            <UBasePanel class="flex flex-col items-start justify-start w-full text-left">
                                <div class="p-2">
                                    <h1 class="opacity-50 drop-shadow-sm">Trade Management Actions</h1>
                                </div>
                                <UDivider />
                                <div class="p-2 flex flex-col items-start justify-start gap-2 w-full">             
                                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" variant="ghost" size="xs" class="w-full" v-if="!trade.editing" @click="trade.editing = true;">
                                        Edit
                                        <UIcon name="lucide:pencil-line" class="ms-auto" />
                                    </UButton>
                                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" variant="ghost" size="xs" class="w-full" v-if="trade.editing" @click="trade.editing = false">
                                        Done Editing
                                        <UIcon name="lucide:check" class="ms-auto" />
                                    </UButton>
                                    <UButton :color="colorMode.value == 'dark' ? 'white' : 'gray'" variant="ghost" size="xs" class="w-full" @click="editTags(trade)">
                                        Edit Tags
                                        <UIcon name="lucide:hash" class="ms-auto" />
                                    </UButton>        
                                
                                </div>
                                <UDivider />
                                <div class="p-2 flex flex-col items-start justify-start gap-2 w-full">
                                    <UTooltip text="Delete action cannot be undone." class="w-full">
                                        <UButton color="orange" variant="ghost" size="xs" class="w-full" @click="deleteSpecific(trade.identifier)">
                                            Delete
                                            <UIcon name="lucide:trash-2" class="ms-auto" />
                                        </UButton>
                                    </UTooltip>
                                </div>
                            </UBasePanel>
                        </template>
                    </UPopover>
                </td>
                </tr>
            </tbody>

            </table>

            <div class="tracking-wider sticky top-0 bg-gray-200 dark:bg-gray-900 !z-10 text-2xs font-medium p-1.5 text-center text-foreground/80" v-else>
                <span class="animate-pulse">No data</span>
            </div>

        </div>
        
    </div>
</template>
