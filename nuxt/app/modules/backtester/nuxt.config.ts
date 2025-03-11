import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
    components: [
        { path: '#backtester/components', prefix: 'B', pathPrefix: false }
    ],
    css: [
        '#backtester/assets/css/backtester.css'
    ],
    alias: { '#backtester': resolve('./') }
})
