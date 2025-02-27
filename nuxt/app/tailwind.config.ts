import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', '-apple-system', ...defaultTheme.fontFamily.sans],
        nunito: ['Nunito', ...defaultTheme.fontFamily.sans],
        kalam: ['Kalam', ...defaultTheme.fontFamily.sans]
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
