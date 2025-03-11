<script lang="ts" setup>
defineProps({
    info: {
        type: Boolean,
        default: false
    },
    name: String,
    value: [String, Number]
})
</script>
<template>

<div class="px-4">
    <h5 class="inline-flex text-sm items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
        {{ name }}

        <UPopover v-if="info" :ui="{ring: 'ring-0'}">
            <svg data-popover-target="clicks-info" data-popover-placement="bottom" class="w-3 h-3 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <template #panel>
                <div class="max-w-64 rounded-md bg-gray-800 ring-1 ring-white/5 ring-inset">
                    <slot name="info" />
                </div>
            </template>
        </UPopover>
    </h5>
    <p class="text-gray-900 dark:text-white text-lg leading-none font-bold">
        {{ value }}
    </p>
</div>
</template>
