<script lang="ts" setup>
  const emit = defineEmits(["navigate"]);

  function onNavigate() {
    emit("navigate");
  }
</script>

<template>
  <UModal :ui="{ overlay: { background: 'backdrop-blur-sm bg-emerald-950/25' } }">
    <TradesNotifyAccounts @navigate="onNavigate" />
  </UModal>
</template>
