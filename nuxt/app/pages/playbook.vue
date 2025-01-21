<script setup lang="ts">
  import type { Playbook } from "~/types";

  //const { data: mails } = await useFetch<Mail[]>("/api/mails", { default: () => [] });

  const playbooks = ref([
  {
      id: '48788a4b-a49a-49f5-a354-7a323d3e4dc3',
      title: 'ADR 1st Hour Confirmation',
      body: 'lorem ipsum',
      created_at: new Date()
    },
    {
      id: 'ec3370d9-ff16-4643-b566-8301aea51fbb',
      title: 'RDR Broken Model',
      created_at: new Date()
    },
    {
      id: '0ba4af7d-3af3-4703-bae4-7b603fce71b3',
      title: 'Retirement Setup',
      created_at: new Date()
    },
    {
      id: '0ba4af7d-3af3-4703-bae4-312312',
      title: 'ADR Setup',
      created_at: new Date()
    },
    {
      id: '0ba4af7d-3af3-4703-bae4-123112',
      title: 'ODR Setup',
      created_at: new Date()
    },
    {
      id: '0ba4af7d-3af3-4703-bae4-7b603fce711231b3',
      title: 'RDR Setup',
      created_at: new Date()
    },
    {
      id: '0ba4af7d-3af3-4703-bae4-7b603fce71b3231',
      title: 'Models Setup',
      created_at: new Date()
    }
  ])


  // Filter mails based on the selected tab
  const filteredPlaybooks = computed(() => {
    return playbooks.value;
  });

  const selectedPlaybook = ref<Playbook | null>();

  const isMailPanelOpen = computed({
    get() {
      return !!selectedPlaybook.value;
    },
    set(value: boolean) {
      if (!value) {
        selectedPlaybook.value = null;
      }
    },
  });

  // Reset selected mail if it's not in the filtered mails
  watch(filteredPlaybooks, () => {
    if (!filteredPlaybooks.value.find((playbook) => playbook.id === selectedPlaybook.value?.id)) {
      selectedPlaybook.value = null;
    }
  });
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
      <UDashboardNavbar title="Playbooks" :badge="playbooks.length" class="bg-white dark:bg-gray-800 border-b dark:border-gray-900" />

      <!-- ~/components/Playbooks/List.vue -->
      <PlaybooksList v-model="selectedPlaybook" :playbooks="playbooks" />

    </UDashboardPanel>



    <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">

        <UDashboardNavbar class="bg-white dark:bg-gray-800 border-b dark:border-gray-900">
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

            <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
          </template>

          <template #left>
            <template v-if="selectedPlaybook">
              <h1 class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0 mr-2">
                <span class="truncate">{{ selectedPlaybook.title }}</span>
              </h1>
            </template>
          </template>

          <template #right>
              <template v-if="selectedPlaybook">
                <UTooltip text="Edit">
                  <UButton icon="tabler:pencil" color="gray" variant="ghost" />
                </UTooltip>

                <UTooltip text="Delete">
                  <UButton icon="tabler:copy-x-filled" color="rose" variant="ghost" />
                </UTooltip>

                <UDivider orientation="vertical" class="mx-1.5" />
              </template>

            <UButton icon="i-heroicons-plus" label="New" class="ml-2"/>
          </template>
        </UDashboardNavbar>

        <!-- ~/components/inbox/InboxMail.vue -->
        <PlaybooksView v-if="selectedPlaybook" :playbook="selectedPlaybook" />


      <div v-if="!selectedPlaybook" class="hidden flex-1 items-center justify-center lg:flex">
        <AppNoContent />
      </div>


    </UDashboardPanel>
  </UDashboardPage>
</template>
