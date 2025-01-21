import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from "echarts/renderers";

export default defineNuxtPlugin(() => {
  use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);
});
