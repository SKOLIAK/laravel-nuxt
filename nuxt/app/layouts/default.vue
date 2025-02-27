<script setup lang="ts">
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
  //   to: "/summary",
  // },
  // {
  //   id: "trades",
  //   label: "Trades",
  //   icon: "unjs:destr",
  //   to: "/trades",
  // },
  // {
  //   id: "playbooks",
  //   label: "Playbooks",
  //   icon: "unjs:knitwork",
  //   to: "/playbook",
  // },
  {
    id: "backtester",
    label: "Backtester",
    icon: "unjs:unplugin",
    to: "/backtester",
  }], 

[{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-pro/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui-pro',
  target: '_blank'
}]]

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

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
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


      <SidebarLinks :links="links[0]" />
      <UDashboardSidebarLinks :links="links[1]" />


      <USelectMenu></USelectMenu>

    </UDashboardPanel>

    <div class="bg-white dark:bg-gray-800 no-scrollbar relative m-4 ml-0 w-full overflow-y-auto rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-white/5">
      <slot />
    </div>
   

  </UDashboardLayout>
</template>