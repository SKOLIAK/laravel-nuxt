<script setup lang="ts">
  import { format, isToday } from "date-fns";
  import type { Playbook } from "~/types";

  const props = defineProps({
    modelValue: {
      type: Object as PropType<Playbook | null>,
      default: null,
    },
    playbooks: {
      type: Array as PropType<Playbook[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  const playbookRefs = ref<Element[]>([]);

  const selectedPlaybook = computed({
    get() {
      return props.modelValue;
    },
    set(value: Playbook | null) {
      emit("update:modelValue", value);
    },
  });

  watch(selectedPlaybook, () => {
    if (!selectedPlaybook.value) {
      return;
    }

    const ref = playbookRefs.value[selectedPlaybook.value.id];
    if (ref) {
      ref.scrollIntoView({ block: "nearest" });
    }
  });

  defineShortcuts({
    arrowdown: () => {
      const index = props.playbooks.findIndex((mail) => mail.id === selectedPlaybook.value?.id);

      if (index === -1) {
        selectedPlaybook.value = props.playbooks[0];
      } else if (index < props.playbooks.length - 1) {
        selectedPlaybook.value = props.playbooks[index + 1];
      }
    },
    arrowup: () => {
      const index = props.playbooks.findIndex((mail) => mail.id === selectedPlaybook.value?.id);

      if (index === -1) {
        selectedPlaybook.value = props.playbooks[props.playbooks.length - 1];
      } else if (index > 0) {
        selectedPlaybook.value = props.playbooks[index - 1];
      }
    },
  });
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div
      v-for="(playbook, index) in playbooks"
      :key="index"
      :ref="
        (el) => {
          playbookRefs[playbook.id] = el as Element;
        }
      "
    >
      <div
        class="cursor-pointer border-l-2 p-4 text-sm text-gray-900 dark:text-white"
        :class="[
          selectedPlaybook && selectedPlaybook.id === playbook.id
            ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25'
            : 'hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10 border-white dark:border-gray-800',
        ]"
        @click="selectedPlaybook = playbook"
      >
        <div class="flex items-center justify-between font-semibold">
          <div class="flex items-center gap-3">
            {{ playbook.title }}
          </div>

        </div>
        <p class="text-xs line-clamp-1 text-gray-400 dark:text-gray-500">
          {{ useCreatedDateFormat(playbook.created_at) }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
