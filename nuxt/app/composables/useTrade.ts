import { createSharedComposable } from "@vueuse/core";

const _useTrade = () => {

    /**
     * Calculate net proceeds for the given parameters
     * @param outcome
     * @param profit_level
     * @param stop_level
     * @param quantity
     * @param tick_value
     * @returns Net proceeds value
     */
    const useGetProceeds = (
        outcome: string,
        profit_level: number,
        stop_level: number,
        quantity: number,
        tick_value: number
    ) => {
        return  outcome == 'win' ? profit_level * quantity * tick_value :
                outcome == 'loss' ? stop_level * quantity * -tick_value : 0
    }

    return { useGetProceeds }
};

export const useTrade = createSharedComposable(_useTrade);
