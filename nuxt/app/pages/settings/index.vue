<script setup lang="ts">
  definePageMeta({
    middleware: ["auth"],
  });
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UCard :ui="{ body: { base: 'grid grid-cols-12 gap-6 md:gap-8' } }" class="ring-0">
      <div class="col-span-12 lg:col-span-4">
        <div class="mb-2 text-lg font-semibold">Profile information</div>
        <div class="text-sm opacity-80">
          Update your account's profile information and email address.
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8">
        <AccountUpdateProfile />
      </div>

      <UDivider class="col-span-12" />

      <div class="col-span-12 lg:col-span-4">
        <div class="mb-2 text-lg font-semibold">Manage Tags</div>
        <div class="text-sm">
          <span class="opacity-80">Create tags and assign them to groups</span>

          <div class="!opacity-100 text-rose-500 dark:text-rose-400  font-bold">(Only move the last one from the list)</div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8">
        <AccountManageTags />
      </div>

      <UDivider class="col-span-12" />

      <div class="col-span-12 lg:col-span-4">
        <div class="mb-2 text-lg font-semibold">Update Password</div>
        <div class="text-sm opacity-80">
          Ensure your account is using a long, random password to stay secure.
        </div>
      </div>
      <div class="col-span-12 lg:col-span-8">
        <AccountUpdatePassword />
      </div>
    </UCard>
  </UDashboardPanelContent>
</template>
