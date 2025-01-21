export default defineAppConfig({
  ui: {
    primary: "teal",
    gray: "zinc",
    tooltip: {
      default: {
        openDelay: 500,
      },
    },
    avatar: {
      default: {
        icon: "akar-icons:person",
      },
    },
    button: {
      base: "button text-center",
      color: {
        primary: {
          solid: "primary-button",
        },
        gray: {
          solid: "secondary-button",
        },
        red: {
          solid: "danger-button",
        },
      },
    },
    input: {
      padding: {
        md: "px-3.5 py-2.5",
      },
    },
    divider: {
      border: {
        base: 'flex dark:!border-gray-900'
      }
    }
  },
});
