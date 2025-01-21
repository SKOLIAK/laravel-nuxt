<script lang="ts" setup>
const { $storage } = useNuxtApp()
import { ModalsViewScreenshot } from "#components"

const modal = useModal()

defineProps({
  screenshot: {
    type: Object,
    default: {}
  }
})

function viewScreenshot(sc) {
  console.log('Viewing', sc)
  modal.open(ModalsViewScreenshot, {
    file: sc
  })
}


</script>

<template>

<div class="relative group rounded-xl">
    <div class="bg-background border-gradient rounded-xl">
      <div
        class="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg ring-1 ring-inset ring-white/25 group-hover:ring-primary bg-cover bg-center bg-no-repeat transition-all duration-200"
        :style="{ 'background-image': 'url(' + $storage(screenshot.file) + ')' }"
      >

        <svg
          class="z-0 absolute inset-0 h-full w-full stroke-gray-950/10 dark:stroke-white/10"
          fill="none"
        >
          <defs>
            <pattern
              id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
            </pattern>
          </defs>
          <rect
            stroke="none"
            fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
            width="100%"
            height="100%"
          />
        </svg>


        <!-- Screenshot Actions -->
        <div class="bg-gradient-to-tr from-primary/10 via-primary/10 to-primary/50 absolute top-0 right-0 bottom-0 left-0 transition-all duration-200 opacity-0 group-hover:opacity-100">

         <button
         class="absolute top-0 left-0 right-0 bottom-0"
         @click="viewScreenshot($storage(screenshot.file))" />

          <div class="flex items-center justify-end p-2 z-10 gap-x-1">
            <UTooltip text="View">
              <UButton color="white" class="hover:!bg-black" size="2xs" icon="tabler:zoom"
                @click.prevent="viewScreenshot($storage(screenshot.file))"
              />
            </UTooltip>

            <!-- <UTooltip text="Draw">
              <UButton color="white" class="hover:!bg-black" size="2xs" icon="tabler:paint-filled"/>
            </UTooltip> -->

            <UTooltip text="Delete">
              <UButton color="white" class="hover:!bg-black" size="2xs" icon="tabler:trash-x"/>
            </UTooltip>


          </div>
        </div>



      </div>

    </div>
  </div>

</template>
