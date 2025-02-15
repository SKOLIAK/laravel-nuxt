import { createSharedComposable } from "@vueuse/core";
import _ from "lodash";

const _useBacktester = () => {
    const route         = useRoute()
    const router        = useRouter()
    const auth          = useAuthStore()
    const tradingview   = useTWPaste()

    const pluck = (arr, keys) => arr.map(i => keys.map(k => i[k])[0]);

    /** Variables */
    const Folders            = ref([])
    const _SelectedBacktest  = ref({})
    const SelectedFolder     = ref({})
    const FolderModalOpen    = ref(false)
    const ModalOpen          = ref(false)
    const IsDirty            = ref(false)
    const IsSaving           = ref(false)

    /** Compute values for the selected backtest */
    const SelectedBacktest = computed(() => {
        let Obj = Object.assign(<any>ref({}).value, _SelectedBacktest.value)


        if(Obj.trades != undefined && Obj.trades.length > 0) {
            // Calculate win rate percentage
            let wins        = Obj.trades.filter(x => x.outcome == 'win').length
            let losses      = Obj.trades.filter(x => x.outcome == 'loss').length
            Obj.percentage  = wins / (wins + losses)

            // Calculate Total gain in R multiples
            Obj.totalR  = _.sum(pluck(Obj.trades, ['rrr']))

            // Calculate ending balance
            Obj.ending_balance = Number(Obj.starting_balance + _.sum(pluck(Obj.trades, ['netProceeds'])))

            // Calculate difference (gain %) of the backtest
            Obj.gain    = (Obj.ending_balance - Obj.starting_balance) / Obj.starting_balance
        }


        return Obj
    })

    function recalculate() {
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
    const { refresh: fetchFolders } = useFetch<any>("backtesting/groups", {
        immediate: false,
        onResponse({ response }) {
          if (response.status === 200) {
            Folders.value = response._data
            _SelectedBacktest.value = Folders.value[0].backtests[0]
          }
        },
    });

    /** Watch and wait for when the trades have been pasted */
    watch(tradingview.PasteObject.value, () => {
        // ...
    })


    /** Define shortcuts to be used */
    defineShortcuts({});

    /** If backtester is "dirty" (changes made without saving), alert the user before navigating out */
    router.beforeEach(() => {
        if(IsDirty.value == true) {
            // @TODO
            // return confirm('Are you sure you want to leave this page? You have unsaved changes that will be lost.')
        }
    })

    /** On navigate away: clear values */
    watch(
        () => route.fullPath,
        () => {
            IsDirty.value           = false
            IsSaving.value          = false
            FolderModalOpen.value   = false
            ModalOpen.value         = false
            _SelectedBacktest.value = {}
            SelectedFolder.value    = {}

        }
    );

    return {
        fetchFolders,
        Folders,
        SelectedBacktest,
        _SelectedBacktest,
        SelectedFolder,
        FolderModalOpen,
        ModalOpen,
        IsDirty,
        IsSaving,
        recalculate
    };
};

export const useBacktester = createSharedComposable(_useBacktester);
