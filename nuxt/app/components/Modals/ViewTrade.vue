<script lang="ts" setup>
import { loadTradeViewData, loadedTradeViewData, isTradeViewLoading, contractSpecs } from '@/utils/pages/summary';

const props = defineProps({
  identifier: {
    type: String,
    default: ''
  }
})

onBeforeMount(async () => {
  await loadTradeViewData(props.identifier)
})

function removeTag(_tag, _on) {
  console.warn('remove tag', _tag, 'on', _on)
  // @todo
}
function addTag() {
  console.warn('wants to add a tag. Open modal to choose')
  // @todo
}










const screenshotUpload = ref('')
</script>


<template>
  <USlideover
    :ui="{
      wrapper: 'top-4 right-4 bottom-4',
      rounded: 'rounded-xl',
      translate: { base: 'translate-x-0', right: 'translate-x-4' },
      overlay: { background: 'bg-backdrop' },
      base: 'ring-1 ring-gray-700/50 overflow-y-auto no-scrollbar'
    }">

      <!-- Loading indicator when fetching data -->
      <div class="flex items-center justify-center w-full h-full" v-if="isTradeViewLoading">
        <Spinner size="1.5em" />
      </div>

      <div v-else>


        <!-- Header Section-->
        <div class="min-h-24 bg-gray-800 border-b border-gray-700/50">
          <div class="p-4 select-none">

            <div>

              <!-- Top Row -->
               <div class="flex items-center justify-between">

                <!-- Name of the security -->
                <div class="flex font-semibold text-3xl drop-shadow truncate text-ellipsis">
                  {{ contractSpecs.name }}
                </div>

                <!-- Right section ...-->
               </div>


              <!-- Details about the security-->
              <div class="flex items-center justify-start gap-x-1 mt-1">

                <!-- Name of the security-->
                <span class="font-semibold text-xs text-gray-500 rounded ring-1 ring-inset ring-gray-700/50 py-0.5 px-1.5 border border-transparent bg-gray-900">
                  {{ loadedTradeViewData.symbolOriginal }}
                </span>

                <!-- Type of Security -->
                <span class="font-semibold text-xs text-gray-500 rounded ring-1 ring-inset ring-gray-700/50 py-0.5 px-1.5 border border-transparent bg-gray-900">
                  {{ contractSpecs.type }}
                </span>

                <!-- Account Name-->
                <span
                  class="overflow-hidden flex items-center justify-center font-semibold text-xs text-gray-500 rounded ring-1 ring-inset border border-transparent ring-gray-700/50 bg-gray-900"
                  v-if="loadedTradeViewData.account != undefined"
                >
                  <div class="w-3 h-5 ring-1 ring-inset ring-white/10" :style="{'background': loadedTradeViewData.account.color}"></div>
                  <div class="py-0.5 px-1.5">
                    {{ loadedTradeViewData.account.nickname }}
                  </div>
                </span>
              </div>


              <!-- Tags -->
              <div class="mt-3 flex items-center justify-start gap-x-1">
                <Tag :tag="tag" :deletable="true" v-for="tag in loadedTradeViewData.tags" v-on:deleteTag="removeTag(tag.id, loadedTradeViewData.id)"/>
                <AddTag v-on:addTag="addTag" />
              </div>


            </div>
          </div>
        </div>

        <!-- Content Start -->
        <div class="p-4">

          <!-- ~/components/Summary/quickstats.vue -->
          <SummaryQuickstats :trade="loadedTradeViewData" />

          <!-- ~/components/Summary/ratings.vue -->
          <SummaryRatings :ratings="loadedTradeViewData.ratings" />


          <!-- NOTE -->
          <UFormGroup label="Note" size="xs" class="mt-4">
            <UTextarea v-model="loadedTradeViewData.note" autoresize />

            <!-- ACTIONS -->
            <div class="mt-4 flex justify-end">
              <InputUploadScreenshot
                entity="screenshots"
                v-model="screenshotUpload"
                max-size="10"
                accept=".png, .jpg, .jpeg, .webp"
              />

              <UButton
                size="xs"
                class="ml-auto"
                >Save</UButton
              >
            </div>
          </UFormGroup>



          <!-- SCREENSHOTS -->
          <div class="relative mt-4 overflow-y-auto">
            <div v-for="sc in loadedTradeViewData.screenshots">

              <!-- ~/components/Molecules/Screenshot.vue -->
              <MoleculesScreenshot :screenshot="sc" class="mb-2"/>
            </div>
          </div>



        </div>
      </div>


  </USlideover>

</template>
