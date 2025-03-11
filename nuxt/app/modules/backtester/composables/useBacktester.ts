import { createSharedComposable } from "@vueuse/core"
import type { ChartDataRecord } from "~/modules/backtester/types"
import resolveConfig from "tailwindcss/resolveConfig";
import TailwindConfig from "@/tailwind.config";
import _ from "lodash";

const _useBacktester = () => {
  const { theme } = resolveConfig(TailwindConfig)
  const appConfig = useAppConfig();

  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const { PasteObject } = useTradingviewPaste()
  const { useSessionColors } = useBacktesterSettings()

  /** Backtester View */
  const viewTypes = [
    { label: "Table" },
    { label: "Graph" },
  ];
  const selectedView = ref(0);

  /** Autosave */
  const DirtyTimer = ref(null)
  const autosaveDuration = ref(12000)
  const autosaveEnabled = ref(true)


  /** Variables */
  const Folders = ref([])
  const FolderForm = ref()
  const BacktestForm = ref()
  const SelectedBacktest = ref({})
  const SelectedFolder = ref({})
  const SelectedTrades = ref([])
  const FolderModalOpen = ref(false)
  const BacktestModalOpen = ref(false)
  const ModalOpen = ref(false)
  const IsDirty = ref(false)
  const IsSaving = ref(false)
  const selectedTrades = ref([])

  /** Chart Data */
  const ChartData = ref(<ChartDataRecord>{
    riskToReward: [],
    sessionGain: [],
  })
  const RValues = ref({
    mean: 0,
    mode: 0
  })

  /** Define shortcuts to be used */
  defineShortcuts({});

  /** Clear chart date when changing folders */
  watch(SelectedFolder, () => {
    SelectedBacktest.value = {}
    // ChartData.value.sessionGain.splice(0)
    // ChartData.value.riskToReward.splice(0)
    // RValues.value.mean = 0
    // RValues.value.mode = 0
  })

  /** Watch and wait for when the trades have been pasted */
  watch(PasteObject.value, () => {
    if (!isObjectEmpty(SelectedBacktest.value)) {
      PasteObject.value.forEach(trade => {
        SelectedBacktest.value.trades.unshift(trade)
      });

    }
  })

  /** Compute values for the selected backtest */
  const SelectedBacktestComputed = computed(() => {
    let Obj = Object.assign(<any>ref({}).value, SelectedBacktest.value)

    if (!isObjectEmpty(Obj) && Obj.trades != undefined && Obj.trades.length > 0) {
      // Calculate win rate percentage
      let wins = Obj.trades.filter(x => x.outcome.toLowerCase() == 'win').length
      let losses = Obj.trades.filter(x => x.outcome.toLowerCase() == 'loss').length
      Obj.percentage = wins / (wins + losses)

      // Calculate Total gain in R multiples
      Obj.totalR = _.sum(pluck(Obj.trades, ['rrr']))
      // Calculate ending balance
      Obj.ending_balance = Number(Obj.starting_balance + _.sum(pluck(Obj.trades, ['netProceeds'])))

      // Calculate difference (gain %) of the backtest
      Obj.gain = (Obj.ending_balance - Obj.starting_balance) / Obj.starting_balance

      // Calculate mean and median of R Multiple
      let rr_more_than_0 = Obj.trades.filter(x => x.rrr > 0)
      RValues.value.mean = useTwoDecFormat(getMean(pluck(rr_more_than_0, ['rrr'])))
      RValues.value.mode = useTwoDecFormat(getMode(pluck(rr_more_than_0, ['rrr'])))

      let minRR = 0
      let maxRR = 0
      let RRArray = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
      RRArray.forEach((k, v) => {
        /** Collect data to be used in color interpolation for each bar */
        let x = Obj.trades.filter(x => x.rrr >= k && x.rrr < k + 0.5).length
        if (x < minRR) { minRR = x }
        if (x > maxRR) { maxRR = x }
      })

      /** Collect data for Risk-to-Reward Ratio Chart */
      ChartData.value.riskToReward = []
      let countit = 0
      RRArray.forEach((k, v) => {
        let temp = {}
        let x = Obj.trades.filter(x => x.rrr >= k && x.rrr < k + 0.5).length
        //console.log('Range:', k, k + 0.5, 'Found:', x)
        temp.x = countit
        temp.y = x
        temp.color = colorInterpolate(theme.colors[appConfig.ui.gray][700], theme.colors[appConfig.ui.primary][500], ((x - minRR) / (maxRR - minRR)))
        temp.tick = k + '-' + Number(k + 0.5)
        ChartData.value.riskToReward.push(temp)
        countit++
      })



      /** Collect data for Sessions total R gain Chart */
      ChartData.value.sessionGain = []
      if (auth.logged) {
        auth.user.sessions.forEach((session, k) => {
          let temp = {}
          let trades = Obj.trades.filter(x => x.session == session.name)

          temp.x = k
          temp.y = trades.length
          temp.y2 = 0 // total gain
          temp.y3 = 0 // total rrr
          temp.tick = session.name

          let wins = trades.filter(x => x.outcome.toLowerCase() == 'win').length
          let losses = trades.filter(x => x.outcome.toLowerCase() == 'loss').length
          temp.y4 = (wins / (wins + losses)) * 100 // win rate


          let aB = trades.filter(x => x.gain > 0)
          aB.forEach(trade => {
            temp.y2 += (trade.gain * 100)
          });

          trades.forEach(trade => {
            temp.y3 += trade.rrr
          });

          temp.color = useSessionColors.value ? session.color : theme.colors[appConfig.ui.primary][500]

          ChartData.value.sessionGain.push(temp)
        })

        let outside_session = Obj.trades.filter(x => x.session == '-')

        if (outside_session.length) {
          let temp = {}
          let trades = Obj.trades.filter(x => x.session == '-')

          temp.x = auth.user.sessions.length
          temp.y = outside_session.length
          temp.y2 = 0 // total gain
          temp.y3 = 0 // total rrr
          temp.tick = '-'

          let wins = outside_session.filter(x => x.outcome.toLowerCase() == 'win').length
          let losses = outside_session.filter(x => x.outcome.toLowerCase() == 'loss').length
          temp.y4 = (wins / (wins + losses)) * 100 // win rate


          let aB = outside_session.filter(x => x.gain > 0)
          aB.forEach(trade => {
            temp.y2 += (trade.gain * 100)
          });

          outside_session.forEach(trade => {
            temp.y3 += trade.rrr
          });
          temp.color = theme.colors[appConfig.ui.primary][500]
          ChartData.value.sessionGain.push(temp)
        }

        //console.log(ChartData.value.sessionGain)
      }






      // let rRRArray = ['ADR','RDR','ODR']
      // rRRArray.forEach((k, v) => {
      //     let temp = {}
      //     let x = Obj.trades.filter(x => x.session == k).length

      //     //console.log('Range:', k, k + 0.5, 'Found:', x)
      //     temp.x = countit
      //     temp.y =  x
      //     temp.y2 = 50
      //     temp.tick = k
      //     temp.color = getRandomHexColor()
      //     ChartData.value.sessionGain.push(temp)
      //     console.log(k, v)
      // })
    }


    return Obj
  })

  function updateTrade(id: string) {
    if (isObjectEmpty(SelectedBacktest.value)) { return }
    let a = SelectedBacktest.value.trades.filter(x => x.identifier == id)
    if (!a.length) { return }

    console.log(a)
  }

  function recalculate() {
    if (isObjectEmpty(SelectedBacktest.value)) { return }
    console.log('Recalculating')
    let bal = SelectedBacktest.value.starting_balance
    let test = []
    SelectedBacktest.value.trades.forEach(t => {
      t.gain = t.netProceeds / bal
      bal += t.netProceeds
      test.push(t.gain)
    })
    SelectedBacktest.value.test = _.sum(test)
  }

  /** Call methods */
  const { refresh: fetchFolders } = useFetch<any>("backtesting/folders", {
    immediate: false,
    onResponse({ response }) {
      if (response.status === 200) {
        Folders.value = response._data
        console.log('FOLDERS FETCHED')
      }
    },
  });

  async function selectBacktest(_idVal: string = '') {
    return new Promise(async (resolve, reject) => {
      await selectFolder(SelectedFolder.value.id ?? '')
      if (_idVal != '') {
        SelectedBacktest.value = SelectedFolder.value.backtests.filter(x => x.id == _idVal)[0] ?? {}
      }
      resolve(1)
    })
  }

  async function selectFolder(_idVal: string = '') {
    return new Promise(async (resolve, reject) => {
      await fetchFolders()
      if (_idVal != '') {
        SelectedFolder.value = Folders.value.filter(x => x.id == _idVal)[0] ?? {}
      }
      resolve(1)
    })
  }

  async function updateFolder(data) {
    return new Promise(async (resolve, reject) => {
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/folders", {
        method: "POST",
        body: data,
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.status === 422) {

            FolderForm.value.setErrors(response._data?.errors);

          } else if (response?.ok) {
            selectFolder(response._data.data.id)

            FolderModalOpen.value = false
            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        }
      });

    });
  }

  async function createFolder(data) {
    return new Promise(async (resolve, reject) => {
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/folders", {
        method: "PUT",
        body: data,
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.status === 422) {

            FolderForm.value.setErrors(response._data?.errors);

          } else if (response?.ok) {
            selectFolder(response._data.data.id)
            FolderModalOpen.value = false

            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        }
      });

    });
  }

  async function useDeleteFolder(_id) {
    return new Promise(async (resolve, reject) => {

      SelectedFolder.value = {}
      SelectedBacktest.value = {}
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/folders", {
        method: "DELETE",
        body: { id: _id },
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.ok) {
            fetchFolders()

            if (SelectedFolder.value.id == response._data.id) {
              SelectedFolder.value = Folders.value[0]
              SelectedBacktest.value = SelectedFolder.value.backtests[0] ?? {}
            }

            FolderModalOpen.value = false
            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        },
      });

    });
  }


  async function updateBacktest(data) {
    return new Promise(async (resolve, reject) => {
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/backtests", {
        method: "POST",
        body: data,
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.status === 422) {

            BacktestForm.value.setErrors(response._data?.errors);

          } else if (response?.ok) {
            BacktestModalOpen.value = false
            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        }
      });

    });
  }

  async function createBacktest(data) {
    return new Promise(async (resolve, reject) => {
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/backtests", {
        method: "PUT",
        body: data,
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.status === 422) {

            BacktestForm.value.setErrors(response._data?.errors);

          } else if (response?.ok) {
            selectBacktest(response._data.data)
            BacktestModalOpen.value = false

            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        }
      });

    });
  }

  async function useDeleteBacktest(_id) {
    return new Promise(async (resolve, reject) => {

      SelectedBacktest.value = {}
      spinnerLoadingPage.value = true;

      await $fetch("backtesting/backtests", {
        method: "DELETE",
        body: { id: _id },
        onResponse({ response }) {

          spinnerLoadingPage.value = false;

          if (response?.ok) {
            selectBacktest()

            SelectedBacktest.value = SelectedFolder.value.backtests[0] ?? {}


            BacktestModalOpen.value = false
            useToast().add({
              icon: GetSuccessIcon,
              title: response._data.message,
              color: GetSuccessColor,
            });
          }

          resolve(1)

        },
      });

    });
  }

  /** If backtester is "dirty" (changes made without saving), alert the user before navigating out */
  router.beforeEach(() => {
    if (IsDirty.value == true) {
      // @TODO
      // return confirm('Are you sure you want to leave this page? You have unsaved changes that will be lost.')
    }
  })

  /** On navigate away: clear values */
  watch(
    () => route.fullPath,
    () => {
      IsDirty.value = false
      IsSaving.value = false
      FolderModalOpen.value = false
      BacktestModalOpen.value = false
      ModalOpen.value = false
      SelectedBacktest.value = {}
      SelectedFolder.value = {}

    }
  );

  return {
    fetchFolders,
    Folders,
    SelectedBacktestComputed,
    SelectedBacktest,
    SelectedFolder,
    SelectedTrades,
    FolderModalOpen,
    BacktestModalOpen,
    FolderForm,
    BacktestForm,
    ModalOpen,
    IsDirty,
    IsSaving,
    DirtyTimer,
    recalculate,
    ChartData,
    RValues,
    viewTypes,
    selectedView,
    autosaveDuration,
    autosaveEnabled,
    updateTrade,

    createFolder,
    updateFolder,
    useDeleteFolder,

    createBacktest,
    updateBacktest,
    useDeleteBacktest,

    selectedTrades
  };
};

export const useBacktester = createSharedComposable(_useBacktester);
