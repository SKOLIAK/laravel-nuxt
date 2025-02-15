<script lang="ts" setup>
import { useCreateFolder, useDeleteFolder, FolderModalOpen } from '@/utils/backtester'
import { spinnerLoadingPage, spinnerLoadingPageText } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'

const isModalOpen   = ref(false)
const ModalMode     = ref(0)

const FolderData    = reactive({
    id: null,
    name: getRandomNameString(),
    color: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
})

function SubmitModal() {
    if (!ModalMode) {
        useCreateFolder(FolderData)
    } else {
        // ...
    }
}

function NewFolder() {
    FolderData.name         = getRandomNameString()
    FolderData.color        = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    FolderModalOpen.value   = true;
    ModalMode.value         = 0;
    FolderData.id           = null;
}

function EditFolder(_Object) {
    FolderData.id           = _Object.id;
    FolderData.name         = _Object.name
    FolderData.color        = _Object.color;
    ModalMode.value         = 1;
    FolderModalOpen.value   = true;
}

defineExpose({NewFolder, EditFolder})

</script>

<template>
  <UModal
    :ui="{ background: '!bg-transparent', overlay: { background: 'bg-backdrop' } }"
    v-model="FolderModalOpen"
  >
    <UCard
      class="flex flex-1 flex-col"
      :ui="{
        background: 'bg-gradient-to-tr from-gray-800 to-gray-900/80',
        rounded: '!rounded-xl',
        body: { base: 'flex-1' },
        ring: 'ring-1 dark:ring-white/5 ring-inset',
        divide: 'divide-y divide-gray-100 dark:divide-gray-700/25',
      }"
    >
        <template #header>
            <div class="flex items-center justify-between drop-shadow">
            <div class="w-10/12">
                <h3 class="inlinetext-base tracking-wide leading-6 font-semibold text-gray-900 dark:text-white">
                    <template v-if="!ModalMode">
                        Create a new folder
                    </template>
                    <template v-else>
                        Edit your folder
                    </template>
                </h3>
                <p class="text-xs opacity-50">
                    Backtesting folders allow you to organise your individual backtests.
                    You can also further customise them with a colour of your choice
                </p>
            </div>
            <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                :autofocus="false"
                @click.prevent="FolderModalOpen = false"
            />
            </div>
        </template>


            <!-- Content -->
        <div class="flex items-center justify-center gap-x-2">

            <!-- Folder Name -->
            <UInput
                class="w-full"
                v-model="FolderData.name"
                :placeholder="'Give it a good name, such as `' + getRandomNameString() + '`'"
            />

            <!-- Folder Color -->
            <UPopover>
              <button :disabled="spinnerLoadingPage">
                <div class="color-select" id="color-select" :style="{ 'background-color': FolderData.color }">
                  <span class="drop-shadow">{{ FolderData.color }}</span>
                </div>
              </button>
              <template #panel>
                <!-- ~/components/ColorPicker.vue -->
                <ColorPicker v-model="FolderData.color" />
              </template>
            </UPopover>

        </div>



        <template #footer>
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start gap-x-2">
                    <UTooltip text="Delete action cannot be undone." v-if="FolderData.id">
                        <UButton
                            color="rose"
                            variant="soft"
                            icon="tabler:trash-x"
                            :disabled="spinnerLoadingPage"
                            :loading="spinnerLoadingPage"
                            @click.prevent="useDeleteFolder(FolderData.id)"
                        />
                    </UTooltip>

                </div>
                <div class="flex items-center justify-end gap-x-2">
                    <UButton
                        color="white"
                        variant="ghost"
                        label="Cancel"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="FolderModalOpen = false"
                        class="font-normal dark:text-white/50 dark:hover:text-white"
                    />
                    <UButton
                        color="white"
                        :label="!ModalMode ? 'Create' : 'Update'"
                        :loading="spinnerLoadingPage"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="useCreateFolder(FolderData)"
                    />
                </div>
            </div>
        </template>
    </UCard>
  </UModal>
</template>
