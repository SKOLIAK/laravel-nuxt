
export const tags = ref([])

export async function useGetTags() {
  console.info('\n✅ GETTING EXISTING TAGS');
  tags.value.splice(0)
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/tags", {
        method: "GET",
        onResponse({ response }) {

          response._data.forEach(e => {
            let temp = {}
            temp.id = e.id
            temp.name = e.name
            temp.color = e.color
            temp.text_color = e.text_color
            tags.value.push(temp)
          });

          resolve()
        }
      })
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: "Error retrieving existing tags",
        color: GetErrorColor,
      })
      reject(error.message)
    }
  })
}
