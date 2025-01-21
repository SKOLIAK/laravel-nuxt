<script lang="ts" setup>
  definePageMeta({
    middleware: ["guest"],
    layout: "auth",
  });

  useSeoMeta({
    title: "Log In",
  });
</script>

<template>
  <UCard class="mx-auto my-20 w-full max-w-md">
    <h1 class="mb-6 text-3xl font-medium">Log In</h1>
    <AuthLogin />
  </UCard>
</template>
