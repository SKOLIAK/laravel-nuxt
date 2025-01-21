import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import isoWeek from "dayjs/plugin/isoWeek.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import updateLocale from "dayjs/plugin/updateLocale.js";
import utc from "dayjs/plugin/utc.js";

export const GetErrorIcon = "octicon:x";
export const GetErrorColor = "orange";
export const GetSuccessIcon = "octicon:check";
export const GetSuccessColor = "primary";
export const GetInfoIcon = "octicon:light-bulb-16";
export const GetInfoColor = "gray";

dayjs.extend(utc);

dayjs.extend(isoWeek);

dayjs.extend(timezone);

dayjs.extend(duration);

dayjs.extend(updateLocale);

dayjs.extend(localizedFormat);

dayjs.extend(customParseFormat);

export const timeZones = ref([
  "America/New_York",
  "Asia/Shanghai",
  "Europe/Brussels",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Europe/London",
  "Asia/Riyadh",
]);
export const traderTimeZone = ref("");

export function useSetTimeZone(timezone) {
  traderTimeZone.value =
    timezone && timeZones.value.includes(timezone) ? timezone.trim() : timeZones.value[0];
  console.log(" -> TimeZone for Trades: " + traderTimeZone.value);
}

export const spinnerLoadingPage = ref(false);
export const spinnerLoadingPageText = ref("Loading ...");

export const backtestChartData = reactive([]);



/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DASHBOARDS (NITRO)
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const dashboards = [
  {
      label: "Dashboard",
      icon: "vscode-icons:file-type-bazel",
      click: () => {
        dashboardMode.value = dashboards[0];
      },
    },
    {
      label: "Nitro",
      icon: "skill-icons:robloxstudio",
      click: () => {
        dashboardMode.value = dashboards[1];
      },
    },

  ];

export const dashboardMode = ref(dashboards[0]);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CHARTS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const renderingCharts = ref(false);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CALENDAR
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const calendarData = reactive({});
export const miniCalendarsData = reactive([]);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * GENERAL
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const renderData = ref(0); //this is for updating DOM
export const hasData = ref(false);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * TRADES
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const selectedRange = ref();
export const filteredTrades = reactive([]);
export const filteredTradesDaily = reactive([]);
export const filteredTradesTrades = reactive([]);
export const totals = reactive({});
export const totalsByDate = reactive({});
export const groups = reactive({});
export const profitAnalysis = reactive({});
export const timeFrame = ref(15);
export const imports = ref([]);

export const TradeUnixes = ref([]);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DASHBOARD
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export const dashboardChartsMounted = ref();
export const dashboardIdMounted = ref(false);
export const barChartNegativeTagGroups = ref([]);

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DATE FORMATS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export function useDateNumberFormat(param) {
  return Number(Math.trunc(param)); //we have to use /1000 and not unix because or else does not take into account tz
}

export function useDateCalFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM-DD");
}

export function useDateCalFormatMonth(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM");
}

export function useTimeFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("HH:mm:ss");
}

export function useTimeFormatFromDate(param) {
  return dayjs(param).tz(traderTimeZone.value).format("HH:mm:ss");
}

export function useTimeDuration(param) {
  return dayjs.duration(param * 1000).format("HH:mm:ss");
}

export function useSwingDuration(param) {
  let duration = Number(dayjs.duration(param * 1000).format("D"));
  let period;
  duration > 1 ? (period = "days") : (period = "day");
  return duration + " " + period;
}

export function useHourMinuteFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("HH:mm");
}

export function formatDateCorrectly(date) {
  let a = date.split("/");
  return a[2] + "-" + a[0] + "-" + a[1];
}

export function dateToTzUnix(date) {
  return dayjs.tz(date, traderTimeZone.value).unix();
}

export function useDateTimeFormat(param, unix = true) {
  return unix
    ? dayjs.unix(param).tz(traderTimeZone.value).format("YYYY-MM-DD HH:mm:ss")
    : dayjs(param).tz(traderTimeZone.value).format("YYYY-MM-DD HH:mm:ss");
}

export function useChartFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("DD.MM.YYYY");
}

export function useMonthFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("MMMM YYYY");
}

export function useMonthFormatShort(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("MMM YY");
}

export function useCreatedDateFormat(param) {
  return dayjs.unix(param).tz(traderTimeZone.value).format("dddd, DD MMMM YYYY");
}

export function useDatetimeLocalFormat(param) {
  return dayjs.tz(param * 1000, traderTimeZone.value).format("YYYY-MM-DDTHH:mm:ss"); //here we ne
}

export function useStartOfDay(param) {
  return dayjs(param * 1000)
    .tz(traderTimeZone.value)
    .startOf("day")
    .unix();
}

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * NUMBER FORMATS
 * ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export function useThousandCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "USD",
  }).format(param);
}

export function useThousandFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(param);
}

export function useTwoDecCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  }).format(param);
}

export function useThreeDecCurrencyFormat(param) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
    style: "currency",
    currency: "USD",
  }).format(param);
}

export function useXDecCurrencyFormat(param, param2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: param2,
    style: "currency",
    currency: "USD",
  }).format(param);
}

export function useTwoDecFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(param);
}

export function useXDecFormat(param, param2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: param2 }).format(param);
}

export function useNoDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0, style: "percent" }).format(
    param
  );
}

export function useOneDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, style: "percent" }).format(
    param
  );
}

export function useTwoDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, style: "percent" }).format(
    param
  );
}

export function useFormatBytes(param, decimals = 2) {
  if (param === 0) return "0 bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["param", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(param) / Math.log(k));
  return parseFloat((param / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function useDecimalsArithmetic(param1, param2) {
  //https://flaviocopes.com/javascript-decimal-arithmetics/
  return (param1.toFixed(6) * 100 + param2.toFixed(6) * 100) / 100;
}

export const amountCaseTypes = ref(["net", "gross"]);
export const amountCase =
  typeof localStorage !== "undefined" ? ref(localStorage.getItem("selectedGrossNet")) : "";

if (!amountCase.value) {
  amountCase.value = amountCaseTypes.value[0];
}

watch(amountCase, function (a, b) {
  console.info("--> New filtering to " + a);
  localStorage.setItem("selectedGrossNet", a);
});

export const selectedRatioTypes = ref(["appt", "apps", "profitFactor"]);
export const selectedRatio =
  typeof localStorage !== "undefined" ? ref(localStorage.getItem("selectedRatio")) : ref("");

if (!selectedRatio.value) {
  selectedRatio.value = selectedRatioTypes.value[0];
}

watch(selectedRatio, function (a, b) {
  console.info("--> New filtering to " + a);
  localStorage.setItem("selectedRatio", a);
});
