<script>
  import tailwindConfig from "@/tailwind.config";
  import * as echarts from "echarts";
  import { BarChart, LineChart } from "echarts/charts";
  import { LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import resolveConfig from "tailwindcss/resolveConfig";
  import { defineComponent, ref } from "vue";
  import VChart, { THEME_KEY } from "vue-echarts";

  const trades = [];

  let data = [];
  let date = [];

  for (let index = 0; index < trades.length; index++) {
    const d = trades[index];
    data.push(d.netProceeds);
    date.push(d.created_at);
  }

  const appConfig = useAppConfig();
  const primary = appConfig.ui.primary;

  use([CanvasRenderer, BarChart, LineChart, TitleComponent, TooltipComponent, LegendComponent]);

  const { theme } = resolveConfig(tailwindConfig);

  export default defineComponent({
    name: "HelloWorld",
    components: {
      VChart,
    },
    provide: {
      [THEME_KEY]: "",
    },
    setup() {
      const option = ref({
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
          backgroundColor: theme.colors.gray[900],
          borderColor: theme.colors.gray[900],
          textStyle: {
            color: theme.colors.white,
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
            return (
              '<span class="font-bold text-xs"><div class="text-sm text-white/50">' +
              date +
              "</div>Proceeds: " +
              proceeds +
              "<br>Cumulated: " +
              cumulProceeds +
              "</span>"
            );
          },
        },
        title: {
          left: "left",
          text: "Cummulated PnL",
          textStyle: {
            color: theme.colors.white,
          },
          formatter: (params) => {
            return useTwoDecCurrencyFormat(params);
          },
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: date,
          axisLine: {
            lineStyle: {
              color: theme.colors.gray[500],
            },
          },
        },
        yAxis: {
          type: "value",
          formatter: "{value} W",
          axisPointer: {
            snap: true,
          },
          axisLine: {
            lineStyle: {
              color: theme.colors.gray[500],
            },
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              color: theme.colors.gray[800],
            },
            axisLabel: {
              formatter: (params) => {
                return useTwoDecCurrencyFormat(params);
              },
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            show: false,
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
            show: false,
          },
        ],
        series: [
          {
            name: "Net",
            type: "line",
            stack: "PNL",
            showSymbol: false,
            areaStyle: {
              opacity: 0.7,
            },
            emphasis: {
              focus: "series",
            },
            data: data,
            itemStyle: {
              color: appConfig.ui.primary,
            },
            encode: {
              x: "Date",
              itemName: "Date",
            },
          },
        ],
      });

      return { option };
    },
  });
</script>

<template>
  <v-chart class="h-full w-full" :option="option" autoresize />
</template>
