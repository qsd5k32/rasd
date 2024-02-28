import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Rasd',
    title: 'Rasd',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/droid.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    'plugins/toast.js',
    'plugins/axios.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    'cookie-universal-nuxt',
    '@nuxtjs/auth-next',
    ['nuxt-gmaps', {
      key: 'AIzaSyA-IQyk0w2hXbtn9y2vRwwxo4noZP5jRrA',
      //you can use libraries: ['places']
    }]
  ],
  i18n: {
    baseUrl: '/',
    parsePages: false,
    seo: false,
    defaultLocale: 'ar',
    locales: [
      {
        name: 'العربية',
        code: 'ar',
        iso: 'ar-ar',
        file: 'ar.js'
      },
      {
        name: 'English',
        code: 'en',
        iso: 'en-US',
        file: 'en.js'
      },
    ],
    lazy: true,
    langDir: 'lang/',
    vueI18n: {
      //fallbackLocale: 'en'
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    },
    onLanguageSwitched: (previous, current) => {
      if (process.client) {
        const DATE = new Date()
        DATE.setTime(DATE.getTime() + 365 * 24 * 3600 * 1000)
        document.cookie =
          'lang=' + current + '; path=/; expires=' + DATE.toUTCString()
      }
    }
  },


  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'https://rasd.pmisexpro.com/api',
    //baseURL: 'http://127.0.0.1:8000/api',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    rtl: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#00BFA6',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#00BFA6',
          secondary: '#474E68'
        }
      }
    }
  },
  auth: {
    redirect: {
      login: '/auth/login',
      home: '/'
    },
    watchLoggedIn: false,
    strategies: {
      local: {
        token: {
          property: 'token'
        },
        endpoints: {
          login: {
            url: 'https://rasd.pmisexpro.com/api/login',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: 'user',
            method: 'get',
            propertyName: 'user',
            autoFetch: true
          }
        }
      }

    },
    rewriteRedirects: false

  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

  },

}
