// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/image'],

  compatibilityDate: '2024-07-03',
  rootDir: 'nuxt/',


  future: {
    compatibilityVersion: 4,
  },

  /**
   * Manually disable nuxt telemetry.
   * @see [Nuxt Telemetry](https://github.com/nuxt/telemetry) for more information.
   */
  telemetry: true,

  $development: {
    ssr: false,
    devtools: {
      enabled: false,
    },
  },

  $production: {
    ssr: false,
  },

  app: {
    head: {
      title: 'Dashboard',
      titleTemplate: '%s | ' + import.meta.env.APP_NAME,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  routeRules: {
    'auth/verify': { ssr: false }
  },

  tailwindcss: {
    cssPath: '@/assets/css/main.css',
  },

  /**
   * @see https://v3.nuxtjs.org/api/configuration/nuxt.config#modules
   */
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    'dayjs-nuxt',
    'nuxt-security',
  ],

  image: {
    domains: [
      import.meta.env.APP_URL || 'http://127.0.0.1:8000'
    ],
    alias: {
      api: import.meta.env.APP_URL || 'http://127.0.0.1:8000'
    }
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://*", import.meta.env.APP_URL || 'http://127.0.0.1:8000'],
      },
    },
  },

  dayjs: {
    locales: ['en'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'en',
    defaultTimezone: import.meta.env.APP_TIMEZONE,
  },

  typescript: {
    strict: false,
  },

  /**
   * @see https://v3.nuxtjs.org/guide/features/runtime-config#exposing-runtime-config
   */
  runtimeConfig: {
    apiLocal: import.meta.env.API_LOCAL_URL,
    public: {
      apiBase: import.meta.env.APP_URL,
      apiPrefix: '/api/v1',
      storageBase: import.meta.env.APP_URL + '/storage/',
      providers: {
        google: {
          name: "Google",
          icon: "",
          color: "gray",
        },
      },
    },
  },
})
