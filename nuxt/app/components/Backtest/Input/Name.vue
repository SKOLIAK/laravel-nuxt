<script lang="ts" setup>
import { IsDirty, DirtyTimer, useAutosave, SelectedBacktest, useUpdateBacktestName } from '@/utils/backtester'

const backtester = useBacktester()

function updateName () {
    IsDirty.value = true
    if (DirtyTimer.value) {
        clearTimeout(DirtyTimer.value)
    }

    SelectedBacktest.value.name = SelectedBacktest.value.name == '' ? getRandomNameString() : SelectedBacktest.value.name

    if(useAutosave.value == true) {
        DirtyTimer.value = setTimeout(async () => {
            await useUpdateBacktestName()
        }, 10000)
    }
}

</script>

<template>
    <input
        v-model="SelectedBacktest.name"
        @input="updateName"
        autocomplete="false"
        class="bg-transparent outline-none focus:outline-none !text-lg font-medium text-white"
    />
</template>
