import dayjs from "dayjs";
import _ from "lodash";
import Papa from "papaparse";

export const brokers = ref(["tradovate"]);
export const selectedBroker = ref(brokers.value[0]);
export const tradovateTiers = ref([
  {
    value: "free",
    label: "Free",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "lifetime",
    label: "Lifetime",
  },
  {
    value: "apex",
    label: "Apex",
  },
  {
    value: "topstep",
    label: "Topstep",
  },
]);
export const selectedTradovateTier = ref("");

export async function useTradovate(param) {
  return new Promise(async (resolve, reject) => {
    try {
      let papaParse = Papa.parse(param, { header: true });
      let papaParseNew = [];
      //we need to recreate the JSON with proper date format + we simplify
      papaParse.data.forEach((element) => {
        if (element.orderId && element.Status.trim() == "Filled") {
          //console.log("element " + JSON.stringify(element))
          element.execTime = dayjs.tz(element["Fill Time"], traderTimeZone.value).unix();
          element["B/S"] = element["B/S"].trim();
          papaParseNew.push(element);
        }
      });

      //console.log("--> PapaParseNew " + JSON.stringify(papaParseNew))
      var b = _.chain(papaParseNew).orderBy(["execTime"], ["asc"]).groupBy("Contract");
      //console.log('--> b: ' + JSON.stringify(b))

      let ObjectB = JSON.parse(JSON.stringify(b));
      //console.log('--> Object B: ' + JSON.stringify(ObjectB))

      // Itterate through each symbol
      const keys2 = Object.keys(ObjectB);

      // Clear trades data
      TradesData.splice(0);

      for (const key2 of keys2) {
        const tempExecs = ObjectB[key2];

        let newTrade = true;
        let strategy;
        let totalQty = 0;

        for (let i = 0; i < tempExecs.length; i++) {
          let data = tempExecs[i];

          let temp = {};
          //console.log('--> Temp Exec: ' + JSON.stringify(data))
          temp.Account = data.Account;

          let month = data.Date.split("/")[0];
          let day = data.Date.split("/")[1];
          let year = data.Date.split("/")[2];

          if (year.length == 4) {
            temp["T/D"] = data.Date;
            temp["S/D"] = data.Date;
          } else if (year.length == 2) {
            let newDate = month + "/" + day + "/20" + year;
            temp["T/D"] = newDate;
            temp["S/D"] = newDate;
          } else {
            reject("Year length issue");
          }

          temp.Currency = "USD";
          temp.Type = "future";

          let qtyNumber = Number(data["Filled Qty"]);
          temp.Qty = parseFloat(qtyNumber);

          if (newTrade == true && data["B/S"] == "Buy") {
            //= new trade
            newTrade = false;
            strategy = "long";
            temp.Side = "B";
            totalQty += qtyNumber;
          } else if (newTrade == true && data["B/S"] == "Sell") {
            newTrade = false;
            strategy = "short";
            temp.Side = "SS";
            totalQty += -qtyNumber;
          } else if (newTrade == false && data["B/S"] == "Buy") {
            strategy == "long" ? (temp.Side = "B") : (temp.Side = "BC");
            totalQty += +qtyNumber;
          } else if (newTrade == false && data["B/S"] == "Sell") {
            strategy == "long" ? (temp.Side = "S") : (temp.Side = "SS");
            totalQty += -qtyNumber;
          }

          totalQty == 0 ? (newTrade = true) : (newTrade = false);

          temp.SymbolOriginal = data.Contract;
          temp.Symbol = data.Product;
          temp.SymbolDescription = data["Product Description"];

          let priceNumber = Number(data["Avg Fill Price"]);
          temp.Price = parseFloat(priceNumber);

          //console.log(" Exec Time "+dayjs(data["Fill Time"], "HH:mm:ss").unix())
          temp["Exec Time"] = dayjs(data["Fill Time"]).format("HH:mm:ss");

          let contractSpecs = futureContractsJson.value.filter(
            (item) => item.symbol == temp.Symbol
          );
          //console.log(" -> contractSpecs " + JSON.stringify(contractSpecs))
          if (contractSpecs.length == 0) {
            reject("Missing information for future symbol " + temp.Symbol);
          }
          let tick = contractSpecs[0].tick;
          let value = contractSpecs[0].value;

          let qtyNumberSide;

          if (temp.Side == "B" || temp.Side == "BC") {
            qtyNumberSide = -qtyNumber;
          } else {
            qtyNumberSide = qtyNumber;
          }

          let proceedsNumber = ((qtyNumberSide * priceNumber) / tick) * value; // contract value (https://www.degiro.co.uk/knowledge/investing-in-futures/index-futures)
          //console.log(" Symobole "+temp.Symbol+" on "+temp["T/D"]+" has gross proceed of " + proceedsNumber)

          temp["Gross Proceeds"] = parseFloat(proceedsNumber);

          let echangeFees = futuresTradovateFees.value.filter((item) => item.symbol == temp.Symbol);
          let commNumber = 0;
          if (echangeFees) {
            //console.log(" -> exchange fee "+JSON.stringify(echangeFees[0].fee))
            //console.log(" -> fee "+echangeFees[0].fee[selectedTradovateTier.value])
            commNumber = echangeFees[0].fee[selectedTradovateTier.value.value] * qtyNumber;
          } else {
            reject("No Fees found");
          }
          temp.Comm = parseFloat(commNumber);
          temp.SEC = 0;
          temp.TAF = 0;
          temp.NSCC = 0;
          temp.Nasdaq = 0;
          temp["ECN Remove"] = 0;
          temp["ECN Add"] = 0;
          temp["Net Proceeds"] = parseFloat(proceedsNumber - commNumber);
          temp["Clr Broker"] = "";
          temp.Liq = "";
          //console.log("temp "+JSON.stringify(temp))
          TradesData.push(temp);
        }
      }
    } catch (error) {
      console.warn("  --> ERROR " + error);
      reject(error);
    }
    resolve();
  });
}
