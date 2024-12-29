import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        nunito: ['Nunito']
      },
      colors: {
        green: {
          '50': '#ebfef5',
          '100': '#d0fbe5',
          '200': '#a4f6d0',
          '300': '#6aebb7',
          '400': '#2fd899',
          '500': '#0abf82',
          '600': '#009f6d',
          '700': '#007c58',
          '800': '#036247',
          '900': '#04503c',
          '950': '#012d23',
        },
      },
      keyframes: {
        starScale: {
          "from, to": {
            transform: "rotate(0) scale(0)",
            opacity: 0,
          },

          "50%": {
            transform: "rotate(180deg) scale(1)",
            opacity: 1,
          },
        },
      },
      animation: {
        starScale: "starScale 800ms ease infinite",
      },
    }
  }
}
