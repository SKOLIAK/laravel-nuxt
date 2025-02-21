import dayjs from 'dayjs'
import { TradeObject } from '@/utils/trade';
import { createSharedComposable } from "@vueuse/core";
import type { Trade } from "@/types";

const _useTWPaste = () => {

    const _trade    = useTrade()
    const _trader   = useTrader()
    let ClipboardObject = ref(<any>{})
    let PasteObject     = ref([])

    async function pasteTrades(event) {
        return new Promise(async (resolve, reject) => {
            PasteObject.value.splice(0);
            /** Get data from the clipboard */
            let clip = event.clipboardData.getData("text/html")

            /** Check if data from TradingView has been pasted */
            if (clip.includes("data-tradingview-clip")) {

                console.log('   --> Pasting trades from TradingView')

                /** Reconstruct */
                let clipObj = JSON.parse(
                    clip.split('data-tradingview-clip="')[1].split('">')[0].replaceAll("&#34;", '"')
                );

                /** Check if valid paste data */
                const validTypes = ["long position", "short position", "drawings"]
                if (validTypes.includes(clipObj.title.toLowerCase())) {
                    ClipboardObject.value = clipObj
                    await buildPasteObject()
                }

            }
        });
    }

    function getTargetPrice(strategy, entry, ticks) {
        return parseFloat(strategy == "long" ? entry + ticks : entry - ticks)
    }

    function getStopPrice(strategy, entry, ticks) {
        return parseFloat(strategy == "long" ? entry - ticks : entry + ticks)
    }

    function getOutcome(PasteObj: any, target: number, stop: number) {
        return PasteObj.source.points.length == 3 ? 'be'
            : PasteObj.source.points[3].price == target ? 'win' : 'loss'
    }


    async function buildPasteObject() {
        return new Promise(async (resolve, reject) => {
            /** Multiple Object Drawings */
            if(typeof ClipboardObject.value.sources == undefined || !ClipboardObject.value.sources.length) return

            /** Loop through each object */

            ClipboardObject.value.sources.forEach((Obj: any) => {

                /** Pluck out only the position tools */
                let types = ["LineToolRiskRewardLong", "LineToolRiskRewardShort"]
                if (!types.includes(Obj.source.type)) return

                let symbol = Obj.source.state.symbol.split(":")[1].split("1!")[0]

                /** Retrieve information about the security traded */
                let contractSpecs = futureContractsJson.value.filter(
                    (x) => x.symbol == symbol
                );

                if (contractSpecs.length == 0) {
                    reject("Missing information for future symbol " + symbol)
                }

                /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 *  Start Creating Trade Object
                 *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

                /**
                 * Initialise temporary trade object with the skeleton object in order to preserve default values if unchanged
                 * For example: In this case we're not calculating Gross Proceeds, but in non backtesting case we might
                 * @TODO: This is a generic paste object, which will be used everywhere.
                 * Check which case it is.  */
                let trade = Object.assign(<Trade>{}, TradeObject)
                trade.symbol            = contractSpecs[0].symbol
                trade.direction         = Obj.source.type.replace("LineToolRiskReward", "").toLowerCase()
                trade.symbol_tw         = Obj.source.state.symbol
                trade.symbolOriginal    = contractSpecs[0].name
                trade.timeframe         = Obj.source.state.interval
                trade.entryTime         = Obj.source.points[0].time_t
                trade.exitTime          = Obj.source.points[1].time_t
                trade.day_of_week       = Number(dayjs.unix(trade.entryTime).day())
                trade.quantity          = Number(useTwoDecFormat(Obj.source.state.qty.toFixed(2)))
                trade.entry             = Obj.source.points[0].price
                trade.target            = getTargetPrice(
                                            trade.direction,
                                            trade.entry,
                                            Obj.source.state.profitLevel * contractSpecs[0].tick
                                        )
                trade.stop              = getStopPrice(
                                            trade.direction,
                                            trade.entry,
                                            Obj.source.state.stopLevel * contractSpecs[0].tick
                                        )
                trade.outcome           = getOutcome(Obj, trade.target, trade.stop)
                trade.exit              = trade.outcome == 'win' ? trade.target : trade.outcome == 'loss' ? trade.stop : 0

                /** Realised Risk-to-Reward Ratio */
                trade.rrr               = Number(Math.abs((trade.entry - trade.exit) / (trade.entry - trade.stop)).toFixed(2)) * (trade.outcome == 'loss' ? -1 : 1)

                /** Risk-to-Reward Ratio  */
                trade.rr                = Number(Math.abs((trade.entry - trade.target) / (trade.entry - trade.stop)).toFixed(2))

                trade.netProceeds       = _trade.useGetProceeds(
                                            trade.outcome,
                                            Obj.source.state.profitLevel,
                                            Obj.source.state.stopLevel,
                                            trade.quantity,
                                            contractSpecs[0].value
                                        )


                let echangeFees = futuresTradovateFees.value.filter((item) => item.symbol == trade.symbol)
                let commNumber = 0;

                if (echangeFees) {
                    //console.log(" -> exchange fee "+JSON.stringify(echangeFees[0].fee))
                    //console.log(" -> fee "+echangeFees[0].fee[selectedTradovateTier.value])
                    commNumber = echangeFees[0].fee[selectedTradovateTier.value.value] * trade.quantity
                }

                trade.fees              = commNumber
                trade.grossProceeds     = trade.netProceeds - commNumber

                /** Push the generated trade to a final array */
                PasteObject.value.push(trade)
            })

            resolve(1)

        })
    }

    addEventListener("paste", (e) => {
        pasteTrades(e)
    })


    const something = () => {
        return 'something'
    }





  return { PasteObject };
};

export const useTWPaste = createSharedComposable(_useTWPaste);
