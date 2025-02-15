import type { Trade } from "@/types";

export const TradeObject = <Trade>{
    symbol            : '',
    direction         : 'long',
    symbol_tw         : '',
    symbolOriginal    : '',
    timeframe         : '1',
    entryTime         : 0,
    exitTime          : 0,
    day_of_week       : 1,
    quantity          : 0,
    entry             : 0,
    target            : 0,
    stop              : 0,
    exit              : 0,
    outcome           : 'be',
    rrr               : 0,
    fees              : 0,
    netProceeds       : 0,
    grossProceeds     : 0,
}
