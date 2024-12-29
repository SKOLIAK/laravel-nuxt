<script setup lang="ts">
const links = [[{
  label: 'General',
  icon: 'akar-icons:person',
  to: '/settings',
  exact: true
}, {
  label: 'Devices',
  icon: 'akar-icons:mobile-device',
  to: '/settings/devices'
}, {
  label: 'Accounts',
  icon: 'akar-icons:people-multiple',
  to: '/settings/accounts'
}]]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Settings" class="bg-white" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto bg-white">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
