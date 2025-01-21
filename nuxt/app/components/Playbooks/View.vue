
<script lang="ts" setup>
import ImagePlaceholder from '../ImagePlaceholder.vue';

defineProps({
  playbook: {
    type: Object,
    default: {}
  }
})
</script>

<template>
  <div
    v-if="JSON.stringify(playbook) != '{}'"
    class="p-4"
  >

    <div v-if="playbook.body">

      <div class="group flex items-center justify-start gap-x-4 mb-4 rounded-lg border border-dashed border-teal-600 bg-teal-950 px-4 py-3 text-xs font-medium text-teal-300 transition-all duration-200 hover:border-teal-400">
        <UIcon name="tabler:info-triangle-filled" size="1.25em" />
        <div>
          Important note about this setup goes here
        </div>
      </div>


      <div class="p-2.5 ring-1 ring-inset ring-gray-600/40 rounded-lg bg-gray-900 mb-4 tracking-wider drop-shadow">
        <div class="font-medium text-sm mb-2 text-green-500">✅ Entry Criteria</div>
        <p class="text-xs leading-relaxed">
          Trade was closed as the price never came back to fill theorder during the session. HOWEVER, I got a loss for it as it apparently got filled at 17:58 UK Time when the session traded was ADR at around 2AM. Probably I deleted the position tool, but not the order and now the PNL for the day is only 80$ instead of original 200$ when I stopped trading.
          Noticed this only now, when importing the trades for today.
        </p>
      </div>


      <ImagePlaceholder class="max-w-64 max-h-24"/>

    </div>

    <div class="text-center select-none m-4 text-gray-600 drop-shadow" v-else>
      <div><UIcon name="tabler:wind" size="2em"/></div>
      <code class="text-xs font-bold">This playbook entry is empty</code>
    </div>

  </div>
</template>
