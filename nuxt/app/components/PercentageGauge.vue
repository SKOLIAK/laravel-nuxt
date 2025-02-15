<script lang="ts" setup>
defineProps({
    percent: {
        type: Number,
        default: 0
    }
})
</script>

<template>
    <!-- Gauge Component -->
    <UTooltip :text="'Win Percentage: ' + useTwoDecPercentFormat(percent)">
        <div class="relative size-8 cursor-help">
            <svg class="rotate-[90deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <!-- Background Circle (Gauge) -->
                <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-gray-700" stroke-width="3" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                <!-- Gauge Progress -->
                <circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-primary" stroke-width="3" :stroke-dasharray="(percent * 100).toFixed(2) + ' 100'" stroke-linecap="round"></circle>
            </svg>
        </div>
    </UTooltip>
    <!-- End Gauge Component -->
</template>
