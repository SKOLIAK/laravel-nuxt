<script lang="ts" setup>
import { randomBetween } from '@/utils/math'

const className  = ref('no-content')
const imageNum  = ref(1)

onMounted(() => {
    imageNum.value = randomBetween(1,4)
    className.value = className.value + '-' + imageNum.value
})


</script>

<template>
  <div class="mb-6 flex-wrap items-center justify-center">
    <div class="my-20 flex w-full justify-center">
      <div class="w-96 select-none text-center">
        <div class="no-content-img h-64 w-full bg-white shadow-xl" :class="className"></div>
        <h1 class="mt-7 text-sm font-normal text-gray-500">
          <slot />
        </h1>
      </div>
    </div>
  </div>
</template>
