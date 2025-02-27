<template>
<UContainer class="mt-5">
  <UPricingGrid :compact="true" class="p-48"> 
      <UPricingCard
        title="Free"
        description="Get started for free with limited features"
        :button="{ label: 'Get started' }"
        :features="['2 Backtests', '1 Trading Account']"
        align="bottom"
      />
      <UPricingCard
        title="Lineage"
        description="Pay monthly as you go. Cancel anytime"
        :price="useTwoDecCurrencyFormat(5.99)"
        cycle="/month"
        :badge="{ label: 'Popular' }"
        :button="{ label: 'Start now' }"
        :features="['♾️ Backtests', '♾️ Trading Accounts']"
        align="bottom"
        scale
        highlight
      />
  </UPricingGrid>
</UContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth'
})
</script>