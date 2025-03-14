<script lang="ts" setup>
const { Folders, SelectedFolder, SelectedBacktest } = useBacktester() 
</script>

<template>
      <UNoContent v-if="Folders.length == 0">
        <div class="drop-shadow-sm">
            <div class="mb-2">
                You don't have any backtesting folders yet.
            </div>
            <div class="flex items-center justify-center gap-x-1">
                Click
                <div type="button" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 button button text-center font-medium rounded-md text-xs gap-x-1 px-2 py-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white disabled:bg-white aria-disabled:bg-white dark:bg-gray-900  dark:disabled:bg-gray-900 dark:aria-disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center"><span class="iconify i-solar:add-folder-linear flex-shrink-0 h-4 w-4" aria-hidden="true"></span><span class="">Create Folder</span></div>
                button at the top to begin.
            </div>
        </div>
    </UNoContent>

    <UNoContent v-else-if="!isObjectEmpty(SelectedFolder) && SelectedFolder.backtests.length == 0">
        <div class="drop-shadow-sm">
            <div class="mb-2">
                You haven't created any backtests yet.
                Create one to get started
            </div>
        </div>
    </UNoContent>

    <UNoContent v-else-if="!isObjectEmpty(SelectedBacktest) && !SelectedBacktest.trades.length">
        <div class="drop-shadow-sm" v-if="!$device.isMobile">
            <div class="mb-2">
                This backtest is empty. You can paste trades from TradingView once done backtesting.
            </div>
            Use 
            <template v-if="$device.isMacOS">
              <UKbd>CMD</UKbd> + <UKbd>V</UKbd>
            </template>
            <template v-if="$device.isWindows">
              <UKbd>CTRL</UKbd> + <UKbd>V</UKbd> 
            </template>

            to paste trades

        </div>
        <div class="drop-shadow-sm" v-else>
          This backtest is empty. You can paste trades from TradingView once done backtesting using a PC
        </div>
        
        <p class="mt-4 italic text-sm drop-shadow-sm">
            Make sure to adjust the position tool in Tradingview to start at the candle where you entered the trade and end at the candle where you exited the trade.
        </p>
    </UNoContent>

    <UNoContent v-else-if="isObjectEmpty(SelectedBacktest) && !isObjectEmpty(SelectedFolder) && SelectedFolder.backtests.length != 0">
        <div class="drop-shadow-sm">
           No backtest is selected. Select one from the dropdown to begin
        </div>
    </UNoContent>

    <UNoContent v-else-if="isObjectEmpty(SelectedFolder)">
        <div class="drop-shadow-sm">
            No folder is selected. Select one from the dropdown to begin
        </div>
    </UNoContent>

</template>