<script lang="ts" setup>
import { useGetExistingAccounts, accountsList } from '@/utils/accounts'
const auth = useAuthStore()

const AccountsRequireAttention = ref(false)

onBeforeMount(async () => {
    await useGetExistingAccounts()

    accountsList.value.forEach(a => {
      if (a.size == 0 || a.one_r == 0) {
        AccountsRequireAttention.value = true
      }
    });
})


</script>

<template>
<div v-if="AccountsRequireAttention" class="transition-all duration-200 flex items-center justify-center gap-x-4 group rounded-lg text-xs font-medium bg-fuchsia-200 px-4 py-3 text-fuchsia-800 mb-4">
  <UIcon name="tabler:info-triangle-filled" size="1.5em"/>
  <div>
    One or more of your accounts requires attention. This could be because 1R or Account size is not set
  </div>
</div>
<div class="base-card !p-0 overflow-hidden mb-10 !bg-white/60">
  <div class="p-4 flex items-center gap-x-2 overflow-x-auto relative">
    <GeneralAddCard class="min-w-32 min-h-32">Add Account</GeneralAddCard>

    <GeneralEntryCard :color="account.color" v-for="account in accountsList">
      <UIcon name="tabler:info-triangle-filled" v-if="account.size == 0 || account.one_r == 0" class="text-fuchsia-500" size="1.5em" />
      <div v-if="account.nickname != ''">
        <div>
          {{ account.nickname }}
        </div>
        <p class="text-gray-400 group-hover:text-gray-500 transition duration-200">
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
