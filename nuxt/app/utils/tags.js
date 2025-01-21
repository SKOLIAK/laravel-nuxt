export const tags = ref([]);
export const tagGroups = ref([]);
export const tagsBusy = ref(false);
import { loaderText, loaderActive } from '@/utils/loader'

export const ungroupedColor = typeof localStorage !== "undefined" ? ref(localStorage.getItem("ungroupedColor") ?? '#646464') : ref('#646464');
watch(ungroupedColor, function (a, b) { localStorage.setItem("ungroupedColor", a) });


export async function useUpdateTagGroups(objData) {
  console.info("\n✅ UPDATING TAG GROUPS");
  tagsBusy.value = true
  loaderActive.value = true
  loaderText.value = 'Updating...'
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/tags/groups", {
        method: "POST",
        body: {data: objData},
        onResponse({ response }) {
          tagsBusy.value = false
          loaderActive.value = false
          console.log(response._data)
          useGetTagGroups()
          resolve();
        },
      });
    } catch (error) {
      tagsBusy.value = false
      loaderActive.value = false
      useToast().add({
        icon: GetErrorIcon,
        title: error.message,
        color: GetErrorColor,
      });
      reject(error.message);
    }
  });
}


export async function useGetTagGroups() {
  console.info("\n✅ GETTING EXISTING TAG GROUPS");
  tags.value.splice(0);
  tagGroups.value.splice(0);
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/tags/groups", {
        method: "GET",
        onResponse({ response }) {
          if ( response._data.status == 'ok') {

            response._data.data.forEach((e) => {
              let temp = {};
              temp.id = e.id;
              temp.name = e.name;
              temp.color = e.color;
              temp.text_color = e.text_color;
              temp.tags = e.tags;
              tagGroups.value.push(temp)
                e.tags.forEach((a) => {
                  let temp2 = {};
                  temp2.id = a.id;
                  temp2.name = a.name;
                  temp2.color = a.color;
                  tags.value.push(temp2);
                })

            });
          }
          resolve();
        },
      });
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: error.message,
        color: GetErrorColor,
      });
      reject(error.message);
    }
  });
}


export async function useGetTags() {
  console.info("\n✅ GETTING EXISTING TAGS");
  tags.value.splice(0);
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/tags", {
        method: "GET",
        onResponse({ response }) {
          response._data.forEach((e) => {
            let temp = {};
            temp.id = e.id;
            temp.name = e.name;
            temp.color = e.color;
            temp.text_color = e.text_color;
            tags.value.push(temp);
          });

          resolve();
        },
      });
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: error.message,
        color: GetErrorColor,
      });
      reject(error.message);
    }
  });
}

export async function useDeleteTag(param) {
  console.info("\n✅ DELETING TAG");
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/tags", {
        method: "DELETE",
        params: {
          'tag_id': param
        },
        onResponse({ response }) {
          useToast().add({
            icon: GetSuccessIcon,
            title: response._data.message,
            color: GetSuccessColor,
          });
          resolve();
        },
      });
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: response._data.message,
        color: GetErrorColor,
      });
      reject(error.message);
    }
  })
}
