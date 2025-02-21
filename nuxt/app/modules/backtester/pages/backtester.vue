<script lang="ts" setup>
const { selectedView, SelectedBacktestComputed, SelectedBacktest, Folders, autosaveDuration, autosaveEnabled } = useBacktester()

</script>
<template>
<UDashboardPage>
    <UDashboardPanel grow class="h-[100vh]">

        <!-- Left Navbar-->
        <UDashboardNavbar class="bg-gray-800 border-b border-gray-900">
            <template #left>
                <!-- ~/components/PageTitle.vue -->
                <PageTitle />
            </template>

            <template #center>
                <!-- ~/components/input/TypeSelect.vue -->
                 <InputTypeSelect />
            </template>

            <template #right>
                <UPopover :ui="{background: '!bg-gray-800 border border-white/10'}">
                    <UButton
                        icon="tabler:dots-vertical"
                        size="sm"
                        color="white"
                        variant="ghost"
                    />
                    <template #panel>
                        <!-- ~/components/settings/General.vue -->
                        <SettingsGeneral />
                    </template>
                </UPopover>
            </template>
        </UDashboardNavbar>

        <UDashboardToolbar class="!border-b !border-gray-900">

            <div class="flex items-center gap-x-2">
                <Spinner v-if="!Folders.length"/>
                <InputFolder />
                <InputBacktest />
            </div>
        </UDashboardToolbar>

        <!-- Content -->
        <UDashboardPanelContent class="!p-0 !overflow-x-hidden">
            <template v-if="!isObjectEmpty(SelectedBacktest)">
                <TradeTable v-if="selectedView == 0"/>
                <TradeGraphs v-if="selectedView == 1"/>
            </template>

            <AppNoContent v-else />

        </UDashboardPanelContent>
    </UDashboardPanel>

    <UDashboardPanel
      :width="600"
      class="bg-gray-800 h-[calc(100vh-2em)] select-none"
      :ui="{
        border: 'border-l border-r-0 dark:!border-gray-900'
      }"
    >
        <UDashboardNavbar
            :ui="{
            wrapper: 'dark:!border-gray-900',
            title: 'text-lg font-medium text-black dark:text-white',
            }"
        >
        Sidebar
        </UDashboardNavbar>

        <DEVBlock>
            <template #code>
                {{ SelectedBacktestComputed.trades }}
            </template>
        </DEVBlock>
    </UDashboardPanel>
</UDashboardPage>
</template>
