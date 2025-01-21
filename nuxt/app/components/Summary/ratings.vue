<script lang="ts" setup>
const ratingRates = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

defineProps({
  ratings: {
    type: Object,
    default: {}
  }
})

</script>



<template>
    <!-- RATINGS -->
    <div class="mt-4 flex items-end justify-between gap-x-2" v-if="JSON.stringify(ratings) != '{}'">
      <UFormGroup label="Prep" size="xs">
        <USelect
          v-model="ratings.preparation"
          :options="ratingRates"
          :disabled="ratings.preparation != 0"
        />
      </UFormGroup>

      <UFormGroup label="Entry" size="xs">
        <USelect
          v-model="ratings.entry"
          :options="ratingRates"
          :disabled="ratings.entry != 0"
        />
      </UFormGroup>

      <UFormGroup label="Stop" size="xs">
        <USelect
          v-model="ratings.stop_loss"
          :options="ratingRates"
          :disabled="ratings.stop_loss != 0"
        />
      </UFormGroup>

      <UFormGroup label="Target" size="xs">
        <USelect
          v-model="ratings.target"
          :options="ratingRates"
          :disabled="ratings.target != 0"
        />
      </UFormGroup>

      <UFormGroup label="Manage" size="xs">
        <USelect
          v-model="ratings.management"
          :options="ratingRates"
          :disabled="ratings.management != 0"
        />
      </UFormGroup>

      <UFormGroup label="Rules" size="xs">
        <USelect
          v-model="ratings.rules"
          :options="ratingRates"
          :disabled="ratings.rules != 0"
        />
      </UFormGroup>
    </div>
</template>
