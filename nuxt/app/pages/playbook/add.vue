<template>
    <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Playbooks" class="sticky top-0 bg-white">
        <template #right>
          <UButton
            icon="i-heroicons-plus"
            label="Add"
            size="sm"
            class="ml-1.5"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardPanelContent class="overflow-x-hidden overflow-y-auto">

  <div class="flex-wrap items-center justify-center mb-6 ">


  <AppNoContent />
<!--

      <UCard class="base-card card-bg-glow w-full mx-auto max-w-6xl">
      <h1 class="text-2xl font-medium">Playbook title</h1>
      </UCard>


      <div class="base-card !p-0 overflow-hidden mb-10 max-w-6xl">
          <div class="flex items-center bg-white px-6 py-4 ring-1 ring-slate-900/5">
          <div class="mr-2">
            <span class="inline-flex items-center justify-center p-2 opener-button primary green rounded-lg !ring-0 !border-0 shadow text-white">
              <UIcon name="akar-icons:door" size="1.5em"/>
            </span>
          </div>
          <div>
            <h3 class="text-slate-900 dark:text-white text-base font-medium tracking-tight">Entry Models</h3>
            <span class="text-slate-500 dark:text-slate-400 text-sm">
              The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
            </span>
          </div>
        </div>
        <div class="p-4 flex items-center justify-between">
          <GeneralAddCard @clicked="addClicked" class="min-w-32 min-h-32">Entry Model</GeneralAddCard>
        </div>
      </div>







  <div class="base-card !p-0 mt-10">
    <div class="py-3.5 px-5 border-b border-border-normal" style="height: 72px;">
      <div class="flex">
        <div class="shadow ring-1 ring-gray-100 mr-3 p-2.5 rounded-full flex items-center justify-center" style="width: 38px; height: 38px;">
          <img src="https://app.foreplay.co/img/brand-profile.a8d75043.svg">
        </div>
      <div>
        <div>
          <div class="text-sm font-medium">
            <span class="text-gray-700">Entry Models</span>
          </div>
          <div class="text-xs font-normal">
            <span class="text-gray-500/85">Add or select entry models for this playbook</span>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div class="p-4 flex items-center justify-between">
      <GeneralAddCard @clicked="addClicked">Create Entry Model</GeneralAddCard>

    </div>
  </div>-->


</div>


</UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script lang="ts" setup>
function addClicked() {
  alert('clicked')
}

</script>
