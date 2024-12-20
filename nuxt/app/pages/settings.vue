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
}]]
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Settings" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
