import dayjs from "dayjs";
import _ from "lodash";

import { useCreateBlotter, useCreatePnL } from "./add_trades";
import { dateRangeUnix } from "./dateRange";
import {
  filteredTrades,
  filteredTradesDaily,
  filteredTradesTrades,
  hasData,
  spinnerLoadingPageText,
  totals,
  totalsByDate,
  traderTimeZone,
  useDateTimeFormat,
} from "./global";

export const TradesData = reactive([]);
export const executions = reactive({});
export const existingTradesArray = reactive([]);
export const gotExistingTradesArray = ref(false);
export const existingImports = reactive([]);
export const blotter = reactive({});
export const pAndL = reactive({});

export const trades = reactive([]);




export async function useGetFilteredTrades(param) {
  console.info("\n✅ GETTING FILTERED TRADES");
  return new Promise(async (resolve, reject) => {
    await useGetTrades();

    /*============= 4 - Apply filter to trades =============

    * We filter by date range, position, account by looping/creating trades column
    * New variable will be called filteredTrades
    ***************************************************/

    console.log(
      " -> Filtering trades (" +
        useDateTimeFormat(dateRangeUnix.start, false) +
        " - " +
        useDateTimeFormat(dateRangeUnix.end, false) +
        ")"
    );
    spinnerLoadingPageText.value = "Filtering...";

    filteredTrades.length = 0;
    filteredTradesDaily.length = 0;
    filteredTradesTrades.length = 0;

    let loopTrades = (param1) => {
      console.log("param1 " + JSON.stringify(param1))
      let looped = [];

      param1.forEach((value, key) => {
        for (let k in value) {
          let data = value[k];
          if (looped.includes(k)) {
            /**
             * Sometimes there's a behaviour where the same trades gets added twice into the final array
             * resulting in false values. Observed when: Changing to yearly/6 monthly on range selector
             */
            console.warn("--> Stopping overloop");
            break;
          }
          looped.push(k);

          console.log(" -> Looping " + k);

          let temp = _.omit(data, ["trades", "pAndL", "blotter"]);

          // Use format as there are some kind of issue where it display one month less
          // when using month(), date(), year()
          temp.date = dayjs.unix(k).tz(traderTimeZone.value).format("DD");
          temp.month = dayjs.unix(k).tz(traderTimeZone.value).format("MM");
          temp.year = dayjs.unix(k).tz(traderTimeZone.value).format("YYYY");
          temp.dateUnix = k;
          temp.trades = [];
          //console.log('Date ' + temp.year + '/' + temp.month + "/" + temp.date)

          // if (router.currentRoute.value.name == 'daily') {
          //   ... Do the daily page stuff here @todo
          // }

          data.trades.forEach((t) => {
            if (t.side == "long") {
              t.priceVar = t.entryPrice - t.exitPrice;
            } else {
              t.priceVar = t.exitPrice - t.entryPrice;
            }

            // @todo Trade Tags
            // @todo Day Tags

            // console.warn('trade', t.td)
            // console.warn('selected', dateRangeUnix.value.start)
            // console.warn('Is withing range? ' + (dateRangeUnix.value.start == 0 && dateRangeUnix.value.end == 0 ? t.td >= dateRangeUnix.value.start : t.td >= dateRangeUnix.value.start && t.td < dateRangeUnix.value.end))

            if (
              dateRangeUnix.value.start == 0 && dateRangeUnix.value.end == 0
                ? t.td >= dateRangeUnix.value.start
                : t.td >= dateRangeUnix.value.start && t.td < dateRangeUnix.value.end
            ) {
              // @todo Other conditions
              temp.trades.push(t);
              //console.warn(JSON.stringify(temp))
              filteredTradesTrades.push(t);
            }
          });

          if (temp.trades.length > 0) {
            filteredTrades.push(temp);
          }
        }

        //console.log('filteredTrades ' + JSON.stringify(filteredTrades))
        //console.log('filteredTradesTrades ' + JSON.stringify(filteredTradesTrades))
      });

      /*
      if (param1.length > 0) hasData.value = true //I do reverse, that is start with true so that on page load No Data does not appear
      param1.forEach(element => {
        //console.log(" -> Looping "+element.dateUnix)
        //console.log("trades "+JSON.stringify(element.trades))
        //console.log(" element " + JSON.stringify(element))

        if (element.trades) {
          let temp = _.omit(element, ["trades", "pAndL", "blotter"]) //We recreate trades and pAndL
          temp.trades = []

          //we need to get date, month and year in order to compare for calendar creation
          temp.date = dayjs.unix(element.dateUnix).tz(timeZoneTrade.value).date()
          temp.month = dayjs.unix(element.dateUnix).tz(timeZoneTrade.value).month()
          temp.year = dayjs.unix(element.dateUnix).tz(timeZoneTrade.value).year()

          if (pageId.value == "daily") {

            //Adding satisfaction for daily page
            temp.satisfaction = null
            for (let index = 0; index < satisfactionArray.length; index++) {
              const el = satisfactionArray[index];
              if (el.dateUnix == element.dateUnix) {
                //console.log("satisfaction "+el.satisfaction)
                temp.satisfaction = el.satisfaction
              }
            }
          }

          //console.log("element "+JSON.stringify(element))
          element.trades.forEach(element => {
            element = _.omit(element, ["excursions"]) //We recreate trades and omit excursions

            //console.log("element "+JSON.stringify(element))
            if (element.side == "long") {
              element.priceVar = element.entryPrice - element.exitPrice
            } else {
              element.priceVar = element.exitPrice - element.entryPrice
            }

            let tradeTagsSelected = false
            let selectedTagsArray = Object.values(selectedTags.value)

            //console.log(" tags "+JSON.stringify(tags))
            //console.log(" element "+JSON.stringify(element))

            //Check if trade(Id) is present in tags list for Trades
            let tagsIndex = tags.findIndex(obj => obj.tradeId == element.id)
            if (tagsIndex != -1) {
              //console.log(" -> selected tags "+Object.values(selectedTags.value))
              //console.log(" -> trade tags " + JSON.stringify(tags[tagsIndex].tags))
              //console.log(" includes ? "+selectedTagsArray.some(value => tags[tagsIndex].tags.find(obj => obj === value)))

              //Case/check if tag_id is present in selectedTagsArray
              if (selectedTagsArray.some(value => tags[tagsIndex].tags.find(obj => obj === value))) {
                tradeTagsSelected = true
              }

              //If its not present, there may be the case where array is null, but 'No tags' is still selected
              if (tags[tagsIndex].tags.length == 0 && selectedTagsArray.includes("t000t")) {
                tradeTagsSelected = true
              }
            }

            //If not, check if no tags is selected or not
            else {
              if (selectedTagsArray.includes("t000t")) {
                tradeTagsSelected = true
              }
            }

            //Check if trade(Id) is present in tags list for Daily tags
            let dayTagsIndex = tags.findIndex(obj => obj.tradeId == element.td)
            if (dayTagsIndex != -1) {
              //console.log(" -> selected tags "+Object.values(selectedTags.value))
              //console.log(" -> trade tags " + JSON.stringify(tags[dayTagsIndex].tags))
              //console.log(" includes ? "+selectedTagsArray.some(value => tags[dayTagsIndex].tags.find(obj => obj === value)))

              //Case/check if tag_id is present in selectedTagsArray
              if (selectedTagsArray.some(value => tags[dayTagsIndex].tags.find(obj => obj === value))) {
                tradeTagsSelected = true
              }

              //If its not present, there may be the case where array is null, but 'No tags' is still selected
              if (tags[dayTagsIndex].tags.length == 0 && selectedTagsArray.includes("t000t")) {
                tradeTagsSelected = true
              }
            }

            //If not, check if no tags is selected or not
            else {
              if (selectedTagsArray.includes("t000t")) {
                tradeTagsSelected = true
              }
            }

            let tradeSatisfaction = null
            for (let index = 0; index < satisfactionTradeArray.length; index++) {
              const el = satisfactionTradeArray[index];
              if (el.tradeId == element.id) {
                tradeSatisfaction = el.satisfaction
              }
            }

            if ((selectedRange.value.start === 0 && selectedRange.value.end === 0 ? element.td >= selectedRange.value.start : element.td >= selectedRange.value.start && element.td < selectedRange.value.end) && selectedPositions.value.includes(element.strategy) && selectedAccounts.value.includes(element.account) && tradeTagsSelected) {

              ///
               // We're using tempArray to be able to group
               // However, as we want to group only the selected tags, we need to check if tag.id is included in selectedTagsArray
              //

              //console.log(" -> trade tags " + JSON.stringify(tags[tagsIndex]))
              let tempArray = []
              if (tags[tagsIndex] != undefined) {
                for (let index = 0; index < tags[tagsIndex].tags.length; index++) {
                  const tagsElement = tags[tagsIndex].tags[index];
                  for (let obj of availableTags) {
                    for (let tag of obj.tags) {
                      if (tag.id === tagsElement && selectedTagsArray.includes(tag.id)) { // as you can have several tags per trade or day, we filter out only the once that are in selectedArray
                        //console.log(" selectedTagsArray "+selectedTagsArray)
                        //console.log(" in selected array " +selectedTagsArray.includes(tag.id))
                        //console.log(" tag "+JSON.stringify(tag))
                        let temp = {}
                        temp.id = tag.id
                        temp.name = tag.name
                        tempArray.push(temp)
                      }
                    }
                  }
                  //let index = availableTags.findIndex(obj)
                  //console.log(" tempArray "+JSON.stringify(tempArray))

                }
              }

              if (tags[dayTagsIndex] != undefined) {

                for (let index = 0; index < tags[dayTagsIndex].tags.length; index++) {
                  const tagsElement = tags[dayTagsIndex].tags[index];
                  for (let obj of availableTags) {
                    for (let tag of obj.tags) {
                      if (tag.id === tagsElement && selectedTagsArray.includes(tag.id)) { // as you can have several tags per trade or day, we filter out only the once that are in selectedArray
                        //console.log(" selectedTagsArray "+selectedTagsArray)
                        //console.log(" in selected array " +selectedTagsArray.includes(tag.id))
                        //console.log(" tag "+JSON.stringify(tag))
                        let temp = {}
                        temp.id = tag.id
                        temp.name = tag.name
                        tempArray.push(temp)
                      }
                    }
                  }
                  //let index = availableTags.findIndex(obj)
                  //console.log(" tempArray "+JSON.stringify(tempArray))
                }
              }

              element.tags = tempArray

              //console.log(" element "+JSON.stringify(element))
              element.satisfaction = tradeSatisfaction


              element.stopLoss = null
              element.maePrice = null
              element.mfePrice = null

              let indexExcursion = excursions.findIndex(obj => obj.tradeId == element.id)
              if (indexExcursion != -1) {
                if (excursions[indexExcursion].stopLoss) element.stopLoss = excursions[indexExcursion].stopLoss
                if (excursions[indexExcursion].maePrice) element.maePrice = excursions[indexExcursion].maePrice
                if (excursions[indexExcursion].mfePrice) element.mfePrice = excursions[indexExcursion].mfePrice
              }

              //
               // CALC OPTIMIZATION
               //



              temp.trades.push(element)

              filteredTradesTrades.push(element)
              //console.log(" -> Temp trades "+JSON.stringify(temp.trades))
            }
          });
          // Just use the once that have recreated trades (or else daily was showing last 3 months and only one month with trades data)
          if (temp.trades.length > 0) {
            filteredTrades.push(temp)
          }
        }
      }); */
    };

    //console.log("trades " + JSON.stringify(trades))
    //console.log("filteredTrades " + JSON.stringify(filteredTrades))

    loopTrades(trades[0]);

    console.log(" dateRange.value.start " + dateRange.value.start);
    //console.log(" -> Filtered trades of trades " + JSON.stringify(filteredTradesTrades))
    await useCreateBlotter(true);
    await useCreatePnL();
    //console.log(" Blotter " + JSON.stringify(blotter))
    //console.log(" P and L " + JSON.stringify(pAndL))
    let keys = Object.keys(pAndL);
    //console.log(" keys " + keys)

    //console.log(" -> Filtered trades " + JSON.stringify(filteredTrades))
    for (const key of keys) {
      let index;
      index = filteredTrades.findIndex((obj) => obj.dateUnix == key);
      //console.warn('index ' + index)

      filteredTrades[index].pAndL = pAndL[key];
      filteredTrades[index].blotter = blotter[key];
    }

    filteredTrades.sort((a, b) => {
      return b.dateUnix - a.dateUnix;
    });

    //console.log(" -> Filtered trades new " + JSON.stringify(filteredTrades))
    console.log("\nFinished getting filtered trades\n\n");
    hasData.value = true;
    resolve();
  });
}

export async function useTotalTrades() {
  console.log("\n✅ CREATING TOTAL TRADES");
  return new Promise(async (resolve, reject) => {
    /* Variables */
    let temp1 = [];
    let temp2 = {};
    let temp3 = {};

    var totalQuantity = 0;

    var totalCommission = 0;
    var totalFees = 0;

    var totalGrossProceeds = 0;
    var totalGrossWins = 0;
    var totalGrossLoss = 0;
    var totalGrossSharePL = 0;
    var totalGrossSharePLWins = 0;
    var totalGrossSharePLLoss = 0;
    var highGrossSharePLWin = 0;
    var highGrossSharePLLoss = 0;

    var totalNetProceeds = 0;
    var totalNetWins = 0;
    var totalNetLoss = 0;
    var totalNetSharePL = 0;
    var totalNetSharePLWins = 0;
    var totalNetSharePLLoss = 0;
    var highNetSharePLWin = 0;
    var highNetSharePLLoss = 0;

    var totalExecutions = 0;
    var totalTrades = 0;

    var totalGrossWinsQuantity = 0;
    var totalGrossLossQuantity = 0;
    var totalGrossWinsCount = 0;
    var totalGrossLossCount = 0;

    var totalNetWinsQuantity = 0;
    var totalNetLossQuantity = 0;
    var totalNetWinsCount = 0;
    var totalNetLossCount = 0;
    var financials = {};

    //console.log("filtered trades " + JSON.stringify(filteredTrades[0].trades))

    /*============= 1- CREATING GENERAL TOTALS =============

    * needed for dashboard
    * we start by iterating trades to created totals
    * Note: during iteration, we will also push to create a list of trades needed for grouping
    * Then we prepare a json that we push to totals
    */

    /* 1a - In each filtered trade, we will iterate trade to create totals */
    //console.log("filteredTrades  " + JSON.stringify(filteredTrades))

    filteredTrades.forEach((element, index) => {
      element.trades.forEach((el) => {
        /*============= NOTE - Creating list of trades =============

        * at the same time, we will push each trade inside trades
        * that way we have a list of trades that we can group
        * according to grouping need (per date but also entry, strategy, etc.)
        */

        temp1.push(el);

        /******************** */

        totalQuantity += parseFloat(el.buyQuantity) + parseFloat(el.sellQuantity);
        totalCommission += parseFloat(el.commission);

        totalGrossProceeds += parseFloat(el.grossProceeds); //Total amount of proceeds
        totalGrossWins += parseFloat(el.grossWins);
        totalGrossLoss += parseFloat(el.grossLoss);
        totalGrossSharePL += parseFloat(el.grossSharePL);
        //console.log(" totalGrossProceeds "+totalGrossProceeds)

        totalGrossSharePLWins += parseFloat(el.grossSharePLWins);
        totalGrossSharePLLoss += parseFloat(el.grossSharePLLoss);

        if (el.grossSharePL >= 0) {
          if (el.grossSharePL > highGrossSharePLWin) {
            highGrossSharePLWin = parseFloat(el.grossSharePL);
          }
        }
        if (el.grossSharePL < 0) {
          if (el.grossSharePL < highGrossSharePLLoss) {
            highGrossSharePLLoss = parseFloat(el.grossSharePL);
          }
        }

        totalNetProceeds += parseFloat(el.netProceeds);
        totalNetWins += parseFloat(el.netWins);
        totalNetLoss += parseFloat(el.netLoss);
        totalNetSharePL += parseFloat(el.netSharePL);
        totalNetSharePLWins += parseFloat(el.netSharePLWins);
        totalNetSharePLLoss += parseFloat(el.netSharePLLoss);
        //el.highNetSharePLWin > highNetSharePLWin ? highNetSharePLWin = el.highNetSharePLWin : highNetSharePLWin = highNetSharePLWin
        //el.highNetSharePLLoss < highNetSharePLLoss ? highNetSharePLLoss = el.highNetSharePLLoss : highNetSharePLLoss = highNetSharePLLoss
        if (el.netSharePL >= 0) {
          if (el.netSharePL > highNetSharePLWin) {
            highNetSharePLWin = parseFloat(el.netSharePL);
          }
        }
        if (el.netSharePL < 0) {
          if (el.netSharePL < highNetSharePLLoss) {
            highNetSharePLLoss = parseFloat(el.netSharePL);
          }
        }

        totalExecutions += parseFloat(el.executionsCount);
        totalTrades += parseFloat(el.tradesCount);
        totalGrossWinsQuantity += parseFloat(el.grossWinsQuantity);
        totalGrossLossQuantity += parseFloat(el.grossLossQuantity);
        totalGrossWinsCount += parseFloat(el.grossWinsCount); //Total number/count of gross winning trades
        totalGrossLossCount += parseFloat(el.grossLossCount); //Total number/count of gross losing trades

        totalNetWinsQuantity += parseFloat(el.netWinsQuantity);
        totalNetLossQuantity += parseFloat(el.netLossQuantity);
        totalNetWinsCount += parseFloat(el.netWinsCount); //Total number/count of net winning trades
        totalNetLossCount += parseFloat(el.netLossCount); //Total number/count of net losing trades
        financials += parseFloat(el.financials); //Total number/count of net losing trades
      });
    });

    /* 1b - Create a json that we push to totals */

    /*******************
     * Info
     *******************/
    temp2.quantity = totalQuantity;

    /*******************
     * Commissions and fees
     *******************/
    temp2.commission = totalCommission;
    temp2.fees = totalFees;

    /*******************
     * Gross proceeds and P&L
     *******************/
    temp2.grossProceeds = totalGrossProceeds;
    temp2.grossWins = totalGrossWins;
    temp2.grossLoss = totalGrossLoss;
    temp2.grossSharePL = totalGrossSharePL;
    /*totalGrossWinsQuantity == 0 ? temp2.grossSharePLWins = 0 : temp2.grossSharePLWins = (totalGrossWins / totalGrossWinsQuantity)
    totalGrossLossQuantity == 0 ? temp2.grossSharePLLoss = 0 : temp2.grossSharePLLoss = totalGrossLoss / totalGrossLossQuantity*/
    temp2.grossSharePLWins = totalGrossSharePLWins;
    temp2.grossSharePLLoss = totalGrossSharePLLoss;
    temp2.highGrossSharePLWin = highGrossSharePLWin;
    temp2.highGrossSharePLLoss = highGrossSharePLLoss;

    /*******************
     * Net proceeds and P&L
     *******************/
    temp2.netProceeds = totalNetProceeds;
    temp2.netFeesProceeds = totalNetProceeds - temp2.otherFees;
    temp2.netWins = totalNetWins;
    temp2.netLoss = totalNetLoss;
    temp2.netSharePL = totalNetSharePL;
    /*totalNetWinsQuantity == 0 ? temp2.netSharePLWins = 0 : temp2.netSharePLWins = totalNetWins / totalNetWinsQuantity
    totalNetLossQuantity == 0 ? temp2.netSharePLLoss = 0 : temp2.netSharePLLoss = totalNetLoss / totalNetLossQuantity*/
    temp2.netSharePLWins = totalNetSharePLWins;
    temp2.netSharePLLoss = totalNetSharePLLoss;
    temp2.highNetSharePLWin = highNetSharePLWin;
    temp2.highNetSharePLLoss = highNetSharePLLoss;
    temp2.netProceedsEstimations = temp2.grossProceedsEstimations - temp2.feesEstimations; // @todo sketchy here all estimations
    temp2.netWinsEstimations = temp2.grossWinsEstimations - temp2.feesEstimations;
    temp2.netLossEstimations = temp2.grossLossEstimations - temp2.feesEstimations;

    /*******************
     * Counts
     *******************/
    temp2.executions = totalExecutions;
    temp2.trades = totalTrades;

    temp2.grossWinsQuantity = totalGrossWinsQuantity;
    temp2.grossLossQuantity = totalGrossLossQuantity;
    temp2.grossWinsCount = totalGrossWinsCount;
    temp2.grossLossCount = totalGrossLossCount;

    temp2.netWinsQuantity = totalNetWinsQuantity;
    temp2.netLossQuantity = totalNetLossQuantity;
    temp2.netWinsCount = totalNetWinsCount;
    temp2.netLossCount = totalNetLossCount;

    //temp2.netSharePLWins = totalNetSharePLWins
    //temp2.netSharePLLoss = totalNetSharePLLoss

    //Needed for Dashboard
    temp2.probGrossWins = totalGrossWinsCount / totalTrades;
    temp2.probGrossLoss = totalGrossLossCount / totalTrades;
    temp2.probNetWins = totalNetWinsCount / totalTrades;
    temp2.probNetLoss = totalNetLossCount / totalTrades;
    //console.log("prob net win "+temp2.probNetWins+" and loss "+temp2.probNetLoss)

    temp2.avgGrossWins = totalGrossWins / totalGrossWinsCount;
    temp2.avgGrossLoss = -(totalGrossLoss / totalGrossLossCount);
    temp2.avgNetWins = totalNetWins / totalNetWinsCount;
    temp2.avgNetLoss = -(totalNetLoss / totalNetLossCount);

    temp2.avgGrossSharePLWins = totalGrossSharePLWins / totalGrossWinsCount;
    temp2.avgGrossSharePLLoss = -(totalGrossSharePLLoss / totalGrossLossCount);
    temp2.avgNetSharePLWins = totalNetSharePLWins / totalNetWinsCount;
    temp2.avgNetSharePLLoss = -(totalNetSharePLLoss / totalNetLossCount);
    for (let key in totals) delete totals[key];
    Object.assign(totals, temp2);
    //console.log(" -> TOTALS " + JSON.stringify(totals))

    /*============= 2- RECREATING TOTALS BY DATE =============
     *
     * Create totals per date needed for grouping monthly, weekly and daily
     */

    console.log("temp2 " + JSON.stringify(temp2));

    var z = _.chain(temp1).orderBy(["td"], ["asc"]).groupBy("td");

    let objectY = JSON.parse(JSON.stringify(z));
    const keys3 = Object.keys(objectY);

    for (const key3 of keys3) {
      //console.log("key 3 " + key3)
      //console.log("z "+JSON.stringify(z))
      var tempTrades = objectY[key3];
      //console.log("tempTrades " + JSON.stringify(tempTrades));
      temp3[key3] = {};

      /*******************
       * Info
       *******************/
      var sumBuyQuantity = 0;
      var sumSellQuantity = 0;

      /*******************
       * Commissions and fees
       *******************/
      var sumCommission = 0;
      var sumSec = 0;
      var sumTaf = 0;
      var sumNscc = 0;
      var sumNasdaq = 0;
      var sumFees = 0;

      /*******************
       * Gross proceeds and P&L
       *******************/
      var sumGrossProceeds = 0;
      var sumGrossWins = 0;
      var sumGrossLoss = 0;
      var sumGrossSharePL = 0; //On a trade level, it's Proceeds per share traded. But as we blotter and create global P&L, it is a cumulative number (like proceeds). way.value we can calculate estimations. If we need and average per share, it's a different calculation
      var sumGrossSharePLWins = 0;
      var sumGrossSharePLLoss = 0;
      var highGrossSharePLWin = 0;
      var highGrossSharePLLoss = 0;

      /*******************
       * Net proceeds and P&L
       *******************/
      var sumNetProceeds = 0;
      var sumNetWins = 0;
      var sumNetLoss = 0;
      var sumNetSharePL = 0;
      var sumNetSharePLWins = 0;
      var sumNetSharePLLoss = 0;
      var highNetSharePLWin = 0;
      var highNetSharePLLoss = 0;

      /*******************
       * Counts
       *******************/
      var sumExecutions = 0;
      var sumTrades = 0;
      var sumGrossWinsQuantity = 0;
      var sumGrossLossQuantity = 0;
      var sumGrossWinsCount = 0;
      var sumGrossLossCount = 0;
      var sumNetWinsQuantity = 0;
      var sumNetLossQuantity = 0;
      var sumNetWinsCount = 0;
      var sumNetLossCount = 0;

      tempTrades.forEach((element) => {
        sumBuyQuantity += Number(element.buyQuantity);
        sumSellQuantity += Number(element.sellQuantity);
        sumCommission += Number(element.commission);
        sumFees += Number(element.commission);

        sumGrossProceeds += Number(element.grossProceeds);
        sumGrossWins += Number(element.grossWins);
        sumGrossLoss += Number(element.grossLoss);
        sumGrossSharePL += Number(element.grossSharePL);
        sumGrossSharePLWins += Number(element.grossSharePLWins);
        sumGrossSharePLLoss += Number(element.grossSharePLLoss);
        if (element.grossSharePL >= 0) {
          if (element.grossSharePL > highGrossSharePLWin) {
            highGrossSharePLWin = Number(element.grossSharePL);
          }
        }
        if (element.grossSharePL < 0) {
          if (element.grossSharePL < highGrossSharePLLoss) {
            highGrossSharePLLoss = Number(element.grossSharePL);
          }
        }

        sumNetProceeds += Number(element.netProceeds);
        sumNetWins += Number(element.netWins);
        sumNetLoss += Number(element.netLoss);
        sumNetSharePL += Number(element.netSharePL);
        sumNetSharePLWins += Number(element.netSharePLWins);
        sumNetSharePLLoss += Number(element.netSharePLLoss);
        if (element.netSharePL >= 0) {
          if (element.netSharePL > highNetSharePLWin) {
            highNetSharePLWin = Number(element.netSharePL);
          }
        }
        if (element.netSharePL < 0) {
          if (element.netSharePL < highNetSharePLLoss) {
            highNetSharePLLoss = Number(element.netSharePL);
          }
        }

        sumExecutions += Number(element.executionsCount);
        sumGrossWinsQuantity += Number(element.grossWinsQuantity);
        sumGrossLossQuantity += Number(element.grossLossQuantity);
        sumGrossWinsCount += Number(element.grossWinsCount);

        sumNetWinsQuantity += Number(element.netWinsQuantity);
        sumNetLossQuantity += Number(element.netLossQuantity);
        sumNetWinsCount += Number(element.netWinsCount);
        sumGrossLossCount += Number(element.grossLossCount);
        sumNetLossCount += Number(element.netLossCount);
        sumTrades += Number(element.tradesCount);
      });

      /*******************
       * Info
       *******************/
      //temp3[key3].symbol = key3;
      temp3[key3].buyQuantity = sumBuyQuantity;
      temp3[key3].sellQuantity = sumSellQuantity;

      /*******************
       * Commissions and fees
       *******************/
      temp3[key3].commission = sumCommission;
      temp3[key3].fees = sumFees;
      //console.log("totalLocateFees" + JSON.stringify(temp2))

      /*******************
       * Gross proceeds and P&L
       *******************/
      temp3[key3].grossProceeds = sumGrossProceeds;
      temp3[key3].grossWins = sumGrossWins;
      temp3[key3].grossLoss = sumGrossLoss;
      temp3[key3].grossSharePL = sumGrossSharePL;
      //temp3[key3].grossSharePL = sumGrossProceeds / sumBuyQuantity

      /*sumGrossWinsQuantity == 0 ? temp3[key3].grossSharePLWins = 0 : temp3[key3].grossSharePLWins = sumGrossWins / sumGrossWinsQuantity
      sumGrossLossQuantity == 0 ? temp3[key3].grossSharePLLoss = 0 : temp3[key3].grossSharePLLoss = sumGrossLoss / sumGrossLossQuantity*/
      temp3[key3].grossSharePLWins = sumGrossSharePLWins;
      temp3[key3].grossSharePLLoss = sumGrossSharePLLoss;
      temp3[key3].highGrossSharePLWin = highGrossSharePLWin;
      temp3[key3].highGrossSharePLLoss = highGrossSharePLLoss;

      /*******************
       * Net proceeds and P&L
       *******************/
      temp3[key3].netProceeds = sumNetProceeds;
      temp3[key3].netWins = sumNetWins;
      temp3[key3].netLoss = sumNetLoss;
      temp3[key3].netSharePL = sumNetSharePL;
      //temp3[key3].netSharePL = sumNetProceeds / sumBuyQuantity

      /*sumNetWinsQuantity == 0 ? temp3[key3].netSharePLWins = 0 : temp3[key3].netSharePLWins = sumNetWins / sumNetWinsQuantity
      sumNetLossQuantity == 0 ? temp3[key3].netSharePLLoss = 0 : temp3[key3].netSharePLLoss = sumNetLoss / sumNetLossQuantity*/
      temp3[key3].netSharePLWins = sumNetSharePLWins;
      temp3[key3].netSharePLLoss = sumNetSharePLLoss;
      temp3[key3].highNetSharePLWin = highNetSharePLWin;
      temp3[key3].highNetSharePLLoss = highNetSharePLLoss;

      /*******************
       * Counts
       *******************/
      temp3[key3].executions = sumExecutions;
      temp3[key3].trades = sumTrades;

      temp3[key3].grossWinsQuantity = sumGrossWinsQuantity;
      temp3[key3].grossLossQuantity = sumGrossLossQuantity;
      temp3[key3].grossWinsCount = sumGrossWinsCount;
      temp3[key3].grossLossCount = sumGrossLossCount;

      temp3[key3].netWinsQuantity = sumNetWinsQuantity;
      temp3[key3].netLossQuantity = sumNetLossQuantity;
      temp3[key3].netWinsCount = sumNetWinsCount;
      temp3[key3].netLossCount = sumNetLossCount;

      /*******************
       * Financials
       *******************/
      temp3[key3].financials = tempTrades[0].financials;
    }
    //console.log(" temp 3 " + JSON.stringify(temp3))
    for (let key in totalsByDate) delete totalsByDate[key];
    Object.assign(totalsByDate, temp3);
    //console.log(" -> TOTALS BY DATE " + JSON.stringify(totalsByDate))
    //console.log(" -> TOTALS BY DATE (length) " + Object.keys(totalsByDate).length)
    resolve();
  });
}

export async function useGetTrades() {
  return new Promise(async (resolve, reject) => {
    console.log("--> Getting trades");
    trades.splice(0);
    try {
      await $fetch("/trades", {
        method: "GET",
        onResponse({ response }) {
          if (response.ok) {
            trades.push(response._data);
            console.log(" -> Finished getting existing trades (" + trades.length + ")");
          } else {
            console.log(" -> Getting existing trades error");
          }
          resolve();
        },
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

export async function useCalculateProfitAnalysis(param) {
  console.log("\n✅ CALCULATING PROFIT ANALYSIS");
  return new Promise(async (resolve, reject) => {
    for (let key in profitAnalysis) delete profitAnalysis[key];
    if (JSON.stringify(totals) != "{}") {
      profitAnalysis.grossAvWinPerShare = totals.grossSharePLWins / totals.grossWinsCount;
      profitAnalysis.netAvWinPerShare = totals.netSharePLWins / totals.netWinsCount;

      profitAnalysis.grossAvLossPerShare = -totals.grossSharePLLoss / totals.grossLossCount;
      profitAnalysis.netAvLossPerShare = -totals.netSharePLLoss / totals.netLossCount;

      profitAnalysis.grossHighWinPerShare = totals.highGrossSharePLWin;
      profitAnalysis.netHighWinPerShare = totals.highNetSharePLWin;

      profitAnalysis.grossHighLossPerShare = -totals.highGrossSharePLLoss;
      profitAnalysis.netHighLossPerShare = -totals.highNetSharePLLoss;

      profitAnalysis.grossR =
        profitAnalysis.grossAvWinPerShare / profitAnalysis.grossAvLossPerShare;
      profitAnalysis.netR = profitAnalysis.netAvWinPerShare / profitAnalysis.netAvLossPerShare;

      let grossWin = totals.probGrossWins;
      let netWin = totals.probNetWins;
      console.log("  --> Gross win " + grossWin + " and net win " + netWin);

      profitAnalysis.grossWin = grossWin;
      profitAnalysis.netWin = netWin;

      console.log(" -> Calculating gross and net current expected return");
      let grossCurrExpectReturn = profitAnalysis.grossR * grossWin;
      let netCurrExpectReturn = profitAnalysis.netR * netWin;
      console.log(
        "  --> Gross current expected return " +
          grossCurrExpectReturn +
          " and net " +
          netCurrExpectReturn
      );

      console.log("  --> Profit analysis " + JSON.stringify(profitAnalysis));

      profitAnalysis.netCurrExpectReturn = netCurrExpectReturn;
      profitAnalysis.grossCurrExpectReturn = grossCurrExpectReturn;
    }

    resolve();
  });
}
