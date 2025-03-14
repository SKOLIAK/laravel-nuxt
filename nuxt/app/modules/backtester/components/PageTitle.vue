<script lang="ts" setup>
const { SelectedBacktest, SelectedBacktestComputed, IsDirty, DirtyTimer, autosaveDuration, autosaveEnabled, updateBacktest, SelectedFolder } = useBacktester()

import type { PropType } from 'vue'
import type { title as titleConfig } from '#backtester/ui.config'
import type { DeepPartial, BadgeColor } from '#ui/types'

function updateName () {

    IsDirty.value = true
    if (DirtyTimer.value) {
        clearTimeout(DirtyTimer.value)
    }


    if(autosaveEnabled.value == true) {
        DirtyTimer.value = setTimeout(async () => {
            await updateBacktest({
                id: SelectedBacktest.value.id,
                folder: SelectedFolder.value.id,
                name: SelectedBacktest.value.name == '' ? getRandomNameString() : SelectedBacktest.value.name
            })
        }, autosaveDuration.value)
    }
}

const config = computed(() => ({
    container: 'text-lg font-medium text-foreground',
    wrapper: 'flex items-center gap-x-2',
    base: 'group flex items-center justify-start gap-x-2',
    input: {
        base: 'bg-transparent outline-none focus:outline-none text-foreground',
        hover: 'group-hover:opacity-80 focus:!opacity-100'
    },
    icon: {
        base: '',
        hover: 'group-hover:opacity-80'
    }
}))

defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    icon: {
        type: String,
        default: 'lucide:pen-line'
    },
    badgeColor: {
        type: String as PropType<BadgeColor>,
        default: 'primary'
    },
    class: {
        type: [String, Object, Array] as PropType<any>,
        default: undefined
    },
    ui: {
        type: Object as PropType<DeepPartial<typeof config.value & typeof titleConfig>>,
        default: () => ({})
    }
})

const { ui, attrs } = useUI('backtester.title', toRef(props, 'ui'), config, toRef(props, 'class'), true)
</script>
<template>
    <div :class="[ui.container, props.class]">
        <template v-if="isObjectEmpty(SelectedBacktest)">
            Backtester
        </template>


            <div :class="ui.wrapper" v-else>

                <UBadge :color="badgeColor">
                    {{ useTwoDecPercentFormat(SelectedBacktestComputed.percentage) }}
                </UBadge>

                    <div :class="ui.base">
                        <UIcon :name="icon" :class="[ui.icon.base, ui.icon.hover]" />
                        <input @input="updateName" v-model="SelectedBacktest.name" placeholder="Backtest Title" :class="[ui.input.base, ui.input.hover]"/>
                    </div>

            </div>

    </div>

</template>
