import dayjs from "dayjs";

/** Instrument options and v-model */
export const instruments = ref(['Nasdaq', 'S&P 500', 'Gold', 'Oil'])
export const selectedInstrument = ref(instruments.value[0])

/** Session options and v-model */
export const sessions = ref(['ADR', 'ODR', 'RDR'])
export const selectedSession = ref(sessions.value[0])

/** General filter options and v-model */
export const nitroFilters = ref(['Unfiltered', 'By Day', 'By Week of the Month', 'By Month'])
export const nitroFilter = ref(nitroFilters.value[0])

/** Days of the week options and v-model */
export const daysOfWeek = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
export const dayOfWeek = ref(daysOfWeek.value[0])

/** Months of the year options and v-model */
export const monthsOfYear = ref(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
export const monthOfYear = ref(monthsOfYear.value[0])

/** Week of Month options and v-model */
export const weeksOfMonth = ref(['1st', '2nd', '3rd', '4th'])
export const weekOfMonth = ref(weeksOfMonth.value[0])

/** DR Rule options and v-model */
export const rules = ref(['True', 'False', 'All'])
export const rule = ref(rules.value[2])

/** Confirmation direction options and v-model */
export const directions = ref(['Long', 'Short', 'All'])
export const direction = ref(directions.value[2])


export function getSessionTimes(StartingTime = '00:00', HowManyTimes = 1) {
  let temp = []

  let lastTime = StartingTime

  for (let i = 0; i < HowManyTimes - 1; i++) {

    let a = lastTime
    lastTime = dayjs("2000-01-01 " + lastTime).add(0.5, 'hour').format('HH:mm')

    /**
     * Format the time in a way so we have time windows.
     * Eg.: 02:00-02:30
     */
    temp.push(a + '-' + lastTime)
  }

  /** Add `All` Filter */
  temp.push('All')

  return temp
}

/** Configuration to get correct time buckets */
const sessionTimeIterations = ref({
  'ADR': { start: '20:30', x: 12 },
  'ODR': { start: '04:00', x: 10 },
  'RDR': { start: '10:30', x: 12 }
})

/** Currently selected Session time array */
export const sessionTimes = ref(getSessionTimes(
  sessionTimeIterations.value[selectedSession.value].start,
  sessionTimeIterations.value[selectedSession.value].x
))

/** Currently seleced Session time window */
export const selectedSessionTime = ref(sessionTimes.value[0])

/** Once different session is chosen, update the time array */
watch(selectedSession, function() {
  sessionTimes.value = getSessionTimes(sessionTimeIterations.value[selectedSession.value].start, sessionTimeIterations.value[selectedSession.value].x)   // AllSessionTimes.value[selectedSession.value]
  selectedSessionTime.value = sessionTimes.value[0]
})









