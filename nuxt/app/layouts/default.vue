<script setup lang="js">
  import { dashboards, dashboardMode } from '@/utils/global'

  import { instruments, selectedInstrument, sessions, selectedSession } from '@/utils/nitro'


  import { useCharts } from "@/utils/charts";
  import { loaderText, loaderActive } from '@/utils/loader'

  import { Gradient } from '@/utils/gradient'


function closeNitro() {
  dashboardMode.value = dashboards[0]
}


  const route = useRoute();
  const appConfig = useAppConfig();
  const { isHelpSlideoverOpen } = useDashboard();


  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "unjs:giget",
      to: "/"
    },
    {
      id: "summary",
      label: "Summary",
      icon: "unjs:defu",
      to: "/summary",
    },
    {
      id: "trades",
      label: "Trades",
      icon: "unjs:destr",
      to: "/trades",
    },
    {
      id: "playbooks",
      label: "Playbooks",
      icon: "unjs:knitwork",
      to: "/playbook",
    },
    {
      id: "backtesting",
      label: "Backtesting",
      icon: "unjs:unplugin",
      to: "/backtesting",
    }
  ]

  const footerLinks = [
    {
      label: "Help & Support",
      icon: "i-heroicons-question-mark-circle",
      click: () => (isHelpSlideoverOpen.value = true),
    },
  ];

  const groups = [
    {
      key: "links",
      label: "Go to",
      commands: links.map((link) => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
    },
  ];

</script>

<template>

  <UDashboardLayout class="">
    <UDashboardPanel class="!border-0" :width="233" collapsible>
      <UDashboardNavbar
        class="!justify-between mt-3 !border-transparent p-6 pb-4 pr-3"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <AppLogo />
        </template>
        <template #right>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown v-if="dashboardMode.label == 'Dashboard'"/>
          <UTooltip text="Exit Nitro View" v-else>
            <UButton color="gray" variant="ghost" icon="akar-icons:x-small" @click="closeNitro" />
          </UTooltip>
        </template>
      </UDashboardNavbar>

      <!-- ~/components/app/sidebarlinks.vue -->
      <AppSidebarLinks :links="links" v-if="dashboardMode.label == 'Dashboard'"/>

      <!-- Nitro Sidebar -->
      <div class="mx-4 mt-4" v-if="dashboardMode.label == 'Nitro'">
        <UFormGroup label="Select Instrument" size="xs">
          <USelectMenu :options="instruments" v-model="selectedInstrument" size="md" searchable />
        </UFormGroup>

        <UFormGroup label="Select Session" size="xs" class="mt-4">
          <URadioGroup v-model="selectedSession" :options="sessions" size="xs" />
        </UFormGroup>

        <!-- <UCheckbox label="Remove News Days" class="mt-4"/> -->
      </div>



      <div class="mx-4">
        <UDivider class="divider" />
      </div>

      <UDashboardSidebar>
        <template #header>
          <NavigationSearch v-if="dashboardMode.label == 'Dashboard'"/>
        </template>

        <div class="flex-1" />
        <UDivider class="divider sticky bottom-0" />

        <!-- ~/components/ModeDropdown.vue -->
        <ModeDropdown />


        <template #footer>
          <!-- -->
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <div class="bg-main no-scrollbar relative m-4 ml-0 w-full overflow-y-auto rounded-xl ring-1 ring-gray-600/40" v-if="dashboardMode.label != 'Nitro'">
      <slot />
    </div>

    <!-- Nitro Page Content -->
    <div class="bg-main no-scrollbar relative m-4 ml-0 w-full overflow-y-auto rounded-xl ring-1 ring-gray-600/40" v-else>
      <NitroPage />
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
