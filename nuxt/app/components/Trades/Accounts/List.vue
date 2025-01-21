<script lang="ts" setup>
  import { accountsList, useGetExistingAccounts } from "@/utils/accounts";

  const auth = useAuthStore();

  const AccountsRequireAttention = ref(false);

  onBeforeMount(async () => {
    await useGetExistingAccounts();

    accountsList.value.forEach((a) => {
      if (a.size == 0 || a.one_r == 0) {
        AccountsRequireAttention.value = true;
      }
    });
  });
</script>

<template>
  <div
    v-if="AccountsRequireAttention"
    class="group mb-4 flex items-center justify-center gap-x-4 rounded-lg bg-rose-200 dark:bg-rose-900 px-4 py-3 text-xs font-medium text-rose-800 dark:text-rose-100 transition-all duration-200 ring-1 ring-rose-300 dark:ring-rose-700"
  >
    <UIcon name="tabler:info-triangle" size="1.5em" />
    <div>
      One or more of your accounts requires attention. This could be because 1R or Account size is not set.
    </div>
  </div>
  <div class="base-card mb-10 overflow-hidden bg-white dark:bg-gray-900 !p-0">
    <div class="relative flex items-center gap-x-2 overflow-x-auto p-4">
      <GeneralAddCard class="min-h-32 min-w-32">Add Account</GeneralAddCard>

      <GeneralEntryCard :color="account.color" v-for="account in accountsList">
        <UIcon
          name="tabler:info-triangle"
          v-if="account.size == 0 || account.one_r == 0"
          class="text-rose-500 dark:text-rose-300"
          size="1.5em"
        />
        <div v-if="account.nickname != ''">
          <div>
            {{ account.nickname }}
          </div>
          <p class="text-gray-900 dark:text-white transition duration-200 group-hover:text-gray-500">
            {{ account.name }}
          </p>
        </div>
        <div v-else>
          <div>
            {{ account.name }}
          </div>
        </div>
      </GeneralEntryCard>
    </div>
  </div>
</template>
