import { futureContractsJson } from '@/utils/contracts';

export const loadedTradeViewData = ref({})
export const isTradeViewLoading = ref(true)
export const contractSpecs = ref({})

watch(loadedTradeViewData, () => {
  isTradeViewLoading.value = JSON.stringify(loadedTradeViewData.value) == '{}' ? true : false
})

export async function loadTradeViewData(trade_identifier) {

  // Reset values. When loadedTradeViewData is empty the state is: loading
  contractSpecs.value = {}
  loadedTradeViewData.value = {}

  return new Promise(async (resolve, reject) => {
    try {
      isTradeViewLoading.value = true
      await $fetch("/trades/" + trade_identifier, {
        method: "GET",
        onResponse({ response }) {
          if(response._data.message) {
            reject()
          } else {
            loadedTradeViewData.value = response._data
            contractSpecs.value = futureContractsJson.value.filter((x) => x.symbol == loadedTradeViewData.value.symbol)[0]
            resolve()
          }
        },
      });
    } catch (error) {
      useToast().add({
        icon: GetErrorIcon,
        title: "Error retrieving trade data",
        color: GetErrorColor,
      });

      reject();
    }
  })
}
