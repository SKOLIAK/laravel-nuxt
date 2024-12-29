export const BacktestingGroups = ref([])
export const isLoading = ref(false)
export const isModalOpen = ref(false)

export async function useGetGroups() {
  return new Promise(async (resolve, reject) => {
    console.log('--> Getting backtest groups')
    isLoading.value = true
    try {
      await $fetch("/backtesting/groups", {
        method: "GET",
        onResponse({ response }) {
          if (response._data.status = 'ok') {
            BacktestingGroups.value = []
            response._data.forEach(element => {
              BacktestingGroups.value.push(element)
            });
            console.log(" -> Finished getting existing backtesting groups (" + BacktestingGroups.length + ")")
          }
          resolve()
          isLoading.value = false
          isModalOpen.value = false
        }
      })
    } catch (error) {
      reject(error.message)
      isLoading.value = false
      isModalOpen.value = false
    }


  })
}


export async function useDeleteGroup(groupId) {
  return new Promise(async (resolve, reject) => {
    console.log('--> Deleting backtesting group')
    BacktestingGroups.value = []
    isLoading.value = true
    try {
      await $fetch("/backtesting/groups", {
        method: "DELETE",
        body: { id: groupId },
        onResponse({ response }) {
          isLoading.value = false
          if (response._data?.status == 'ok') {
            useGetGroups()
          }
        }
      })
    } catch (error) {
      isLoading.value = false
      reject(error.message)
    }
  })
}


export async function useCreateGroup(data) {
  return new Promise(async (resolve, reject) => {
    console.log('--> Creating backtesting group')
    BacktestingGroups.value = []
    isLoading.value = true
    try {
      await $fetch("/backtesting/groups", {
        method: "POST",
        body: data,
        onResponse({ response }) {
          isLoading.value = false
          if (response._data?.status == 'ok') {
            useGetGroups()
          }
          useToast().add({
            icon: response._data?.status == 'ok' ? GetSuccessIcon : GetErrorIcon,
            title: response._data.message,
            color: response._data?.status == 'ok' ? GetSuccessColor : GetErrorColor,
          });
        }
      })
    } catch (error) {
      isLoading.value = false
      reject(error.message)
    }
  })
}
