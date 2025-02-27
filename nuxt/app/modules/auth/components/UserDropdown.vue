<script setup lang="ts">
const auth = useAuthStore()
const { $storage } = useNuxtApp()

const items = [
  [{
    label: auth.logged ? auth.user.email : '',
    slot: 'account',
    disabled: true
  }], 
  
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth'
  }], 
  
  [{
    label: 'Changelog',
    icon: 'i-heroicons-megaphone'
  }, {
    slot: 'status',
    label: 'Status',
    disabled: true
  }], 
  
  [{
    slot: 'signout',
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: auth.logged ? auth.logout : ''
  }]
]
</script>

<template>
  <UDropdown 
    :items="items" 
    :ui="{ 
      item: { 
        disabled: 'cursor-default select-none opacity-100' 
        } 
    }" 
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar 
    :ui="{
      rounded: 'rounded-md'
    }"
    size="xs"
    :src="$storage(auth.user.avatar)" 
    />

    <template #account="{ item }">
      <div class="text-left text-xs">
        <p class="opacity-50">
          Signed in as
        </p>
        <p class="opacity-70 truncate text-ellipsis font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </template>

    <template #status="{ item }">
      <UTooltip text="Server status is healthy" class="flex items-center justify-between w-full" :popper="{ placement: 'right' }">
        <span class="truncate">{{ item.label }}</span>


        <div class="relative ml-auto mr-1 w-2 h-2">
          <div class="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full absolute"></div>
          <div class="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-ping absolute"></div>
        </div>
      </UTooltip>

    </template>

    <template #signout="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </template>
  </UDropdown>
</template>