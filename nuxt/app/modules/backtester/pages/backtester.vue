<script setup lang="ts">
import { BFolderActionsModal } from '#components';
</script>

<template>
  <!-- MAIN CONTENT -->
  <UDashboardContent>
    <UDashboardNavbar>
      <template #left>
        <BPageTitle />
      </template>
      <template #center>
        <BViewSwitch />
      </template>
      <template #right>
        <BGeneralSettings />

      </template>
    </UDashboardNavbar>
  </UDashboardContent>


  <!-- ~/components/Sidebar/Sidebar.vue -->
  <BSidebar />
</template>
