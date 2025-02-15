import { createSharedComposable } from "@vueuse/core";

const _useDashboard = () => {
  const route = useRoute();
  const router = useRouter();
  const isHelpSlideoverOpen = ref(false);

  defineShortcuts({
    'shift_h': () => router.push("/"),
    'shift_o': () => router.push("/summary"),
    'shift_b': () => router.push("/dev2"),
    'shift_s': () => router.push("/settings"),
    "?": () => (isHelpSlideoverOpen.value = true),
  });

  watch(
    () => route.fullPath,
    () => {
      isHelpSlideoverOpen.value = false;
    }
  );

  return {
    isHelpSlideoverOpen,
  };
};

export const useDashboard = createSharedComposable(_useDashboard);
