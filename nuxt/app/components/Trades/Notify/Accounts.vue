<template>
<div class="transition-all duration-200 flex items-center justify-center gap-x-4 group rounded-lg border text-sm font-medium border-dashed border-emerald-600 hover:border-emerald-400  bg-emerald-950 px-4 py-3 text-emerald-300">
  <UIcon name="tabler:info-triangle-filled" size="2em"/>
  <div>
    Before you can paste trades, you need to go to
    <NuxtLink to="/settings/accounts" class="focus:outline-none" @click="$emit('navigate')">
      <code class="!font-bold transition-all duration-200 rounded py-0.5 px-1 text-xs cursor-pointer bg-emerald-400 text-emerald-950">
        Settings -> Accounts
      </code>
    </NuxtLink>
      to create your trading accounts

  </div>
</div>
</template>
