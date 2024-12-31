import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc)
import isoWeek from 'dayjs/plugin/isoWeek.js'
dayjs.extend(isoWeek)
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(timezone)
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)
import updateLocale from 'dayjs/plugin/updateLocale.js'
dayjs.extend(updateLocale)
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
dayjs.extend(localizedFormat)
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat)
import calendarize from 'calendarize';


import { renderingCharts, traderTimeZone } from '@/utils/global'
import { selectedMonth } from '@/utils/dateRange'


export async function useLoadCalendar() {
  console.log("\nLOADING CALENDAR")
  return new Promise(async (resolve, reject) => {
    renderingCharts.value = true
    miniCalendarsData.length = 0

    const createCalendar = async (param1, param2) => {
      console.log(" -> Creating calendar for " + useMonthFormat(param1))
      //console.log("param 1 " + param1)

      /* https://github.com/lukeed/calendarize/
      * calendarize / calendarizeData is where you get the date number for a given month (so 31 days for May for example and if May starts on monday that given year then 1 or if starts on tuesday then 0, 1). the month must be in date format.It does not work with just convert in to traderTimezone. I need a date. And if the local computer is in another timezone it did not work. So i convert with format
      */
      //console.log("  --> Getting days and position of day for given month")
      //console.log("date "+dayJsDate)

      let dateForCalendarize = new Date(dayjs.unix(param1)).toLocaleString("en-US", { timeZone: traderTimeZone.value })

      //console.log(" date for calendarize "+dateForCalendarize)
      let calendarizeData = calendarize(dateForCalendarize, 1) // this creates.value calendar date numbers needed for a table calendar

      //console.log("  --> Getting trade and creating json for each day of given month")
      let calendarJson = {}
      //let month = dayjs.unix(param1).get('month') + 1 //starts at 0
      let month = dayjs(param1 * 1000).tz(traderTimeZone.value).get('month') + 1 //starts at 0 so here we add 1 to get the 'real' month number
      let year = dayjs(param1 * 1000).tz(traderTimeZone.value).get('year')
      //console.log("month "+month)
      //console.log("Yerar  "+year)
      for (let index1 = 0; index1 < calendarizeData.length; index1++) {
        let element = calendarizeData[index1]
        //console.log("element "+element)
        calendarJson[index1] = []
        for (let index = 0; index < element.length; index++) {
          const element2 = calendarizeData[index1][index];
          //console.log(" -> start")
          //console.log("element 2 "+element2)
          // 1- Create a calendar date from each element2 (calendar number)
          let elementDate = year + "/" + month + "/" + element2

          // 2- Create data for each calendar box
          let calData = {}
          calData.month = useMonthFormat(param1) // day number of the month
          calData.day = element2 // day number of the month

          //Getting trade that is from the same day
          let trade
          for (let i = 0; i < filteredTrades.length; i++) {
            let element = filteredTrades[i]

            if (Number(element.month) == Number(month) && Number(element.year) == Number(year) && Number(element.date) == Number(calData.day)) {
              trade = element
            }
          }
          //console.log("trade " + JSON.stringify(trade))

          if (trade != undefined && Object.keys(trade).length != 0 && element2 != 0) { //Check also if not null because day in date cannot be 0
            //console.log("pAndL "+JSON.stringify(trade.pAndL))
            calData.pAndL = trade.pAndL

            calData.satisfaction = trade.satisfaction
          } else {
            calData.pAndL = []
          }
          //console.log("calData " + JSON.stringify(calData))
          calendarJson[index1].push(calData)

        }

      }

      if (param1 == selectedMonth.value.start) {
        for (let key in calendarData) delete calendarData[key]
        Object.assign(calendarData, calendarJson)
        //console.log("calendarData " + JSON.stringify(calendarData))
      } else {
        miniCalendarsData.unshift(calendarJson)
      }


    }


    //let currentMonthNumber = dayjs(selectedMonth.value.start * 1000).month()
    //console.log("currentMonthNumber "+currentMonthNumber)

    //console.log(" creating from selected month "+selectedMonth.value.start)
    createCalendar(selectedMonth.value.start)

    //console.log(" -> Mini Cal data "+JSON.stringify(miniCalendarsData.value))

    //console.log("calendarData " + JSON.stringify(calendarData))
    //console.log("miniCalData " + JSON.stringify(miniCalendarsData))
    //console.log("resolve")
    resolve()
  })

}
