import tailwindConfig from "@/tailwind.config";
import { format } from "date-fns";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek.js";
import * as echarts from "echarts";
import resolveConfig from "tailwindcss/resolveConfig";

import { dateRangeModel } from "./dateRange";
import { amountCase, selectedRange, totals, totalsByDate, useChartFormat } from "./global";


let colorMode = {}
// Failsafe
colorMode.preference = 'dark'


dayjs.extend(isoWeek);

const appConfig = useAppConfig();
const { theme } = resolveConfig(tailwindConfig);

const maxChartValues = 20;

export const backtestDataX = ref([]);
export const backtestDataY = ref([]);
export const backtestChart = ref(null);

export async function useCharts(param) {
  console.log("\n✅ USING CHARTS");
  for (let index = 1; index <= 2; index++) {
    var chartId = "pieChart" + index;

    if (param == "clear") {
      echarts.init(document.getElementById(chartId)).clear();
    }

    if (param == "init") {
      let green;
      let red;
      if (index == 1) {
        //green = probWins
        //red = probLoss
        green = totals[amountCase.value + "WinsCount"] / totals.trades;
        red = totals[amountCase.value + "LossCount"] / totals.trades;
        await usePieChart(chartId, green, red);
      }
    }
  }

  function handleCharts(prefix, useChartFunction) {
    let elements = document.querySelectorAll(`[id^="${prefix}"]`);
    elements.forEach((element) => {
      if (param == "clear") {
        echarts.init(element).clear();
      }
      if (param == "init" || param == prefix) {
        useChartFunction(element.id);
      }
    });
  }

  handleCharts("cumulatedPnl", useCumulatedPnlChart);
  handleCharts("backtestChartElement", useBacktestChart);
}



export function useNitroCharts() {
  return new Promise((resolve, reject) => {
    let myChart = echarts.init(document.getElementById('nitro-extension-chart'));

    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.white,
        borderColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.zinc[200],
        textStyle: {
          color: colorMode.preference == 'dark' ? theme.colors.white : theme.colors.zinc[900],
        },
        formatter: (params) => {
          params.forEach((element, index) => {
            return "Something Something blah blah<br/ >More here :D";
          })
        },
      },
      axisLabel: {
        interval: 1000,
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        data: [-0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "solid",
            color: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.zinc[100],
          },
        },
        axisLabel: {
          formatter: (params) => {
            return params;
          },
        },
      },
      series: [
        {
          data: [2,
            {
              value: 1.1,
              itemStyle: {
                color: theme.colors.teal[200]
              }
            }, 0.7, 0.9, 2, 1.3, 1, 1.2, 2, 1.3, 1.5, 1.6, 1.2],
          type: "bar",
          label: {
            color: theme.colors.zinc[900],
          },
          itemStyle: {
            color: theme.colors.teal[600],
          },
          emphasis: {
            itemStyle: {
              color: theme.colors.teal[600],
            },
          },
        },
      ],
    };
    myChart.setOption(option);
    resolve();

  })
}

export function useBacktestChart(param) {
  return new Promise((resolve, reject) => {
    var chartDom = document.getElementById(param);

    backtestChart.value = echarts.init(chartDom);
    var option;

    option = {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: backtestDataX.value,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: backtestDataY.value,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            color: "#059669",
          },
          areaStyle: {
            opacity: 0.2,
          },
        },
      ],
    };

    option && backtestChart.value.setOption(option);
  });
}

export function useCumulatedPnlChart(param) {
  //console.log("  --> " + param)
  return new Promise((resolve, reject) => {
    var myChart = echarts.init(document.getElementById(param));
    var chartData = [];
    var chartBarData = [];
    var chartXAxis = [];
    var sumProceeds = 0;
    var weekOfYear = null;
    var monthOfYear = null;
    var i = 1;

    let objectY = JSON.parse(JSON.stringify(totalsByDate));
    const keys = Object.keys(objectY);

    for (const key of keys) {
      var element = objectY[key];
      var proceeds = 0;

      var pushingChartBarData = () => {
        if (keys.length <= maxChartValues) {
          var temp = {};
          temp.value = proceeds;
          temp.label = {};
          temp.label.show = true;
          if (proceeds >= 0) {
            temp.label.position = "top";
          } else {
            temp.label.position = "bottom";
          }
          temp.label.formatter = (params) => {
            return useThousandCurrencyFormat(params.value);
          };
          chartBarData.push(temp);
        } else {
          chartBarData.push(proceeds);
        }
      };

      var pushingChartData = () => {
        if (chartData.length == 0) {
          chartData.push(proceeds);
        } else {
          chartData.push(chartData.slice(-1).pop() + proceeds);
        }
      };

      if (dateRangeModel.value == "daily") {
        proceeds = element[amountCase.value + "Proceeds"];
        chartXAxis.push(useChartFormat(key));
        pushingChartBarData();
        pushingChartData();
      }

      if (dateRangeModel.value == "weekly") {
        //First value
        if (weekOfYear == null) {
          weekOfYear = dayjs.unix(key).isoWeek();
          sumProceeds += element[amountCase.value + "Proceeds"];
          //console.log("First run. Week of year: "+weekOfYear+" and month of year "+ dayjs.unix(key).month()+" and start of week "+dayjs.unix(key).startOf('isoWeek')+" and month of start of week "+dayjs.unix(dayjs.unix(key).startOf('isoWeek')/1000).month())
          //If start of week is another month
          /*if (dayjs.unix(key).month() != dayjs.unix(dayjs.unix(key).startOf('isoWeek') / 1000).month()) {
              chartXAxis.push(useChartFormat(key))
          } else {
              chartXAxis.push(useChartFormat(dayjs.unix(key).startOf('isoWeek') / 1000))
          }*/
          //First I did the logic above. But I realized that it makes difficult to compare. Expl: 1 month you will have from 1/09, then 06/09. But then, last two weeks, the 06/09 value will not be the same, because two weeks back is actually starting at 07/09.So, for the first, we always push the key
          chartXAxis.push(useChartFormat(key));
        } else if (weekOfYear == dayjs.unix(key).isoWeek()) {
          //Must be "else if" or else calculates twice : once when null and then this time.value
          //console.log("Same week. Week of year: " + weekOfYear)
          sumProceeds += element[amountCase.value + "Proceeds"];
        }
        if (dayjs.unix(key).isoWeek() != weekOfYear) {
          //When week changes, we create values proceeds and push both chart datas
          proceeds = sumProceeds;
          pushingChartBarData();
          pushingChartData();

          //New week, new proceeds
          sumProceeds = 0;
          weekOfYear = dayjs.unix(key).isoWeek();
          //console.log("New week. Week of year: " + weekOfYear + " and start of week " + dayjs.unix(key).startOf('isoWeek'))
          sumProceeds += element[amountCase.value + "Proceeds"];
          chartXAxis.push(useChartFormat(dayjs.unix(key).startOf("isoWeek") / 1000));
        }
        if (i == keys.length) {
          //Last key. We wrap up.
          proceeds = sumProceeds;
          pushingChartBarData();
          pushingChartData();
          //console.log("Last element")
        }
      }

      if (dateRangeModel.value == "monthly") {
        //First value
        if (monthOfYear == null) {
          monthOfYear = dayjs.unix(key).month();
          sumProceeds += element[amountCase.value + "Proceeds"];
          chartXAxis.push(useChartFormat(key));
        }
        //Same month. Let's continue adding proceeds
        else if (monthOfYear == dayjs.unix(key).month()) {
          //console.log("Same week. Week of year: " + monthOfYear)
          sumProceeds += element[amountCase.value + "Proceeds"];
        }
        if (dayjs.unix(key).month() != monthOfYear) {
          //When week changes, we create values proceeds and push both chart datas
          proceeds = sumProceeds;
          pushingChartBarData();
          pushingChartData();

          //New month, new proceeds
          sumProceeds = 0;
          monthOfYear = dayjs.unix(key).month();
          //console.log("New week. Week of year: " + monthOfYear + " and start of week " + dayjs.unix(key).startOf('month'))
          sumProceeds += element[amountCase.value + "Proceeds"];
          chartXAxis.push(useChartFormat(dayjs.unix(key).startOf("month") / 1000));
        }
        if (i == keys.length) {
          //Last key. We wrap up.
          proceeds = sumProceeds;
          pushingChartBarData();
          pushingChartData();
          sumProceeds = 0;
          //console.log("Last element")
        }
      }
      i++;

      //console.log("element "+JSON.stringify(element))
    }
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.white,
        borderColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.zinc[200],
        textStyle: {
          color: colorMode.preference == 'dark' ? theme.colors.white : theme.colors.zinc[900],
        },
        formatter: (params) => {
          var proceeds;
          var cumulProceeds;
          var date;
          params.forEach((element, index) => {
            if (index == 0) {
              cumulProceeds = useThousandCurrencyFormat(element.value);
              date = element.name;
            }
            if (index == 1) {
              proceeds = useThousandCurrencyFormat(element.value);
            }
          });
          //console.log("params "+JSON.stringify(params[0][0]))
          return date + "<br>Proceeds: " + proceeds + "<br>Cumulated: " + cumulProceeds;
        },
      },
      axisLabel: {
        interval: 1000,
      },
      xAxis: {
        type: "category",
        data: chartXAxis,
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "solid",
            color: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.zinc[100],
          },
        },
        axisLabel: {
          formatter: (params) => {
            return useThousandCurrencyFormat(params);
          },
        },
      },
      series: [
        {
          data: chartData,
          type: "line",
          smooth: true,
          symbol: false,
          itemStyle: {
            color: theme.colors.teal[500],
          },
          emphasis: {
            itemStyle: {
              color: theme.colors.teal[600],
            },
          },
        },
        {
          data: chartBarData,
          type: "bar",
          label: {
            color: theme.colors.zinc[900],
          },
          itemStyle: {
            color: theme.colors.teal[500],
          },
          emphasis: {
            itemStyle: {
              color: theme.colors.teal[600],
            },
          },
        },
      ],
    };
    myChart.setOption(option);
    resolve();
  });
}

export function useRenderPieChart() {
  return new Promise(async (resolve, reject) => {
    await useGetFilteredTrades();
    await filteredTrades.forEach((el) => {
      var chartId = "pieChart" + el.dateUnix;
      var probWins = el.pAndL[amountCase.value + "WinsCount"] / el.pAndL.trades;
      var probLoss = el.pAndL[amountCase.value + "LossCount"] / el.pAndL.trades;
      //var probNetWins = (el.pAndL.netWinsCount / el.pAndL.trades)
      //var probNetLoss = (el.pAndL.netLossCount / el.pAndL.trades)
      //console.log("prob net win " + probNetWins + " and loss " + probNetLoss)
      usePieChart(chartId, probWins, probLoss, "daily");
    });
    resolve();
  });
}

export function usePieChart(param1, param2, param3) {
  //chart ID, green, red, page
  return new Promise((resolve, reject) => {
    console.log("  --> " + param1);
    console.log("para 2 " + param2 + " and 3 " + param3);
    let myChart = echarts.init(document.getElementById(param1));
    let green = param2;
    let red = param3;
    const option = {
      series: [
        {
          type: "pie",
          radius: ["70%", "100%"],
          avoidLabelOverlap: false,
          data: [{ value: green }, { value: red }],
          itemStyle: {
            color: (params) => {
              if (params.dataIndex == 0) {
                return theme.colors.zinc[500];
              }
              if (params.dataIndex == 1) {
                return colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.zinc[100];
              }
            },
          },
          label: {
            show: true,
            position: "center",
            color: colorMode.preference == 'dark' ? theme.colors.zinc[500] : theme.colors.zinc[900],
            formatter: (params) => {
              let rate = "";
              if (param1 == "pieChart1") {
                rate = "\nWin rate";
              }
              if (param1 == "pieChart2") {
                rate = "\nSatisfaction";
              }
              return useOneDecPercentFormat(green) + rate;
            },
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    };
    myChart.setOption(option);
    resolve();
  });
}

export function useDoubleLineChart(param1, param2, param3, param4) {
  //chartID, chartDataGross, chartDataNet, chartCategories
  //console.log("param1 "+param1+", param2 "+param2+", param3 "+param3+", param4 "+param4)
  return new Promise((resolve, reject) => {
    //console.log("param1 "+param1)
    var myChart = echarts.init(document.getElementById(param1));
    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.white,
        borderColor: colorMode.preference == 'dark' ? theme.colors.zinc[900] : theme.colors.white,
        textStyle: {
          color: colorMode.preference == 'dark' ? theme.colors.white : theme.colors.zinc[900],
        },
        formatter: (params) => {
          var gross;
          var net;
          var time;
          params.forEach((element, index) => {
            //console.log('element ' + JSON.stringify(element))
            if (index == 0) {
              gross = element.value.toFixed(0) + "$";
              time = element.name;
            }
            if (index == 1) {
              net = element.value.toFixed(0) + "$";
            }
          });
          //console.log("params "+JSON.stringify(params[0][0]))
          //console.log('time format ' + typeof time + "time " + time)
          return (
            "<div class='text-xs text-light-dark'>" +
            time +
            "<div class='border-b dark:border-gray-700/50 border-gray-200 my-1'></div>Gross: " +
            gross +
            "<br>Net: " +
            net +
            "</div >"
          );
        },
      },
      axisLabel: {},
      xAxis: {
        data: param4,
        name: "0",
        nameLocation: "start",
      },
      yAxis: {
        type: "value",
        /*scale: true,
        max: function(value) {
            return value.max;
        },
        min: function(value) {
            return value.min;
        },*/
        axisLabel: {
          show: false,
          formatter: (params) => {
            return params.toFixed(0) + "$";
          },
        },
        splitLine: {
          show: false,
        },
      },

      series: [
        {
          data: param2,
          showSymbol: false, //removes dot on line
          type: "line",
          smooth: true,
          itemStyle: {
            color: theme.colors.zinc[300],
          },
          emphasis: {
            itemStyle: {
              color: theme.colors.zinc[300],
            },
          },
        },
        {
          data: param3,
          showSymbol: false, //removes dot on line
          type: "line",
          smooth: true,
          itemStyle: {
            color: theme.colors.zinc[500],
          },
          emphasis: {
            itemStyle: {
              color: theme.colors.zinc[500],
            },
          },
        },
      ],
    };
    myChart.setOption(option);
    resolve();
  });
}

export function useRenderDoubleLineChart() {
  return new Promise(async (resolve, reject) => {
    await filteredTrades.forEach((el) => {
      //console.log(" date "+el.dateUnix)
      var chartId = "doubleLineChart" + el.dateUnix;
      var chartDataGross = [];
      var chartDataNet = [];
      var chartCategories = [];
      el.trades.forEach((element) => {
        var proceeds = element.grossProceeds;
        //console.log("proceeds "+proceeds)
        var proceedsNet = element["netProceeds"];
        if (chartDataGross.length == 0) {
          chartDataGross.push(proceeds);
        } else {
          chartDataGross.push(chartDataGross.slice(-1).pop() + proceeds);
        }

        if (chartDataNet.length == 0) {
          chartDataNet.push(proceedsNet);
        } else {
          chartDataNet.push(chartDataNet.slice(-1).pop() + proceedsNet);
        }
        chartCategories.push(useHourMinuteFormat(element.exitTime));
        //console.log("chartId "+chartId+", chartDataGross "+chartDataGross+", chartDataNet "+chartDataNet+", chartCategories "+chartCategories)
      });
      useDoubleLineChart(chartId, chartDataGross, chartDataNet, chartCategories);
    });
    resolve();
  });
}
