export const GetErrorIcon = 'akar-icons:chat-error'
export const GetErrorColor = 'red'
export const GetSuccessIcon = 'akar-icons:check-box'
export const GetSuccessColor = 'green'
export const GetInfoIcon = 'akar-icons:info-fill'
export const GetInfoColor = 'primary'


export const timeZones = ref(["America/New_York", "Asia/Shanghai", "Europe/Brussels", "Asia/Tokyo", "Asia/Hong_Kong", "Asia/Kolkata", "Europe/London", "Asia/Riyadh"])
export const traderTimeZone = ref('')

export function useSetTimeZone(timezone) {
  traderTimeZone.value = timezone && timeZones.value.includes(timezone) ? timezone.trim() : timeZones.value[0]
  console.log(" -> TimeZone for Trades: " + traderTimeZone.value)
}
