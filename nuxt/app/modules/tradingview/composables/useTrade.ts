import { createSharedComposable } from "@vueuse/core";
import { futureContractsJson } from "@/utils/contracts";

export const _useUseTrade = () => {

  const GetProceedsFromTicks = (
    symbol: string,
    outcome: "win" | "loss" | "be",
    profit_lvl: number,
    stop_lvl: number,
    quantity: number
  ) => {
    if (outcome == "be") return 0

    let contractSpecs = futureContractsJson.value.filter(
      (x) => x.symbol == symbol
    );

    if (contractSpecs.length == 0) { return 0 }

    return outcome.toLowerCase() == 'win' ? profit_lvl * quantity * contractSpecs[0].value :
      outcome.toLowerCase() == 'loss' ? stop_lvl * quantity * -contractSpecs[0].value : 0
  }


  return {
    GetProceedsFromTicks
  }
}

export const useTrade = createSharedComposable(_useUseTrade);