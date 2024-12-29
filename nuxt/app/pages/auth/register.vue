<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
  layout: 'auth'
});

useSeoMeta({
  title: 'Sign Up',
})
</script>
<template>
  <UCard class="w-full max-w-md mx-auto my-20">
    <h1 class="text-3xl font-medium mb-6">Sign Up</h1>
    <AuthRegister />
  </UCard>
</template>
