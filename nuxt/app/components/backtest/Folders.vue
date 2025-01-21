<script lang="ts" setup>
  import {
    BacktestingGroups,
    isLoading,
    isModalOpen,
    useCreateGroup,
    useDeleteGroup,
    useGetGroups,
  } from "@/utils/backtests";

  /** Changes title depending if creating or editing */
  const modalMode = ref(0);

  const defColor = ref("#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"));

  const data = reactive({
    name: "",
    color: defColor,
    id: null,
  });

  function editGroup(name, color, id) {
    data.name = name;
    data.color = color;
    data.id = id;
    modalMode.value = 1;
    isModalOpen.value = true;
  }

  function newGroup() {
    data.name = "";
    // Generate new color each time
    data.color = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    isModalOpen.value = true;
    modalMode.value = 0;
    data.id = null;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  onBeforeMount(async () => {
    await useGetGroups();
  });
</script>

<template>
  <div class="base-card mb-10 overflow-hidden bg-white/60 dark:bg-gray-900 !p-0">
    <div class="flex items-center bg-white dark:bg-gray-900 px-6 py-4 ring-1 ring-gray-900/5 dark:ring-gray-700/50">
      <div class="mr-2">
        <span
          class="opener-button primary inline-flex items-center justify-center rounded-lg !border-0 bg-gray-100 p-2 text-gray-700 dark:text-white shadow !ring-0"
        >
          <UIcon name="akar-icons:stack-overflow-fill" size="1.5em" />
        </span>
      </div>
      <div>
        <h3 class="text-base font-medium !font-sans leading-snug tracking-tighter text-slate-900 dark:text-white">
          Backtesting Folders
        </h3>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Create, Delete or Edit your backtesting folders
        </span>
      </div>
    </div>
    <div class="relative flex items-center gap-x-2 overflow-x-auto p-4">
      <GeneralAddCard class="min-h-32 min-w-32" @click="newGroup()">New Folder</GeneralAddCard>

      <GeneralEntryCard
        :color="group.color"
        @click="editGroup(group.name, group.color, group.id)"
        v-for="group in BacktestingGroups"
      >
        {{ group.name }}
      </GeneralEntryCard>

      <div
        class="absolute bottom-0 left-0 right-0 top-0 bg-white/10 backdrop-blur-sm"
        v-if="isLoading"
      >
        <div
          role="status"
          class="bg- absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"
        >
          <svg
            aria-hidden="true"
            class="h-8 w-8 animate-spin fill-gray-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <UModal
    :ui="{ overlay: { background: 'backdrop-blur-sm bg-teal-950/25 dark:bg-teal-950/25' } }"
    v-model="isModalOpen"
  >
    <UCard
      class="flex flex-1 flex-col"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            v-if="modalMode == 0"
          >
            Create New Backtest Folder
          </h3>
          <h3 class="inlinetext-base font-semibold leading-6 text-gray-900 dark:text-white" v-else>
            Update Backtest Folder
          </h3>
          <UIcon name="svg-spinners:90-ring-with-bg" v-if="isLoading" />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            v-else
            @click="isModalOpen = false"
          />
        </div>
      </template>

      <div class="flex flex-row items-start justify-start">
        <div class="mr-4 w-full">
          <UFormGroup label="Backtesting Folder Name" name="name" required>
            <UInput v-model="data.name" type="text" autocomplete="off" :disabled="isLoading" />
          </UFormGroup>
        </div>

        <div>
          <UFormGroup label="Color" name="color">
            <UPopover>
              <button :disabled="isLoading">
                <div class="color-select" id="color-select" :style="{ 'background-color': data.color }">
                  <span class="drop-shadow">{{ data.color }}</span>
                </div>
              </button>
              <template #panel>
                <!-- ~/components/ColorPicker.vue -->
                <ColorPicker v-model="data.color" />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
      </div>

      <template #footer>
        <div class="!text-right">
          <UButton
            color="red"
            :ui="{ base: 'base-button p-6 btn mr-2' }"
            @click.prevent="useDeleteGroup(data.id)"
            v-if="modalMode == 1"
            :disabled="isLoading"
          >
            Delete
          </UButton>
          <UButton
            color="gray"
            :ui="{ base: 'base-button p-4 btn mr-2' }"
            @click="isModalOpen = false"
            >Cancel</UButton
          >
          <UButton
            :ui="{ base: 'base-button btn' }"
            @click.prevent="useCreateGroup(data)"
            :disabled="isLoading"
            >Save</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
