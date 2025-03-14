/** `Pluck` specific keys from an array */
export const pluck = (arr, keys) => arr && arr.map(i => keys.map(k => i[k])[0]);

/** Check if object is empty */
export function isObjectEmpty(_Object) {
  return !_Object || Object.keys(_Object).length === 0 && _Object.constructor === Object
}

export function useTwoDecFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(param);
}

export function useTwoDecPercentFormat(param) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, style: "percent" }).format(
    param
  );
}

export function useTwoDecCurrencyFormat(param, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: currency,
  }).format(param);
}

export function sleep(ms: number = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}