import { futureContractsJson } from "./contracts";

export const PasteObject = reactive([]);
const ClipboardObject = ref({});
const validTypes = ["long position", "short position", "drawings"];

export function pasteTrades(event) {
  return new Promise((resolve, reject) => {
    PasteObject.splice(0);
    /** Get data from the clipboard */
    let clip = event.clipboardData.getData("text/html");

    /** Check if data from TradingView has been pasted */
    if (clip.includes("data-tradingview-clip")) {
      /** Reconstruct */
      let clipObj = JSON.parse(
        clip.split('data-tradingview-clip="')[1].split('">')[0].replaceAll("&#34;", '"')
      );

      /** Check if valid paste data */
      if (validTypes.includes(clipObj.title.toLowerCase())) {
        ClipboardObject.value = clipObj;
        buildPasteObject();
      }
    }
  });
}

function buildPasteObject() {
  return new Promise((resolve, reject) => {
    /** Multiple Object Drawings */
    if (
      typeof ClipboardObject.value.sources != undefined &&
      ClipboardObject.value.sources.length > 0
    ) {
      console.warn(ClipboardObject.value);

      ClipboardObject.value.sources.forEach((Obj) => {
        /** Make sure that it is actually a TW`s trade tool in case of pasting different `Drawings` */
        let types = ["LineToolRiskRewardLong", "LineToolRiskRewardShort"];
        if (types.includes(Obj.source.type)) {
          let temp = {};
          temp.strategy = Obj.source.type.replace("LineToolRiskReward", "").toLowerCase();

          let contractSpecs = futureContractsJson.value.filter(
            (x) => x.symbol == Obj.source.state.symbol.split(":")[1].split("1!")[0]
          );
          if (contractSpecs.length == 0) {
            reject("Missing information for future symbol " + temp.Symbol);
          }

          let ticks = contractSpecs[0].tick;
          let value = contractSpecs[0].value;

          temp.symbol = contractSpecs[0].symbol;
          temp.symbolOriginal = contractSpecs[0].name;
          temp.entryTime = Obj.source.points[0].time_t;
          temp.entry = Obj.source.points[0].price;
          temp.target = getTargetPrice(
            temp.strategy,
            temp.entry,
            Obj.source.state.profitLevel * ticks
          );
          temp.stop = getStopPrice(temp.strategy, temp.entry, Obj.source.state.stopLevel * ticks);
          temp.rrr = Math.abs((temp.entry - temp.target) / (temp.entry - temp.stop)).toFixed(2);
          temp.quantity = Obj.source.state.qty;
          temp.outcome = Obj.source.points[3]
            ? Obj.source.points[3].price == temp.target
              ? "Win"
              : Obj.source.points[3].price == temp.stop
                ? "Loss"
                : "BE"
            : "BE";
          temp.proceeds =
            temp.outcome == "Win"
              ? Obj.source.state.profitLevel * temp.quantity * value
              : temp.outcome == "Loss"
                ? Obj.source.state.stopLevel * temp.quantity * -value
                : 0;

          PasteObject.push(temp);
        }
      });
    }
    resolve();
  });
}

function getTargetPrice(strategy, entry, ticks) {
  return parseFloat(strategy == "long" ? entry + ticks : entry - ticks);
}
function getStopPrice(strategy, entry, ticks) {
  return parseFloat(strategy == "long" ? entry - ticks : entry + ticks);
}
