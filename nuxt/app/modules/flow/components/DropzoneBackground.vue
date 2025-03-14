<script lang="ts" setup>
import { Background } from '@vue-flow/background'
import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
const { theme } = resolveConfig(tailwindConfig);
</script>

<template>
  <div class="dropzone-background">
    <Background :pattern-color="theme.colors.gray[400]" :gap="16" />
    <div class="overlay">
      <slot />
    </div>
    <UInfiniteProgress class="!absolute !bottom-0" v-if="spinnerLoadingPage"/>
  </div>
</template>