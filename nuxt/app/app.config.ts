export default defineAppConfig({
  ui: {
    primary: 'emerald',
    gray: 'cool',
    tooltip: {
      default: {
        openDelay: 500
      }
    },
    avatar: {
      default: {
        icon: 'akar-icons:person',
      }
    },
    button: {
      base: 'base-button',
      color: {
        primary: {
          solid: 'button-primary'
        },
        gray: {
          solid: 'button-secondary'
        }
      }
    },
    input: {
      padding: {
        md: 'px-3.5 py-2.5'
      }
    }
  }
})
