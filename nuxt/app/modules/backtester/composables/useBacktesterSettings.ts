import { createSharedComposable } from "@vueuse/core"

const _useBacktesterSettings = () => {

    const useSessionColors = ref(false)
    const backtesterTypes = ref([
        'Futures'
    ])
    const backtesterType = ref(backtesterTypes.value[0])
    const useSessionsChart = ref(true)

    return {
        useSessionColors,
        backtesterTypes,
        backtesterType,
        useSessionsChart
    };
};

export const useBacktesterSettings = createSharedComposable(_useBacktesterSettings);
