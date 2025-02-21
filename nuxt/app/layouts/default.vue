<script setup lang="js">
  import { dashboards, dashboardMode } from '@/utils/global'

  import { instruments, selectedInstrument, sessions, selectedSession } from '@/utils/nitro'

  import { useCharts } from "@/utils/charts";
  import { loaderText, loaderActive } from '@/utils/loader'

  import { Gradient } from '@/utils/gradient'

  import twConfig from "@/tailwind.config";
  import resolveConfig from "tailwindcss/resolveConfig";
  const { theme } = resolveConfig(twConfig)
  const appConfig = useAppConfig();


function closeNitro() {
  dashboardMode.value = dashboards[0]
}

// onMounted(() => {
//     var gradient = new Gradient()
//     gradient.initGradient('#gradient-canvas');
// })

  const route = useRoute();
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
      id: "backtester",
      label: "Backtester",
      icon: "unjs:unplugin",
      to: "/backtester",
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
  const defaultColors = ref(['green', 'teal', 'red', 'sky', 'blue', 'indigo', 'orange', 'yellow'].map(color => ({ label: color, chip: color, click: () => appConfig.ui.primary = color })))
  const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>

    <div class="absolute left-0 top-0 bottom-0 right-0 bg-gradient-to-tl from-gray-900 via-gray-900 to-gray-900/80 select-none">
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
            <UDashboardSidebarLinks
                :links="[{ label: 'Colors', draggable: true, children: colors }]"
                @update:links="colors => defaultColors = colors"
                v-if="dashboardMode.label == 'Dashboard'"
            />
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
    </div>

    <PageLoader />
</template>

