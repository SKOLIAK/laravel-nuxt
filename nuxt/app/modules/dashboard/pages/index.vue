<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'

definePageMeta({
    middleware: ['auth']
})

const { GetProceedsFromTicks } = useTrade()

const { PasteObject } = useTradingviewPaste()

const Proceeds = computed(() => {
    if (!isObjectEmpty(PasteObject.value[0])) {
        return PasteObject.value[0].netProceeds
    } else {
        return ''
    }

    
})


</script>


<template>

    <div class="text-xs p-10">
        {{ PasteObject }}
    </div>

</template>