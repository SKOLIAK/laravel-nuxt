<script setup lang="ts">
const auth = useAuthStore();
const { $storage } = useNuxtApp();
import dayjs  from 'dayjs';

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/settings'
  },{
    label: 'Devices',
    icon: 'i-heroicons-device-phone-mobile',
    to: '/settings/devices'
  }], [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: auth.logout
  }]
])

const getGreeting = () => {
    const currentTime = +dayjs().format('HH')
    if (currentTime >= 6 && currentTime < 12) {
      return "Good morning"
    } else if (currentTime >= 12 && currentTime < 18) {
      return "Good afternoon"
    } else if (currentTime >= 18 && currentTime < 22) {
      return "Good evening"
    } else {
      return "Good night"
    }
  }
</script>

<template>
  <UDropdown
    v-if="auth.logged"
    mode="hover"
    :items="items"
    :ui="{ width: 'min-w-52 w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            size="sm"
            :src="$storage(auth.user.avatar)"
            :alt="auth.user.name"
            :ui="{ rounded: 'rounded-md' }"
          />
        </template>

        <template #trailing>
          <!-- <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          /> -->
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p class="text-xs">
          {{ getGreeting() }},
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ auth.user.name }}
        </p>
      </div>
    </template>
  </UDropdown>
  <UButton
    v-else
    color="gray"
    variant="ghost"
    class="w-full"
    label="Sign In"
    to="/auth/login"
  />
</template>
