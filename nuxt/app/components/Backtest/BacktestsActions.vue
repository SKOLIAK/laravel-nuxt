<script lang="ts" setup>
import { useCreateBacktest, useDeleteBacktest, BacktestModalOpen, SelectedFolder, computeAPPDOWData } from '@/utils/backtester'
import { spinnerLoadingPage, spinnerLoadingPageText } from '@/utils/global'
import { getRandomNameString } from '@/utils/misc'

const ModalMode     = ref(0)

const BacktestData    = reactive({
    id: null,
    name: getRandomNameString(),
    group: {
        id: SelectedFolder.value.id ?? null,
        name: SelectedFolder.value.name ?? null,
        color: SelectedFolder.value.color ?? null
    }
})


function NewBacktest() {
    BacktestData.name       = getRandomNameString()
    BacktestModalOpen.value = true;
    ModalMode.value         = 0;
    BacktestData.id         = null;
    BacktestData.group      = {
        id: SelectedFolder.value.id ??  null,
        name: SelectedFolder.value.name ?? null,
        color: SelectedFolder.value.color ?? null
    }
}

function EditBacktest(_Object) {
    BacktestData.id         = _Object.id;
    BacktestData.name       = _Object.name
    ModalMode.value         = 1;
    BacktestModalOpen.value = true;
}

watch(SelectedFolder, () => {
    BacktestData.group      = {
        id: SelectedFolder.value.id ?? null,
        name: SelectedFolder.value.name ?? null,
        color: SelectedFolder.value.color ?? null
    }

    computeAPPDOWData(SelectedFolder.value.trades ?? [])
})


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
                        Create a new backtest
                    </template>
                    <template v-else>
                        Edit your backtest
                    </template>
                </h3>
                <p class="text-xs opacity-50">
                    Individual backtests allows you to test your strategies.
                    You can explicity specify in which folder your new backtest will be put into
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
        <div class="flex items-center justify-center gap-x-2">

            <!-- Folder Name -->
            <UInput
                class="w-full"
                v-model="BacktestData.name"
                :placeholder="'Give it a good name, such as `' + getRandomNameString() + '`'"
            />

            <USelectMenu class="w-44" v-if="BacktesterFolders.length" :options="BacktesterFolders" v-model="SelectedFolder" searchable option-attribute="name" :search-attributes="['name']">
                <template #option="{ option: folder }">
                    <UIcon name="solar:folder-2-bold-duotone" :style="{'color': folder.color}" class="w-4 h-4"/>
                    <span class="truncate text-ellipsis">{{ folder.name }}</span>
                </template>
                <template #leading>
                    <UIcon name="solar:folder-2-bold-duotone" class="w-5 h-5" :style="{'color': SelectedFolder.color}" />
                </template>
            </USelectMenu>



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
                        :label="!ModalMode ? 'Create' : 'Update'"
                        :loading="spinnerLoadingPage"
                        :disabled="spinnerLoadingPage"
                        @click.prevent="useCreateBacktest(BacktestData)"
                    />
                </div>
            </div>
        </template>
    </UCard>
  </UModal>
</template>
