


export type Trade = {
    identifier: string,
    symbol: string,
    symbol_tw: string,
    direction: "long" | "short",
    symbolOriginal: string,
    timeframe: string,
    entryTime: number,
    exitTime: number,
    day_of_week: number,
    quantity: number,
    entry: number,
    target: number,
    stop: number,
    exit: number,
    outcome: "win" | "loss" | "be",
    rr: number,
    rrr: number,
    fees: number,
    netProceeds: number,
    grossProceeds: number | 0,
    session: string | null,
    type: "future" | "forex"
}