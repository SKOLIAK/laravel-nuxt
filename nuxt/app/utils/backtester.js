import { sum } from 'lodash'
import dayjs from 'dayjs'
import { isObjectEmpty } from '@/utils/misc'
import { pasteTrades, PasteObject } from "@/utils/paste_tw";
import { spinnerLoadingPage, spinnerLoadingPageText } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'

let Skeleton = {
  id: null,
  name: 'Skeleton',
  trades: []
}

// This is for the "avg profit per day of week" chart.
// Might want to move it somewhere else...
export const APPDOWChartData = ref({'1': 0, '2': 0, '3': 0, '4': 0, '5': 0,'6': 0, '7': 0})

export const BacktesterDates = ref([])

export const BacktesterObject   = ref({})
export const BacktesterFolders  = ref([])
export const SelectedBacktest   = ref({})
export const SelectedFolder     = ref({})
export const FolderModalOpen    = ref(false)
export const BacktestModalOpen  = ref(false)
export const DirtyTimer         = ref(null)
export const IsDirty            = ref(false)
export const IsSaving           = ref(false)
export const useAutosave        = ref(true)

function addTradesTimer () {
    IsDirty.value = true
    if (DirtyTimer.value) {
        clearTimeout(DirtyTimer.value)
    }

    if(useAutosave.value == true) {
        DirtyTimer.value = setTimeout(async () => {
            await useAddBacktestTrades()
        }, 10000)
    }
}

export const SelectedBacktestEndingBalance = computed(() => {

    if(! SelectedBacktest.value.trades) return SelectedBacktest.value.starting_balance

    let pnls = []

    SelectedBacktest.value.trades.forEach(trade => {
        pnls.push(trade.netProceeds)
    });

    return sum(pnls) + SelectedBacktest.value.starting_balance
})

export const SelectedBacktestWinRate = computed(() => {
    if(isObjectEmpty(SelectedBacktest.value) || !SelectedBacktest.value.trades.length) return 0
    return SelectedBacktest.value.trades.filter(x => x.outcome == 'Win').length / (SelectedBacktest.value.trades.filter(x => x.outcome == 'Win').length + SelectedBacktest.value.trades.filter(x => x.outcome == 'Loss').length)
})

/**
 * Get the trade object with the highest loss
 * @returns Object trade
 */
export function useGetLargestLossTrade() {
    if(isObjectEmpty(SelectedBacktest.value) || !SelectedBacktest.value.trades.length) return {}
    let value = +Infinity
    SelectedBacktest.value.trades.forEach(trade => {
        value = trade.netProceeds < value ? trade.netProceeds : value
    })

    return SelectedBacktest.value.trades.filter(x => x.proceeds == value)[0]
}

export async function useAddBacktestTrades() {
    return new Promise(async (resolve, reject) => {
        IsSaving.value = true
        console.log('\n--> ADDING NEW TRADES FOR "' + SelectedBacktest.value.name + '" BACKTEST')

        try {
            await $fetch("/backtesting/trades", {
              method: "POST",
              body: { id: SelectedBacktest.value.id, data: SelectedBacktest.value.trades },
              onResponse({ response }) {

                IsSaving.value  = false
                IsDirty.value   = false
                console.log(response._data.message)
                if ( response._data?.status != "ok") {
                    useToast().add({
                        icon: GetErrorIcon,
                        title: response._data.message,
                        color: GetErrorColor,
                    });
                }

              },
            });
          } catch (error) {
            IsSaving.value = false;
            reject(error.message);
          }
    })
}

export function computeAPPDOWData(trade) {
    console.log('computing appdow')
    if(isObjectEmpty(SelectedBacktest.value) || !SelectedBacktest.value.trades) return {}

    let count = SelectedBacktest.value.trades.filter(x => x.identifier == trade.identifier).length

    let DayOfWeek = Number(dayjs.unix(trade.entryTime).day())

    if (APPDOWChartData.value[DayOfWeek] != undefined) {
        APPDOWChartData.value[DayOfWeek] = (APPDOWChartData.value[DayOfWeek] + trade.netProceeds) / 2
    } else {
        APPDOWChartData.value[DayOfWeek] = trade.netProceeds
    }



    // Trade hasn't been added yet
    if (count == 0) {
        let temp    = trade
        temp.gain   = ((SelectedBacktestEndingBalance.value + temp.netProceeds) - SelectedBacktestEndingBalance.value) / SelectedBacktestEndingBalance.value

        SelectedBacktest.value.totalR     += Number(temp.rrr)
        SelectedBacktest.value.gain       += Number(temp.gain)


        // For the Avg. Profit per Day of Week chart
        let DayOfWeek = Number(dayjs.unix(trade.entryTime).day())

        if (APPDOWChartData.value[DayOfWeek] != undefined) {
            APPDOWChartData.value[DayOfWeek] = (APPDOWChartData.value[DayOfWeek] + temp.netProceeds) / 2
        } else {
            APPDOWChartData.value[DayOfWeek] = temp.netProceeds
        }

        return temp
    }

    return {}
}

export async function useUpdateBacktestName() {
    return new Promise(async (resolve, reject) => {
        IsSaving.value = true

        try {
            await $fetch("/backtesting", {
              method: "PUT",
              body: {id: SelectedBacktest.value.id, name: SelectedBacktest.value.name},
              onResponse({ response }) {

                IsSaving.value  = false
                IsDirty.value   = false

                if ( response._data?.status != "ok") {
                    useToast().add({
                        icon: GetErrorIcon,
                        title: response._data.message,
                        color: GetErrorColor,
                    });
                }

              },
            });
          } catch (error) {
            IsSaving.value = false;
            reject(error.message);
          }
    })
}



export async function PasteBacktesterTrades(_event) {
    return new Promise(async (resolve, reject) => {
        try {

            /** Only if we're interacting with a backtest can we paste trades */
            if (isObjectEmpty(SelectedBacktest)) { resolve(); return }

            await pasteTrades(_event)

            //
            let initTimer = false

            PasteObject.forEach(trade => {
                let x = computeAPPDOWData(trade)

                if (!isObjectEmpty(x)) {
                    SelectedBacktest.value.trades.unshift(x)
                }

            });

            initTimer = true

            /** Initialise timer to autosave trades to parse */
            if(initTimer) {
                await (IsDirty.value = true)
                addTradesTimer()
            }

            resolve();
        } catch (error) {
            reject(error.message);
        }
    })
}



export async function useCreateBacktest(_Data) {
    return new Promise(async (resolve, reject) => {
        console.log("--> CREATING NEW BACKTEST");

        spinnerLoadingPage.value = true;
        spinnerLoadingPageText.value = 'Creating Backtest...';

        try {
          await $fetch("/backtesting", {
            method: "POST",
            body: _Data,
            onResponse({ response }) {

              spinnerLoadingPage.value = false;
              if (response._data?.status == "ok") {
                BacktestModalOpen.value = false
                useGetFolders()

                // Snap to a newly created backtest
                SelectedFolder.value = BacktesterFolders.value.filter(x => x.id == _Data.group.id)[0]
                SelectedBacktest.value = SelectedFolder.value.backtests.filter(x => x.id == response._data.data)[0]

                resolve()
              }
              useToast().add({
                icon: response._data?.status == "ok" ? GetSuccessIcon : GetErrorIcon,
                title: response._data.message,
                color: response._data?.status == "ok" ? GetInfoColor : GetErrorColor,
              });
            },
          });
        } catch (error) {
          spinnerLoadingPage.value = false;
          FolderModalOpen.value = false
          reject(error.message);
        }
      });
}

export async function useDeleteBacktest(_Id, _Folder) {
    return new Promise(async (resolve, reject) => {
        console.log("--> DELETEING A BACKTEST");

        spinnerLoadingPage.value = true
        spinnerLoadingPageText.value = 'Deleting backtest...'


        try {
            await $fetch("backtesting", {
                method: "DELETE",
                body: { id: _Id, group_id: _Folder },
                onResponse({ response }) {
                    spinnerLoadingPage.value = false;
                    if (response._data?.status == "ok") {
                        useGetFolders()
                    }

                    useToast().add({
                        icon:response._data?.status == "ok" ? GetSuccessIcon : GetErrorIcon,
                        title: response._data.message,
                        color: GetInfoColor,
                    });
                },
            });
        } catch (error) {
            spinnerLoadingPage.value = false;
            reject(error.message);
        }
    })
}

export async function useGetFolders() {
    return new Promise(async (resolve, reject) => {
        console.log("--> FETCHING BACKTESTING FOLDERS");
        BacktesterFolders.value = [];
        SelectedFolder.value = {}
        SelectedFolder.value = {}
        SelectedBacktest.value = {}
        spinnerLoadingPage.value = true;
        spinnerLoadingPageText.value = 'Fetching folders...'
        try {
            await $fetch("backtesting/groups", {
                method: "GET",
                onResponse({ response }) {

                if ((response._data.status = "ok" && response._data.length > 0)) {
                    response._data.forEach((element) => {
                        BacktesterFolders.value.push(element);
                    });

                    SelectedFolder.value = BacktesterFolders.value[0]
                }
                resolve();
                spinnerLoadingPage.value = false;
                },
            });
        } catch (error) {
            reject(error.message);
            spinnerLoadingPage.value = false;
        }
    });
}

export async function useCreateFolder(data) {
  return new Promise(async (resolve, reject) => {
    console.log("--> CREATING NEW BACKTESTING FOLDER");
    BacktesterFolders.value = [];
    SelectedFolder.value = {}
    SelectedBacktest.value = {}
    spinnerLoadingPage.value = true;
    spinnerLoadingPageText.value = 'Creating Folder...';
    try {
      await $fetch("backtesting/groups", {
        method: "POST",
        body: data,
        onResponse({ response }) {
          spinnerLoadingPage.value = false;
          if (response._data?.status == "ok") {
            FolderModalOpen.value = false
            useGetFolders()
            resolve()
          }
          useToast().add({
            icon: response._data?.status == "ok" ? GetSuccessIcon : GetErrorIcon,
            title: response._data.message,
            color: response._data?.status == "ok" ? GetSuccessColor : GetErrorColor,
          });
        },
      });
    } catch (error) {
      spinnerLoadingPage.value = false;
      FolderModalOpen.value = false
      reject(error.message);
    }
  });
}

export async function useDeleteFolder(_FolderID) {
  return new Promise(async (resolve, reject) => {
    console.log("--> DELETING BACKTESTING FOLDER");
    BacktesterFolders.value = [];
    SelectedFolder.value = {}
    SelectedBacktest.value = {}
    spinnerLoadingPage.value = true;
    spinnerLoadingPageText.value = 'Deleting Folder...';

    try {
      await $fetch("backtesting/groups", {
        method: "DELETE",
        body: { id: _FolderID },
        onResponse({ response }) {
          spinnerLoadingPage.value = false;
          if (response._data?.status == "ok") {
            FolderModalOpen.value = false
            useGetFolders()
            useToast().add({
                icon: GetSuccessIcon,
                title: 'Folder has been deleted',
                color: GetInfoColor,
              });
          }
        },
      });
    } catch (error) {
        FolderModalOpen.value = false
        spinnerLoadingPage.value = false;
        reject(error.message);
    }
  });
}
