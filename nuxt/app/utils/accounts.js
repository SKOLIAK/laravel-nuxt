export const accountsList = ref([])

export async function useGetExistingAccounts() {
  console.info('\n✅ GETTING EXISTING ACCOUNTS');
  accountsList.value = []
  let tempAccList = []
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/accounts", {
        method: "GET",
        onResponse({ response }) {
          tempAccList.push(response._data.data)
        }
      })
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: "Error retrieving existing accounts" + error,
        color: GetErrorColor,
      })
      reject()
    }

    for (let i = 0; i < tempAccList[0].length; i++) {
      accountsList.value.push(tempAccList[0][i])
    }

    console.log(" -> Finished (" + accountsList.value.length + ")")

    resolve()
  })

}
