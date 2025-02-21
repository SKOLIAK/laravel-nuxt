import { createSharedComposable } from "@vueuse/core";
import { futureContractsJson } from "@/utils/contracts";
import type { Trade } from '@/types/index'

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
        return  outcome.toLowerCase() == 'win' ? profit_level * quantity * tick_value :
                outcome.toLowerCase() == 'loss' ? stop_level * quantity * -tick_value : 0
    }

    /**
     * Calculate net proceeds for the given parameters
     * @param outcome
     * @param profit_level
     * @param stop_level
     * @param quantity
     * @param tick_value
     * @returns Net proceeds value
     */
    const useGetProceedsFromTrade = (_trade: Trade) => {
        if (_trade.outcome.toLowerCase() == 'be') { return 0 }

        let contractSpecs = futureContractsJson.value.filter(
            (x) => x.symbol == _trade.symbol
        );

        if (contractSpecs.length == 0) {
            console.log('Missing contract information for symbol ' + _trade.symbol)
            return _trade.netProceeds
        }

        if (_trade.direction.toLowerCase() == 'long') {
            let target = _trade.outcome.toLowerCase() == 'win' ? _trade.target : _trade.stop
            let a = (target - _trade.entry) * _trade.quantity * contractSpecs[0].value
            return a
        } else if (_trade.direction.toLowerCase() == 'short') {
            let target = _trade.outcome.toLowerCase() == 'win' ? _trade.target : _trade.stop
            let a = (_trade.entry - target) * _trade.quantity * contractSpecs[0].value
            return a

        }

    }

    return { useGetProceeds, useGetProceedsFromTrade }
};

export const useTrade = createSharedComposable(_useTrade);
