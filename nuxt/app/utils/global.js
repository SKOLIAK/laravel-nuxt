export const GetErrorIcon = 'octicon:x'
export const GetErrorColor = 'orange'
export const GetSuccessIcon = 'octicon:check'
export const GetSuccessColor = 'teal'
export const GetInfoIcon = 'octicon:light-bulb-16'
export const GetInfoColor = 'blue'

import dayjs from "dayjs"

export const timeZones = ref(["America/New_York", "Asia/Shanghai", "Europe/Brussels", "Asia/Tokyo", "Asia/Hong_Kong", "Asia/Kolkata", "Europe/London", "Asia/Riyadh"])
export const traderTimeZone = ref('')

export function useSetTimeZone(timezone) {
  traderTimeZone.value = timezone && timeZones.value.includes(timezone) ? timezone.trim() : timeZones.value[0]
  console.log(" -> TimeZone for Trades: " + traderTimeZone.value)
}


/**************************************
* DATE FORMATS
**************************************/
export function useDateNumberFormat(param) {
  return Number(Math.trunc(param)) //we have to use /1000 and not unix because or else does not take into account tz
}

export function useDateCalFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM-DD")
}

export function useDateCalFormatMonth(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM")
}

export function useTimeFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("HH:mm:ss")
}

export function useTimeFormatFromDate(param) {
  return dayjs(param).tz(traderTimeZone.value).format("HH:mm:ss")
}

export function useTimeDuration(param) {
  return dayjs.duration(param * 1000).format("HH:mm:ss")
}

export function useSwingDuration(param) {
  let duration = Number(dayjs.duration(param * 1000).format("D"))
  let period
  duration > 1 ? period = "days" : period = "day"
  return (duration + " " + period)
}

export function useHourMinuteFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("HH:mm")
}

export function useDateTimeFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM-DD HH:mm:ss")
}

export function useChartFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("l")
}

export function useMonthFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("MMMM YYYY")
}

export function useMonthFormatShort(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("MMM YY")
}

export function useCreatedDateFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("ddd DD MMMM YYYY")
}

export function useDatetimeLocalFormat(param) {
  return dayjs.tz(param * 1000, traderTimeZone.value).format("YYYY-MM-DDTHH:mm:ss") //here we ne
}

export function useStartOfDay(param) {
  return dayjs(param * 1000).tz(traderTimeZone.value).startOf("day").unix()
}


/**************************************
* NUMBER FORMATS
**************************************/
export function useThousandCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, style: 'currency', currency: 'USD' }).format(param)
}

export function useThousandFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(param)
}

export function useTwoDecCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, style: 'currency', currency: 'USD' }).format(param)
}

export function useThreeDecCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 3, style: 'currency', currency: 'USD' }).format(param)
}

export function useXDecCurrencyFormat(param, param2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: param2, style: 'currency', currency: 'USD' }).format(param)
}

export function useTwoDecFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(param)
}

export function useXDecFormat(param, param2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: param2 }).format(param)
}

export function useOneDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, style: 'percent' }).format(param)
}

export function useTwoDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, style: 'percent' }).format(param)
}

export function useFormatBytes(param, decimals = 2) {
  if (param === 0) return '0 bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['param', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(param) / Math.log(k));
  return parseFloat((param / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function useDecimalsArithmetic(param1, param2) {
  //https://flaviocopes.com/javascript-decimal-arithmetics/
  return ((param1.toFixed(6) * 100) + (param2.toFixed(6) * 100)) / 100
}
