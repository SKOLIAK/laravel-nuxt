import { spinnerLoadingPage, spinnerLoadingPageText } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'
import { PasteObject } from '@/utils/paste_tw'
import type { Backtest } from '~/types'



export const BacktestFolders      = ref([])

export const ObjectData           = ref<Backtest>({
    id: null,
    name: getRandomNameString(),
    starting_balance: 50000,
    ending_balance: 50000,
    wins: 0,
    losses: 0,
    break_evens: 0,
    gain: 0,
    totalR: 0,
    group: {},
    trades: [],
    symbols: []
})

export const ViewBacktestData     = ref({})
export const ViewingBacktest      = ref(false)
watch(ViewBacktestData, (a) => { ViewingBacktest.value = ViewBacktestData.value.name ?? false })

export const CreateBacktestData   = ref({})
export const CopyBacktestData     = ref({})

export const CreatingBacktest     = ref(false)
watch(CreateBacktestData, (a) => { CreatingBacktest.value = JSON.stringify(CreateBacktestData.value) != '{}' ? true : false })

watch(ObjectData, (a) => { ViewBacktestData.value = ObjectData.value })

export function createBacktest() {
    console.log("\n✅ CREATING A NEW BACKTEST");
    CreateBacktestData.value = ObjectData
}





export const isModalOpen = ref(false)

export const creatingABacktest = ref(false)
export const backtestCopy = ref({})

export const makingBacktestCopy = ref(false)


export const newBacktestData = reactive<Backtest>({
  group: {},
  starting_balance: 50000,
  ending_balance: 50000,
  name: getRandomNameString(),
  wins: 0,
  losses: 0,
  break_evens: 0,
  gain: 0,
  totalR: 0,
  trades: 0,
  symbols: [],
  trades: []
})


export function getSessionGain(_session) {
  let gain = 0
  newBacktestData.trades.filter(x => x.session == _session).forEach((t) => {
    gain += t.gain
  })

  return gain
}


export async function useGetGroups() {
  return new Promise(async (resolve, reject) => {
    console.log("--> Getting backtest groups");
    spinnerLoadingPage.value = true;
    spinnerLoadingPageText.value = 'Fetching folders...'
    try {
      await $fetch("/backtesting/groups", {
        method: "GET",
        onResponse({ response }) {
          if ((response._data.status = "ok")) {
            BacktestFolders.value = [];
            console.log(response._data);
            response._data.forEach((element) => {

              BacktestFolders.value.push(element);
            });
            console.log(
              " -> Finished getting existing backtesting groups (" + BacktestFolders.length + ")"
            );
          }
          resolve();
          spinnerLoadingPage.value = false;
          isModalOpen.value = false;
        },
      });
    } catch (error) {
      reject(error.message);
      spinnerLoadingPage.value = false;
      isModalOpen.value = false;
    }
  });
}

export async function useDeleteGroup(groupId) {
  return new Promise(async (resolve, reject) => {
    console.log("--> Deleting backtesting group");
    BacktestFolders.value = [];
    spinnerLoadingPage.value = true;
    spinnerLoadingPageText.value = 'Deleting Folder...';
    try {
      await $fetch("/backtesting/groups", {
        method: "DELETE",
        body: { id: groupId },
        onResponse({ response }) {
          spinnerLoadingPage.value = false;
          if (response._data?.status == "ok") {
            useGetGroups();
          }
        },
      });
    } catch (error) {
      spinnerLoadingPage.value = false;
      reject(error.message);
    }
  });
}

export async function useCreateGroup(data) {
  return new Promise(async (resolve, reject) => {
    console.log("--> Creating backtesting group");
    BacktestFolders.value = [];
    spinnerLoadingPage.value = true;
    spinnerLoadingPageText.value = 'Creating Folder...';
    try {
      await $fetch("/backtesting/groups", {
        method: "POST",
        body: data,
        onResponse({ response }) {
          spinnerLoadingPage.value = false;
          if (response._data?.status == "ok") {
            useGetGroups();
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
      reject(error.message);
    }
  });
}
