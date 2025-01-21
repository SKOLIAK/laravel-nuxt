<script setup lang="ts">
import { dashboards, dashboardMode } from '@/utils/global';
</script>

<template>
  <UDropdown
    v-slot="{ open }"
    mode="hover"
    :items="[dashboards]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
      :icon="dashboardMode.icon"
    >
      <span class="truncate font-semibold text-gray-900 dark:text-white">
        {{ dashboardMode.label }}
      </span>
    </UButton>
  </UDropdown>
</template>
