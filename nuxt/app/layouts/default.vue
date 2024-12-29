<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()
import { useCharts } from '../utils/charts';

const links = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'akar-icons:telescope',
  to: '/',
  tooltip: {
    shortcuts: ['⌘','D']
  }
}, {
  id: 'daily',
  label: 'Daily',
  icon: 'akar-icons:calendar',
  to: '/daily'
}, {
  id: 'trades',
  label: 'Trades',
  icon: 'akar-icons:data',
  to: '/trades'
}, {
  id: 'playbooks',
  label: 'Playbooks',
  icon: 'akar-icons:language',
  to: '/playbook/add' //@todo
}, {
  id: 'backtesting',
  label: 'Backtesting',
  icon: 'akar-icons:stack-overflow-fill',
  to: '/backtesting'
}]

const footerLinks = [{
  label: 'Help & Support',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}]


</script>

<template>
  <UDashboardLayout class="green-background">
    <UDashboardPanel
      class="sidebarpanel green-gradient"
      :width="288"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent p-6 pr-3 pb-4 !justify-between"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <AppLogo />
        </template>
        <template #right>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardNavbar>

      <!-- ~/components/app/sidebarlinks.vue -->
      <AppSidebarLinks :links="links"/>

      <div class="mx-4">
        <UDivider class="divider" />
      </div>

      <UDashboardSidebar>
        <template #header>
          <NavigationSearch />
        </template>






        <div class="flex-1" />
        <UDivider class="divider sticky bottom-0" />
        <UDashboardSidebarLinks :links="footerLinks"/>


        <template #footer>
          <!-- -->
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <div class="main-layout w-full m-4 ml-0 rounded-xl overflow-y-auto no-scrollbar relative bg-main">
      <slot />
    </div>

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>

  <PageLoader />
</template>


<!-- <style scoped>
.border-gradient {
  border-image-source: linear-gradient(to right, theme('colors.white/10'), theme('colors.white/0'));
}
</style> -->
