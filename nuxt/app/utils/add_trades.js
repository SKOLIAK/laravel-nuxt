import { useTradovate } from "./brokers";
import { useChartFormat } from "./global";
import { existingImports, pAndL, blotter, TradesData, executions, trades } from "./trades";
import { filteredTradesTrades } from "./global";
import { accountsList } from './accounts'
import dayjs from "dayjs";
import _ from 'lodash'

let openPosition = false
let tempExecutions = []
let tradedSymbols = []
let tradeAccounts = []
let tradedStartDate = null
let tradedEndDate = null

let openPositionsFile = []
let openPositionsParse = []
let currentTradeId

export const tradeBags = ref([])

export async function useGetExistingTradesArray() {
  console.info('\n✅ GETTING EXISTING TRADES FOR FILTER');
  existingTradesArray.splice(0)
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/trades", {
        method: "GET",
        onResponse({ response }) {
          if (response._data.ok) {
            existingTradesArray.push(response._data.data)
            gotExistingTradesArray.value = true
            console.log(" -> Finished getting existing filter trades (" + response._data.data.length + ")")
          }
          resolve()
        }
      })
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: "Error retrieving existing trades",
        color: GetErrorColor,
      })
      reject(error.message)
    }

  })

}

async function filterExisting() {
  return new Promise(async (resolve, reject) => {
    console.info("\n✅ FILTERING EXISTING TRADES")

    // existingTradesArray.forEach(element => {
    //   //console.log("element "+element)
    //   if (executions.hasOwnProperty(element)) {
    //     console.log(" -> Already imported date " + element)
    //     existingImports.push(element)
    //   }
    // });

    // let tempExecutions = _.omit(executions, existingTradesArray)
    // for (let key in executions) delete executions[key]
    // Object.assign(executions, tempExecutions)
    // //console.log(" -> executions " + JSON.stringify(executions))

    // let tempTrades = _.omit(trades, existingTradesArray)
    // for (let key in trades) delete trades[key]
    // Object.assign(trades, tempTrades)
    // console.log('--> Finished filtering')
    resolve()
  });
}

export async function useImportTrades(fileInput, readAs, broker, param0) {
  return new Promise(async (resolve, reject) => {
    console.info("\n✅ IMPORTING ORDERS FILE")
    let files
    const file = document.getElementById('tradesFileInput')

    if (readAs = "file") {
      files = fileInput.target.files || fileInput.dataTransfer.files
      if (!Object.keys(files).length) {
        return;
      }
    }

    const readAsText = async (param) => {
      return new Promise(async (resolve, reject) => {
        var reader = new FileReader()
        reader.onload = e => {
          resolve(reader.result)
        }

        reader.readAsText(param[0])
      })
    }

    const readAsArrayBuffer = async (param) => {
      return new Promise(async (resolve, reject) => {
        let reader = new FileReader()
        reader.onload = e => {
          resolve(reader.result)
        }

        reader.readAsArrayBuffer(param[0])
      })
    }

    const importFileErrorFunction = (param) => {
      file.value = ''
      useToast().add({
        icon: GetErrorIcon,
        title: "Error while uploading orders file",
        color: GetErrorColor,
      })
    }

    let readFileInput
    selectedBroker.value = broker ?? selectedBroker.value

    if (!brokers.value.includes(selectedBroker.value)) {
      useToast().add({
        icon: GetErrorIcon,
        title: "Broker mismatch error",
        color: GetErrorColor,
      })
      return
    } else {
      readFileInput = await readAsText(files)
    }


    if (selectedBroker.value == "tradovate") {
      console.log("--> Tradovate")
      if (!selectedTradovateTier.value) {
        console.log("--> Tier is not selected")
        useToast().add({
          icon: GetErrorIcon,
          title: "Please select commission plan",
          color: GetErrorColor,
        })
        file.value = ''
        return
      }
      console.log("--> Selected tier: " + selectedTradovateTier.value)

      await useTradovate(readFileInput).catch(error => {
        importFileErrorFunction(error)
      })
    }

    // Continue from line 287 addTrades.js

    /**
     * Create executions & trades
     */
    const create = async () => {
      await createTempExecutions().catch((error) => {
        useToast().add({
          icon: GetErrorIcon,
          title: "Error reading file",
          color: GetErrorColor,
        })
        return
      })

      await createExecutions()
      await getPositionBagsParse()
      await createTrades()
      await filterExisting()
      await useCreateBlotter()
      await useCreatePnL()
    }

    // @TODO // TEMPORARY
    create()
    resolve()

  })
}


async function createTempExecutions() {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ CREATING TEMPORARY EXECUTIONS')

    const keys = Object.keys(TradesData)
    var temp = []
    var i = 0
    var lastId
    var x

    tempExecutions.splice(0)
    tradedSymbols.splice(0)

    for (const key of keys) {
      try {
        let temp2 = {}
        temp2.account = TradesData[key].Account
        temp2.broker = selectedBroker.value

        if (!tradeAccounts.includes(TradesData[key].Account)) tradeAccounts.push(TradesData[key].Account)


        const dateArrayTD = TradesData[key]['T/D'].split('/')
        const formatedDateTD = dateArrayTD[2] + '-' + dateArrayTD[0] + '-' + dateArrayTD[1]
        temp2.td = dayjs.tz(formatedDateTD, traderTimeZone.value).unix()

        const dateArraySD = TradesData[key]['S/D'].split('/')
        const formatedDateSD = dateArraySD[2] + '-' + dateArraySD[0] + '-' + dateArraySD[1]
        temp.sd = dayjs.tz(formatedDateSD, traderTimeZone.value).unix()


        temp2.currency = TradesData[key].Currency
        temp2.type = TradesData[key].Type
        temp2.side = TradesData[key].Side


        if (temp2.side == "B") {
          temp2.strategy = "long"
        }

        if (temp2.side == "S") {
          temp2.strategy = "long"
        }

        if (temp2.side == "BC") {
          temp2.strategy = "short"
        }

        if (temp2.side == "SS") {
          temp2.strategy = "short"
        }


        temp2.symbol = TradesData[key].Symbol.replace('.', '_')
        temp2.symbolOriginal = TradesData[key].SymbolOriginal
        temp2.symbolDescription = TradesData[key].SymbolDescription
        temp2.quantity = parseFloat(TradesData[key].Qty)
        temp2.price = parseFloat(TradesData[key].Price)

        temp2.execTime = dayjs.tz(formatedDateTD + " " + TradesData[key]['Exec Time'], traderTimeZone.value).unix()
        let tempId = "e" + temp2.execTime + "_" + temp2.symbol.replace(".", "_") + "_" + temp2.type + "_" + temp2.side;

        // It happens that two or more trades happen at the same (second) time. So we need to differentiated them
        if (tempId != lastId) {
          x = 1
          temp2.id = tempId + "_" + x
          lastId = tempId
          //console.log("--> last id " + lastId)
        } else {
          x++
          temp2.id = tempId + "_" + x
        }

        temp2.commission = parseFloat(TradesData[key].Comm);
        temp2.sec = parseFloat(TradesData[key].SEC);
        temp2.taf = parseFloat(TradesData[key].TAF);
        temp2.nscc = parseFloat(TradesData[key].NSCC);
        temp2.nasdaq = parseFloat(TradesData[key].Nasdaq);
        temp2.ecnRemove = parseFloat(TradesData[key]['ECN Remove']);
        temp2.ecnAdd = parseFloat(TradesData[key]['ECN Add']);
        temp2.grossProceeds = parseFloat(TradesData[key]['Gross Proceeds']);
        temp2.netProceeds = parseFloat(TradesData[key]['Net Proceeds']);
        temp2.clrBroker = TradesData[key]['Clr Broker'];
        temp2.liq = TradesData[key].Liq;
        temp2.note = TradesData[key].Note;
        temp2.trade = null;

        tempExecutions.push(temp2);


        let index = tradedSymbols.findIndex(obj => obj.symbol == temp2.symbol)

        if (index === -1) {
          let temp = {}
          temp.symbol = temp2.symbol
          temp.secType = temp2.type
          tradedSymbols.push(temp)
        }

        if (!tradedStartDate) {
          //console.log("td type " + typeof + temp2.td)
          tradedStartDate = temp2.td
        } else if (temp2.td < tradedStartDate) {
          tradedStartDate = temp2.td
        }

        if (!tradedEndDate) {
          //console.log("td type " + typeof + temp2.td)
          tradedEndDate = temp2.execTime
        } else if (temp2.execTime < tradedEndDate) {
          tradedEndDate = temp2.execTime
        }

        // console.log(" tradedSymbols " + JSON.stringify(tradedSymbols));
        // console.log(" -> Trade start date " + tradedStartDate)
        // console.log(" -> Trade end date " + tradedEndDate)
        // console.log("temp " + JSON.stringify(temp2))


      } catch (error) {
        console.log("  --> ERROR " + error)
        reject(error.message)
      }
    }
    console.log(" -> Created temp executions");
    console.log(" -> Created traded symbols");
    resolve()

  })
}


async function createExecutions() {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ CREATING EXECUTIONS')

    var a = _.chain(tempExecutions).orderBy(['execTime'], ['asc']).groupBy('td')

    for (let key in executions) delete executions[key]

    Object.assign(executions, JSON.parse(JSON.stringify(a)))

    console.log('--> Created')
    resolve()
  })
}

/**
 * Gets all date unixes for trades, blotter, pnl to identify
 */
export async function getPositionBagsParse() {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ GETTING DB POSITION BAGS')
    tradeBags.value.splice(0)
    openPositionsParse.splice(0)
    await $fetch("/user", {
      method: "GET",
      onResponse({ response }) {
        if (response._data.ok) {
          for (let index = 0; index < response._data.user.unixes.length; index++) {
            const e = response._data.user.unixes[index];
            tradeBags.value.push(e.date_unix)
            openPositionsParse.push(e.date_unix)
          }
          console.log('--> Retrieved ' + tradeBags.length + ' bags')
        }
      }
    })
    resolve()
  })
}


async function createTrades() {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ CREATING TRADES')

    var b = _.chain(tempExecutions).orderBy(['execTime'], ['asc'])
      .groupBy(item => `"${item.symbol}+${item.type}+${item.strategy}+${item.td}"`)

    let objectB = JSON.parse(JSON.stringify(b))
    //console.log("object b "+JSON.stringify(objectB))

    // We iterate through each symbol (key2)
    const keys2 = Object.keys(objectB);

    //console.log("keys 2 (symbols) " + JSON.stringify(keys2));
    var newIds = [] //array used for finding swing trades. Keep aside for later
    var temp2 = []

    for (const key2 of keys2) {
      var tempExecs = objectB[key2]

      var newTrade = true
      var invertedLong = false
      var invertedShort = false
      var grossWinsCount = 0
      var netWinsCount = 0
      var grossLossCount = 0
      var netLossCount = 0
      var tradesCount = 0

      var temp7 = {}

      let initEntryTime
      let initEntryPrice
      let i
      let existingOpenPosition // common name given to existing open position found in Parse or locally

      console.log("\n  ------ ITERATING SYMBOL " + key2 + " on " + useChartFormat(tempExecs[0].td) + " ------")
      for (let i = 0; i < tempExecs.length; i++) {
        let tempExec = tempExecs[i];


        // @todo WILL KEEP ADDING
        /** Checking existing open position amongst open positions stored IN PARSE / DATABASE */
        const existingOpenPositionParseIndex = openPositionsParse.findIndex(x => x.symbol == tempExec.symbol && x.type == tempExec.type && x.strategy == tempExec.strategy)
        /** Checking existing open position amongst open positions stored LOCALLT */
        const existingOpenPositionFileIndex = openPositionsFile.findIndex(x => x.symbol == tempExec.symbol && x.type == tempExec.type && x.strategy == tempExec.strategy)
        // end todo

        // Checking existing open positions array when importing file
        if (newTrade) {
          console.log(" -> New trade from " + useTimeFormat(tempExec.execTime))
          existingOpenPosition = {}

          if (existingOpenPositionParseIndex != -1) {
            console.log("  --> Open position already in Parse for symbol " + key2 + " on " + useChartFormat(tempExec.td) + " at " + useTimeFormat(tempExec.execTime))
            console.log("  --> Open position already in Parse")
            //existingOpenPosition = existingOpenPositionParse

            Object.keys(openPositionsParse[existingOpenPositionParseIndex]).forEach((key) => {
              if (key == "td") {
                existingOpenPosition.td = tempExec.td
              } else {
                existingOpenPosition[key] = openPositionsParse[existingOpenPositionParseIndex][key]
              }
            })
            currentTradeId = existingOpenPosition.id //here currentTradeId is at this state because we "jump" over newTrade as we are continuing an open / swing trade
            temp2.push(existingOpenPosition)
            newTrade = false

            // const existingOpenPositionParseIndex = openPositionsParse.findIndex(x => x.symbol == tempExec.symbol)
            // openPositionsParse.splice(existingOpenPositionParseIndex, 1)
            // console.log(" Open positions "+JSON.stringify(openPositionsParse))
            // console.log(" Open positions length "+openPositionsParse.length)


          } else if (existingOpenPositionFileIndex != -1) {
            //console.log("  --> Open position already in current file for symbol " + key2 + " on " + useChartFormat(tempExec.td) + " at " + useTimeFormat(tempExec.execTime))
            console.log("  --> Open position already in current file")
            //console.log(" existingOpenPositionFileIndex "+existingOpenPositionFileIndex)
            //console.log("openPositionsFile "+JSON.stringify(openPositionsFile[existingOpenPositionFileIndex]))

            Object.keys(openPositionsFile[existingOpenPositionFileIndex]).forEach((key) => {
              //console.log(" key "+key)
              if (key == "td") {
                existingOpenPosition.td = tempExec.td
              } else {
                existingOpenPosition[key] = openPositionsFile[existingOpenPositionFileIndex][key]
              }
            })
            //existingOpenPosition = existingOpenPositionFile

            //console.log(" -> existingOpenPosition "+JSON.stringify(existingOpenPosition))
            currentTradeId = existingOpenPosition.id //here currentTradeId is at this state because we "jump" over newTrade as we are continuing an open / swing trade
            existingOpenPosition.td = tempExec.td;
            temp2.push(existingOpenPosition)
            newTrade = false

            //const existingOpenPositionFileIndex = openPositionsFile.findIndex(x => x.symbol == tempExec.symbol)

            // Here we remove the existingOpenPosition from openPositionsFile because we have pushed it and "consumed" it in temp2
            // we don'r remove / don't have the same logic above, for Parse, it's because openPositionsFile is a 'living' file that evolves but Parse is just you download and then you work with openPositionsFile
            openPositionsFile.splice(existingOpenPositionFileIndex, 1)

            //console.log(" Open positions length "+openPositionsFile.length)
            //console.log(" temp 2 "+JSON.stringify(temp2))
          } else {
            console.log("  --> No existing open position (in Parse nor in current file)")
            existingOpenPosition = undefined
          }
        }

        //console.log(" -> existingOpenPosition "+JSON.stringify(existingOpenPosition))

        if (newTrade == true) { //= new trade
          //If qty buy != qty sell and new cycnle, we have an open position, that we push to open positions

          openPosition = true
          newTrade = false
          var invertedLong = false
          var invertedShort = false

          /*******************
           * Info
           *******************/
          //console.log(" -> exec id "+tempExec.id)
          //tempExecIds.push(tempExec.id)

          temp7.id = tempExec.side == "B" || tempExec.side == "S" ? "t" + tempExec.execTime + "_" + tempExec.symbol + "_" + tempExec.type + "_B" : "t" + tempExec.execTime + "_" + tempExec.symbol + "_" + tempExec.type + "_SS"
          console.log("  --> ID " + temp7.id)
          currentTradeId = temp7.id
          temp7.account = tempExec.account;
          temp7.broker = tempExec.broker
          temp7.td = tempExec.td;
          temp7.currency = tempExec.currency;
          temp7.type = tempExec.type;
          temp7.side = tempExec.side;
          if (tempExec.side == "B") {
            temp7.strategy = "long"
            //console.log("  --> Symbol " + key2 + " is bought and long")
            temp7.buyQuantity = tempExec.quantity;
            temp7.sellQuantity = 0
          }
          if (tempExec.side == "S") { //occasionnaly, Tradezero inverts trades and starts by accounting the sell even though it's a long possition
            temp7.strategy = "long"
            //console.log("Symbol " + key2 + " is sold and long")
            console.log("  --> Symbol " + key2 + " is accounted as sell before buy on date " + useChartFormat(tempExec.td) + " at " + useTimeFormat(tempExec.execTime))
            invertedLong = true
            temp7.buyQuantity = 0
            temp7.sellQuantity = tempExec.quantity;
          }
          if (tempExec.side == "SS") {
            temp7.strategy = "short"
            //console.log("  --> Symbol " + key2 + " is sold and short")
            temp7.buyQuantity = 0
            temp7.sellQuantity = tempExec.quantity;
          }
          if (tempExec.side == "BC") { //occasionnaly, Tradezero invertes trades
            temp7.strategy = "short"
            console.log("  --> Symbol " + key2 + " is accounted as buy cover before short sell on date " + useChartFormat(tempExec.td) + " at " + useTimeFormat(tempExec.execTime))
            invertedShort = true
            temp7.buyQuantity = tempExec.quantity;
            temp7.sellQuantity = 0
          }
          temp7.symbol = tempExec.symbol;
          temp7.symbolOriginal = tempExec.symbolOriginal;
          temp7.symbolDescription = tempExec.symbolDescription;
          temp7.entryTime = tempExec.execTime;
          initEntryTime = tempExec.execTime
          temp7.exitTime = 0
          temp7.entryPrice = tempExec.price
          initEntryPrice = tempExec.price
          temp7.exitPrice = 0
          /*if (temp7.entryTime >= startTimeUnix.value) {
              temp7.videoStart = temp7.entryTime - startTimeUnix.value
          }*/

          /*******************
           * Commissions and fees
           *******************/
          temp7.commissionOpen = tempExec.commission;
          temp7.commission = 0
          // temp7.secOpen = tempExec.sec;
          // temp7.sec = 0
          // temp7.tafOpen = tempExec.taf;
          // temp7.taf = 0
          // temp7.nsccOpen = tempExec.nscc;
          // temp7.nscc = 0
          // temp7.nasdaqOpen = tempExec.nasdaq;
          // temp7.nasdaq = 0
          // temp7.ecnRemoveOpen = tempExec.ecnRemove;
          // temp7.ecnRemove = 0
          // temp7.ecnAddOpen = tempExec.ecnAdd;
          // temp7.ecnAdd = 0

          // temp7.clrBroker = tempExec.clrBroker;
          // temp7.liq = tempExec.liq;

          /*******************
           * Gross proceeds and P&L
           *******************/
          temp7.grossEntryProceedsOpen = tempExec.grossProceeds;
          temp7.grossEntryProceeds = 0
          temp7.grossExitProceedsOpen = 0
          temp7.grossExitProceeds = 0
          temp7.grossProceedsOpen = tempExec.grossProceeds;
          temp7.grossProceeds = 0
          temp7.grossWins = 0 //Winning proceeds
          temp7.grossLoss = 0 //Loosing proceeds
          temp7.grossSharePL = 0 //Proceeds per share traded
          temp7.grossSharePLWins = 0 //Wins among proceeds per share
          temp7.grossSharePLLoss = 0 //Losses among proceeds per share
          temp7.grossStatus = null

          /*******************
           * Net proceeds and P&L
           *******************/
          temp7.netEntryProceedsOpen = tempExec.netProceeds;
          temp7.netEntryProceeds = 0
          temp7.netExitProceedsOpen = 0
          temp7.netExitProceeds = 0
          temp7.netProceedsOpen = tempExec.netProceeds;
          temp7.netProceeds = 0
          temp7.netWins = 0
          temp7.netLoss = 0
          temp7.netSharePL = 0 //Less important metric than gross because fees are notre a percentage this gives.value strange results. Beside, we don't use it afterwards. But I keep it for the sake of homogeneity
          temp7.netSharePLWins = 0
          temp7.netSharePLLoss = 0
          temp7.netStatus = null

          /*******************
           * Counts
           *******************/
          temp7.executionsCount = 1 //We create a count that will then be summed during the symbol blotter
          temp7.tradesCount = 0
          temp7.grossWinsQuantity = 0
          temp7.grossLossQuantity = 0
          temp7.grossWinsCount = 0
          temp7.grossLossCount = 0
          temp7.netWinsQuantity = 0
          temp7.netLossQuantity = 0
          temp7.netWinsCount = 0
          temp7.netLossCount = 0

          /*******************
           * Other
           *******************/
          temp7.note = tempExec.note
          temp7.executions = []
          temp7
            .executions
            .push(tempExec.id)
          temp7.openPosition = true
          let exec = executions[tempExec.td].find(x => x.id == tempExec.id)
          exec.trade = temp7.id;

          console.log("  --> buy quantity " + temp7.buyQuantity + " and sell quantity " + temp7.sellQuantity)
          console.log("  --> grossProceeds " + temp7.grossProceedsOpen + " and netProceeds " + temp7.netProceedsOpen)

          temp2.push(temp7)
          //console.log(" temp2 "+JSON.stringify(temp2))

          //we push to openPositionsFile
          //console.log("openPositionsFile "+JSON.stringify(openPositionsFile))
          openPositionsFile.push(temp7)


        } else if (newTrade == false) { //= concatenating trade
          console.log("  --> Concatenating trade from " + useTimeFormat(tempExec.execTime))

          let trde
          if (existingOpenPosition != undefined) {
            //console.log("  --> Getting trd from existing open position")
            trde = temp2.find(x => x.id == existingOpenPosition.id && x.td == existingOpenPosition.td)

          } else {
            //console.log("  --> Getting trd from temp7")
            trde = temp2.find(x => x.id == temp7.id)
          }

          //console.log("trde " + JSON.stringify(trde))

          //console.log(" -> exec id "+tempExec.id)
          //tempExecIds.push(tempExec.id)
          //console.log(" -> temp2 concat is " + JSON.stringify(temp2))
          //console.log(" trd sell quantity "+trde.sellQuantity)
          if (trde.strategy == "long") {
            //console.log(" -> Strategy is long and "+invertedLong+" for symbol "+tempExec.symbol)
            if (!invertedLong) {
              if (tempExec.side == trde.side) { // adding to position
                trde.buyQuantity = useDecimalsArithmetic(trde.buyQuantity, tempExec.quantity)
                //console.log(" -> quantity is "+trde.buyQuantity)
              } else { // clearing/closing position
                trde.sellQuantity = useDecimalsArithmetic(trde.sellQuantity, tempExec.quantity)
                //console.log(" -> quantity is "+trde.buyQuantity)
              }
            } else {
              if (tempExec.side == trde.side) { // adding to position
                trde.sellQuantity = useDecimalsArithmetic(trde.sellQuantity, tempExec.quantity)
              } else { // clearing/closing position
                trde.buyQuantity = useDecimalsArithmetic(trde.buyQuantity, tempExec.quantity)
              }
            }
          }

          if (trde.strategy == "short") {
            //console.log(" -> Strategy is short and "+invertedShort+" for symbol "+tempExec.symbol)
            if (!invertedShort) {
              if (tempExec.side == trde.side) { // adding to position
                trde.sellQuantity = useDecimalsArithmetic(trde.sellQuantity, tempExec.quantity)
              } else { // clearing/closing position
                trde.buyQuantity = useDecimalsArithmetic(trde.buyQuantity, tempExec.quantity)
              }
            } else {
              if (tempExec.side == trde.side) { // adding to position
                trde.buyQuantity = useDecimalsArithmetic(trde.buyQuantity, tempExec.quantity)
              } else { // clearing/closing position
                trde.sellQuantity = useDecimalsArithmetic(trde.sellQuantity, tempExec.quantity)
              }
            }
          }

          trde.commissionOpen = trde.commissionOpen + tempExec.commission;
          trde.secOpen = trde.secOpen + tempExec.sec;
          trde.tafOpen = trde.tafOpen + tempExec.taf;
          trde.nsccOpen = trde.nsccOpen + tempExec.nscc;
          trde.nasdaqOpen = trde.nasdaqOpen + tempExec.nasdaq;

          trde.grossExitProceedsOpen = trde.grossExitProceedsOpen + tempExec.grossProceeds
          trde.grossProceedsOpen = trde.grossProceedsOpen + tempExec.grossProceeds

          trde.netExitProceedsOpen = trde.netExitProceedsOpen + tempExec.netProceeds
          trde.netProceedsOpen = trde.netProceedsOpen + tempExec.netProceeds
          trde
            .executions
            .push(tempExec.id)

          //here we do += because this is.value trades so here when we are concatenating, we need to add +1 to the execution count. ANother option would be to calculate the number of executions but we would need to rely on the executions list. Too complicated.
          trde.executionsCount += 1

          let exec = executions[tempExec.td].find(x => x.id == tempExec.id)
          exec.trade = trde.id;

          console.log("  --> buy quantity " + trde.buyQuantity + " and sell quantity " + trde.sellQuantity)
          console.log("  --> grossProceeds " + trde.grossProceedsOpen + " and netProceeds " + trde.netProceedsOpen)
          //trde = temp2.find(x => x.id == trde.id)

          /*
          * Update openPositionsFile. First remove existing trade json. Then, if buy qty != sell qty then push updated json
          */
          let openPositionIndex = -1
          if (openPositionsFile.length > 0) openPositionIndex = openPositionsFile.findIndex(x => x.id == trde.id)
          if (openPositionIndex != -1) openPositionsFile.splice(openPositionIndex, 1)

          /*******************
           * If Buy Qty = Sell Qty
           *******************/
          if (trde.buyQuantity == trde.sellQuantity) { //When buy and sell quantities are equal means position is closed
            //console.log("trde " + JSON.stringify(trde))
            //console.log(" tempExec "+JSON.stringify(tempExec))
            trde.exitPrice = tempExec.price;
            trde.exitTime = tempExec.execTime;
            /*if (trde.exitTime >= startTimeUnix.value) {
                trde.videoEnd = trde.exitTime - startTimeUnix.value
            }*/

            /***********************
            * MOVING FROM OPEN TO CLOSED
           ************************/
            trde.commission = trde.commissionOpen
            trde.commissionOpen = 0
            trde.sec = trde.secOpen
            trde.secOpen = 0
            trde.taf = trde.tafOpen
            trde.tafOpen = 0
            trde.nscc = trde.nsccOpen
            trde.nsccOpen = 0
            trde.nasdaq = trde.nasdaqOpen
            trde.nasdaqOpen = 0

            trde.grossEntryProceeds = trde.grossEntryProceedsOpen
            trde.grossEntryProceedsOpen = 0
            trde.grossExitProceeds = trde.grossExitProceedsOpen
            trde.grossExitProceedsOpen = 0
            trde.grossProceeds = trde.grossProceedsOpen
            trde.grossProceedsOpen = 0

            trde.netEntryProceeds = trde.netEntryProceedsOpen
            trde.netEntryProceedsOpen = 0
            trde.netExitProceeds = trde.netExitProceedsOpen
            trde.netExitProceedsOpen = 0
            trde.netProceeds = trde.netProceedsOpen
            trde.netProceedsOpen = 0

            /* */

            trde.grossSharePL = trde.grossProceeds / (trde.buyQuantity) //P&L per share is in reality "per share bought (if long)". So, when trade is closed, we take the total quantity and divide by 2

            trde.grossSharePL >= 0 ? trde.grossSharePLWins = trde.grossSharePL : trde.grossSharePLLoss = trde.grossSharePL


            if (trde.grossProceeds >= 0) {
              trde.grossStatus = "win"
              trde.grossWinsQuantity = trde.buyQuantity
              trde.grossWins = trde.grossProceeds
              grossWinsCount = 1
              grossLossCount = 0
            } else {
              trde.grossStatus = "loss"
              trde.grossLossQuantity = trde.buyQuantity
              trde.grossLoss = trde.grossProceeds
              grossLossCount = 1
              grossWinsCount = 0
            }

            trde.netSharePL = trde.netProceeds / (trde.buyQuantity)
            trde.netSharePL >= 0 ? trde.netSharePLWins = trde.netSharePL : trde.netSharePLLoss = trde.netSharePL

            if (trde.netProceeds >= 0) {
              trde.netStatus = "win"
              trde.netWinsQuantity = trde.buyQuantity
              trde.netWins = trde.netProceeds
              netWinsCount = 1
              netLossCount = 0
            } else {
              trde.netStatus = "loss"
              trde.netLossQuantity = trde.buyQuantity
              trde.netLoss = trde.netProceeds
              netLossCount = 1
              netWinsCount = 0
            }

            tradesCount = 1
            trde.grossWinsCount = grossWinsCount
            trde.netWinsCount = netWinsCount
            trde.grossLossCount = grossLossCount
            trde.netLossCount = netLossCount
            trde.tradesCount = tradesCount


            trde.openPosition = false

            //Updating exit time in parse open positions. Close position is update later
            if (openPositionsParse.length > 0) {
              for (let index = 0; index < openPositionsParse.length; index++) {
                const element = openPositionsParse[index];
                if (element.symbol == trde.symbol && element.type == trde.type) {
                  element.exitTime = tempExec.execTime;
                }

              }
            }

            //Updating exit time and closing position in existing file
            for (let index = 0; index < temp2.length; index++) {
              const element = temp2[index]
              if (element.id == trde.id) {
                element.exitTime = tempExec.execTime;
                element.openPosition = false
              }
            }


            //console.log("trde " + JSON.stringify(trde))

            //check if other trades open of same id in

            newTrade = true
            temp7 = {} // I need to reinitiate temp7 here or else when more than one trade per symbol it was adding up
            //console.log("temp2 is " + JSON.stringify(temp2))
            //console.log(" -> trade concat finished")
            //console.log(tradesCount+" trades for symbol "+key2)

            console.log("   ---> Position CLOSED")
            openPosition = false

          } else {
            openPositionsFile.push(trde)
            console.log("   ---> Position OPEN")
            /*if ((i + 1) == tempExecs.length) {
                console.log("   ---> Position OPEN")
                //console.log("   ---> tempExecs " + JSON.stringify(tempExecs))
            }*/

          }
        } else {
          console.log("nothing for key " + key2)
        }
        //console.log("New trade status of symbol "+key2+" is "+newTrade+". the JSON is "+JSON.stringify(temp7))
      }

    }
    //console.log(" -> Open positionsFile " + JSON.stringify(openPositionsFile))
    //console.log(" -> Open positions in Parse "+JSON.stringify(openPositionsParse))
    //console.log("temp2 " + JSON.stringify(temp2))
    var c = _
      .chain(temp2)
      .orderBy(["entryTime"], ["asc"])
      .groupBy("td");
    //console.log(" -> Trades " + JSON.stringify(c))
    for (let key in trades) delete trades[key]
    Object.assign(trades, JSON.parse(JSON.stringify(c)))
    //console.log("Trades C " + JSON.stringify(trades))
    //console.log('executions ' + JSON.stringify(executions))
    resolve()

  })
}


export async function useCreateBlotter(param) {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ CREATING BLOTTER BY SYMBOL');

    let objectZ;
    if (param) { // Case when creating blotter for FilteredTrades
      let temp = _.chain(filteredTradesTrades).orderBy(["entryTime"], ["asc"]).groupBy("td")
      objectZ = JSON.parse(JSON.stringify(temp))
      //console.log(" temp "+JSON.stringify(temp))
    } else {
      objectZ = trades
      //console.log(" this trades "+JSON.stringify(trades))
    }

    const keys9 = Object.keys(objectZ);
    var temp10 = {}
    for (const key9 of keys9) {
      //console.log(" Key9 "+key9)
      temp10[key9] = {}
      var tempExecs = objectZ[key9]
      //console.log("tempExecs9 " + JSON.stringify(tempExecs));
      var z = _
        .chain(tempExecs)
        .orderBy(["entryTime"], ["asc"])
        .groupBy("symbol")
      let objectY = JSON.parse(JSON.stringify(z))
      //console.log("objectY "+JSON.stringify(objectY))
      const keys10 = Object.keys(objectY);
      for (const key10 of keys10) {
        //console.log("key 10 " + key10)
        //console.log("z "+JSON.stringify(z))
        var tempExecs = objectY[key10]
        //console.log("tempExecs " + JSON.stringify(tempExecs));
        temp10[key9][key10] = {};

        /*******************
         * Info
         *******************/
        var sumBuyQuantity = 0
        var sumSellQuantity = 0

        /*******************
         * Commissions and fees
         *******************/
        var sumCommission = 0
        var sumSec = 0
        var sumTaf = 0
        var sumNscc = 0
        var sumNasdaq = 0
        var sumOtherCommission = 0
        var sumFees = 0

        /*******************
         * Gross proceeds and P&L
         *******************/
        var sumGrossProceeds = 0
        var sumGrossWins = 0
        var sumGrossLoss = 0
        var sumGrossSharePL = 0 //On a trade level, it's Proceeds per share traded. But as we blotter and create global P&L, it is a cumulative number (like proceeds). This way.value we can calculate estimations. If we need and average per share, it's a different calculation
        var sumGrossSharePLWins = 0
        var sumGrossSharePLLoss = 0
        var highGrossSharePLWin = 0
        var highGrossSharePLLoss = 0


        /*******************
         * Net proceeds and P&L
         *******************/
        var sumNetProceeds = 0
        var sumNetWins = 0
        var sumNetLoss = 0
        var sumNetSharePL = 0
        var sumNetSharePLWins = 0
        var sumNetSharePLLoss = 0
        var highNetSharePLWin = 0
        var highNetSharePLLoss = 0

        /*******************
         * Counts
         *******************/
        var sumExecutions = 0
        var sumTrades = 0
        var sumGrossWinsQuantity = 0
        var sumGrossLossQuantity = 0
        var sumGrossWinsCount = 0
        var sumGrossLossCount = 0
        var sumNetWinsQuantity = 0
        var sumNetLossQuantity = 0
        var sumNetWinsCount = 0
        var sumNetLossCount = 0



        tempExecs.forEach(element => {
          sumBuyQuantity += element.buyQuantity
          sumSellQuantity += element.sellQuantity
          sumCommission += element.commission
          sumSec += element.sec
          sumTaf += element.taf
          sumNscc += element.nscc
          sumNasdaq += element.nasdaq
          sumOtherCommission += element.sec + element.taf + element.nscc + element.nasdaq
          sumFees += element.commission + element.sec + element.taf + element.nscc + element.nasdaq

          sumGrossProceeds += element.grossProceeds
          sumGrossWins += element.grossWins
          sumGrossLoss += element.grossLoss
          sumGrossSharePL += element.grossSharePL
          sumGrossSharePLWins += element.grossSharePLWins
          sumGrossSharePLLoss += element.grossSharePLLoss
          if (element.grossSharePL >= 0) {
            if (element.grossSharePL > highGrossSharePLWin) {
              highGrossSharePLWin = element.grossSharePL
            }
          }
          if (element.grossSharePL < 0) {
            if (element.grossSharePL < highGrossSharePLLoss) {
              highGrossSharePLLoss = element.grossSharePL
            }

          }

          sumNetProceeds += element.netProceeds
          sumNetWins += element.netWins
          sumNetLoss += element.netLoss
          sumNetSharePL += element.netSharePL
          sumNetSharePLWins += element.netSharePLWins
          sumNetSharePLLoss += element.netSharePLLoss
          if (element.netSharePL >= 0) {
            if (element.netSharePL > highNetSharePLWin) {
              highNetSharePLWin = element.netSharePL
            }

          }
          if (element.netSharePL < 0) {
            if (element.netSharePL < highNetSharePLLoss) {
              highNetSharePLLoss = element.netSharePL
            }

          }

          sumExecutions += element.executionsCount
          sumGrossWinsQuantity += element.grossWinsQuantity
          sumGrossLossQuantity += element.grossLossQuantity
          sumGrossWinsCount += element.grossWinsCount

          sumNetWinsQuantity += element.netWinsQuantity
          sumNetLossQuantity += element.netLossQuantity
          sumNetWinsCount += element.netWinsCount
          sumGrossLossCount += element.grossLossCount
          sumNetLossCount += element.netLossCount
          sumTrades += element.tradesCount

        })

        /*******************
         * Info
         *******************/
        temp10[key9][key10].symbol = key10;
        temp10[key9][key10].type = tempExecs[0].type;
        temp10[key9][key10].buyQuantity = sumBuyQuantity
        temp10[key9][key10].sellQuantity = sumSellQuantity

        /*******************
         * Commissions and fees
         *******************/
        temp10[key9][key10].commission = sumCommission;
        temp10[key9][key10].sec = sumSec
        temp10[key9][key10].taf = sumTaf
        temp10[key9][key10].nscc = sumNscc
        temp10[key9][key10].nasdaq = sumNasdaq
        temp10[key9][key10].otherCommission = sumOtherCommission;
        temp10[key9][key10].fees = sumFees;

        /*******************
         * Gross proceeds and P&L
         *******************/
        temp10[key9][key10].grossProceeds = sumGrossProceeds;
        temp10[key9][key10].grossWins = sumGrossWins;
        temp10[key9][key10].grossLoss = sumGrossLoss;
        temp10[key9][key10].grossSharePL = sumGrossSharePL
        //temp10[key9][key10].grossSharePL = sumGrossProceeds / sumBuyQuantity

        /*sumGrossWinsQuantity == 0 ? temp10[key9][key10].grossSharePLWins = 0 : temp10[key9][key10].grossSharePLWins = sumGrossWins / sumGrossWinsQuantity
        sumGrossLossQuantity == 0 ? temp10[key9][key10].grossSharePLLoss = 0 : temp10[key9][key10].grossSharePLLoss = sumGrossLoss / sumGrossLossQuantity*/
        temp10[key9][key10].grossSharePLWins = sumGrossSharePLWins
        temp10[key9][key10].grossSharePLLoss = sumGrossSharePLLoss
        temp10[key9][key10].highGrossSharePLWin = highGrossSharePLWin;
        temp10[key9][key10].highGrossSharePLLoss = highGrossSharePLLoss;

        /*******************
         * Net proceeds and P&L
         *******************/
        temp10[key9][key10].netProceeds = sumNetProceeds;
        temp10[key9][key10].netWins = sumNetWins;
        temp10[key9][key10].netLoss = sumNetLoss;
        temp10[key9][key10].netSharePL = sumNetSharePL
        //temp10[key9][key10].netSharePL = sumNetProceeds / sumBuyQuantity

        /*sumNetWinsQuantity == 0 ? temp10[key9][key10].netSharePLWins = 0 : temp10[key9][key10].netSharePLWins = sumNetWins / sumNetWinsQuantity
        sumNetLossQuantity == 0 ? temp10[key9][key10].netSharePLLoss = 0 : temp10[key9][key10].netSharePLLoss = sumNetLoss / sumNetLossQuantity*/
        temp10[key9][key10].netSharePLWins = sumNetSharePLWins
        temp10[key9][key10].netSharePLLoss = sumNetSharePLLoss
        temp10[key9][key10].highNetSharePLWin = highNetSharePLWin;
        temp10[key9][key10].highNetSharePLLoss = highNetSharePLLoss;

        /*******************
         * Counts
         *******************/
        temp10[key9][key10].executions = sumExecutions;
        temp10[key9][key10].trades = sumTrades;

        temp10[key9][key10].grossWinsQuantity = sumGrossWinsQuantity;
        temp10[key9][key10].grossLossQuantity = sumGrossLossQuantity;
        temp10[key9][key10].grossWinsCount = sumGrossWinsCount;
        temp10[key9][key10].grossLossCount = sumGrossLossCount;

        temp10[key9][key10].netWinsQuantity = sumNetWinsQuantity;
        temp10[key9][key10].netLossQuantity = sumNetLossQuantity;
        temp10[key9][key10].netWinsCount = sumNetWinsCount;
        temp10[key9][key10].netLossCount = sumNetLossCount;

      }

    }
    for (let key in blotter) delete blotter[key]
    Object.assign(blotter, temp10)
    //console.log(" -> BLOTTER " + JSON.stringify(blotter))
    resolve()
  })
}


export async function useCreatePnL(param) {
  return new Promise(async (resolve, reject) => {
    console.info('\n✅ CREATING P&L');

    let objectQ = blotter
    const keys7 = Object.keys(objectQ);
    var temp9 = {}
    for (const key7 of keys7) {
      //console.log(" key 7 "+key7)
      temp9[key7] = {};
      var tempExecs = objectQ[key7]
      //console.log("temp p&l " + JSON.stringify(tempExecs));
      var sumBuyQuantity = 0
      var sumSellQuantity = 0

      var sumCommission = 0
      var sumSec = 0
      var sumTaf = 0
      var sumNscc = 0
      var sumNasdaq = 0
      var sumOtherCommission = 0
      var sumFees = 0

      var sumGrossProceeds = 0
      var sumGrossWins = 0
      var sumGrossLoss = 0
      var sumGrossSharePL = 0
      var sumGrossSharePLWins = 0
      var sumGrossSharePLLoss = 0
      var highGrossSharePLWin = 0
      var highGrossSharePLLoss = 0

      var sumNetProceeds = 0
      var sumNetWins = 0
      var sumNetLoss = 0
      var sumNetSharePL = 0
      var sumNetSharePLWins = 0
      var sumNetSharePLLoss = 0
      var highNetSharePLWin = 0
      var highNetSharePLLoss = 0

      var sumExecutions = 0
      var sumTrades = 0

      var sumGrossWinsQuantity = 0
      var sumGrossLossQuantity = 0
      var sumGrossWinsCount = 0
      var sumGrossLossCount = 0

      var sumNetWinsQuantity = 0
      var sumNetLossQuantity = 0
      var sumNetWinsCount = 0
      var sumNetLossCount = 0


      const keys8 = Object.keys(tempExecs);
      for (const key8 of keys8) {
        //console.log("key 8 "+key8)
        sumBuyQuantity += tempExecs[key8].buyQuantity
        sumSellQuantity += tempExecs[key8].sellQuantity

        sumCommission += tempExecs[key8].commission
        sumSec += tempExecs[key8].sec
        sumTaf += tempExecs[key8].taf
        sumNscc += tempExecs[key8].nscc
        sumNasdaq += tempExecs[key8].nasdaq
        sumOtherCommission += tempExecs[key8].otherCommission
        sumFees += tempExecs[key8].fees

        sumGrossProceeds += tempExecs[key8].grossProceeds
        sumGrossWins += tempExecs[key8].grossWins
        sumGrossLoss += tempExecs[key8].grossLoss
        sumGrossSharePL += tempExecs[key8].grossSharePL
        sumGrossSharePLWins += tempExecs[key8].grossSharePLWins
        sumGrossSharePLLoss += tempExecs[key8].grossSharePLLoss
        if (tempExecs[key8].highGrossSharePLWin >= highGrossSharePLWin) {
          highGrossSharePLWin = tempExecs[key8].highGrossSharePLWin
        }
        if (tempExecs[key8].highGrossSharePLLoss < highGrossSharePLLoss) {
          highGrossSharePLLoss = tempExecs[key8].highGrossSharePLLoss
        }

        sumNetProceeds += tempExecs[key8].netProceeds
        sumNetWins += tempExecs[key8].netWins
        sumNetLoss += tempExecs[key8].netLoss
        sumNetSharePL += tempExecs[key8].netSharePL
        sumNetSharePLWins += tempExecs[key8].netSharePLWins
        sumNetSharePLLoss += tempExecs[key8].netSharePLLoss
        if (tempExecs[key8].highNetSharePLWin >= highNetSharePLWin) {
          highNetSharePLWin = tempExecs[key8].highNetSharePLWin
        }

        if (tempExecs[key8].highNetSharePLLoss < highNetSharePLLoss) {
          highNetSharePLLoss = tempExecs[key8].highNetSharePLLoss
        }

        sumExecutions += tempExecs[key8].executions
        sumTrades += tempExecs[key8].trades

        sumGrossWinsQuantity += tempExecs[key8].grossWinsQuantity
        sumGrossLossQuantity += tempExecs[key8].grossLossQuantity
        sumGrossWinsCount += tempExecs[key8].grossWinsCount
        sumGrossLossCount += tempExecs[key8].grossLossCount

        sumNetWinsQuantity += tempExecs[key8].netWinsQuantity
        sumNetLossQuantity += tempExecs[key8].netLossQuantity
        sumNetWinsCount += tempExecs[key8].netWinsCount
        sumNetLossCount += tempExecs[key8].netLossCount


      }
      /*******************
       * Info
       *******************/
      temp9[key7].buyQuantity = sumBuyQuantity;
      temp9[key7].sellQuantity = sumSellQuantity;

      /*******************
       * Commissions and fees
       *******************/
      temp9[key7].commission = sumCommission;
      temp9[key7].sec = sumSec
      temp9[key7].taf = sumTaf
      temp9[key7].nscc = sumNscc
      temp9[key7].nasdaq = sumNasdaq
      temp9[key7].otherCommission = sumOtherCommission;
      temp9[key7].fees = sumFees;

      /*******************
       * Gross proceeds and P&L
       *******************/
      temp9[key7].grossProceeds = sumGrossProceeds;
      temp9[key7].grossWins = sumGrossWins;
      temp9[key7].grossLoss = sumGrossLoss;
      temp9[key7].grossSharePL = sumGrossSharePL
      //temp9[key7].grossSharePL = sumGrossProceeds / sumBuyQuantity

      /*sumGrossWinsQuantity == 0 ? temp9[key7].grossSharePLWins = 0 : temp9[key7].grossSharePLWins = sumGrossWins / sumGrossWinsQuantity
      sumGrossLossQuantity == 0 ? temp9[key7].grossSharePLLoss = 0 : temp9[key7].grossSharePLLoss = sumGrossLoss / sumGrossLossQuantity*/
      temp9[key7].grossSharePLWins = sumGrossSharePLWins
      temp9[key7].grossSharePLLoss = sumGrossSharePLLoss
      temp9[key7].highGrossSharePLWin = highGrossSharePLWin;
      temp9[key7].highGrossSharePLLoss = highGrossSharePLLoss;

      /*******************
       * Net proceeds and P&L
       *******************/
      temp9[key7].netProceeds = sumNetProceeds;
      temp9[key7].netWins = sumNetWins;
      temp9[key7].netLoss = sumNetLoss;
      temp9[key7].netSharePL = sumNetSharePL
      //temp9[key7].netSharePL = sumNetProceeds / sumBuyQuantity

      /*sumNetWinsQuantity == 0 ? temp9[key7].netSharePLWins = 0 : temp9[key7].netSharePLWins = sumNetWins / sumNetWinsQuantity
      sumNetLossQuantity == 0 ? temp9[key7].netSharePLLoss = 0 : temp9[key7].netSharePLLoss = sumNetLoss / sumNetLossQuantity*/
      temp9[key7].netSharePLWins = sumNetSharePLWins
      temp9[key7].netSharePLLoss = sumNetSharePLLoss
      temp9[key7].highNetSharePLWin = highNetSharePLWin;
      temp9[key7].highNetSharePLLoss = highNetSharePLLoss;

      /*******************
       * Counts
       *******************/
      temp9[key7].executions = sumExecutions
      temp9[key7].trades = sumTrades

      temp9[key7].grossWinsQuantity = sumGrossWinsQuantity
      temp9[key7].grossLossQuantity = sumGrossLossQuantity
      temp9[key7].grossWinsCount = sumGrossWinsCount
      temp9[key7].grossLossCount = sumGrossLossCount

      temp9[key7].netWinsQuantity = sumNetWinsQuantity
      temp9[key7].netLossQuantity = sumNetLossQuantity
      temp9[key7].netWinsCount = sumNetWinsCount
      temp9[key7].netLossCount = sumNetLossCount


    }
    for (let key in pAndL) delete pAndL[key]
    Object.assign(pAndL, temp9)
    //console.log(" -> P&L: " + JSON.stringify(pAndL))


    //console.log(" -> Created trades table successfully");
    resolve()
  })
}


export async function useUploadTrades(param99, param0) {
  console.info('\n✅ UPLOADING TRADES');

  const uploadToParse = async (dateIdentifier, parseType, isOpenPositions) => {
    return new Promise(async (resolve, reject) => {
      console.log(" -> Parse param1 is " + dateIdentifier)
      console.log(" -> Parse param2 is " + parseType)
      console.log(" -> Parse param3 is " + isOpenPositions)

      if (parseType == "trades") {
        //await parseExecutions(executions[dateIdentifier])
        await parseTrades(trades[dateIdentifier], dateIdentifier)
        //await parsePAndL(pAndL[dateIdentifier])
      }
    })
  }


  const parseTrades = async (trades_data, date_unix) => {
    return new Promise(async (resolve, reject) => {
      try {
        await $fetch("trades", {
          method: "POST",
          body: { trades: trades_data, date_unix: date_unix },
          onResponse({ response }) {
            console.log(response._data)
          }
        })
        resolve()
      } catch (error) {
        useToast().add({
          icon: GetErrorIcon,
          title: 'Something went wrong',
          color: GetErrorColor,
        })
        reject(error.message)
      }

    })
  }

  const parseExecutions = async (param) => {
    return new Promise(async (resolve, reject) => {
      console.log('Parse executions \n' + JSON.stringify(param))
      resolve()
    })
  }

  const parsePAndL = async (param) => {
    return new Promise(async (resolve, reject) => {
      console.log('Parse P&L \n' + JSON.stringify(param))
      resolve()
    })
  }

  const uploadFunction = async (param) => {
    console.log(" -> Upload function for " + param)
    return new Promise(async (resolve, reject) => {
      let keys
      let i = 0
      let numberOfDates = 0

      if (param == "trades") {
        keys = Object.keys(executions)
        numberOfDates = Object.keys(executions).length
      }

      console.log("num of dates " + numberOfDates)
      for (const key of keys) {
        console.log(" key " + key)
        console.log(" trades " + JSON.stringify(trades[key]))
        let checkIfOpenPositions = trades[key].findIndex(x => {
          console.warn(JSON.stringify(x))
          x.openPosition == true
        })
        console.log(" checkIfOpenPositions " + checkIfOpenPositions)

        checkIfOpenPositions != -1 ? checkIfOpenPositions = true : checkIfOpenPositions = false
        const promise = await uploadToParse(key, param, checkIfOpenPositions)
        console.log("promise " + JSON.stringify(promise))
        if (promise == "resolve") resolve()
      }
    })
  }


  if (Object.keys(executions).length > 0) await uploadFunction("trades")
  if (Object.keys(executions).length > 0 && mfePrices.length > 0) await useUpdateMfePrices(param99, param0)
  if (openPositionsParse.length > 0) {
    await loopOpenPositionsParse()
  }
  if (param99 == "api") {
    for (let key in executions) delete executions[key]
    for (let key in executions) delete executions[key]
    for (let key in trades) delete trades[key]
    for (let key in blotter) delete blotter[key]
    for (let key in pAndL) delete pAndL[key]

  }



}
