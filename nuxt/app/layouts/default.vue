<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()
import { useCharts } from '../utils/charts';

const links = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'akar-icons:augmented-reality',
  to: '/',
  tooltip: {
    text: 'Dashboard',
    shortcuts: ['Shift', 'D']
  }
}, {
  id: 'daily',
  label: 'Daily',
  icon: 'akar-icons:sun',
  to: '/daily'
}, {
  id: 'trades',
  label: 'Trades',
  icon: 'akar-icons:align-bottom',
  to: '/trades',
  tooltip: {
    text: 'Users',
    shortcuts: ['G', 'U']
  }
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
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
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

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <div class="flex-1" />

        <UDivider class="sticky bottom-0" />
        <UDashboardSidebarLinks :links="footerLinks" />


        <template #footer>
          <!-- -->
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>

  <PageLoader />
</template>
