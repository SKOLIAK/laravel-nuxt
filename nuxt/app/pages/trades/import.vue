<script setup>
import { brokers, selectedBroker, tradovateTiers, selectedTradovateTier } from '@/utils/brokers';
import { trades } from '@/utils/trades';



let file = null
function handleFileUpload( event ){
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
    <div class="max-w-sm mb-5">
    <label for="file-input" class="sr-only">Choose file</label>
    <input type="file" id="tradesFileInput" accept=".csv" v-on:change="useImportTrades($event, 'file')" class="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
        file:bg-gray-50 file:border-0
        file:me-4
        file:py-3 file:px-4
        dark:file:bg-neutral-700 dark:file:text-neutral-400">
    </div>
    <div class="flex">
        <URadioGroup v-model="selectedBroker" legend="Brokers" :options="brokers" class="mr-5"/>
        <URadioGroup v-model="selectedTradovateTier" legend="Commission Plan" :options="tradovateTiers" />
    </div>

</div>

<div class="relative overflow-x-auto mt-5 rounded">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" v-for="data in trades['1733720400']">
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
                                Open time
                                <UIcon name="octicon:arrow-right-24" />
                                Close time
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
                            <div class="font-medium p-2 rounded inline text-xs" :class="{'text-gray-200 bg-black/20 ': data.netProceeds < 0, 'bg-primary-500 text-white': data.netProceeds >= 0}">
                                {{ data.netProceeds.toFixed(2) }} {{ data.currency }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>






</template>
