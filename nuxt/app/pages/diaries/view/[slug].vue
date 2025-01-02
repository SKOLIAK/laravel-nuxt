<script setup>
import { format, zonedTimeToUtc  } from 'date-fns'

const { $isAlpha } = useNuxtApp();

const route = useRoute()

const Message404 = "Diary doesn't exist."

if (!route.params.slug || ! $isAlpha(route.params.slug)) {
    throw createError({
        statusCode: 404,
        message: Message404,
        fatal: true
    })
}

const diary = ref({})
diary.value = await useMyFetch('diary/' + route.params.slug)
const data = diary.value.data.data


if (Object.keys(data).length === 0) {
    throw createError({
        statusCode: 404,
        message: Message404,
        fatal: true
    })
}


</script>
<template>
    <div v-html="data.content"></div>

    <TiptapFloatingButton icon="octicon:checklist-16" @clickUpdateDiary="router.to('/diaries/edit')" class="ml-4" label="Create" :loading="userDiaryUpdate  === 'pending'">
        <template #content>
            <div class="text-xs text-gray-500 dark:text-white/20 select-none font-medium">
                {{  format(data.created_at ?? new Date(), 'd MMM, yyy kk:mm')  }}
                <span v-if="data.updated_at != data.created_at" class="text-black dark:text-white/40">
                    (Modified: {{ format(data.updated_at ?? new Date(), 'd MMM, yyy kk:mm') }})
                </span>
            </div>
            <div class="py-2 px-3 ml-2">
                <UTooltip text="Mark as important" :shortcuts="['⌘', 'F']">
                    <UCheckbox :disabled="true">
                        <template #label>
                            <span class="text-xsfont-medium select-none" :class="{'text-gray-500 dark:text-white': data.flagged}" v-if="!data.flagged">Not Flagged</span>
                            <span class="text-xsfont-medium select-none" :class="{'text-gray-500 dark:text-white': data.flagged}" v-else>Flagged</span>
                        </template>
                    </UCheckbox>
                </UTooltip>
            </div>

        </template>
        <template #button>
            Edit Diary
        </template>
    </TiptapFloatingButton>
</template>
