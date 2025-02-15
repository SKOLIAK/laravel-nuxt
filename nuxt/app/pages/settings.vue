<script setup lang="ts">
  definePageMeta({
    middleware: ["auth"],
  });
  const links = [
    [
      {
        label: "General",
        icon: "akar-icons:person",
        to: "/settings",
        exact: true,
      },
      {
        label: "Devices",
        icon: "akar-icons:mobile-device",
        to: "/settings/devices",
      },
      {
        label: "Accounts",
        icon: "akar-icons:people-multiple",
        to: "/settings/accounts",
      },
    ],
  ];
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :ui="{
          wrapper: 'dark:!border-gray-900 border-0',
          title: 'text-lg font-medium text-black dark:text-white',
        }"
        title="Settings"
      />

      <UDashboardToolbar class="overflow-x-auto !pb-0 !border-b !border-gray-900">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
