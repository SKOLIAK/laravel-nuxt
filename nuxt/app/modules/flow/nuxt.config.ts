import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
    components: [
        { path: '#flow/components', prefix: 'F', pathPrefix: false }
    ],
    css: [
        '#flow/assets/css/flow.css'
    ],
    alias: { '#flow': resolve('./') }
})
