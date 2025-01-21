<script lang="ts" setup>
  import { dashboardMode } from '@/utils/global'
  const auth = useAuthStore();
</script>
<template>

  <NuxtLink :to="auth.logged && dashboardMode.label != 'Nitro' ? '/' : ''" class="relative">
    <img src="@/assets/images/logo.svg" class="logo mr-1 h-8" />
    <template v-if="dashboardMode.label == 'Nitro'">
      <span class="absolute -right-1 -bottom-1 text-blue-600 font-nunito text-xs font-bold tracking-wider">
        NITRO
      </span>
    </template>
  </NuxtLink>
</template>
