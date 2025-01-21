<script setup lang="ts">
  const authData = useAuthStore();
  let diaries = {};

  $fetch("diaries", {
    immediate: false,
    onResponse({ response }) {
      if (response.status === 200) {
        diaries = response._data;
      }
    },
  });

  definePageMeta({
    middleware: ["auth"],
  });

  useSeoMeta({
    title: "Diary",
  });

  const route = useRoute();
  const router = useRouter();

  function deleteDiary(id) {
    $fetch("diary/" + id, {
      method: "DELETE",
      immediate: false,
      watch: false,
      async onResponse({ response }) {
        if (response._data?.ok) {
          diary.fetchDiaries();

          useToast().add({
            icon: "octicon:info-16",
            title: response._data.message,
            color: "primary",
          });
        }
      },
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
          <div class="tet-white rounded-lg bg-gray-400/5 text-gray-800 dark:bg-white/5">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div class="relative flex h-8 items-center justify-between">
                <Icon
                  name="octicon:bookmark-fill-24"
                  class="cursor-pointer"
                  :class="{
                    'bg-primary-600': d.flagged,
                    'bg-gray-300 dark:bg-black/40': !d.flagged,
                  }"
                  size="1.25em"
                />
                <div
                  class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
                >
                  <div class="hidden sm:ml-6 sm:block">
                    <div class="flex space-x-4">
                      <div
                        class="me-2 mr-5 inline rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {{ useCreatedDateFormat(d.created_at) }}
                        <span v-if="d.updated_at != d.created_at" class="dark:text-white/40">
                          <span class="ml-2 mr-2 text-black/40">|</span>
                          Modified: {{ useCreatedDateFormat(d.updated_at) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
                >
                  <!-- Profile dropdown -->
                  <div class="relative mx-auto ml-3 flex items-center justify-center">
                    <NuxtLink
                      :to="`/diaries/edit/${d.id}`"
                      class="me-2 inline rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-white dark:hover:text-black"
                    >
                      <Icon name="octicon:pencil" class="mr-2 cursor-pointer" />
                      Edit
                    </NuxtLink>

                    <UPopover overlay>
                      <button
                        class="me-2 inline rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-red-500 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-500"
                      >
                        <Icon name="octicon:trash-16" class="cursor-pointer" />
                      </button>

                      <template #panel="{ close }">
                        <div>
                          <div class="mb-2 bg-red-700 px-3 py-2 text-xs font-medium text-red-50">
                            Are you sure you want to delete it?
                          </div>
                          <div class="relative mx-auto flex items-center justify-center px-2 pb-2">
                            <UButton
                              label="Cancel"
                              color="gray"
                              size="xs"
                              variant="ghost"
                              @click="close"
                            />
                            <UButton
                              label="Confirm"
                              color="red"
                              size="xs"
                              variant="ghost"
                              @click="deleteDiary(d.id)"
                              class="ml-2"
                            />
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="border border-gray-100 bg-white text-black transition dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            >
              <div class="diary rounded px-2.5 py-3.5" v-html="d.content"></div>
            </div>
          </div>
        </article>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
