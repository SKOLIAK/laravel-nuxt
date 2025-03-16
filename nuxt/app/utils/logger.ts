import _tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
const { theme } = resolveConfig(_tailwindConfig);

export function logProccess(msg: string) {
  debug('\n✅ ' + msg.toUpperCase(), 'green', 500, 700)
}

export function logSubProccess(msg: string) {
  debug(' --> ' + msg.toWellFormed(), 'gray', 50)
}


export function log(...msg: any[]) {
  if (process.dev) {
    console.log(...msg)
  }
}

export function debug(msg: any, color: string = 'yellow', shade: number = 100, fontWeight: number = 400) {
  if (process.dev) {
    console.log('%c' + msg, 'color: ' + theme.colors[color][shade] + '; font-weight: ' + fontWeight.toString() + '; font-family: "Fira Code", -apple-system, BlinkMacSystemFont, sans-serif;');
  }
}