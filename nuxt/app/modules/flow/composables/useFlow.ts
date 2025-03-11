import { createSharedComposable } from "@vueuse/core";

const _useFlow = () => {
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const config = useRuntimeConfig()

  const isLocked = ref(false)

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


  watch(
    () => route.fullPath,
    () => {
      // ...
    }
  );

  return {
    isLocked,
    lockUnlock,
    getNodeIcon
  };
};

export const useFlow = createSharedComposable(_useFlow);
