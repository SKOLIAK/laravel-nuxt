<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
  layout: 'auth'
});

useSeoMeta({
  title: 'Reset Password',
})
</script>
<template>
  <UCard class="w-full max-w-md mx-auto my-20">
    <h1 class="text-3xl font-medium mb-6">Reset Password</h1>
    <AuthForgotPassword />
  </UCard>
</template>
