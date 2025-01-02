import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

export type Diary = {
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  flagged: boolean;
}


export const useDiaryStore = defineStore('diary', () => {
  const route = useRoute()
  const all = ref(<Diary>{})
  const one = ref(<Diary>{})
  const editorData = ref('Your diary starts here...')

  const { refresh: fetchDiaries } = useFetch<any>('diaries', {
    immediate: false,
    onResponse({ response }) {
      if (response.status === 200) {
        all.value = response._data.data
      }
    }
  })


  const set = (response) => {
    one.value = response
  }


  return { set, one, all, fetchDiaries, editorData }
})
