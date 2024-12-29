import * as echarts from 'echarts';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js'
dayjs.extend(isoWeek)
import { format } from 'date-fns';
import { totalsByDate, useChartFormat, amountCase, totals, selectedRange } from './global';
import { dateRangeModel } from './dateRange';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/tailwind.config'
const appConfig = useAppConfig()
const { theme } = resolveConfig(tailwindConfig)

const maxChartValues = 20


export const backtestDataX = ref([])
export const backtestDataY = ref([])
export const backtestChart = ref(null)

function getTailwindHex(variable, index = 500) {
  return index == 0 ? theme.colors[variable] : theme.colors[variable][index]
}


export async function useCharts(param) {
  console.log("\n✅ USING CHARTS")
  for (let index = 1; index <= 2; index++) {
    var chartId = 'pieChart' + index

    if (param == 'clear') {
      echarts.init(document.getElementById(chartId)).clear()
    }

    if (param == "init") {
      let green
      let red
      if (index == 1) {
        //green = probWins
        //red = probLoss
        green = (totals[amountCase.value + 'WinsCount'] / totals.trades)
        red = (totals[amountCase.value + 'LossCount'] / totals.trades)
        await usePieChart(chartId, green, red)

      }
    }

  }


  function handleCharts(prefix, useChartFunction) {
    let elements = document.querySelectorAll(`[id^="${prefix}"]`);
    elements.forEach(element => {
      if (param == "clear") {
        echarts.init(element).clear();
      }
      if (param == "init" || param == prefix) {
        useChartFunction(element.id);
      }
    });
  }


  handleCharts('cumulatedPnl', useCumulatedPnlChart)
  handleCharts('backtestChartElement', useBacktestChart)
}


export function useBacktestChart(param) {
  return new Promise((resolve, reject) => {
    var chartDom = document.getElementById(param);

    backtestChart.value = echarts.init(chartDom);
    var option;

    option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: backtestDataX.value
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: backtestDataY.value,
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#059669',
          },
          areaStyle: {
            opacity: 0.2,
          }
        }
      ]
    };

    option && backtestChart.value.setOption(option);

  })
}


export function useCumulatedPnlChart(param) {
  //console.log("  --> " + param)
  return new Promise((resolve, reject) => {
    var myChart = echarts.init(document.getElementById(param));
    var chartData = []
    var chartBarData = []
    var chartXAxis = []
    var sumProceeds = 0
    var weekOfYear = null
    var monthOfYear = null
    var i = 1

    let objectY = JSON.parse(JSON.stringify(totalsByDate))
    const keys = Object.keys(objectY);

    for (const key of keys) {
      var element = objectY[key]
      var proceeds = 0

      var pushingChartBarData = () => {
        if (keys.length <= maxChartValues) {
          var temp = {}
          temp.value = proceeds
          temp.label = {}
          temp.label.show = true
          if (proceeds >= 0) {
            temp.label.position = 'top'
          } else {
            temp.label.position = 'bottom'
          }
          temp.label.formatter = (params) => {
            return useThousandCurrencyFormat(params.value)
          }
          chartBarData.push(temp)
        } else {
          chartBarData.push(proceeds)
        }
      }

      var pushingChartData = () => {
        if (chartData.length == 0) {
          chartData.push(proceeds)
        } else {
          chartData.push(chartData.slice(-1).pop() + proceeds)
        }
      }

      if (dateRangeModel.value == "daily") {
        proceeds = element[amountCase.value + 'Proceeds']
        chartXAxis.push(useChartFormat(key))
        pushingChartBarData()
        pushingChartData()
      }

      if (dateRangeModel.value == "weekly") {
        //First value
        if (weekOfYear == null) {
          weekOfYear = dayjs.unix(key).isoWeek()
          sumProceeds += element[amountCase.value + 'Proceeds']
          //console.log("First run. Week of year: "+weekOfYear+" and month of year "+ dayjs.unix(key).month()+" and start of week "+dayjs.unix(key).startOf('isoWeek')+" and month of start of week "+dayjs.unix(dayjs.unix(key).startOf('isoWeek')/1000).month())
          //If start of week is another month
          /*if (dayjs.unix(key).month() != dayjs.unix(dayjs.unix(key).startOf('isoWeek') / 1000).month()) {
              chartXAxis.push(useChartFormat(key))
          } else {
              chartXAxis.push(useChartFormat(dayjs.unix(key).startOf('isoWeek') / 1000))
          }*/
          //First I did the logic above. But I realized that it makes difficult to compare. Expl: 1 month you will have from 1/09, then 06/09. But then, last two weeks, the 06/09 value will not be the same, because two weeks back is actually starting at 07/09.So, for the first, we always push the key
          chartXAxis.push(useChartFormat(key))

        } else if (weekOfYear == dayjs.unix(key).isoWeek()) { //Must be "else if" or else calculates twice : once when null and then this time.value
          //console.log("Same week. Week of year: " + weekOfYear)
          sumProceeds += element[amountCase.value + 'Proceeds']
        }
        if (dayjs.unix(key).isoWeek() != weekOfYear) {
          //When week changes, we create values proceeds and push both chart datas
          proceeds = sumProceeds
          pushingChartBarData()
          pushingChartData()

          //New week, new proceeds
          sumProceeds = 0
          weekOfYear = dayjs.unix(key).isoWeek()
          //console.log("New week. Week of year: " + weekOfYear + " and start of week " + dayjs.unix(key).startOf('isoWeek'))
          sumProceeds += element[amountCase.value + 'Proceeds']
          chartXAxis.push(useChartFormat(dayjs.unix(key).startOf('isoWeek') / 1000))
        }
        if (i == keys.length) {
          //Last key. We wrap up.
          proceeds = sumProceeds
          pushingChartBarData()
          pushingChartData()
          //console.log("Last element")
        }
      }

      if (dateRangeModel.value == "monthly") {
        //First value
        if (monthOfYear == null) {
          monthOfYear = dayjs.unix(key).month()
          sumProceeds += element[amountCase.value + 'Proceeds']
          chartXAxis.push(useChartFormat(key))

        }
        //Same month. Let's continue adding proceeds
        else if (monthOfYear == dayjs.unix(key).month()) {
          //console.log("Same week. Week of year: " + monthOfYear)
          sumProceeds += element[amountCase.value + 'Proceeds']
        }
        if (dayjs.unix(key).month() != monthOfYear) {
          //When week changes, we create values proceeds and push both chart datas
          proceeds = sumProceeds
          pushingChartBarData()
          pushingChartData()

          //New month, new proceeds
          sumProceeds = 0
          monthOfYear = dayjs.unix(key).month()
          //console.log("New week. Week of year: " + monthOfYear + " and start of week " + dayjs.unix(key).startOf('month'))
          sumProceeds += element[amountCase.value + 'Proceeds']
          chartXAxis.push(useChartFormat(dayjs.unix(key).startOf('month') / 1000))
        }
        if (i == keys.length) {
          //Last key. We wrap up.
          proceeds = sumProceeds
          pushingChartBarData()
          pushingChartData()
          sumProceeds = 0
          //console.log("Last element")
        }
      }
      i++

      //console.log("element "+JSON.stringify(element))
    }
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.colors.white,
        borderColor: theme.colors.gray[200],
        textStyle: {
          color: theme.colors.gray[900]
        },
        formatter: (params) => {
          var proceeds
          var cumulProceeds
          var date
          params.forEach((element, index) => {
            if (index == 0) {
              cumulProceeds = useThousandCurrencyFormat(element.value)
              date = element.name
            }
            if (index == 1) {
              proceeds = useThousandCurrencyFormat(element.value)
            }
          });
          //console.log("params "+JSON.stringify(params[0][0]))
          return date + "<br>Proceeds: " + proceeds + "<br>Cumulated: " + cumulProceeds

        }
      },
      axisLabel: {
        interval: 1000,
      },
      xAxis: {
        type: 'category',
        data: chartXAxis,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: theme.colors.gray[100]
          }
        },
        axisLabel: {
          formatter: (params) => {
            return useThousandCurrencyFormat(params)
          }
        },
      },
      series: [{
        data: chartData,
        type: 'line',
        smooth: true,
        symbol: false,
        itemStyle: {
          color: theme.colors.emerald[500],
        },
        emphasis: {
          itemStyle: {
            color: theme.colors.emerald[600]
          }
        },
      },
      {
        data: chartBarData,
        type: 'bar',
        label: {
          color: theme.colors.gray[900]
        },
        itemStyle: {
          color: theme.colors.emerald[500],
        },
        emphasis: {
          itemStyle: {
            color: theme.colors.emerald[600]
          }
        },
      }
      ]
    }
    myChart.setOption(option);
    resolve()
  })
}


export function usePieChart(param1, param2, param3) { //chart ID, green, red, page
  return new Promise((resolve, reject) => {
    console.log("  --> " + param1)
    console.log("para 2 " + param2 + " and 3 " + param3)
    let myChart = echarts.init(document.getElementById(param1));
    let green = param2 ? param2 : 0
    let red = param3 ? param3 : 1
    const option = {
      series: [{
        type: 'pie',
        radius: ['70%', '100%'],
        avoidLabelOverlap: false,
        data: [
          { value: green },
          { value: red },
        ],
        itemStyle: {
          color: (params) => {
            if (params.dataIndex == 0) {
              return theme.colors.emerald[600]
            }
            if (params.dataIndex == 1) {
              return theme.colors.gray[100]
            }
          }
        },
        label: {
          show: true,
          position: 'center',
          color: theme.colors.gray[900],
          formatter: (params) => {
            let rate
            if (param1 == "pieChart1") {
              rate = "\nWin rate"
            }
            if (param1 == "pieChart2") {
              rate = "\nSatisfaction"
            }
            return useOneDecPercentFormat(green) + rate
          }
        },
        emphasis: {
          disabled: true
        },
      },

      ]
    };
    myChart.setOption(option);
    resolve()
  })
}
