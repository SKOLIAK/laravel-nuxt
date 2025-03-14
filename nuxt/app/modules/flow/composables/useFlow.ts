import { createSharedComposable, useLocalStorage } from "@vueuse/core";
import type { ViewPort as TypeViewPort } from "#flow/types"
import { useVueFlow } from '@vue-flow/core'

const _useFlow = () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  const edges = ref([])
  const nodes = ref([])

  const isSaving = ref(false)
  const isLocked = ref(false)

  const selectedElement = ref(null)
  const activeSidebarItem = ref(0)

  const getViewport = typeof localStorage !== "undefined" ? ref(localStorage.getItem("flowViewport")) : ref(null);

  const setViewport = (value: object) => {
    localStorage.setItem("flowViewport", JSON.stringify(value))
  }

  watch(isLocked, () => {
    if (isLocked.value == true) {
      selectedElement.value = null
      activeSidebarItem.value = 0
    }
  })

  const lockUnlock = (value) => {
    isLocked.value = value
  }

  function getNodeIcon(type: string) {
    let a = type.replace('__', '')
    switch (a) {
      case 'input':
        return 'lucide:message-circle-question'
        break;

      case 'true':
        return 'lucide:check'
        break;

      case 'false':
        return 'lucide:x'
        break;

      case 'output':
        return 'lucide:goal'
        break;

      case 'group':
        return 'lucide:square-chart-gantt'
        break;

      default:
        return 'lucide:mouse-pointer-click'
        break;
    }
  }

  async function fetchFlow() {
    return new Promise(async (resolve, reject) => {
      console.log('Loading flow')
      spinnerLoadingPage.value = true
      await $fetch("flow", {
        immediate: false,
        onResponse({ response }) {
          if (response.status === 200) {
            edges.value = response._data.edges
            nodes.value = response._data.nodes
            spinnerLoadingPage.value = false
          }
          resolve(1)
        },
      });
    })
  }

  async function saveFlow(_edges, _nodes) {
    return new Promise(async (resolve, reject) => {
      spinnerLoadingPage.value = true;
      isSaving.value = true
      await $fetch("flow", {
        method: "POST",
        body: { edges: _edges, nodes: _nodes },
        onResponse({ response }) {
          isSaving.value = false
          spinnerLoadingPage.value = false;
          console.log(response._data.message)
          useToast().add({
            icon: response?.ok ? GetSuccessIcon : GetErrorIcon,
            title: response._data.message,
            color: response?.ok ? GetSuccessColor : GetErrorColor,
          })

          resolve(1)

        }
      })

    })
  }


  watch(
    () => route.fullPath,
    () => {
      // ...
    }
  );

  return {
    edges,
    nodes,
    fetchFlow,
    saveFlow,
    isSaving,
    isLocked,
    lockUnlock,
    getNodeIcon,
    getViewport,
    setViewport,

    selectedElement,
    activeSidebarItem
  };
};

export const useFlow = createSharedComposable(_useFlow);
