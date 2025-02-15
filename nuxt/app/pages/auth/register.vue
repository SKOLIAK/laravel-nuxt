<script lang="ts" setup>
  definePageMeta({
    middleware: ["guest"],
    layout: "auth",
  });

  useSeoMeta({
    title: "Sign Up",
  });
</script>
<template>
  <UCard class="mx-auto my-20 w-full max-w-md ring-0">
    <h1 class="mb-6 text-3xl font-medium">Sign Up</h1>
    <AuthRegister />
  </UCard>
</template>
