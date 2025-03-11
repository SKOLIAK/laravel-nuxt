import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
    modules: ["@nuxt/ui"],
    components: [
        { path: '#core-ui/components', prefix: 'U', pathPrefix: false }
    ],
    css: [
        '#core-ui/assets/css/ui.css',
        '@cyhnkckali/vue3-color-picker/dist/style.css'
    ],
    alias: { '#core-ui': resolve('./') },
    vite: {
        optimizeDeps: {
            include: ['vue3-smooth-dnd']
        }
    }
})
