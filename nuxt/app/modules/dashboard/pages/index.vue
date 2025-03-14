<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'

definePageMeta({
    middleware: ['auth'],
})

const { GetProceedsFromTicks } = useTrade()

const { PasteObject, ClipboardObject } = useTradingviewPaste()

const Proceeds = computed(() => {
    if (!isObjectEmpty(PasteObject.value[0])) {
        return PasteObject.value[0].netProceeds
    } else {
        return ''
    }


})


const itemssss = ref([
    [
        { id: 1, data: "Upside Model" },
        { id: 2, data: "Downside Model" },
        { id: 3, data: "Range Contraction" }
    ], [
        { id: 4, data: "DR Confirmation" },
    ]
])

const items = ref([])
const newItems = ref([])
onBeforeMount(async () => {
    await useFetch("tags/groups", {
        async onResponse({ response }) {
            if (response.ok) {
                items.value = response._data.data
            }
        }
    })
})
</script>


<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-3xl">Home page</h1>

        <div class="flex items-center justify-start gap-x-2">
            <span>Paste a trade from</span>
            <UTooltip text="TradingView" :popper="{ placement: 'right' }">
                <UTradingView class="transfrom hover:scale-105 transition-transform duration-500" />
            </UTooltip>
        </div>
        <p>The following sum will update:</p>
        <UBadge :color="Proceeds > 0 ? 'emerald' : 'rose'" variant="soft">{{ useTwoDecCurrencyFormat(Proceeds) }}
        </UBadge>
        <div>
            <small>{{ ClipboardObject }}</small>
        </div>

        <UInfiniteProgress />

    </div>




</template>