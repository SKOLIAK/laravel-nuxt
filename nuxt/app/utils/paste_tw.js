import dayjs from "dayjs"
import { futureContractsJson } from "@/utils/contracts";
import { tradingSessions } from '@/utils/sessions'
import { timeZones } from "@/utils/global";

import { CreatingBacktest, ObjectData, ViewingBacktest } from "~/utils/backtests";

export const PasteObject = reactive([]);
const ClipboardObject = ref({});
const validTypes = ["long position", "short position", "drawings"];


// @todo from database
const CheckSessions = {
  ADR: { start: '19:30', end: '02:00'},
  ODR: { start: '03:00', end: '08:30'},
  RDR: { start: '09:30', end: '16:00'},
}



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
        buildPasteObject()
        resolve()
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
      //console.warn(ClipboardObject.value);

    console.log("-> TRADINGVIEW PASTE EVENT")
    ClipboardObject.value.sources.forEach((Obj) => {
        /** Make sure that it is actually a TW`s trade tool in case of pasting different `Drawings` */
        let types = ["LineToolRiskRewardLong", "LineToolRiskRewardShort"];
        if (types.includes(Obj.source.type)) {
            let temp = {};
            temp.direction = Obj.source.type.replace("LineToolRiskReward", "").toLowerCase();

            let contractSpecs = futureContractsJson.value.filter(
                (x) => x.symbol == Obj.source.state.symbol.split(":")[1].split("1!")[0]
            );
            if (contractSpecs.length == 0) {
                reject("Missing information for future symbol " + temp.Symbol);
            }

          let ticks = contractSpecs[0].tick;
          let value = contractSpecs[0].value;

          temp.identifier       = Obj.source.id + '_' + contractSpecs[0].symbol
          temp.symbol           = contractSpecs[0].symbol;
          temp.symbol_tw        = Obj.source.state.symbol
          temp.symbolOriginal   = contractSpecs[0].name;
          temp.entryTime        = Obj.source.points[0].time_t;
          temp.exitTime         = Obj.source.points[1].time_t;
          temp.timeframe        = Obj.source.state.interval;
          temp.day_of_week      = Number(dayjs.unix(temp.entryTime).day())
          // Check which session
          temp.session = '-'

          tradingSessions.value.forEach((sess) => {

                let start = sess.start
                let end = sess.end

                let base_date       = dayjs.unix(temp.entryTime).tz(timeZones.value[0]).format("MM-DD-YYYY")
                let session_start   = dayjs(base_date + " " + start).unix()
                let session_end     = dayjs(base_date + " " + end).unix()
                let entry           = dayjs.unix(temp.entryTime).tz(timeZones.value[0]).format("MM-DD-YYYY HH:mm")
                entry = dayjs(entry).unix()

                console.warn(entry)

                // It's an overnight session which crosses midnight, we add One day to end time
                // @todo convert hours to minutes + minutes and compare if start is less than end then it's an overnight session
                if (session_end < session_start) {
                    session_end += 86400
                }

                let in_session = entry >= session_start && entry < session_end

                if (in_session == true) {
                    temp.session = sess.name
                }
          })




        for (const a in CheckSessions) {
            let start = CheckSessions[a].start
            let end = CheckSessions[a].end

            let base_date       = dayjs.unix(temp.entryTime).tz(timeZones.value[0]).format("MM-DD-YYYY")
            let session_start   = dayjs(base_date + " " + start).unix()
            let session_end     = dayjs(base_date + " " + end).unix()
            let entry           = dayjs.unix(temp.entryTime).tz(timeZones.value[0]).format("MM-DD-YYYY HH:mm")
            entry = dayjs(entry).unix()

            //console.warn(entry)

            // It's an overnight session which crosses midnight, we add One day to end time
            if (a == 'ADR') {
                session_end += 86400
            }

            let in_session = entry >= session_start && entry <= session_end

            // console.log(
            //   a + '\n',
            //   base_date + " " + start + '\n',
            //   'Start: ' + dayjs.unix(session_start).format("MM-DD-YYYY HH:mm") + '\n',
            //   'Check: ' + dayjs.unix(entry).format("MM-DD-YYYY HH:mm") + '\n',
            //   'End: ' + dayjs.unix(session_end).format("MM-DD-YYYY HH:mm") + '\n',
            //   in_session)

            if (in_session == true) {
                temp.session = a
                break
            }

          }

            temp.entry = Obj.source.points[0].price;
            temp.target = getTargetPrice(
                temp.direction,
                temp.entry,
                Obj.source.state.profitLevel * ticks
            );
            temp.stop = getStopPrice(temp.direction, temp.entry, Obj.source.state.stopLevel * ticks);
            temp.quantity = Obj.source.state.qty;
            temp.outcome = Obj.source.points[3]
                ? Obj.source.points[3].price == temp.target
                ? "Win"
                : Obj.source.points[3].price == temp.stop
                    ? "Loss"
                    : "BE"
                : "BE";

            temp.rrr = temp.outcome == "Win" ? Number(Math.abs((temp.entry - temp.target) / (temp.entry - temp.stop)).toFixed(2)) : temp.outcome == "Loss" ? -1 : 0

            temp.netProceeds =
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
})}

function getTargetPrice(direction, entry, ticks) {
  return parseFloat(direction == "long" ? entry + ticks : entry - ticks);
}
function getStopPrice(direction, entry, ticks) {
  return parseFloat(direction == "long" ? entry - ticks : entry + ticks);
}
