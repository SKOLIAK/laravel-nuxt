<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
})
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

    <div>
      <BTradesTable />
    </div>

    
    
  </UDashboardContent>


  <!-- ~/components/Sidebar/Sidebar.vue -->
  <BSidebar />
</template>
