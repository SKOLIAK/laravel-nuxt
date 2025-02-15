
export const tradingSessions = ref([])

export function getSessions() {
  console.log("-> GETTING TRADING SESSIONS");
  return new Promise(async (resolve, reject) => {
    try {
      await $fetch("/sessions", {
        method: "GET",
        onResponse({ response }) {
          tradingSessions.value = response._data
          resolve();
        },
      });
    } catch (error) {
      reject(error.message);
    }
  })
}
