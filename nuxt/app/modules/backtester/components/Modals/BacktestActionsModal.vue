<script lang="ts" setup>
import { spinnerLoadingPage } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'

const { SelectedFolder, Folders, BacktestForm, createBacktest, updateBacktest, useDeleteBacktest, BacktestModalOpen } = useBacktester()

const BacktestData    = reactive({
    id: null,
    name: getRandomNameString(),
    folder: null
})

BacktestData.folder = computed(() => {
  return SelectedFolder.value.id
})

function NewBacktest() {
    BacktestData.name         = getRandomNameString()
    BacktestData.id           = null;
    BacktestModalOpen.value   = true;
}

function EditBacktest(_Object) {
    BacktestData.id           = _Object.id;
    BacktestData.name         = _Object.name;
    BacktestModalOpen.value   = true;
    BacktestData.folder       = _Object.group.name;
}

defineExpose({NewBacktest, EditBacktest})

</script>

<template>
  <UModal
    :ui="{ background: '!bg-transparent', overlay: { background: 'bg-backdrop' } }"
    v-model="BacktestModalOpen"
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
                  <template v-if="!BacktestData.id">
                      Create a new backtest
                  </template>
                  <template v-else>
                      Edit your backtest
                  </template>

              </h3>

              <!-- Modal Title Description -->
              <p class="text-xs opacity-50">
                  Your individual backtests belongs to folders. With each different backtest you can fine tune, test & optimise your strategies. 
              </p>
          </div>
          <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              :autofocus="false"
              @click.prevent="BacktestModalOpen = false"
          />
        </div>
      </template>

      <!-- Content -->
      <div class="flex items-start justify-start gap-x-2">

        <UForm ref="BacktestForm" :state="BacktestData" class="w-full flex flex-col gap-2 items-start justify-start gap-x-2">
          <UFormGroup class="w-full" name="name">
            <!-- Folder Name -->
            <UInput
                v-model="BacktestData.name"
                type="text"
                :placeholder="'Give it a good name, such as `' + getRandomNameString() + '`'"
                :autocomplete="false"
                
            />
          </UFormGroup>
          <UDivider label="In:" v-if="!BacktestData.id" />
          <UFormGroup class="w-full" name="folder" v-if="!BacktestData.id">
            <!-- Folder Name -->
            <USelectMenu class="!w-full" v-if="Folders.length != 0" :options="Folders" v-model="SelectedFolder" searchable option-attribute="name" :search-attributes="['name']">
                <template #option="{ option: folder }">
                    <UIcon name="solar:folder-2-bold-duotone" :style="{'color': folder.color}" class="w-4 h-4"/>
                    <span class="truncate text-ellipsis">{{ folder.name }}</span>
                </template>

                <template #leading>
                    <UIcon name="solar:folder-2-bold-duotone" class="w-5 h-5 shrink-0" v-if="!isObjectEmpty(SelectedFolder)" :style="{'color': SelectedFolder.color ?? 'white'}" />
                    <template v-else>
                        <span class="opacity-50">Select Folder</span>
                    </template>

                </template>
            </USelectMenu>
          </UFormGroup>
        </UForm>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
                <div class="flex items-center justify-start gap-x-2">
                    <UTooltip text="Delete action cannot be undone." v-if="BacktestData.id">
                        <UButton
                            color="rose"
                            variant="soft"
                            icon="tabler:trash-x"
                            :disabled="spinnerLoadingPage"
                            :loading="spinnerLoadingPage"
                            @click.prevent="useDeleteBacktest(BacktestData.id)"
                        />
                    </UTooltip>

                </div>
                <div class="flex items-center justify-end gap-x-2">
                    <UButton
                        color="white"
                        variant="ghost"
                        label="Cancel"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="BacktestModalOpen = false"
                        class="font-normal dark:text-white/50 dark:hover:text-white"
                    />
                    <UButton
                        color="white"
                        :label="!BacktestData.id ? 'Create' : 'Update'"
                        :loading="spinnerLoadingPage"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="!BacktestData.id ? createBacktest(BacktestData) : updateBacktest(BacktestData)"
                    />
                </div>
            </div>

      </template>

    </UCard>

  </UModal>
</template>
