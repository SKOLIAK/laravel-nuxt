<script lang="ts" setup>
import { spinnerLoadingPage } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'

const { FolderForm, createFolder, updateFolder, useDeleteFolder, FolderModalOpen } = useBacktester()

const FolderData    = reactive({
    id: null,
    name: getRandomNameString(),
    color: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
})


function NewFolder() {
    FolderData.name         = getRandomNameString()
    FolderData.color        = "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    FolderData.id           = null;
    FolderModalOpen.value   = true;
}

function EditFolder(_Object) {
    FolderData.id           = _Object.id;
    FolderData.name         = _Object.name
    FolderData.color        = _Object.color;
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
          background: 'bg-gradient-to-tr from-white to-gray-100/80 dark:from-gray-800 dark:to-gray-900/80',
          rounded: '!rounded-xl',
          body: { base: 'flex-1' },
          ring: 'ring-1 ring-black/5 dark:ring-white/5 ring-inset',
          divide: 'divide-y divide-gray-200/60 dark:divide-gray-700/25',
        }"
      >
      <template #header>
        <div class="flex items-center justify-between drop-shadow">
          <div class="w-10/12">
              <h3 class="inlinetext-base tracking-wide leading-6 font-semibold text-gray-900 dark:text-white">

                  <!-- Modal Title -->
                  <template v-if="!FolderData.id">
                      Create a new folder
                  </template>
                  <template v-else>
                      Edit your folder
                  </template>

              </h3>

              <!-- Modal Title Description -->
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
      <div class="flex items-start justify-start gap-x-2">

        <UForm ref="FolderForm" :state="FolderData" class="w-full flex items-start justify-start gap-x-2">
          <UFormGroup class="w-full" name="name">
            <!-- Folder Name -->
            <UInput
                v-model="FolderData.name"
                type="text"
                :placeholder="'Give it a good name, such as `' + getRandomNameString() + '`'"
                :autocomplete="false"
                
            />
          </UFormGroup>


          <!-- Folder Color -->
          <UPopover>
            <button :disabled="spinnerLoadingPage">
              <div class="color-select" id="color-select" :style="{ 'background-color': FolderData.color }">
                <span class="drop-shadow">{{ FolderData.color }}</span>
              </div>
            </button>
            <template #panel>
              <UColorPicker v-model="FolderData.color" />
            </template>
          </UPopover>
        </UForm>
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
                        :label="!FolderData.id ? 'Create' : 'Update'"
                        :loading="spinnerLoadingPage"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="!FolderData.id ? createFolder(FolderData) : updateFolder(FolderData)"
                    />
                </div>
            </div>

      </template>

    </UCard>

  </UModal>
</template>
