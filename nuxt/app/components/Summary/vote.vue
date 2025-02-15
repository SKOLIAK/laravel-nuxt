<script lang="ts" setup>
defineProps({
  trade: {
    type: Object,
    defailt: {}
  }
})

const emit = defineEmits(["update:modelValue"]);

function rateIt(_unix, _rating) {
  $fetch("trades/rate", {
      method: "POST",
      params: {
        unix: _unix,
        rating: _rating
      },
      ignoreResponseError: true,
      onResponse({ response }) {
        emit("update:modelValue", response._data.rating)
      },
    });
}

</script>

<template>
<div class="flex items-center justify-start gap-x-1" v-if="JSON.stringify(trade) != '{}'">

  <!-- Upvote -->
  <UTooltip text="Like">
    <button
      class="group hover:bg-gray-800 rounded transition-all duration-200 px-1.5 py-1 flex items-center justify-center ring-transparent hover:ring-gray-700/25 ring-inset ring-1"
      @click="rateIt(trade.dateUnix, 1)"
    >
      <UIcon
        name="solar:heart-bold"
        class="text-gray-500 group-hover:text-primary"
        :class="{
          'text-primary': trade.rating == 1,
        }"
      />
    </button>
  </UTooltip>

  <!-- Downvote -->
  <UTooltip text="Dislike">
    <button
      class="group hover:bg-gray-800 rounded transition-all duration-200 px-1.5 py-1 flex items-center justify-center ring-transparent hover:ring-gray-700/25 ring-inset ring-1"
      @click="rateIt(trade.dateUnix, 2)"
    >
      <UIcon
        name="solar:heart-broken-bold"
        class="text-gray-500 group-hover:text-rose-500"
        :class="{
          'text-rose-500': trade.rating == 2,
        }"
      />
    </button>
  </UTooltip>

</div>
</template>
