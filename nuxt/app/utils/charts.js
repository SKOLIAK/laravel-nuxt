import * as echarts from 'echarts';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js'
dayjs.extend(isoWeek)
import { format } from 'date-fns';
import { totalsByDate, useChartFormat, amountCase } from './global';
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
    console.warn(chartDom)
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
  //console.log('Cumulated Pnl Chart param --> ' + param)
  return new Promise((resolve, reject) => {
    var myChart
    var instance = echarts.getInstanceByDom(document.getElementById(param))
    myChart = !instance ? echarts.init(document.getElementById(param)) : instance

    var chartData = []
    var chartBarData = []
    var chartXAxis = []
    var sumProceeds = 0
    var weekOfYear = null
    var monthOfYear = null
    var i = 0 // 0 - cumul / 1 - regular

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
          temp.label.show = false
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

        if (weekOfYear == null) {
          weekOfYear = dayjs.unix(key).isoWeek()
          sumProceeds += element[amountCase.value + 'Proceeds']
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


      // @todo Add monthly??
      i++
    }

    let _base = +new Date(2024, 1, 1);
    let _oneDay = 24 * 3600 * 1000;
    let _date = [];
    let _data = [Math.random() * 300];
    let _previous = 0
    for (let i = 1; i < 100; i++) {
      var now = new Date((_base += _oneDay));
      _date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
      _data.push(_previous = Math.round((Math.random() - 0.5) * 20 + _data[i - 1]));
    }



    const option = {
      title: {
        left: 'left',
        text: 'Cumulative PnL',
        textStyle: {
          color: theme.colors.gray[700]
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.colors.white,
        borderColor: getTailwindHex('gray', 100),
        textStyle: {
          color: theme.colors.gray[700]
        },
        formatter: (params) => {
          var proceeds
          var cumulProceeds
          var date
          params.forEach((element, index) => {
            if (index == 0) {
              cumulProceeds = useTwoDecCurrencyFormat(element.value)
              date = element.name
            }
            if (index == 1) {
              proceeds = useTwoDecCurrencyFormat(element.value)
            }
          });
          //console.log("params "+JSON.stringify(params[0][0]))
          return '<span class="font-medium text-xs"><div class="text-gray-700 font-bold">' + date + "</div><div>Proceeds: " + proceeds + "</div>Cumulated: " + cumulProceeds + '</span>'

        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: chartXAxis,
        axisLine: {
          lineStyle: {
            color: theme.colors.gray[500]
          }
        },
      },
      yAxis: {
        type: 'value',
        axisPointer: {
          snap: true
        },
        axisLine: {
          lineStyle: {
            color: theme.colors.gray[400]
          }
        },
        splitLine: {
          lineStyle: {
            type: 'solid',
            color: theme.colors.gray[100]
          },
          axisLabel: {
            formatter: (params) => {
              return useThousandCurrencyFormat(params)
            }
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          show: false,
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          show: false
        }
      ],
      series: [{
        name: 'Proceeds',
        stack: 'proceeds',
        data: chartBarData,
        type: 'line',
        smooth: true,
        symbol: 'none',
        itemStyle: {
          color: getTailwindHex(appConfig.ui.primary, 600),
        },
        areaStyle: {
          opacity: 0.2,
        }
      },
      {
        name: 'Proceeds',
        stack: 'proceeds',
        data: _data, // @todo chartData,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: theme.colors.gray[600],
        },
        areaStyle: {
          opacity: 0.2,
        }
      }
      ]
    }

    myChart.setOption(option);
    resolve()


  })




}
