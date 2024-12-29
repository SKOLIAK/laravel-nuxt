<script lang="ts" setup>
const auth = useAuthStore()
</script>
<template>
  <NuxtLink :to="auth.logged ? '/' : ''">
    <img src="@/assets/images/logo.svg" class="logo mr-1 h-8"/>
  </NuxtLink>
</template>
