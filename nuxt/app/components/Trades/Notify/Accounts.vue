<template>
  <div
    class="group flex items-center justify-center gap-x-4 rounded-lg border border-dashed border-emerald-600 bg-emerald-950 px-4 py-3 text-sm font-medium text-emerald-300 transition-all duration-200 hover:border-emerald-400"
  >
    <UIcon name="tabler:info-triangle-filled" size="2em" />
    <div>
      Before you can paste trades, you need to go to
      <NuxtLink to="/settings/accounts" class="focus:outline-none" @click="$emit('navigate')">
        <code
          class="cursor-pointer rounded bg-emerald-400 px-1 py-0.5 text-xs !font-bold text-emerald-950 transition-all duration-200"
        >
          Settings -> Accounts
        </code>
      </NuxtLink>
      to create your trading accounts
    </div>
  </div>
</template>
