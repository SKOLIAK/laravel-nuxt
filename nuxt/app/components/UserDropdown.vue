<script setup lang="ts">
  import dayjs from "dayjs";

  const auth = useAuthStore();
  const { $storage } = useNuxtApp();

  const items = computed(() => [
    [
      {
        slot: "account",
        label: "",
        disabled: true,
      },
    ],
    [
      {
        label: "Settings",
        icon: "i-heroicons-cog-8-tooth",
        to: "/settings",
      },
      {
        label: "Devices",
        icon: "i-heroicons-device-phone-mobile",
        to: "/settings/devices",
      },
    ],
    [
      {
        label: "Sign out",
        icon: "i-heroicons-arrow-left-on-rectangle",
        click: auth.logout,
      },
    ],
  ]);

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
            size="xs"
            :src="$storage(auth.user.avatar)"
            :alt="auth.user.name"
            :ui="{ rounded: 'rounded-md' }"
          />
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          />
        </template>
      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p class="text-xs">
          Signed in as
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ auth.user.email }}
        </p>
      </div>
    </template>
  </UDropdown>
  <UButton v-else color="white" size="xs" class="w-full" label="Sign In" to="/auth/login" />
</template>
