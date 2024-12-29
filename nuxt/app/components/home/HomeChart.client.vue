<script setup lang="ts">
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns'
import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
import type { Period, Range } from '~/types'
import { useElementSize } from '@vueuse/core'

const cardRef = ref<HTMLElement | null>(null)

const props = defineProps({
  period: {
    type: String as PropType<Period>,
    required: true
  },
  range: {
    type: Object as PropType<Range>,
    required: true
  }
})

type DataRecord = {
  date: Date
  amount: number
}

const { width } = useElementSize(cardRef)

const objArray = ref([])

function Prob(){
    var rnd = Math.random(),
        rnd2 = Math.random();
    if(rnd<0.4) return (1 + Math.floor(1000 * rnd2)/100);
    else if(rnd<0.6) return (11 + Math.floor(1000 * rnd2)/100);
    else if(rnd<0.9) return (21 + Math.floor(1000 * rnd2)/100);
    else return (31 + Math.floor(500 * rnd2)/100);
}

// We use `useAsyncData` here to have same random data on the client and server
const { data } = await useAsyncData<DataRecord[]>(async () => {
  const dates = ({
    daily: eachDayOfInterval,
    weekly: eachWeekOfInterval,
    monthly: eachMonthOfInterval
  })[dateRangeModel.value](dateRange.value)

  const min = -500
  const max = 500
  let last = 0

  //return dates.map(date => ({ date, amount: last += last = Prob() }))
  dates.forEach((e,k) => {
    let checkDate = format(e, 'dd.MM.yyyy')
    let tmp = []


    pnlChartData.value.forEach(b => {
      if (b.date == checkDate) {
        tmp[k]['date'] = new Date(b.date)
        tmp[k]['amount'] = b.amount
      } else {
        tmp[k]['date'] = e
        tmp[k]['amount'] = 0
      }

      objArray.push(tmp[k])

    });


  });

  let le = dates.map((date, x) => ({ date, amount: isLoaded && pnlChartData.value.findIndex(x => x.date == format(date, 'dd.MM.yyyy')) ? pnlChartData.value[pnlChartData.value.findIndex(x => x.date == format(date, 'dd.MM.yyyy'))].amount : 0 }))

  console.warn(le)


  return le
}, {
  watch: [() => dateRangeModel.value, () => dateRange.value],
  default: () => []
})


console.warn(isLoaded && pnlChartData.value.findIndex(x => x.date == '05.12.2024') ? pnlChartData.value[pnlChartData.value.findIndex(x => x.date == '05.12.2024')].amount : 0)


const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.amount

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))

const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format

const formatDate = (date: Date): string => {
  return ({
    daily: format(date, 'd MMM'),
    weekly: format(date, 'd MMM'),
    monthly: format(date, 'MMM yyy')
  })[props.period]
}

const xTicks = (i: number) => {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }

  return formatDate(data.value[i].date)
}

const template = (d: DataRecord) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`
</script>

<template>
  <UDashboardCard
    ref="cardRef"
    :ui="{ body: { padding: '!pb-3 !px-0' } as any }"
  >
    <template #header>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
          Cumulated Pnl
        </p>
        <p class="text-3xl text-gray-900 dark:text-white font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <VisXYContainer
      :data="data"
      :padding="{ top: 10 }"
      class="h-96"
      :width="width"
    >
      <VisLine
        :x="x"
        :y="y"
        color="rgb(var(--color-primary-DEFAULT))"
      />
      <VisArea
        :x="x"
        :y="y"
        color="rgb(var(--color-primary-DEFAULT))"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="rgb(var(--color-primary-DEFAULT))"
        :template="template"
      />

      <VisTooltip />
    </VisXYContainer>
  </UDashboardCard>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: rgb(var(--color-primary-500));
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: rgb(var(--color-gray-200));
  --vis-axis-tick-color: rgb(var(--color-gray-200));
  --vis-axis-tick-label-color: rgb(var(--color-gray-400));

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: rgb(var(--color-gray-200));
  --vis-tooltip-text-color: rgb(var(--color-gray-900));
}

.dark {
  .unovis-xy-container {
    --vis-crosshair-line-stroke-color: rgb(var(--color-primary-400));
    --vis-crosshair-circle-stroke-color: rgb(var(--color-gray-900));

    --vis-axis-grid-color: rgb(var(--color-gray-800));
    --vis-axis-tick-color: rgb(var(--color-gray-800));
    --vis-axis-tick-label-color: rgb(var(--color-gray-500));

    --vis-tooltip-background-color: rgb(var(--color-gray-900));
    --vis-tooltip-border-color: rgb(var(--color-gray-800));
    --vis-tooltip-text-color: #fff;
  }
}
</style>
