// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    // Nuxt UI Pro
    // "@nuxt/ui-pro",

    // Layers
    "nuxt/app/modules/ui",
    "nuxt/app/modules/auth",
    "nuxt/app/modules/flow",
    "nuxt/app/modules/tradingview",
    "nuxt/app/modules/dashboard",
    "nuxt/app/modules/backtester",
  ],

  ssr: false,

  css: [
    "~/assets/css/main.css",
    "~/assets/css/gradient.css"
  ],

  modules: ["@pinia/nuxt", "@nuxtjs/color-mode", "@nuxtjs/device"],


  devtools: { enabled: true },
  compatibilityDate: "2025-02-26",
  future: { compatibilityVersion: 4 },
  rootDir: "nuxt/",

  pinia: {
    storesDirs: [
      'app/stores/**',
      'app/modules/**/stores/**'
    ]
  },

  fonts: {
    provider: "google",
    families: [
      {
        name: "Nunito",
        provider: "local",
        src: "~/public/nunito.woff2",
        weight: ["400", "500", "600", "700"],
      },
    ],
  },

  /**
   * Manually disable nuxt telemetry.
   * @see [Nuxt Telemetry](https://github.com/nuxt/telemetry) for more information.
   */
  telemetry: true,

  app: {
    head: {
      title: "Dashboard",
      titleTemplate: "%s | " + import.meta.env.APP_NAME,
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "script", href: "https://code.jquery.com/jquery-latest.min.js" },
      ],
    },
  },

  routeRules: {
    "auth/verify": { ssr: false },
  },

  image: {
    domains: [import.meta.env.APP_URL || "http://127.0.0.1:8000"],
    alias: {
      api: import.meta.env.APP_URL || "http://127.0.0.1:8000",
    },
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      crossOriginOpenerPolicy: "same-origin-allow-popups",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "https://*",
          import.meta.env.APP_URL || "http://127.0.0.1:8000",
        ],
      },
    },
  },

  dayjs: {
    locales: ["en"],
    plugins: ["relativeTime", "utc", "timezone"],
    defaultLocale: "en",
    defaultTimezone: import.meta.env.APP_TIMEZONE,
  },

  ui: {
    global: true,
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
      apiPrefix: "/api/v2",
      storageBase: import.meta.env.APP_URL + "/storage/",
      providers: {
        google: {
          name: "Google",
          icon: "logos:google-icon",
          color: "gray",
        },
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: {
    preference: "dark",
    classSuffix: "",
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
});