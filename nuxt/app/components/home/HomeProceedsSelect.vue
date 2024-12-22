<script setup lang="ts">
import { amountCase, amountCaseTypes } from '@/utils/global';

</script>

<template>
  <USelectMenu
    v-slot="{ open }"
    v-model="amountCase"
    :options="amountCaseTypes"
    :ui-menu="{ width: 'w-32', option: { base: 'capitalize' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      :label="amountCase"
      color="gray"
      variant="ghost"
      class="capitalize"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </USelectMenu>
</template>
