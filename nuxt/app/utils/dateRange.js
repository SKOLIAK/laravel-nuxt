import dayjs from "dayjs"
import { traderTimeZone } from "./global"
import { useMountDashboard } from "./utils"
export const dateRange = typeof localStorage !== 'undefined' ? ref(JSON.parse(localStorage.getItem('selectedDateRange'))) : ''
export const dateRangeModel = typeof localStorage !== 'undefined' ? ref(localStorage.getItem('selectedDateRangeModel')) : ''
export const dateRangeUnix = typeof localStorage !== 'undefined' ? ref(JSON.parse(localStorage.getItem('selectedDateRangeUnix'))) : ''

watch(dateRange, function (newValue, oldValue) {
  console.log('\n✅ Selected new date range --> \n' + JSON.stringify(newValue), dayjs(newValue.start).unix())

  dateRangeUnix.value = {
    start: dayjs(newValue.start).unix(),
    end: dayjs(newValue.end).unix(),
  }

  // Reset
  localStorage.removeItem('selectedDateRange')
  localStorage.removeItem('selectedDateRangeUnix')

  // // Set
  localStorage.setItem('selectedDateRange', JSON.stringify(newValue))
  localStorage.setItem('selectedDateRangeUnix', JSON.stringify(dateRangeUnix.value))


  // @todo temporary refresh
  useMountDashboard()

})

watch(dateRangeModel, function (newValue, oldValue) {
  console.log('\n✅ Selected new date range model --> \n' + JSON.stringify(newValue))
  localStorage.setItem('selectedDateRangeModel', newValue)
})

export const ranges = [
  { label: 'Last 7 days', duration: { days: 7 } },
  { label: 'Last 14 days', duration: { days: 14 } },
  { label: 'Last 30 days', duration: { days: 30 } },
  { label: 'Last 3 months', duration: { months: 3 } },
  { label: 'Last 6 months', duration: { months: 6 } },
  { label: 'Last year', duration: { years: 1 } }
]
/** SET INITIAL VALUES..... */
if (!dateRangeModel.value) {
  dateRangeModel.value = 'Daily'
}

if (!dateRangeUnix.value) {
  dateRangeUnix.value = {
    start: 0,
    end: 0
  }
}

if (!dateRange.value) {
  var timeAgo = new Date();
  timeAgo.setDate(timeAgo.getDate() - ranges[0].duration.days);
  dateRange.value = {
    start: new Date() - 1,
    end: timeAgo
  }
}

