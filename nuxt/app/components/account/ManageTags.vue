<script lang="ts" setup>
  import { getRandomHexColor } from "@/utils/misc";
  import { tags, tagGroups, useGetTagGroups, useUpdateTagGroups, ungroupedColor, tagsBusy } from "@/utils/tags";
  import Sortable from "sortablejs";

  import { loaderText, loaderActive } from '@/utils/loader'

  const availableGroups = reactive([]);


  const availableTags = reactive([]);
  const tagsLoading = ref(false);

  onBeforeMount(async () => {
    await (loaderActive.value = true)
    await (tagsLoading.value = true);
    await useGetTagGroups();
    availableTags.value = tags.value
    await tagGroups.value.forEach(e => {
      availableGroups.push(e)
    });

    initSortable()
    await (tagsLoading.value = false);
    await (loaderActive.value = false)
});



const initSortable = () => {
  console.log('\n --> INIT SORTABLEJS')
  for (let x = 0; x < availableGroups.length; x++) {
    const element = availableGroups[x];

      let idDivElToCreate = document.getElementById(element.id);

      if (idDivElToCreate != null) {
        Sortable.create(idDivElToCreate, {
          group: {
            name: "common",
          },
          animation: 100,
          onEnd: function (evt) {
            let itemEl = evt.item; // dragged HTMLElement
            let tagId = itemEl.id;
            if(!tagId) { return }
            console.log(tagId)
            let tagName = availableTags.value.find(x => x.id == tagId).name

            let oldListId = evt.from.id
            let newListId = evt.to.id
            let oldIndex = evt.oldIndex
            let newIndex = evt.newIndex

            console.log(" -> Tag " + tagName + " (id: " +tagId+ ") dragged from list " + availableGroups.find(x => x.id == oldListId).name + " on index " + oldIndex + " to list " + availableGroups.find(x => x.id == newListId).name + " on position " + newIndex)

            let OldListData = availableGroups.find(x => x.id == oldListId)
            console.log('Old list:', OldListData.name)

            let NewListData = availableGroups.find(x => x.id == newListId)
            console.log('New list:', NewListData.name)

            // IF 0 INDEX IS TAKEN AND THERES MORE THAN 1 IT CARRIES BOTH>>????/
            availableGroups.find(x => x.id == oldListId).tags.splice(oldIndex, 1)

            let temp = {}
            temp.id = tagId
            temp.name = tagName
            availableGroups.find(x => x.id == newListId).tags.splice(newIndex, 0, temp)

            console.warn(OldListData)

            // let tempOldTags = OldListData.tags
            // tempOldTags.splice(oldIndex, 1)
            // console.warn(tempOldTags)
            // //OldListData.tags.splice(oldIndex, 1)

            // let temp = {}
            // temp.id = tagId
            // temp.name = tagName
            // //NewListData.tags.splice(newIndex, 0, temp)



            //*******************************************************************
            //                            TODO
            //  CLEAN MOVES OF TAGS BETWEEN GROUPS, THEN LOOK AT THE CONTROLLER TO UPDATE RELATIONS
            //  */

            // console.log(" -> Tag " + tagName + " dragged from list " + oldListId + " on index " + oldIndex + " to list " + newListId + " on position " + newIndex)
            // let oldGroupData = availableGroups.find((x) => x.id == oldListId)
            // let newArr = []
            // oldGroupData.tags.forEach(element => {
            //   if (element.id != tagId) {
            //     newArr.push(element)
            //   }
            // });

            // oldGroupData.tags = newArr

            // let temp = {}
            // temp.id = tagId
            // temp.name = tagName
            // let newGroupData = availableGroups.find((x) => x.id == newListId)
            // newGroupData.tags.splice(newIndex, 0, temp)


          }
        });
      }


  }
}



function createTagGroup() {
  let temp = {}
  temp.name = 'New Group'
  temp.color = getRandomHexColor()
  temp.tags = []
  availableGroups.unshift(temp)
}





</script>

<template>
  <DEVBlock>
    <template #code>
      {{ availableGroups }}
    </template>
  </DEVBlock>

  <div>
    <div class="mb-6 flex items-center justify-start gap-x-2">
      <UButton size="xs" color="white" icon="tabler:plus" @click="createTagGroup">New Group</UButton>
      <UButton size="xs" color="white" icon="tabler:plus">New Tag</UButton>
    </div>

    <UIcon name="svg-spinners:bars-rotate-fade" v-if="tagsLoading == true" />








    <!-- CONTAINERS WHERE CAN BE DRAGGED TO & FROM -->
    <div v-for="group in availableGroups" class="containerBox">
      <div class="containerName">{{ group.name }}</div>
      <div class="containerDrop" :id="group.id">
        <div v-for="tag in group.tags" :id="tag.id" draggable="true" class="p-1 bg-white/10">
          {{ tag.name }}
        </div>
      </div>
    </div>


    <UDivider />































    <div class="grid grid-cols-2 grid-rows-2 gap-4">

      <!-- DEFAULT GROUP -->
      <div
        class="rounded mb-4 w-full bg-white dark:bg-gray-900 ring-1  ring-gray-200 dark:ring-gray-700/50 lg:mb-0"
      >
        <div class="flex items-center justify-between px-3 pt-4 bg-white dark:bg-gray-800 pb-4">
          <div class="select-none pl-2 text-sm font-medium">Ungrouped</div>

          <UPopover>
              <div id="color-select" class="color-select" :style="{ 'background-color': ungroupedColor }">
                <span class="drop-shadow">{{ ungroupedColor }}</span>
              </div>
              <template #panel>
                <!-- ~/components/ColorPicker.vue -->
                <ColorPicker v-model="ungroupedColor" />
              </template>
            </UPopover>
        </div>

        <div class="rounded relative rounded-tl-none rounded-tr-none bg-white dark:bg-gray-900 px-3 py-2 pt-2">
          <div
            class="rounded-md mb-1 text-white group flex items-center justify-between px-1 ring-inset dark:ring-gray-700/50 ring-gray-200 transition-all duration-300 hover:bg-gray-50 hover:dark:bg-gray-900 hover:ring-1"
            v-for="tag in availableTags"
            :style="{ 'background-color': ungroupedColor }"
            :id="tag.id"
          >
            <UIcon name="tabler:hash" class="mr-none drop-shadow" size="1.2em" />
            <UInput v-model="tag.name" variant="none" />
            <UIcon name="tabler:dots-vertical" class="ml-auto  cursor-pointer drop-shadow" size="1.5em" :id="tag.id"/>
          </div>
        </div>
      </div>

      <!-- DYNAMIC GROUPS -->





      <div
        class="rounded mb-4 w-full dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700/50 lg:mb-0"
        v-for="group in availableGroups"
      >
        <div class="flex items-center justify-between px-3 pt-4 bg-white dark:bg-gray-800 pb-4">
          <UInput v-model="group.name" variant="none" class="font-medium" />
            <UPopover>
              <div id="color-select" class="color-select" :style="{ 'background-color': group.color }">
                <span class="drop-shadow">{{ group.color }}</span>
              </div>
              <template #panel>
                <!-- ~/components/ColorPicker.vue -->
                <ColorPicker v-model="group.color" />
              </template>
            </UPopover>
        </div>
        <div class="rounded rounded-tl-none rounded-tr-none bg-white dark:bg-gray-900 px-3 py-2 pt-2" :id="group.id">
            <div
              class="mb-1 text-white font-medium text-xs rounded-md group flex items-center justify-between px-1 ring-inset dark:ring-gray-700/50 ring-gray-200 transition-all duration-300 hover:bg-gray-50 hover:dark:bg-gray-900 hover:ring-1"
              v-for="tag in group.tags"
              :style="{ 'background-color': group.color }"
              :id="tag.id"
            >
              <UInput v-model="tag.name" variant="none" class="cursor-pointer"  />
            </div>
          </div>
      </div>

    </div>


    <div class="pt-8">
      <UButton type="submit" class="btn" label="Save" :loading="tagsBusy" @click="useUpdateTagGroups(availableGroups)"/>
    </div>
  </div>
</template>


<style>
.containerBox {
  @apply rounded ring-1 m-2
}
.containerName {
  @apply text-3xl font-medium bg-gray-200 dark:bg-gray-700 p-2
}

.containerDrop {
  @apply p-2
}
</style>
