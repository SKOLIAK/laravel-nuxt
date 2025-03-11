<script setup lang="ts">
import { UDashboardSidebarLinks } from '#components'

const route = useRoute()
const toast = useToast()


const links = [[    
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "unjs:giget",
    to: "/"
  },
  // {
  //   id: "summary",
  //   label: "Summary",
  //   icon: "unjs:defu",
  //   to: "/1",
  // },
  {
    id: "tradingPlan",
    label: "Trading Plan",
    //icon: "unjs:destr",
    icon: "fxemoji:notebook",
    to: "/trading-plan",
    disabled: false
  },
  // {
  //   id: "playbooks",
  //   label: "Playbooks",
  //   icon: "unjs:knitwork",
  //   to: "/1",
  // },
  {
    id: "backtester",
    label: "Backtester",
    icon: "unjs:unplugin",
    to: "/backtester",
  }]

]



onMounted(async () => {
  const cookie = useCookie('cookie-consent')

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 200,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'gray',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'gray',
      variant: 'ghost'
    }]
  })
})
const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-pro/dashboard/blob/v3/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])

</script>

<template>
  <UDashboardLayout >
    <UDashboardSearch :groups="groups" />

    <UDashboardPanel class="!border-0" :width="233" collapsible>

      <UDashboardNavbar
          class="!justify-between mt-3 !border-transparent p-6 pb-4 pr-3"
          :ui="{ left: 'flex-1' }"
      >
          <template #left>
            <Logo />
          </template>
          <template #right>
            <UserDropdown />
          </template>
      </UDashboardNavbar>

      <UDashboardSidebarLinks :links="links[0]" />


      <UCallout color="orange" icon="heroicons:exclamation-triangle" class="mx-3 text-xs">
        Welcome to the BETA. You may encounter bugs or things not working as they're indended to. Please be patient with us as this app is still work in progress. 
      </UCallout>




    </UDashboardPanel>

    <UDashboardPage>
      <slot />
    </UDashboardPage>
   

  </UDashboardLayout>
</template>