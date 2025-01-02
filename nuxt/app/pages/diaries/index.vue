<script setup lang="ts">

const authData = useAuthStore();
let diaries = {}

$fetch('diaries', {
  immediate: false,
  onResponse({ response }) {
    if (response.status === 200) {
      diaries = response._data
    }
  }
})

definePageMeta({
  middleware: ["auth"],
})



useSeoMeta({
  title: 'Diary',
})


const route = useRoute()
const router = useRouter()

function deleteDiary(id) {
  $fetch("diary/" + id, {
    method: "DELETE",
    immediate: false,
    watch: false,
    async onResponse({ response }) {
      if (response._data?.ok) {

        diary.fetchDiaries()

        useToast().add({
          icon: "octicon:info-16",
          title: response._data.message,
          color: "primary",
        });
      }
    }
  });
}


</script>

<template>

  <UDashboardPage>

    <UDashboardPanel grow>
      <UDashboardNavbar title="Diaries" class="bg-white">
        <template #right>
          <!-- Actions ... -->
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="bg-white">
        <template #left>
          <!-- -->
        </template>
        <template #right>
          <!-- -->
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        {{ diaries }} content
        <article v-for="d in diaries" class="mb-6 text-gray-200">
          <div class="rounded-lg bg-gray-400/5 text-gray-800 dark:bg-white/5 tet-white">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div class="relative flex h-8 items-center justify-between">
                <Icon name="octicon:bookmark-fill-24" class="cursor-pointer"
                  :class="{ 'bg-primary-600': d.flagged, 'bg-gray-300 dark:bg-black/40': !d.flagged }" size="1.25em" />
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div class="hidden sm:ml-6 sm:block">
                    <div class="flex space-x-4">

                      <div
                        class="inline bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 mr-5">
                        {{ useCreatedDateFormat(d.created_at) }}
                        <span v-if="d.updated_at != d.created_at" class="dark:text-white/40">
                          <span class="text-black/40 mr-2 ml-2">|</span>
                          Modified: {{ useCreatedDateFormat(d.updated_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                  <!-- Profile dropdown -->
                  <div class="relative ml-3 flex items-center justify-center mx-auto">




                    <NuxtLink :to="`/diaries/edit/${d.id}`"
                      class="inline hover:bg-gray-200 dark:hover:bg-white dark:hover:text-black bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                      <Icon name="octicon:pencil" class="cursor-pointer mr-2" />
                      Edit
                    </NuxtLink>

                    <UPopover overlay>
                      <button
                        class="inline hover:bg-red-500 dark:hover:bg-red-500 hover:text-white bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        <Icon name="octicon:trash-16" class="cursor-pointer" />
                      </button>

                      <template #panel="{ close }">
                        <div>
                          <div class="py-2 px-3 bg-red-700 text-red-50 font-medium text-xs mb-2">
                            Are you sure you want to delete it?
                          </div>
                          <div class="relative flex items-center justify-center mx-auto px-2 pb-2">
                            <UButton label="Cancel" color="gray" size="xs" variant="ghost" @click="close" />
                            <UButton label="Confirm" color="red" size="xs" variant="ghost" @click="deleteDiary(d.id)"
                              class="ml-2" />
                          </div>
                        </div>

                      </template>
                    </UPopover>





                  </div>
                </div>
              </div>
            </div>

            <div
              class="border border-gray-100 bg-white transition dark:border-gray-800 dark:bg-gray-900 dark:text-white text-black">
              <div class="py-3.5 px-2.5 rounded diary" v-html="d.content"></div>
            </div>
          </div>
        </article>

      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
