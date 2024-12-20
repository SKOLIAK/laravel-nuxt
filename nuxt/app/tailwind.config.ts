import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        extend: {
        fontFamily: {
            sans: ['DM Sans', ...defaultTheme.fontFamily.sans]
        },
        colors: {
            'bright-green': {
                    '50': '#f5ffe4',
                    '100': '#e8ffc5',
                    '200': '#d1ff92',
                    '300': '#b1ff53',
                    '400': '#91fb20',
                    '500': '#70e000',
                    '600': '#55b500',
                    '700': '#418902',
                    '800': '#366c08',
                    '900': '#2f5b0c',
                    '950': '#153300',
                },
        }
        }
    }
}
